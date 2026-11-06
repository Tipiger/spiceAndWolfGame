'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
require('../js/data.js');const {Game}=require('../js/engine.js'),M=require('../js/money.js'),data=globalThis.SW_DATA;
const ok=r=>{assert.equal(r.ok,true,r.message);return r;};
const offer=(g,id)=>g.getPurchaseOffers().find(t=>t.templateId===id);
function calm(){const d=structuredClone(data);if(d.rules.events)d.rules.events.dailyChance=0;return d;}
function openMarkets(city){const d=calm();d.story=[];d.initial={...d.initial,city,money:10000,inventory:{},costBasis:{},unlockedCities:d.cities.map(c=>c.id)};return d;}
function route(from,target){const scores=new Map([[from,{days:0,cost:0,path:[from]}]]),pending=[from];while(pending.length){pending.sort((a,b)=>scores.get(a).days-scores.get(b).days||scores.get(a).cost-scores.get(b).cost);const id=pending.shift(),at=scores.get(id);if(id===target)return at;for(const r of data.routes){const next=r.from===id?r.to:r.to===id?r.from:null;if(!next)continue;const candidate={days:at.days+r.days,cost:at.cost+r.cost,path:[...at.path,next]},old=scores.get(next);if(!old||candidate.days<old.days||candidate.days===old.days&&candidate.cost<old.cost){scores.set(next,candidate);pending.push(next);}}}throw Error('No route');}
function visit(g,target){for(const id of route(g.state.city,target).path.slice(1))ok(g.travel(id));}
test('the chapter requires a real purchase delivery and can unlock every city with the accepted route and announcement conditions',()=>{
 const d=calm(),g=new Game(d);assert.equal(g.previewTravel('pazzio').ok,false);ok(g.advanceStory());assert.equal(g.hasMechanic('purchase'),false);ok(g.advanceStory());const c=offer(g,'pasloe-wine');ok(g.travel('pazzio'));assert.equal(g.advanceStory().ok,false);ok(g.sell('fur',8));ok(g.advanceStory());assert.equal(g.hasMechanic('purchase'),true);ok(g.advanceStory());assert.equal(g.advanceStory().ok,false);ok(g.buy('wine',6));ok(g.travel('pasloe'));ok(g.deliverPurchase(c.id));assert.equal(g.state.day,7);ok(g.travel('pazzio'));ok(g.advanceStory());assert.equal(g.hasMechanic('information'),true);assert.equal(g.hasMechanic('loan'),false);const before=g.state.day;while(g.getActiveStory().id!=='northbound')ok(g.advanceStory());assert.equal(g.state.day,before);assert.equal(g.hasMechanic('loan'),true);assert.ok(g.state.flags.includes('first_chapter_complete'));ok(g.buy('pepper',1));ok(g.travel('poroson'));assert.equal(g.advanceStory().ok,false);ok(g.sell('pepper',1));ok(g.advanceStory());assert.ok(g.state.chapterComplete);assert.equal(g.state.debt,0);for(const c of d.cities)assert.ok(g.state.unlockedCities.includes(c.id));const copy=new Game(d);ok(copy.importSave(g.exportSave()));assert.deepEqual(copy.state,g.state);
});
test('every announcement has a reachable foreign source with positive net profit on its loaded delivery leg',()=>{
 assert.equal(data.purchaseNotices.length,10);
 for(const t of data.purchaseNotices){
  const life=data.goods.find(g=>g.id===t.good).shelfLifeDays;
  assert.equal(data.cities.find(c=>c.id===t.destination).market[t.good],undefined,t.id+' must use foreign supply');
  const sources=data.cities.filter(c=>c.market[t.good]).filter(c=>{const r=route(c.id,t.destination);return r.days<=t.listingDays&&(!life||r.days<life);});
  assert.ok(sources.length,t.id+' needs a route within its deadline and shelf life');
  let profitable=false;
  for(const source of sources){
   const d=openMarkets(source.id);d.initial.day=t.initialPublishDay;
   const g=new Game(d),cash=g.state.money,cargo=structuredClone(g.state.cargo),c=offer(g,t.id);
   assert.ok(c,t.id);assert.equal(c.dueDay,t.initialPublishDay+t.listingDays);assert.deepEqual(g.state.cargo,cargo);assert.equal(g.state.money,cash);
   const purchaseQuote=g.quote(t.good),purchase=ok(g.buy(t.good,t.quantity));assert.equal(purchase.amount,M.round(purchaseQuote.buy*t.quantity));
   visit(g,t.destination);assert.equal(g.quote(t.good),null);ok(g.deliverPurchase(c.id));
   // This checks procurement plus the loaded leg only. An empty trip to the source is not guaranteed to pay.
   if(g.state.money>cash)profitable=true;
   assert.equal(g.state.inventory[t.good],0);assert.equal(g.deliverPurchase(c.id).ok,false);
   const copy=new Game(d);ok(copy.importSave(g.exportSave()));assert.deepEqual(copy.state,g.state);
  }
  assert.ok(profitable,t.id+' needs at least one profitable loaded delivery at the actual quoted price');
 }
});
test('limited local markets and food shelf lives keep announcements dependent on reachable foreign supply',()=>{
 for(const city of data.cities)assert.ok(Object.keys(city.market).length<data.goods.length);
 for(const t of data.purchaseNotices.filter(t=>data.goods.find(g=>g.id===t.good).shelfLifeDays)){const life=data.goods.find(g=>g.id===t.good).shelfLifeDays,sources=data.cities.filter(c=>c.id!==t.destination&&c.market[t.good]);assert.ok(sources.some(s=>{const days=route(s.id,t.destination).days;return days<life&&days<=t.listingDays;}),t.id);}
});
test('neighboring markets keep shared goods within a modest base-price spread',()=>{
 for(const r of data.routes){const a=data.cities.find(c=>c.id===r.from),b=data.cities.find(c=>c.id===r.to);for(const id of Object.keys(a.market)){if(!b.market[id])continue;const prices=[a.market[id].price,b.market[id].price];assert.ok(Math.max(...prices)/Math.min(...prices)<=1.26,`${r.from}/${r.to}/${id} price spread`);}}
});
test('dedicated announcement round trips do not restore outsized returns on committed cash',()=>{
 for(const t of data.purchaseNotices){
  const life=data.goods.find(g=>g.id===t.good).shelfLifeDays;
  const sources=data.cities.filter(c=>c.market[t.good]).filter(c=>{const r=route(t.destination,c.id);return r.days*2<=t.listingDays&&(!life||r.days<life);});
  for(const source of sources){
   const d=openMarkets(t.destination);d.initial.day=t.initialPublishDay;
   const g=new Game(d),cash=g.state.money,id=offer(g,t.id).id;
   visit(g,source.id);ok(g.buy(t.good,t.quantity));visit(g,t.destination);
   const committed=cash-g.state.money;ok(g.deliverPurchase(id));
   // Allow losses and future tuning while preventing the old 40%-190% dedicated-trip returns.
   assert.ok(g.state.money-cash<=committed*.3,t.id+' dedicated return should stay below 30% of procurement plus both travel legs');
  }
 }
});
test('opening-day source stocks can pay on the loaded leg without funding an empty return',()=>{
 for(const [source,destination,good] of [['yorentz','pazzio','fur'],['pazzio','poroson','pepper']]){
  const g=new Game(openMarkets(source)),cash=g.state.money,quantity=g.quote(good).stock;
  ok(g.buy(good,quantity));visit(g,destination);ok(g.sell(good,quantity));
  assert.ok(g.state.money>cash,good+' loaded leg should retain a trading opportunity');
  assert.equal(g.getLoad(),0);visit(g,source);
  assert.ok(g.state.money<=cash,good+' empty return should require better planning');
 }
});
test('planning cargo for both directions can profit from four announcements on one round trip',()=>{
 const g=new Game(openMarkets('pazzio')),cash=g.state.money,departure=g.state.day;
 const outward=['pasloe-wine','pasloe-apples'],homeward=['pazzio-wheat','pazzio-cheese'];
 const buyFor=ids=>{for(const id of ids){const t=data.purchaseNotices.find(t=>t.id===id);ok(g.buy(t.good,t.quantity));}};
 const deliver=ids=>{for(const id of ids)ok(g.deliverPurchase(offer(g,id).id));};
 buyFor(outward);visit(g,'pasloe');deliver(outward);buyFor(homeward);visit(g,'pazzio');deliver(homeward);
 assert.equal(g.state.purchaseCompleted,outward.length+homeward.length);assert.equal(g.getLoad(),0);assert.ok(g.state.money>cash);assert.equal(g.state.debt,0);assert.equal(g.state.day-departure,route('pazzio','pasloe').days*2);
});
test('Trenni amounts settle in quarters across trade, loan and saves',()=>{
 for(const [value,expected]of [[0,'0'],[.25,'¼'],[.5,'½'],[.75,'¾'],[12.75,'12¾'],[-1.25,'−1¼'],[1000.5,'1,000½']])assert.equal(M.format(value),expected);
 const d=calm(),g=new Game(d);g.state.unlockedMechanics.push('loan');ok(g.takeLoan(1.25));ok(g.buy('wheat',1));ok(g.sell('wheat',1));g.advanceDays(2);for(const n of [g.state.money,g.state.debt,g.getNetWorth(),g.state.totalProfit,...Object.values(g.state.costBasis)])assert.ok(M.isQuarter(n));const copy=new Game(d);ok(copy.importSave(g.exportSave()));assert.deepEqual(copy.state,g.state);
});
test('interest accumulates before charging a quarter and small final interest is waived at payoff',()=>{
 const g=new Game(calm());g.state.unlockedMechanics.push('loan');ok(g.takeLoan(1));g.advanceDays(20);assert.equal(g.state.debt,1);assert.ok(g.state.interestAccrued>0&&g.state.interestAccrued<.25);ok(g.repayLoan(g.getLoanPayoff()));assert.equal(g.state.interestAccrued,0);ok(g.takeLoan(100));g.advanceDays(2);assert.equal(g.state.debt,100.5);
});
test('apples come from an open market and gifting consumes the oldest batch once per day',()=>{
 const d=calm(),g=new Game(d);assert.equal(g.buy('apple',1).ok,false);ok(g.advanceStory());ok(g.travel('pazzio'));ok(g.buy('apple',3));const before=g.state.relationship;ok(g.shareApple());assert.equal(g.state.inventory.apple,2);assert.equal(g.state.relationship,before+2);assert.equal(g.shareApple().ok,false);const copy=new Game(d);ok(copy.importSave(g.exportSave()));ok(copy.rest(1));ok(copy.shareApple());assert.equal(copy.state.inventory.apple,1);
});
