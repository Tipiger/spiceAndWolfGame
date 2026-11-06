'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { Game, VERSION } = require('../js/engine.js');
const { fixture } = require('./helpers.cjs');
const rain = { id: 'rain', name: '大暴雨', description: '商路泥泞', scope: 'route', minDays: 1, maxDays: 3, travelMultiplier: 2, stockMultiplier: 1, priceMultiplier: 1, dailyConsumption: 0 };
const harvest = { id: 'harvest', name: '大丰收', description: '附近供货增加', scope: 'market', eligibleGoods: ['wheat'], minDays: 3, maxDays: 5, travelMultiplier: 1, stockMultiplier: 2, priceMultiplier: .7, dailyConsumption: 0 };
function scenario(types = [rain, harvest]) {
  const data = fixture({
    goods: [{ id: 'wheat', name: '小麦', unit: '袋', weight: 1, basePrice: 10, cargoW: 1, cargoH: 1, stackLimit: 100, shelfLifeDays: null }],
    cities: [{ id: 'a', name: '甲城', market: { wheat: { price: 10, stock: 20 } } }, { id: 'b', name: '乙城', market: { wheat: { price: 12, stock: 20 } } }, { id: 'c', name: '丙城', market: { wheat: { price: 14, stock: 20 } } }],
    routes: [{ from: 'a', to: 'b', days: 3, cost: 4 }, { from: 'b', to: 'c', days: 2, cost: 3 }],
    story: [{ id: 'open', title: '启程', conditions: {}, reward: {} }],
    initial: { city: 'a', money: 500, unlockedCities: ['a', 'b', 'c'], unlockedMechanics: ['trade', 'travel', 'loan'], inventory: {}, costBasis: {} },
    newsNoInformation: require('../js/content.js').newsNoInformation,
    newsTemplates: structuredClone(require('../js/content.js').newsTemplates),
    worldEvents: structuredClone(types)
  });
  data.rules.events = { dailyChance: 0, rainForecastDays: 2, harvestForecastExtraDays: 0, festivalForecastExtraDays: 2, travelerChance: 0, tavernCost: 2 };
  Object.assign(data.rules.market, { priceAmplitude: 0, restockDivisor: 20, minimumRestock: 1 });
  return data;
}
const ok = result => { assert.equal(result.ok, true, result.message); return result; };
// Arrange an existing future forecast; production creates identical records in its daily scheduler.
function forecast(game, type, target, startDay, endDay, good = null) {
  const event = { id: `event-${++game.state.eventCounter}`, type, target, good, startDay, endDay, reports: [] };
  game.state.worldEvents.push(event); return event;
}

test('events are scheduled before anyone buys information and hidden forecasts stay out of read APIs', () => {
  const data = scenario([harvest]); data.rules.events.dailyChance = 1;
  const game = new Game(data, { seed: 0 });
  assert.equal(game.state.worldEvents.length, 1);
  assert.equal(game.state.worldEvents[0].startDay, game.state.day + game.state.worldEvents[0].endDay - game.state.worldEvents[0].startDay + 1);
  assert.equal(game.state.worldEvents[0].good, 'wheat');
  const before = structuredClone(game.state);
  assert.deepEqual(game.getKnownEvents(), []); assert.deepEqual(game.getLocalEvents(), []);
  game.quote('wheat'); game.quote('wheat', 'b'); game.previewTravel('b');
  assert.deepEqual(game.state, before);
  game.advanceDays(before.worldEvents[0].startDay - game.state.day);
  const started = before.worldEvents[0], stock = game.state.markets[started.target].wheat.stock;
  assert.equal(stock, 40);
  assert.equal(game.quote('wheat', started.target).buy, data.cities.find(city => city.id === started.target).market.wheat.price * .7);
});

