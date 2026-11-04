'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { Game } = require('../js/engine.js');
const { fixture } = require('./helpers.cjs');
const M = require('../js/money.js');

const data = fixture({
  goods: [{ id: 'fur', name: '毛皮', unit: '捆', weight: 4, basePrice: 10, cargoW: 2, cargoH: 1, stackLimit: 4, shelfLifeDays: null }, { id: 'wheat', name: '小麦', unit: '袋', weight: 2, basePrice: 3, cargoW: 1, cargoH: 1, stackLimit: 10, shelfLifeDays: null }],
  cities: [
    { id: 'village', name: '村庄', market: { fur: { price: 10, stock: 20 }, wheat: { price: 3, stock: 20 } } },
    { id: 'port', name: '港城', market: { fur: { price: 20, stock: 20 }, wheat: { price: 5, stock: 20 } } },
    { id: 'north', name: '北方', market: { fur: { price: 12, stock: 20 } } }
  ],
  routes: [{ from: 'village', to: 'port', days: 2, cost: 4 }, { from: 'port', to: 'north', days: 3, cost: 6 }],
  story: [
    { id: 'meeting', title: '相遇', conditions: { city: 'village' }, reward: { flags: ['met'], money: 5 } },
    { id: 'fur-sale', title: '毛皮交易', conditions: { city: 'port', soldAt: { city: 'port', good: 'fur', quantity: 2 } }, reward: { unlockCities: ['north'], unlockMechanics: ['loan'], money: 10 } }
  ],
  initial: { city: 'village', money: 150, wagon: { cols: 8, rows: 5, maxWeight: 40 }, inventory: { fur: 2 }, unlockedCities: ['village', 'port'] }
});

test('trade enforces quantity, stock, capacity and cash without changing state on failure', () => {
  const game = new Game(data);
  const original = game.exportSave();
  for (const quantity of [-2, 0, 1.2, NaN, Infinity, 20000]) assert.equal(game.buy('fur', quantity).ok, false);
  assert.equal(game.buy('unknown', 1).ok, false);
  assert.equal(game.buy('fur', 20).ok, false);
  assert.equal(game.sell('fur', 3).ok, false);
  assert.deepEqual(JSON.parse(game.exportSave()).state, JSON.parse(original).state);
  const cash = game.state.money;
  const price = game.quote('fur').buy;
  assert.equal(game.buy('fur', 3).ok, true);
  assert.equal(game.state.inventory.fur, 5);
  assert.equal(game.quote('fur').stock, 17);
  assert.equal(game.state.money, Math.round((cash - price * 3) * 100) / 100);
});

test('same-town trading cannot create silver', () => {
  const game = new Game(data),initial=game.state.money;
  game.buy('wheat',2);game.sell('wheat',2);assert.ok(game.state.money<initial);
});

test('trade, story and route unlocks form a complete journey', () => {
  const game = new Game(data);
  assert.equal(game.previewTravel('north').ok, false);
  assert.equal(game.advanceStory().ok, true);
  assert.equal(game.buy('wheat', 2).ok, true);
  assert.equal(game.travel('port').ok, true);
  assert.equal(game.state.day, 3);
  assert.equal(game.advanceStory().ok, false);
  assert.equal(game.sell('fur', 2).ok, true);
  assert.equal(game.advanceStory().ok, true);
  assert.equal(game.state.chapterComplete, true);
  assert.equal(game.previewTravel('north').ok, true);
  assert.deepEqual(game.state.visited, ['village', 'port']);
  assert.equal(game.state.travelLog.length, 1);
  assert.equal(game.state.soldAt.port.fur, 2);
});

