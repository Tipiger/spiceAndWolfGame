'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Game,VERSION}=require('../js/engine.js'),C=require('../js/calendar.js');
const {fixture}=require('./helpers.cjs');
const data=fixture({goods:[{id:'grain',name:'粮食',unit:'袋',weight:1,basePrice:4,cargoW:1,cargoH:1,stackLimit:10,shelfLifeDays:null}],cities:[{id:'a',name:'粮村',market:{grain:{price:4,stock:30}}},{id:'b',name:'港城',market:{}}],routes:[{from:'a',to:'b',days:2,cost:2}],initial:{city:'b',money:150,inventory:{},unlockedCities:['a','b']},story:[],purchaseNotices:[{id:'grain-order',title:'港城收粮',issuer:'掌柜',issuerRole:'粮商',destination:'b',good:'grain',quantity:3,listingDays:5,refreshDays:4,initialPublishDay:1,unitPrice:12,description:'截止日固定的私人收购。'}],calendar:{epoch:{year:1,month:10,day:1},daysPerMonth:30,monthsPerYear:12,events:[{id:'harvest',title:'收获余庆',month:10,day:1}]} });
const ok=r=>{assert.equal(r.ok,true,r.message);return r;};
const offer=g=>g.getPurchaseOffers()[0];
function stocked(){const d=structuredClone(data);d.initial.inventory.grain=9;return new Game(d);}