test('harvest doubles the remaining stock once, changes both quotes, and expires without restoring purchases', () => {
  const game = new Game(scenario([harvest]), { seed: 1 });
  ok(game.buy('wheat', 5)); // 15 remain; the next day ordinary restock makes 16.
  forecast(game, 'harvest', 'a', 3, 5, 'wheat');
  game.advanceDays(1); assert.equal(game.quote('wheat').stock, 16); assert.equal(game.quote('wheat').buy, 10);
  game.advanceDays(1); assert.equal(game.state.day, 3); assert.equal(game.quote('wheat').stock, 32); assert.equal(game.quote('wheat').buy, 7);
  assert.equal(game.getKnownEvents()[0].isPublic, true);
  const cash = game.state.money; ok(game.buy('wheat', 1)); ok(game.sell('wheat', 1)); assert.ok(game.state.money < cash);
  ok(game.buy('wheat', 25)); assert.equal(game.quote('wheat').stock, 7);
  game.advanceDays(1); assert.equal(game.quote('wheat').stock, 8); // not doubled again
  game.advanceDays(1); assert.equal(game.quote('wheat').buy, 7); assert.equal(game.quote('wheat').stock, 9); // end day is inclusive
  game.advanceDays(1); assert.equal(game.quote('wheat').buy, 10); assert.equal(game.quote('wheat').stock, 10);
  assert.deepEqual(game.getKnownEvents(), []);
});

test('harvest caps daily refill at the doubled limit and returns excess stock to the normal limit', () => {
  const game = new Game(scenario([harvest]), { seed: 2 });
  forecast(game, 'harvest', 'b', 3, 5, 'wheat');
  game.advanceDays(2); assert.equal(game.state.markets.b.wheat.stock, 40);
  ok(new Game(scenario([harvest]), { seed: 99 }).importSave(game.exportSave())); // validate imported event state, not the reader's current market cap
  game.advanceDays(2); assert.equal(game.state.markets.b.wheat.stock, 40);
  game.advanceDays(1); assert.equal(game.state.markets.b.wheat.stock, 20);
  assert.equal(game.state.city, 'a'); // a remote harvest really happens without visiting or hearing about it
});

test('rain begins during a journey, slows only its active dates and restores normal speed when it stops', () => {
  const game = new Game(scenario([rain]), { seed: 3 });
  forecast(game, 'rain', 'a~b', 3, 3);
  assert.equal(game.previewTravel('b').days, 3); // unknown rain cannot leak through the estimate
  ok(game.startTravel('b'));
  ok(game.advanceTravelDay()); assert.equal(game.state.day, 2); assert.equal(game.getTravelStatus().progress, 1);
  const rainy = ok(game.advanceTravelDay()); assert.equal(game.state.day, 3); assert.equal(game.getTravelStatus().progress, 1.5); assert.ok(rainy.events.some(text => text.includes('暴雨')));
  assert.equal(game.getKnownEvents()[0].isPublic, true);
  ok(game.advanceTravelDay()); assert.equal(game.state.day, 4); assert.equal(game.getTravelStatus().progress, 2.5);
  assert.equal(ok(game.advanceTravelDay()).arrived, true); assert.equal(game.state.day, 5); assert.equal(game.state.city, 'b'); assert.equal(game.state.money, 496); assert.equal(game.state.travelLog[0].days, 4);
});

test('the same rain affects both directions and known forecasts alone change travel estimates', () => {
  const data = scenario([rain]); data.initial.city = 'b';
  const game = new Game(data, { seed: 4 }); forecast(game, 'rain', 'a~b', 3, 5);
  assert.equal(game.previewTravel('a').days, 3);
  ok(game.buyInformation()); assert.equal(game.previewTravel('a').days, 3);
  game.advanceDays(1); ok(game.buyInformation(game.state.worldEvents[0].id)); assert.equal(game.previewTravel('a').days, 5);
  const result = ok(game.travel('a')); assert.equal(result.arrived, true); assert.equal(game.state.day, 7);
  assert.equal(game.state.travelLog[0].days, 5);
});

test('tavern charges for empty inquiries and rejects unaffordable or repeated attempts', () => {
  const game = new Game(scenario([rain]), { seed: 5 });
  const empty = ok(game.buyInformation()); assert.equal(empty.cost, 2); assert.equal(game.state.money, 498); game.advanceDays(1);
  let before;
  forecast(game, 'rain', 'a~b', 3, 4);
  game.state.money = 1; before = structuredClone(game.state); assert.equal(game.buyInformation().ok, false); assert.deepEqual(game.state, before);
  game.state.money = 10; const information = ok(game.buyInformation()); assert.equal(information.cost, 2); assert.equal(game.state.money, 8); assert.equal(information.event.reports[0].source, 'tavern');
  before = structuredClone(game.state); assert.equal(game.buyInformation().ok, false); assert.deepEqual(game.state, before);
});