test('save roundtrip preserves the full game and imports atomically reject malformed state', () => {
  const game = new Game(data);
  game.advanceStory();
  game.travel('port');
  game.sell('fur', 2);
  game.advanceStory();
  game.takeLoan(50);
  const original = JSON.parse(game.exportSave());
  const copy = new Game(data);
  assert.equal(copy.importSave(JSON.stringify(original)).ok, true);
  assert.deepEqual(copy.state, game.state);
  const corruptions = [
    state => { state.money = -1; },
    state => { state.city = '__proto__'; },
    state => { state.inventory.fur = 0.5; },
    state => { state.inventory.fur = 1000; },
    state => { state.money = 1.1; },
    state => { state.markets.port.wheat.stock = -1; },
    state => { state.storyIndex = 99; },
    state => { state.wagon.maxWeight = 0; },
    state => { state.flags.push('unknown'); },
    state => { state.extraField = {}; }
  ];
  for (const corrupt of corruptions) {
    const damaged = structuredClone(original);
    corrupt(damaged.state);
    assert.equal(copy.importSave(damaged).ok, false);
    assert.deepEqual(copy.state, game.state);
  }
  assert.equal(copy.importSave('{').ok, false);
  assert.equal(copy.importSave({ format: 'different' }).ok, false);
});

test('borrowing adds a liability, time adds interest, repayment respects available cash', () => {
  const game = new Game(data);
  assert.equal(game.takeLoan(100).ok, false);
  game.state.unlockedMechanics.push('loan');
  const worth = game.getNetWorth();
  assert.equal(game.takeLoan(100).ok, true);
  assert.equal(game.getNetWorth(), worth);
  game.travel('port');
  assert.ok(game.state.debt > 100);
  assert.equal(game.takeLoan(150).ok, false);
  const debt = game.state.debt;
  assert.equal(game.repayLoan(debt).ok, true);
  assert.equal(game.state.debt, 0);
  assert.equal(game.state.loanDueDay, null);
  assert.equal(game.repayLoan(1).ok, false);
});

test('a stranded player has a recovery path without granting repeatable same-day free money', () => {
  const game = new Game(data);
  assert.equal(game.rescue().ok, false);
  game.removeGoods('fur', game.state.inventory.fur);
  game.state.money = 0;
  assert.equal(game.travel('port').ok, false);
  assert.equal(game.rescue().ok, true);
  assert.equal(game.state.day, 2);
  assert.equal(game.state.money, 12);
  assert.equal(game.rescue().ok, false);
  assert.equal(game.travel('port').ok, true);
});

test('non-finite and prototype-named financial inputs cannot change the ledger', () => {
  const game = new Game(data);
  game.state.unlockedMechanics.push('loan');
  const original = structuredClone(game.state);
  for (const bad of [NaN, Infinity, -Infinity, -5, 0, '10', {}, null]) {
    assert.equal(game.buy('fur', bad).ok, false);
    assert.equal(game.sell('fur', bad).ok, false);
    assert.equal(game.takeLoan(bad).ok, false);
    assert.equal(game.repayLoan(bad).ok, false);
  }
  for (const id of ['__proto__', 'constructor', 'toString']) {
    assert.equal(game.quote(id), null);
    assert.equal(game.sell(id, 1).ok, false);
    assert.equal(game.buy(id, 1).ok, false);
  }
  assert.deepEqual(game.state, original);
});

test('opening money, date, relationship and wagon are read from the configured initial values', () => {
  const configured = structuredClone(data);
  Object.assign(configured.initial, {
    money: 73.5,
    day: 5,
    relationship: 11,
    wagon: { cols: 3, rows: 2, maxWeight: 25 }
  });
  const game = new Game(configured);
  assert.equal(game.state.money, 73.5);
  assert.equal(game.state.day, 5);
  assert.equal(game.state.relationship, 11);
  assert.deepEqual(game.state.wagon, configured.initial.wagon);
});