test('calendar uses a fictional 30-day month and carries month, year and season boundaries correctly',()=>{
 const g=new Game(data);assert.deepEqual([g.getCalendar().year,g.getCalendar().month,g.getCalendar().day],[1,10,1]);assert.equal(g.formatDate(),'行商历1年10月1日');assert.equal(g.formatDate(30,{short:true}),'10月30日');assert.equal(g.formatDate(31),'行商历1年11月1日');assert.equal(g.formatDate(91),'行商历2年1月1日');assert.equal(g.getCalendar(61).season,'winter');assert.equal(g.getCalendar().events[0].id,'harvest');assert.equal(C.getMonth(1,9,data.calendar)[29].absoluteDay,0);assert.equal(C.getMonth(2,1,data.calendar)[0].absoluteDay,91);assert.throws(()=>C.getMonth(0,10));
});
test('announcements are visible worldwide and reading them creates no acceptance state or goods',()=>{
 const d=structuredClone(data);d.initial.city='a';const g=new Game(d),before=structuredClone(g.state);
 assert.equal(g.getPurchaseOffers().length,1);assert.equal(g.getPurchaseOffers('a').length,0);const remote=g.getPurchaseOffers('b')[0];assert.equal(remote.id,offer(g).id);assert.equal(remote.available,true);assert.equal(remote.canDeliver,false);assert.match(remote.reason,/港城/);assert.deepEqual(g.state,before);
 assert.deepEqual(g.state.purchaseHistory,[]);
});
test('self-procured goods can be delivered on arrival without any prior acceptance',()=>{
 const d=structuredClone(data);d.initial.city='a';const g=new Game(d),id=offer(g).id,before=structuredClone(g.state);
 assert.equal(g.deliverPurchase(id).ok,false);assert.deepEqual(g.state,before);ok(g.buy('grain',3));assert.equal(g.getPurchaseOffers()[0].canDeliver,false);ok(g.travel('b'));
 const cash=g.state.money;assert.equal(offer(g).canDeliver,true);const result=ok(g.deliverPurchase(id));assert.equal(g.state.money,cash+36);assert.equal(g.state.inventory.grain,0);assert.equal(g.state.purchaseCompleted,1);assert.equal(result.record.id,id);assert.equal(result.record.status,'delivered');assert.equal(Object.hasOwn(result.record,'acceptedDay'),false);
 assert.equal(g.deliverPurchase(id).ok,false);assert.equal(g.state.money,cash+36);
});
test('locked towns remain visible but cannot be reached or remotely paid',()=>{
 const d=structuredClone(data);d.initial.city='a';d.initial.unlockedCities=['a'];d.initial.inventory.grain=3;const g=new Game(d),before=structuredClone(g.state);
 assert.equal(g.getPurchaseOffers().length,1);assert.equal(g.getPurchaseOffers('b')[0].available,true);assert.equal(g.getPurchaseOffers('b')[0].canDeliver,false);assert.match(offer(g).reason,/尚未开放/);assert.equal(g.previewTravel('b').ok,false);assert.equal(g.deliverPurchase(offer(g).id).ok,false);assert.deepEqual(g.state,before);
});
test('reading a publication late keeps its original deadline and requires only local goods',()=>{
 const g=stocked(),first=offer(g);g.advanceDays(4);const before=structuredClone(g.state),late=offer(g);assert.equal(late.publishedDay,1);assert.equal(late.dueDay,first.dueDay);assert.equal(late.dueDay,6);assert.equal(late.remainingDays,1);assert.equal(late.canDeliver,true);assert.equal(late.id,first.id);assert.deepEqual(g.state,before);
});
test('announcements expire worldwide and vanish before their cooldown ends',()=>{
 const d=structuredClone(data);d.initial.city='a';const g=new Game(d);const first=g.getPurchaseOffers('b')[0];g.advanceDays(5);assert.equal(g.state.day,6);assert.equal(g.getPurchaseOffers('b')[0].id,first.id);g.advanceDays(1);assert.equal(g.getPurchaseOffers().length,0);assert.equal(g.state.purchaseHistory.length,0);assert.equal(g.getUpcomingPurchases()[0].nextPublishDay,11);assert.equal(g.getUpcomingPurchases('a').length,0);g.advanceDays(3);assert.equal(g.getPurchaseOffers('b').length,0);g.advanceDays(1);const renewed=g.getPurchaseOffers('b')[0];assert.notEqual(renewed.id,first.id);assert.equal(renewed.publishedDay,11);assert.equal(renewed.dueDay,16);
});
test('direct delivery is allowed on the posted last day and starts cooldown from actual delivery',()=>{
 const g=stocked();g.advanceDays(5);const c=offer(g);assert.equal(g.state.day,c.dueDay);const cash=g.state.money;ok(g.deliverPurchase(c.id));assert.equal(g.state.money,cash+36);assert.equal(g.getPurchaseOffers().length,0);assert.equal(g.getUpcomingPurchases()[0].nextPublishDay,10);g.advanceDays(3);assert.equal(g.getPurchaseOffers().length,0);g.advanceDays(1);assert.equal(offer(g).publishedDay,10);assert.equal(offer(g).dueDay,15);assert.equal(offer(g).canDeliver,true);
});
test('early delivery refreshes and the old publication cannot be paid twice',()=>{
 const g=stocked();g.advanceDays(1);const c=offer(g);ok(g.deliverPurchase(c.id));assert.equal(g.getUpcomingPurchases()[0].nextPublishDay,6);g.advanceDays(4);const second=offer(g);assert.equal(second.cycle,2);assert.equal(second.publishedDay,6);const cash=g.state.money;assert.equal(g.deliverPurchase(c.id).ok,false);assert.equal(g.state.money,cash);ok(g.deliverPurchase(second.id));assert.equal(g.state.purchaseCompleted,2);assert.notEqual(c.id,second.id);assert.equal(g.state.purchaseHistory.length,2);
});
test('stale publication IDs cannot silently deliver to a later issue of the same template',()=>{
 const g=stocked(),stale=offer(g).id;g.advanceDays(10);const current=offer(g).id;assert.notEqual(stale,current);const before=structuredClone(g.state);assert.equal(g.deliverPurchase(stale).ok,false);assert.deepEqual(g.state,before);assert.equal(g.deliverPurchase('grain-order').ok,false);ok(g.deliverPurchase(current));
});
test('a large time advance matches daily processing across many publication cycles',()=>{
 const bulk=new Game(data),daily=new Game(data);bulk.advanceDays(204);for(let i=0;i<204;i++)daily.advanceDays(1);assert.deepEqual(bulk.state,daily.state);assert.ok(bulk.state.purchaseBoard[0].cycle>10);assert.equal(bulk.state.purchaseHistory.length,0);
});
test('published deadlines and cooldown dates survive save and load without being reset',()=>{
 const g=new Game(data);g.advanceDays(4);const copy=new Game(data);ok(copy.importSave(g.exportSave()));assert.equal(offer(copy).dueDay,6);copy.advanceDays(3);assert.equal(copy.state.day,8);const cooling=new Game(data);ok(cooling.importSave(copy.exportSave()));assert.equal(cooling.getUpcomingPurchases()[0].nextPublishDay,11);cooling.advanceDays(3);assert.equal(offer(cooling).publishedDay,11);assert.equal(offer(cooling).dueDay,16);
 const paid=stocked(),id=offer(paid).id;ok(paid.deliverPurchase(id));const saved=new Game(data);ok(saved.importSave(paid.exportSave()));assert.equal(saved.getUpcomingPurchases()[0].nextPublishDay,5);assert.equal(saved.deliverPurchase(id).ok,false);
});
test('save validation rejects shifted schedules, altered history, tracking fields and duplicate payments atomically',()=>{
 const g=stocked();ok(g.deliverPurchase(offer(g).id));const saved=JSON.parse(g.exportSave());
 for(const mutate of [s=>s.purchaseBoard[0].dueDay++,s=>{s.purchaseBoard[0].publishedDay++;s.purchaseBoard[0].dueDay++;},s=>s.purchaseBoard[0].extraField='unexpected',s=>s.purchaseHistory[0].dueDay++,s=>s.purchaseHistory[0].unitPrice++,s=>s.purchaseHistory[0].publicationId='publication-grain-order-2',s=>s.purchaseBoard.push({...s.purchaseBoard[0]}),s=>s.purchaseHistory.push({...s.purchaseHistory[0]}),s=>s.purchaseHistory=[],s=>s.extraField=[],s=>s.unlockedMechanics.push('undefined-mechanic')]){const damaged=structuredClone(saved);mutate(damaged.state);assert.equal(g.importSave(damaged).ok,false);assert.deepEqual(g.state,saved.state);}
 const cooldown=structuredClone(saved);cooldown.state.purchaseBoard[0].nextPublishDay++;assert.equal(g.importSave(cooldown).ok,false);
});
test('v9 is the only accepted save version and rejected envelopes leave the journey untouched',()=>{
 assert.equal(VERSION,9);const g=new Game(data),saved=JSON.parse(g.exportSave());
 for(const version of [0,1,2,3,4,5,6,7,8]){const old=structuredClone(saved);old.version=version;old.state.schemaVersion=version;assert.equal(g.importSave(old).ok,false);assert.deepEqual(g.state,saved.state);}
});
test('completed-publication history stays bounded and saves after many delivery cycles',()=>{
 const d=structuredClone(data);d.initial.inventory.grain=780;d.initial.wagon={cols:30,rows:5,maxWeight:1000};const g=new Game(d);
 for(let i=0;i<260;i++){ok(g.deliverPurchase(offer(g).id));g.advanceDays(4);}
 assert.equal(g.state.purchaseCompleted,260);assert.equal(g.state.purchaseHistory.length,200);assert.equal(offer(g).cycle,261);const copy=new Game(d);ok(copy.importSave(g.exportSave()));assert.deepEqual(copy.state,g.state);
});

test('calendar displays locked-town announcements worldwide, their cooldown and renewed dates without changing the journey',()=>{
 require('../js/calendar-ui.js');const ui=globalThis.SWCalendarUI,d=structuredClone(data);d.initial.city='a';d.initial.unlockedCities=['a'];const g=new Game(d);
 const render=selectedDay=>{const before=structuredClone(g.state),html=ui.render(g,{selectedDay});assert.deepEqual(g.state,before);assert.doesNotMatch(html,/领取|接单|已接|合同/);return html;};
 const current=render(6);assert.match(current,/港城收粮/);assert.match(current,/港城 · 收购公告截止/);assert.match(current,/1份公告截止/);assert.match(current,/截止当日仍可交付/);
 g.advanceDays(6);const cooling=render(11);assert.match(cooling,/公告目前冷却中/);assert.match(cooling,/新一期截止行商历1年10月16日/);assert.match(cooling,/冷却结束，再次发布/);assert.doesNotMatch(cooling,/港城 · 收购公告截止/);
 g.advanceDays(4);const renewed=render(11);assert.match(renewed,/本期已发布/);assert.match(renewed,/港城 · 收购公告截止/);assert.match(renewed,/截止行商历1年10月16日/);
});