test('travelers share existing forecasts for free, including on an extra rainy day', () => {
  const data = scenario([rain, harvest]); data.rules.events.travelerChance = 1;
  const game = new Game(data, { seed: 6 }); forecast(game, 'rain', 'a~b', 3, 5); ok(game.buyInformation());
  ok(game.startTravel('b')); ok(game.advanceTravelDay()); ok(game.advanceTravelDay());
  // This forecast already exists before the next daily traveler encounter; no message creates it.
  forecast(game, 'harvest', 'c', 5, 7, 'wheat');
  ok(game.advanceTravelDay()); assert.equal(game.getTravelStatus().elapsedDays, 3); // still on the road
  const cash = game.state.money;
  forecast(game, 'harvest', 'b', 6, 8, 'wheat');
  const extraDay = ok(game.advanceTravelDay());
  assert.equal(game.state.money, cash); assert.equal(game.getKnownEvents().find(event => event.target === 'b').reports[0].source, 'traveler');
  assert.ok(extraDay.events.some(text => text.includes('乙城')));
});

test('all town operations reject during travel without changing date, money or random state', () => {
  const game = new Game(scenario(), { seed: 7 }); ok(game.startTravel('b'));
  const before = structuredClone(game.state);
  for (const action of [() => game.buy('wheat', 1), () => game.sell('wheat', 1), () => game.deliverPurchase('missing'), () => game.advanceStory(), () => game.takeLoan(1), () => game.repayLoan(1), () => game.rest(1), () => game.rescue(), () => game.buyInformation(), () => game.shareApple(), () => game.startTravel('b'), () => game.travel('b')]) {
    assert.equal(action().ok, false); assert.deepEqual(game.state, before);
  }
  assert.deepEqual(game.advanceDays(10), []); assert.deepEqual(game.state, before); // cannot advance the calendar while bypassing journey progress
});

test('edited rain multipliers preserve valid fractional progress through saves', () => {
  const data = scenario([rain]); data.worldEvents[0].travelMultiplier = 3; data.rules.events.rainForecastDays = 1;
  const game = new Game(data, { seed: 70 }); forecast(game, 'rain', 'a~b', 2, 4); ok(game.startTravel('b'));
  for (let day = 0; day < 3; day++) { ok(game.advanceTravelDay()); ok(new Game(data, { seed: 71 }).importSave(game.exportSave())); }
  assert.ok(Math.abs(game.getTravelStatus().progress - 1) < .000002);
  while (game.state.journey) ok(game.advanceTravelDay());
  assert.equal(game.state.travelLog[0].days, 5);
});

test('a mid-journey save restores progress, hidden events and PRNG, and matches uninterrupted travel', () => {
  const data = scenario(); data.rules.events.dailyChance = 1; data.rules.events.travelerChance = .5;
  const game = new Game(data, { seed: 8 }); ok(game.startTravel('b')); ok(game.advanceTravelDay());
  const copy = new Game(data, { seed: 999 }); ok(copy.importSave(game.exportSave())); assert.deepEqual(copy.state, game.state);
  while (game.state.journey) { assert.deepEqual(ok(copy.advanceTravelDay()), ok(game.advanceTravelDay())); assert.deepEqual(copy.state, game.state); }
  copy.advanceDays(30); game.advanceDays(30); assert.deepEqual(copy.state, game.state);
  ok(new Game(data).importSave(game.exportSave()));
});

test('same seed and equivalent day advancement produce the same world without buying information', () => {
  const data = scenario(); data.rules.events.dailyChance = 1;
  const bulk = new Game(data, { seed: 9 }), daily = new Game(data, { seed: 9 });
  bulk.advanceDays(100); for (let day = 0; day < 100; day++) daily.advanceDays(1);
  assert.deepEqual(bulk.state, daily.state); assert.ok(bulk.state.eventCounter > 10);
  assert.equal(new Game(data, { seed: 10 }).importSave(bulk.exportSave()).ok, true);
});