test('edited market rules change quote cadence, trading spread and daily replenishment', () => {
  const configured = structuredClone(data);
  Object.assign(configured.rules.market, {
    pricePeriodDays: 1,
    priceSteps: 3,
    priceAmplitude: .1,
    sellRate: .5,
    restockDivisor: 2,
    minimumRestock: 3
  });
  const game = new Game(configured);
  const today = game.quote('wheat');
  assert.ok(today.sell <= today.buy / 2);
  assert.ok(M.isQuarter(today.sell));
  assert.equal(game.buy('wheat', 10).ok, true);
  assert.equal(game.quote('wheat').stock, 10);
  game.advanceDays(1);
  assert.notEqual(game.quote('wheat').buy, today.buy);
  assert.equal(game.quote('wheat').stock, 20);

  configured.rules.market.minimumRestock = 5;
  configured.rules.market.restockDivisor = 100;
  const minimum = new Game(configured);
  assert.equal(minimum.buy('wheat', 10).ok, true);
  minimum.advanceDays(1);
  assert.equal(minimum.quote('wheat').stock, 15);
});

test('edited loan rules control credit, maturity and accumulated daily interest', () => {
  const configured = structuredClone(data);
  configured.rules.loan = { limit: 60, dailyRate: .02, termDays: 9 };
  configured.initial.unlockedMechanics.push('loan');
  const game = new Game(configured);
  assert.equal(game.takeLoan(60.25).ok, false);
  assert.equal(game.takeLoan(60).ok, true);
  assert.equal(game.state.loanDueDay, 10);
  assert.equal(game.getLoanSummary().creditAvailable, 0);
  game.advanceDays(1);
  assert.equal(game.state.debt, 61);
  assert.equal(game.state.interestAccrued, .2);
});

test('edited rest, recovery and relationship rewards affect the same journey without new mechanics', () => {
  const configured = structuredClone(data);
  configured.rules.rest = { dailyCost: 3.5, maxDays: 2, relationshipGain: 4 };
  configured.rules.rescue = { cashThreshold: 15, reward: 30, days: 2 };
  Object.assign(configured.rules.relationship, { max: 50, travelGain: 5, storyGain: 7, appleGain: 8, trustThreshold: 20, intimacyThreshold: 40 });
  configured.goods.push({ id: 'apple', name: '苹果', unit: '篮', weight: 1, basePrice: 1, cargoW: 1, cargoH: 1, stackLimit: 5, shelfLifeDays: 5 });
  configured.cities[0].market.apple = { price: 1, stock: 20 };
  const game = new Game(configured);
  assert.equal(game.advanceStory().ok, true);
  assert.equal(game.state.relationship, 27);
  assert.equal(game.buy('apple', 1).ok, true);
  assert.equal(game.shareApple().ok, true);
  assert.equal(game.state.relationship, 35);
  assert.equal(game.travel('port').ok, true);
  assert.equal(game.state.relationship, 40);
  const cash = game.state.money;
  assert.equal(game.rest(3).ok, false);
  assert.equal(game.rest(2).ok, true);
  assert.equal(game.state.money, cash - 7);
  assert.equal(game.state.relationship, 44);
  assert.equal(game.sell('fur', 2).ok, true);
  assert.equal(game.advanceStory().ok, true);
  assert.equal(game.state.relationship, 50);

  const recovery = structuredClone(configured);
  recovery.initial.money = 0;
  recovery.initial.inventory = {};
  const stranded = new Game(recovery);
  assert.equal(stranded.rescue().ok, true);
  assert.equal(stranded.state.day, 3);
  assert.equal(stranded.state.money, 30);
  assert.equal(stranded.rescue().ok, false);
});

test('a save from a different balance revision is rejected atomically', () => {
  const first = structuredClone(data);
  first.balanceRevision = 'balance-a';
  const game = new Game(first);
  const saved = game.exportSave();
  assert.equal(JSON.parse(saved).balanceRevision, 'balance-a');
  assert.equal(new Game(first).importSave(saved).ok, true);

  const changed = structuredClone(first);
  changed.rules.rest.dailyCost = 3;
  changed.balanceRevision = 'balance-b';
  changed.initial.money = 42;
  const current = new Game(changed), before = structuredClone(current.state);
  const rejected = current.importSave(saved);
  assert.equal(rejected.ok, false);
  assert.match(rejected.message, /数值配置不匹配/);
  assert.deepEqual(current.state, before);
});
