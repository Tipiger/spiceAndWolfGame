'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Game}=require('../js/engine.js');
const {fixture}=require('./helpers.cjs');
const base=fixture({
  goods:[{id:'crate',name:'货箱',unit:'箱',weight:5,basePrice:10,cargoW:2,cargoH:1,stackLimit:3,shelfLifeDays:null},{id:'bag',name:'粮袋',unit:'袋',weight:2,basePrice:4,cargoW:1,cargoH:1,stackLimit:2,shelfLifeDays:null},{id:'apple',name:'苹果',unit:'篮',weight:1,basePrice:3,cargoW:1,cargoH:1,stackLimit:5,shelfLifeDays:3}],
  cities:[{id:'a',name:'村庄',market:{crate:{price:10,stock:30},bag:{price:4,stock:30},apple:{price:3,stock:30}}},{id:'b',name:'港口',market:{bag:{price:6,stock:30}}}],
  routes:[{from:'a',to:'b',days:2,cost:3}],story:[],
  initial:{city:'a',money:150,unlockedCities:['a','b'],wagon:{cols:3,rows:2,maxWeight:50},inventory:{}},
  purchaseNotices:[{id:'order',title:'收购货箱',issuer:'掌柜',issuerRole:'货栈主人',destination:'b',good:'crate',quantity:3,listingDays:5,refreshDays:4,initialPublishDay:1,unitPrice:20,description:'自行采购后在河港交付。'},{id:'fruit',title:'新鲜苹果',issuer:'厨师',issuerRole:'旅馆厨师',destination:'b',good:'apple',quantity:3,listingDays:10,refreshDays:4,initialPublishDay:1,unitPrice:12,description:'新鲜采购，期限内送抵。'}]
});
const ok=r=>{assert.equal(r.ok,true,r.message);return r;};
const offer=(g,id)=>g.getPurchaseOffers().find(t=>t.templateId===id);
const buyer=()=>{const d=structuredClone(base);d.initial.city='b';return new Game(d);};
test('cargo enforces stack limits, physical footprints and weight independently, atomically',()=>{
 const g=new Game(base);ok(g.buy('crate',4));assert.deepEqual(g.state.cargo.map(s=>s.quantity),[3,1]);assert.equal(g.getLoad(),20);ok(g.buy('bag',4));assert.equal(g.getCargoUsage().usedCells,6);const before=structuredClone(g.state);assert.equal(g.buy('crate',3).ok,false);assert.deepEqual(g.state,before);
 const d=structuredClone(base);d.initial.wagon.maxWeight=9;const heavy=new Game(d),snapshot=structuredClone(heavy.state);assert.equal(heavy.buy('crate',2).ok,false);assert.deepEqual(heavy.state,snapshot);assert.ok(heavy.getCargoUsage().freeCells>0);
});
test('manual placement and auto-arrangement preserve quantities, costs and batch life',()=>{
 const g=new Game(base);ok(g.buy('crate',3));ok(g.buy('bag',2));const crate=g.state.cargo.find(s=>s.good==='crate'),bag=g.state.cargo.find(s=>s.good==='bag'),before=structuredClone(g.state.cargo);assert.equal(g.moveCargo(crate.id,bag.x,bag.y).ok,false);assert.deepEqual(g.state.cargo,before);assert.equal(g.moveCargo(crate.id,-1,0).ok,false);ok(g.moveCargo(crate.id,0,0,true));assert.equal(g.getCargoLayout().stacks.find(s=>s.id===crate.id).h,2);ok(g.autoArrangeCargo());const copy=new Game(base);ok(copy.importSave(g.exportSave()));assert.deepEqual(copy.state,g.state);
});
test('a public announcement supplies no goods and is paid once for self-procured stock on arrival',()=>{
 const g=buyer(),before=structuredClone(g.state),c=offer(g,'order');assert.equal(c.canDeliver,false);assert.deepEqual(g.state,before);assert.equal(g.quote('crate'),null);assert.equal(g.buy('crate',1).ok,false);assert.equal(g.sell('crate',1).ok,false);assert.equal(g.deliverPurchase(c.id).ok,false);ok(g.travel('a'));ok(g.buy('crate',3));ok(g.travel('b'));const cash=g.state.money;ok(g.deliverPurchase(c.id));assert.equal(g.state.money,cash+60);assert.equal(g.state.inventory.crate,0);assert.equal(g.state.purchaseCompleted,1);assert.equal(g.deliverPurchase(c.id).ok,false);assert.equal(g.state.money,cash+60);assert.equal(offer(g,'order'),undefined);
});

test('public announcements are readable without money, inventory or carrying room',()=>{
 const d=structuredClone(base);d.initial.city='b';d.initial.money=0;d.initial.wagon={cols:1,rows:1,maxWeight:1};const g=new Game(d),before=structuredClone(g.state);assert.equal(offer(g,'order').available,true);assert.equal(offer(g,'order').canDeliver,false);assert.equal(g.getLoad(),0);assert.equal(g.state.money,0);assert.deepEqual(g.state,before);
});