test('strict event and journey saves reject malformed records and old versions atomically', () => {
  const data = scenario(), game = new Game(data, { seed: 11 }); forecast(game, 'rain', 'a~b', 3, 4); ok(game.buyInformation()); ok(game.startTravel('b')); ok(game.advanceTravelDay());
  const saved = JSON.parse(game.exportSave()), target = new Game(data, { seed: 12 }), before = structuredClone(target.state);
  const corruptions = [
    state => state.randomState = -1, state => state.randomState = 1.5, state => state.eventCounter = 0,
    state => state.worldEvents[0].extra = true, state => state.worldEvents[0].type = '__proto__', state => state.worldEvents[0].target = 'b~a',
    state => state.worldEvents[0].good = 'wheat', state => state.worldEvents[0].startDay = 999, state => state.worldEvents[0].endDay = 99,
    state => state.worldEvents[0].reports[0].source = 'rumor', state => state.worldEvents[0].reports[0].day = null,
    state => state.worldEvents[0].reports[0].detail = 'detail',
    state => state.worldEvents.push(structuredClone(state.worldEvents[0])),
    state => state.journey.extra = 1, state => state.journey.cost++, state => state.journey.to = 'c', state => state.journey.startedDay++,
    state => state.journey.progress = 3, state => state.journey.elapsedDays++, state => state.journey.progress = -.5, state => state.journey.progress = .75,
    state => state.markets.a.wheat.stock = 41
  ];
  for (const corrupt of corruptions) { const damaged = structuredClone(saved); corrupt(damaged.state); assert.equal(target.importSave(damaged).ok, false); assert.deepEqual(target.state, before); }
  const old = structuredClone(saved); old.version = VERSION - 1; old.state.schemaVersion = VERSION - 1; assert.equal(target.importSave(old).ok, false); assert.deepEqual(target.state, before);
  ok(target.importSave(saved)); assert.deepEqual(target.state, game.state);
});

const festival = { id: 'festival', name: '城市节庆', description: '宴席需求增加', scope: 'city', eligibleGoods: ['wine', 'apple', 'cheese'], minDays: 3, maxDays: 5, travelMultiplier: 1, stockMultiplier: 1, priceMultiplier: 1.35, dailyConsumption: 6 };
function festivalScenario(types = [festival]) {
  const data = scenario(types);
  for (const [id, name, price] of [['wine', '葡萄酒', 20], ['apple', '苹果', 10], ['cheese', '奶酪', 10]]) data.goods.push({ id, name, unit: '份', weight: 1, basePrice: price, cargoW: 1, cargoH: 1, stackLimit: 100, shelfLifeDays: null });
  data.cities[0].market.wine = { price: 20, stock: 20 }; data.cities[0].market.apple = { price: 10, stock: 20 };
  data.cities[1].market.cheese = { price: 10, stock: 20 };
  return data;
}

test('festivals are scheduled only in towns selling suitable goods and never invent a missing local good', () => {
  const data = festivalScenario(); data.rules.events.dailyChance = 1;
  for (let seed = 0; seed < 30; seed++) {
    const game = new Game(data, { seed }), event = game.state.worldEvents[0];
    assert.ok(['a', 'b'].includes(event.target)); assert.equal(event.good, null);
    game.advanceDays(event.startDay - game.state.day); const active = game.getActiveEvents()[0];
    assert.deepEqual(active.goods, event.target === 'a' ? ['wine', 'apple'] : ['cheese']);
    assert.equal(game.quote('cheese', 'a'), null); assert.equal(game.quote('wine', 'b'), null); assert.equal(game.quote('wine', 'c'), null);
    ok(new Game(data, { seed: 999 }).importSave(game.exportSave()));
  }
});

test('festival raises both quotes, consumes existing goods after refill on every active day and restores the normal market', () => {
  const data = festivalScenario(), game = new Game(data, { seed: 30 }); forecast(game, 'festival', 'a', 3, 5);
  const ordinary = game.quote('wine'); game.advanceDays(2);
  assert.equal(game.quote('wine').buy, ordinary.buy * 1.35); assert.ok(game.quote('wine').sell > ordinary.sell);
  assert.equal(game.quote('wheat').buy, 10); assert.equal(game.quote('wine').stock, 14); assert.equal(game.quote('apple').stock, 14);
  const cash = game.state.money; ok(game.buy('wine', 1)); ok(game.sell('wine', 1)); assert.ok(game.state.money < cash);
  game.advanceDays(1); assert.equal(game.quote('wine').stock, 9);
  game.advanceDays(1); assert.equal(game.quote('wine').stock, 4); assert.equal(game.quote('wine').buy, 27);
  game.advanceDays(1); assert.equal(game.quote('wine').stock, 5); assert.equal(game.quote('wine').buy, 20);
  const scarceData = festivalScenario(); scarceData.cities[0].market.wine.stock = 3;
  const scarce = new Game(scarceData, { seed: 31 }); forecast(scarce, 'festival', 'a', 3, 5); scarce.advanceDays(4);
  assert.equal(scarce.quote('wine').stock, 0); scarce.advanceDays(1); assert.equal(scarce.quote('wine').stock, 1);
});

test('a festival and harvest multiply prices while harvest alone controls stock capacity and announcements keep their terms', () => {
  const crop = { ...harvest, eligibleGoods: ['wheat', 'apple'] }, data = festivalScenario([crop, festival]);
  data.purchaseNotices = [{ id: 'apple-order', title: '收苹果', destination: 'c', good: 'apple', quantity: 2, unitPrice: 15, initialPublishDay: 1, listingDays: 9, refreshDays: 3 }];
  const game = new Game(data, { seed: 32 }), terms = game.getPurchaseOffers().map(({ unitPrice, quantity, dueDay }) => ({ unitPrice, quantity, dueDay }));
  forecast(game, 'harvest', 'a', 3, 5, 'apple'); game.advanceDays(1); forecast(game, 'festival', 'a', 4, 6);
  game.advanceDays(1); assert.equal(game.quote('apple').stock, 40); assert.equal(game.quote('apple').buy, 7);
  game.advanceDays(1); assert.equal(game.quote('apple').stock, 34); assert.equal(game.quote('apple').buy, 9.5); assert.equal(game.quote('wine').buy, 27);
  assert.deepEqual(game.getPurchaseOffers().map(({ unitPrice, quantity, dueDay }) => ({ unitPrice, quantity, dueDay })), terms);
  ok(new Game(data).importSave(game.exportSave()));
  game.advanceDays(2); assert.equal(game.quote('apple').stock, 14); assert.equal(game.quote('apple').buy, 13.5);
  game.advanceDays(1); assert.equal(game.quote('apple').stock, 15); assert.equal(game.quote('apple').buy, 10);
});

test('credible hints omit all exact goods, dates and multipliers, then a later report supplies details without rerolling', () => {
  const game = new Game(scenario([harvest]), { seed: 33 }); const event = forecast(game, 'harvest', 'b', 3, 5, 'wheat');
  const schedule = { id: event.id, type: event.type, target: event.target, good: event.good, startDay: event.startDay, endDay: event.endDay }, randomState = game.state.randomState;
  ok(game.buyInformation()); const hint = game.getKnownEvents()[0];
  assert.equal(hint.detailLevel, 'hint'); assert.equal(hint.city, 'b'); assert.equal(hint.reports[0].detail, 'hint');
  for (const field of ['startDay', 'endDay', 'good', 'goods', 'description', 'travelMultiplier', 'stockMultiplier', 'priceMultiplier', 'dailyConsumption', 'eligibleGoods', 'minDays', 'maxDays']) assert.equal(Object.hasOwn(hint, field), false, field);
  assert.equal(hint.message.includes('小麦'), false); assert.equal(hint.message.includes(game.formatDate(3)), false);
  const before = structuredClone(game.state); assert.equal(game.buyInformation().ok, false); assert.deepEqual(game.state, before);
  game.advanceDays(1); const cash = game.state.money; const result = ok(game.buyInformation(event.id)); const detail = game.getKnownEvents()[0];
  assert.equal(game.state.money, cash - 2); assert.equal(result.report.detail, 'detail'); assert.equal(detail.detailLevel, 'detail');
  assert.equal(detail.startDay, 3); assert.equal(detail.endDay, 5); assert.deepEqual(detail.goods, ['wheat']); assert.equal(detail.priceMultiplier, .7);
  assert.equal(detail.message.includes('乙城的小麦的小麦'), false); assert.ok(detail.message.includes('小麦'));
  assert.deepEqual(Object.fromEntries(Object.keys(schedule).map(key => [key, event[key]])), schedule); assert.equal(game.state.randomState !== randomState, true); // advancing the world alone uses RNG
  const after = structuredClone(game.state); assert.equal(game.buyInformation().ok, false); assert.deepEqual(game.state, after);
});