test('the deadline is inclusive and an expired notice preserves self-owned cargo without penalty',()=>{
 const g=buyer(),c=offer(g,'order');ok(g.travel('a'));ok(g.buy('crate',3));ok(g.travel('b'));ok(g.rest(1));assert.equal(g.state.day,c.dueDay);ok(g.deliverPurchase(c.id));
 const late=buyer(),l=offer(late,'order');ok(late.travel('a'));ok(late.buy('crate',3));const cash=late.state.money;late.advanceDays(5);assert.equal(late.getPurchaseStatus(l.id).available,false);assert.equal(late.state.inventory.crate,3);assert.equal(late.state.money,cash);assert.equal(late.deliverPurchase(l.id).ok,false);assert.equal(late.state.purchaseHistory.length,0);
});

test('different purchase dates retain separate expiry batches; moving and saving cannot rejuvenate them',()=>{
 const g=new Game(base);ok(g.buy('apple',2));const first=g.state.cargo.find(s=>s.good==='apple');assert.equal(first.expiresDay,4);ok(g.rest(1));ok(g.buy('apple',2));assert.equal(g.state.cargo.filter(s=>s.good==='apple').length,2);const expiry=g.state.cargo.map(s=>[s.id,s.purchasedDay,s.expiresDay]);ok(g.rotateCargo(first.id));ok(g.autoArrangeCargo());assert.deepEqual(g.state.cargo.map(s=>[s.id,s.purchasedDay,s.expiresDay]),expiry);const copy=new Game(base);ok(copy.importSave(g.exportSave()));copy.advanceDays(2);assert.equal(copy.state.day,4);assert.equal(copy.state.inventory.apple,2);assert.ok(copy.state.cargo.every(s=>s.expiresDay===5));assert.equal(copy.state.spoiledGoods.apple,2);assert.equal(copy.state.costBasis.apple,copy.state.cargo.reduce((n,s)=>n+s.cost,0));
});
test('FEFO fulfillment removes older food first and buying fresh food cannot reset old shelf life',()=>{
 const g=new Game(base);ok(g.buy('apple',3));g.advanceDays(1);ok(g.buy('apple',2));g.removeGoods('apple',2);assert.equal(g.state.cargo.find(s=>s.expiresDay===4).quantity,1);assert.equal(g.state.cargo.find(s=>s.expiresDay===5).quantity,2);g.advanceDays(2);assert.equal(g.state.inventory.apple,2);assert.ok(g.state.cargo.every(s=>s.expiresDay===5));
});
test('direct announcement delivery consumes the oldest food batch and preserves newer shelf life',()=>{
 const d=structuredClone(base);d.initial.city='b';d.routes[0].days=1;const g=new Game(d),id=offer(g,'fruit').id;
 ok(g.travel('a'));ok(g.buy('apple',3));const oldExpiry=g.state.cargo[0].expiresDay;g.advanceDays(1);ok(g.buy('apple',2));ok(g.travel('b'));ok(g.deliverPurchase(id));
 assert.equal(g.state.inventory.apple,2);assert.ok(g.state.cargo.every(s=>s.expiresDay===oldExpiry+1));g.advanceDays(1);assert.equal(g.state.inventory.apple,2);g.advanceDays(1);assert.equal(g.state.inventory.apple,0);assert.equal(g.state.spoiledGoods.apple,2);
});
test('one extra rest can spoil a food shipment in transit while its announcement remains published',()=>{
 const g=buyer(),c=offer(g,'fruit');ok(g.travel('a'));ok(g.buy('apple',3));const expiry=g.state.cargo.find(s=>s.good==='apple').expiresDay;ok(g.rest(1));assert.equal(g.previewTravel('b').spoiling[0].expiresDay,expiry);const result=ok(g.travel('b'));assert.equal(g.state.day,expiry);assert.equal(g.state.inventory.apple,0);assert.ok(result.events.some(e=>e.includes('腐坏')));assert.equal(g.getPurchaseStatus(c.id).status,'offered');assert.equal(g.getPurchaseStatus(c.id).canDeliver,false);assert.equal(g.quote('apple'),null);
});
test('strict saves reject overlapping cargo, edited expiry, non-quarter balances and altered delivery records atomically',()=>{
 const g=buyer(),id=offer(g,'order').id;ok(g.travel('a'));ok(g.buy('crate',3));ok(g.buy('apple',2));ok(g.buy('bag',2));ok(g.travel('b'));ok(g.deliverPurchase(id));const saved=JSON.parse(g.exportSave());
 for(const corrupt of [s=>{s.cargo[1].x=s.cargo[0].x;s.cargo[1].y=s.cargo[0].y;},s=>s.cargo[0].expiresDay++,s=>s.cargo[0].purchasedDay=0,s=>s.inventory.apple++,s=>s.cargo[0].cost+=.1,s=>s.money+=.1,s=>s.purchaseHistory[0].unitPrice++,s=>s.purchaseHistory[0].totalPrice++,s=>s.purchaseHistory[0].dueDay++,s=>s.cargo[0].extraField='unexpected']){const bad=structuredClone(saved);corrupt(bad.state);assert.equal(g.importSave(bad).ok,false);assert.deepEqual(g.state,saved.state);}
});