test('travelers can supply the next layer for free and use their own credible dialogue', () => {
  const data = scenario([rain]); data.rules.events.travelerChance = 1;
  const game = new Game(data, { seed: 34 }); forecast(game, 'rain', 'a~b', 3, 5); const first = ok(game.buyInformation());
  ok(game.startTravel('b')); const cash = game.state.money; ok(game.advanceTravelDay());
  const detail = game.getKnownEvents()[0]; assert.equal(detail.detailLevel, 'detail'); assert.equal(game.state.money, cash);
  assert.deepEqual(detail.reports.map(report => [report.source, report.day, report.detail]), [['tavern', 1, 'hint'], ['traveler', 2, 'detail']]);
  assert.notEqual(detail.message, first.message); assert.equal(game.getEventNotices()[1].source, 'traveler');
  const other = new Game(data, { seed: 34 }); forecast(other, 'rain', 'a~b', 3, 5); ok(other.startTravel('b')); ok(other.advanceTravelDay());
  assert.equal(other.getKnownEvents()[0].detailLevel, 'hint'); assert.notEqual(other.getKnownEvents()[0].message, first.message);
});

test('every active event becomes fully public globally and active details are never sold as information', () => {
  const game = new Game(scenario([rain]), { seed: 35 }); forecast(game, 'rain', 'b~c', 3, 4);
  assert.deepEqual(game.getKnownEvents(), []); game.advanceDays(2);
  assert.equal(game.state.city, 'a'); const active = game.getActiveEvents()[0];
  assert.equal(active.isPublic, true); assert.equal(active.detailLevel, 'detail'); assert.equal(active.startDay, 3); assert.equal(active.endDay, 4); assert.deepEqual(active.reports, []);
  assert.deepEqual(game.getKnownEvents(), game.getActiveEvents()); assert.deepEqual(game.getLocalEvents(), []);
  const cash = game.state.money; ok(game.buyInformation()); assert.equal(game.state.money, cash - 2);
  assert.equal(game.getEventNotices()[0].kind, 'started'); assert.equal(game.getEventNotices()[0].source, 'public');
});

test('heard, detail and started notices persist safe snapshots in FIFO order even after their event expires', () => {
  const data = scenario([rain]), game = new Game(data, { seed: 36 }); forecast(game, 'rain', 'a~b', 3, 3);
  ok(game.buyInformation()); game.advanceDays(1); ok(game.buyInformation(game.state.worldEvents[0].id)); game.advanceDays(2);
  assert.deepEqual(game.getKnownEvents(), []); assert.deepEqual(game.state.worldEvents, []);
  const notices = game.getEventNotices(); assert.deepEqual(notices.map(notice => notice.kind), ['heard', 'detail', 'started']);
  assert.equal(Object.hasOwn(notices[0].event, 'startDay'), false); assert.equal(notices[1].event.isPublic, false); assert.equal(notices[2].event.isPublic, true);
  assert.equal(notices[2].event.startDay, 3); assert.equal(notices[2].event.endDay, 3);
  const copy = new Game(data, { seed: 999 }); ok(copy.importSave(game.exportSave())); assert.deepEqual(copy.getEventNotices(), notices);
  notices[0].message = '外部编辑'; assert.notEqual(copy.getEventNotices()[0].message, notices[0].message);
  const before = structuredClone(copy.state); assert.equal(copy.acknowledgeEventNotice(copy.getEventNotices()[1].id).ok, false); assert.deepEqual(copy.state, before);
  for (const notice of copy.getEventNotices()) { ok(copy.acknowledgeEventNotice(notice.id)); ok(new Game(data).importSave(copy.exportSave())); }
  assert.deepEqual(copy.getEventNotices(), []); copy.advanceDays(1); assert.deepEqual(copy.getEventNotices(), []); assert.equal(copy.state.noticeCounter, 3);
});

test('public notices are created once while synchronous travel and rest can continue until the UI acknowledges', () => {
  const data = scenario([rain]), game = new Game(data, { seed: 37 }); forecast(game, 'rain', 'b~c', 3, 4);
  ok(game.travel('b')); assert.equal(game.state.city, 'b'); assert.equal(game.getEventNotices().length, 1);
  ok(game.rest(1)); assert.equal(game.getEventNotices().length, 1); assert.equal(game.state.noticeCounter, 1);
  const notice = game.getEventNotices()[0], before = structuredClone(game.state); game.getKnownEvents(); game.getActiveEvents(); game.getLocalEvents(); game.getEventNotices();
  assert.deepEqual(game.state, before); ok(game.acknowledgeEventNotice(notice.id)); assert.equal(game.state.noticeCounter, 1);
});

test('strict saves reject forged report layers, leaked hints, altered notification snapshots and out-of-order acknowledgements', () => {
  const data = scenario([rain]), game = new Game(data, { seed: 38 }); forecast(game, 'rain', 'a~b', 3, 4);
  ok(game.buyInformation()); game.advanceDays(1); ok(game.buyInformation(game.state.worldEvents[0].id));
  const saved = JSON.parse(game.exportSave()), target = new Game(data, { seed: 39 }), before = structuredClone(target.state);
  const corruptions = [
    state => state.worldEvents[0].reports[0].detail = 'detail',
    state => state.worldEvents[0].reports[1].day = 0,
    state => state.worldEvents[0].reports[1].source = 'public',
    state => state.worldEvents[0].reports[0].text = '不允许的持久字段',
    state => state.worldEvents[0].reports.push({ source: 'traveler', day: 2, detail: 'detail' }),
    state => state.noticeCounter++, state => state.noticeCounter = 0,
    state => state.eventNotices[0].id = 'notice-7',
    state => state.eventNotices.reverse(),
    state => state.eventNotices[0].source = 'public',
    state => state.eventNotices[0].report.detail = 'detail',
    state => state.eventNotices[0].day = 2,
    state => state.eventNotices[0].event.startDay = 3,
    state => state.eventNotices[0].event.goods = ['wheat'],
    state => state.eventNotices[0].event.message = '谣言',
    state => state.eventNotices[0].event.reports[0].text = '谣言',
    state => state.eventNotices[1].event.endDay++,
    state => state.eventNotices[1].event.travelMultiplier = 1,
    state => state.eventNotices[1].event.reports[0].day = 2,
    state => state.eventNotices[0].message = '谣言',
    state => state.worldEvents = []
  ];
  for (const corrupt of corruptions) { const damaged = structuredClone(saved); corrupt(damaged.state); assert.equal(target.importSave(damaged).ok, false); assert.deepEqual(target.state, before); }
  ok(target.importSave(saved)); assert.deepEqual(target.state, game.state);
  const old = structuredClone(saved); old.version = 7; assert.equal(target.importSave(old).ok, false);
});

test('targeted follow-up can complete a traveler hint on the same day and tavern quota persists across towns and saves', () => {
  const data = scenario([rain]), game = new Game(data, {seed: 71});
  const event = forecast(game, 'rain', 'a~b', 3, 4);
  game._reportEvent(event, 'traveler', []);
  ok(game.buyInformation(event.id));
  assert.deepEqual(event.reports.map(r => r.day), [1, 1]);
  assert.equal(event.reports[1].detail, 'detail');
  const copy = new Game(data); ok(copy.importSave(game.exportSave()));
  copy.state.city = 'b'; copy.state.visited.push('b');
  const before = structuredClone(copy.state);
  assert.equal(copy.buyInformation().ok, false); assert.deepEqual(copy.state, before);
  copy.advanceDays(1); const cash = copy.state.money; ok(copy.buyInformation());
  assert.equal(copy.state.money, cash - data.rules.events.tavernCost);
});

test('new inquiries leave known hints untouched, selected follow-ups reject invalid targets without spending', () => {
  const game = new Game(scenario([rain]), {seed: 72});
  const first = forecast(game, 'rain', 'a~b', 3, 4), second = forecast(game, 'rain', 'b~c', 3, 4);
  game._reportEvent(first, 'traveler', []);
  const before = structuredClone(game.state);
  assert.equal(game.buyInformation('missing').ok, false); assert.deepEqual(game.state, before);
  assert.equal(ok(game.buyInformation()).event.id, second.id);
  assert.equal(first.reports.length, 1);
});

test('production lead times depend on event duration and support simultaneous starts', () => {
  const data = structuredClone(require('../js/data.js')); data.rules.events.dailyChance = 1;
  for (const type of data.worldEvents) {
    const d = structuredClone(data); d.worldEvents = [type];
    const game = new Game(d, {seed: 81}), event = game.state.worldEvents[0], duration = event.endDay - event.startDay + 1;
    assert.equal(event.startDay-game.state.day, type.id === 'rain' ? 2 : duration + (type.id === 'festival' ? 2 : 0));
    for (let day=0;day<20;day++) { game.advanceDays(1); ok(new Game(d).importSave(game.exportSave())); }
  }
});
