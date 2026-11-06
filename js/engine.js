/* Spice & Wolf: a deterministic, browser-independent single-player economy. */
(function (root) {
  'use strict';
  const VERSION = 9;
  const MONEY_LIMIT = 1e9;
  const clone = value => JSON.parse(JSON.stringify(value));
  const money = root.SWMoney || (typeof require === 'function' ? require('./money.js') : null);
  if (!money) throw new Error('缺少银币计数工具');
  const calendar = root.SWCalendar || (typeof require === 'function' ? require('./calendar.js') : null);
  if (!calendar) throw new Error('缺少行商历工具');
  const round = money.round, roundReceipt = money.floor, fmt = money.format;
  const measure = n => Math.round(n * 1e6) / 1e6;
  const validNumber = (n, min = 0, max = MONEY_LIMIT) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
  const whole = (n, min = 1, max = 10000) => Number.isInteger(n) && n >= min && n <= max;
  const coinAmount = (n, min = 0, max = MONEY_LIMIT) => validNumber(n,min,max) && money.isQuarter(n);
  const plain = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const yes = (message, extra = {}) => Object.assign({ ok: true, message }, extra);
  const no = message => ({ ok: false, message });
  const mechanicNames = {
    trade: '货物买卖', travel: '旅行', free_trade: '自由行商',
    loan: '商会借贷', purchase: '收购公告'
  };

  class Game {
    constructor(data, options = {}) {
      if (!data || !Array.isArray(data.cities) || !data.cities.length || !Array.isArray(data.goods) || !data.rules || !data.initial?.wagon) throw new Error('游戏资料不完整');
      this.data = data;
      this.rules = data.rules;
      this.goods = Object.fromEntries(data.goods.map(g => [g.id, g]));
      this.cities = Object.fromEntries(data.cities.map(c => [c.id, c]));
      this.eventTypes = Object.fromEntries((data.worldEvents || []).map(event => [event.id, event]));
      const seed = options.seed ?? (Object.keys(this.eventTypes).length ? Math.floor(Math.random() * 0x100000000) : 0);
      if (!whole(seed, 0, 0xffffffff)) throw new Error('随机种子应为32位无符号整数。');
      const eventRules = data.rules.events;
      if (Object.keys(this.eventTypes).length && (!eventRules || !whole(eventRules.rainForecastDays, 1, 30) || !whole(eventRules.harvestForecastExtraDays, 0, 30) || !whole(eventRules.festivalForecastExtraDays, 0, 30) || !validNumber(eventRules.dailyChance, 0, 1) || !validNumber(eventRules.travelerChance, 0, 1) || !coinAmount(eventRules.tavernCost, .25, 1000000))) throw new Error('缺少有效的事件数值。');
      for (const event of Object.values(this.eventTypes)) {
        if (!['route', 'market', 'city'].includes(event.scope) || !whole(event.minDays, 1, 30) || !whole(event.maxDays, event.minDays, 30)) throw new Error('事件持续时间或作用范围无效。');
        if (!whole(event.travelMultiplier, 1, 4) || !whole(event.stockMultiplier, 1, 4) || !validNumber(event.priceMultiplier, .1, 4) || !whole(event.dailyConsumption, 0, 100000)) throw new Error('事件倍率无效。');
        if (event.scope !== 'route' && (!Array.isArray(event.eligibleGoods) || !event.eligibleGoods.length || new Set(event.eligibleGoods).size !== event.eligibleGoods.length || !event.eligibleGoods.every(id => Object.hasOwn(this.goods, id)))) throw new Error('事件适用商品无效。');
      }
      const initial = data.initial;
      const city = initial.city;
      const inventory = Object.fromEntries(data.goods.map(g => [g.id, initial.inventory?.[g.id] || 0]));
      const markets = {};
      for (const place of data.cities) {
        markets[place.id] = {};
        for (const good of data.goods) {
          const listing = place.market?.[good.id];
          if (listing) markets[place.id][good.id] = { stock: listing.stock };
        }
      }
      this.state = {
        schemaVersion: VERSION, day: initial.day, city,
        money: round(initial.money),
        inventory, costBasis: Object.fromEntries(data.goods.map(g => [g.id, initial.costBasis && Object.hasOwn(initial.costBasis, g.id) ? round(initial.costBasis[g.id]) : round((initial.inventory?.[g.id] || 0) * g.basePrice)])),
        markets, unlockedCities: [...new Set(initial.unlockedCities)],
        unlockedMechanics: [...initial.unlockedMechanics],
        storyIndex: 0, flags: [], soldAt: {}, visited: [city],
        travelLog: [], journal: [{ day: initial.day, text: '马车已经备好。新的旅程从这里开始。' }],
        relationship: initial.relationship,
        debt: 0, interestAccrued: 0, loanDueDay: null,
        tradeCount: 0, totalProfit: 0, chapterComplete: !(data.story || []).length, lastGiftDay: null,
        wagon: clone(initial.wagon),
        cargo: [], cargoCounter: 0, purchaseHistory: [], purchaseCompleted: 0, spoiledGoods: {}, purchaseBoard: [],
        randomState: seed, eventCounter: 0, worldEvents: [], journey: null,
        noticeCounter: 0, eventNotices: [], lastTavernDay: null
      };
      for (const t of data.purchaseNotices || []) {
        if (!whole(t.listingDays, 1, 365) || !whole(t.refreshDays, 1, 365) || !whole(t.initialPublishDay, 1, 100000)) throw new Error('收购公告的发布周期无效。');
        this.state.purchaseBoard.push({ templateId: t.id, id: null, cycle: 0, publishedDay: null, dueDay: null, status: 'cooldown', nextPublishDay: t.initialPublishDay, closedDay: null, closedReason: null });
      }
      this._syncPurchaseBoard();
      if (!this.state.unlockedCities.includes(city)) this.state.unlockedCities.push(city);
      for (const good of data.goods) {
        const quantity = inventory[good.id];
        if (quantity) { const plan = this._planAdd(good.id, quantity, { totalCost: this.state.costBasis[good.id] }); if (!plan.ok) throw new Error('初始货舱无法容纳货物：' + plan.message); this.state.cargo = plan.cargo; this.state.cargoCounter = plan.counter; }
      }
      this._scheduleWorldEvent();
    }

    cargoShape(goodId, rotated = false) {
      const good = this.goods[goodId];
      if (!good) return null;
      const w = good.cargoW, h = good.cargoH;
      return rotated ? { w: h, h: w } : { w, h };
    }
    getCargoUsage() {
      const wagon = this.state.wagon;
      const usedCells = this.state.cargo.reduce((n, s) => { const d = this.cargoShape(s.good, s.rotated); return n + d.w * d.h; }, 0);
      return { ...wagon, weight: this.getLoad(), usedCells, totalCells: wagon.cols * wagon.rows, freeCells: wagon.cols * wagon.rows - usedCells, stacks: this.state.cargo.length };
    }
    getCargoLayout() {
      return { ...this.getCargoUsage(), stacks: this.state.cargo.map(stack => ({ ...clone(stack), ...this.cargoShape(stack.good, stack.rotated), name: this.goods[stack.good].name, weight: measure(this.goods[stack.good].weight * stack.quantity), remainingDays: stack.expiresDay === null ? null : stack.expiresDay-this.state.day, stackLimit: this.goods[stack.good].stackLimit })) };
    }
    _fits(stack, cargo, wagon = this.state.wagon) {
      const { w, h } = this.cargoShape(stack.good, stack.rotated);
      if (!whole(stack.x, 0, wagon.cols) || !whole(stack.y, 0, wagon.rows) || stack.x + w > wagon.cols || stack.y + h > wagon.rows) return false;
      return !cargo.some(other => {
        if (other.id === stack.id) return false;
        const shape = this.cargoShape(other.good, other.rotated);
        return stack.x < other.x + shape.w && stack.x + w > other.x && stack.y < other.y + shape.h && stack.y + h > other.y;
      });
    }
    _findSpot(stack, cargo, wagon = this.state.wagon) {
      for (const rotated of [false, true]) {
        const shape = this.cargoShape(stack.good, rotated);
        if (rotated && shape.w === shape.h) continue;
        for (let y = 0; y <= wagon.rows - shape.h; y++) for (let x = 0; x <= wagon.cols - shape.w; x++) {
          const placed = { ...stack, x, y, rotated };
          if (this._fits(placed, cargo, wagon)) return placed;
        }
      }
      return null;
    }
    _planAdd(goodId, quantity, meta = {}) {
      if (typeof goodId !== 'string' || !Object.hasOwn(this.goods, goodId) || !whole(quantity)) return no('货物或数量无效。');
      const good = this.goods[goodId], limit = good.stackLimit;
      if (this.getLoad() + good.weight * quantity > this.state.wagon.maxWeight + 0.001) return no('这批货物超过马车重量上限。');
      const purchasedDay = meta.purchasedDay ?? this.state.day;
      const expiresDay = good.shelfLifeDays ? purchasedDay + good.shelfLifeDays : null;
      const totalCost = round(meta.totalCost || 0), cargo = clone(this.state.cargo);
      let remaining = quantity, counter = this.state.cargoCounter, allocatedCost = 0;
      const costFor = count => { const target = count===remaining?totalCost:round(totalCost*(quantity-remaining+count)/quantity),cost=round(target-allocatedCost);allocatedCost=target;return cost; };
      for (const stack of cargo) if (stack.good === goodId && stack.expiresDay === expiresDay && stack.quantity < limit) {
        const amount = Math.min(remaining, limit-stack.quantity), cost=costFor(amount);
        stack.quantity += amount; stack.cost=round(stack.cost+cost); remaining-=amount;
        if (!remaining) break;
      }
      while (remaining) {
        const count=Math.min(remaining,limit),cost=costFor(count);
        const stack={id:`cargo-${++counter}`,good:goodId,quantity:count,x:0,y:0,rotated:false,purchasedDay,expiresDay,cost};
        const placed=this._findSpot(stack,cargo);
        if(!placed)return no('货舱没有能放下这批货物的空间。可以先整理或调整摆放。');
        cargo.push(placed);remaining-=count;
      }
      return yes('货舱可以装下这批货物。',{cargo,counter});
    }
    canFitCargo(goodId, quantity) { const result = this._planAdd(goodId, quantity); return { ok: result.ok, message: result.message }; }
    moveCargo(stackId, x, y, rotated) {
      const stack = this.state.cargo.find(item => item.id === stackId);
      if (!stack) return no('没有找到这件货物。');
      if (rotated !== undefined && typeof rotated !== 'boolean') return no('旋转方向无效。');
      const moved = { ...stack, x, y, rotated: rotated ?? stack.rotated };
      if (!this._fits(moved, this.state.cargo)) return no('这里放不下：请避开其他货物与货舱边界。');
      Object.assign(stack, moved);
      return yes('货物已重新摆放。');
    }
    rotateCargo(stackId) {
      const stack = this.state.cargo.find(item => item.id === stackId);
      if (!stack) return no('没有找到这件货物。');
      return this.moveCargo(stackId, stack.x, stack.y, !stack.rotated);
    }
    autoArrangeCargo() {
      const ordered = clone(this.state.cargo).sort((a, b) => {
        const da = this.cargoShape(a.good), db = this.cargoShape(b.good);
        return db.w * db.h - da.w * da.h || Math.max(db.w, db.h) - Math.max(da.w, da.h);
      });
      const packed = [];
      for (const stack of ordered) {
        const placed = this._findSpot(stack, packed);
        if (!placed) return no('暂时找不到更好的排布，已保留原有货物位置。');
        packed.push(placed);
      }
      this.state.cargo = packed;
      return yes('货舱已整理，货物与购入批次保持完好。');
    }
    getCalendar(day = this.state.day) { return calendar.getDate(day, this.data.calendar); }
    formatDate(day = this.state.day, { short = false } = {}) { return this.getCalendar(day)[short ? 'shortLabel' : 'label']; }

    _random() {
      // Mulberry32: the saved integer is the entire generator state, including seed 0.
      let value = this.state.randomState = (this.state.randomState + 0x6d2b79f5) >>> 0;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 0x100000000;
    }
    _routeKey(from, to) { return [from, to].sort().join('~'); }
    _eventActive(event, day = this.state.day) { return event.startDay <= day && day <= event.endDay; }
    _eventGoods(event) {
      const definition = this.eventTypes[event.type];
      if (definition.scope === 'route') return [];
      if (definition.scope === 'market') return [event.good];
      return Object.keys(this.cities[event.target].market || {}).filter(good => definition.eligibleGoods.includes(good));
    }
    _eventPlace(event, detail = 'detail') {
      if (this.eventTypes[event.type].scope === 'route') return event.target.split('~').map(id => this.cities[id].name).join('—') + '商路';
      return this.cities[event.target].name + (detail === 'detail' && event.good ? '的' + this.goods[event.good].name : '');
    }
    _newsText(event, source, detail) {
      const definition = this.eventTypes[event.type], templates = this.data.newsTemplates[event.type];
      const choices = source === 'public' ? templates.public : templates[source][detail];
      const index = (Number(event.id.slice(6)) + source.length + detail.length) % choices.length;
      const values = { place: this._eventPlace(event, 'hint'), eventName: definition.name };
      if (detail === 'detail') Object.assign(values, { startDate: this.formatDate(event.startDay), endDate: this.formatDate(event.endDay),
        goods: this._eventGoods(event).map(id => this.goods[id].name).join('、'), description: definition.description });
      return choices[index].replace(/\{(\w+)\}/g, (_, key) => values[key] || '');
    }
    _eventView(event, day = this.state.day) {
      const definition = this.eventTypes[event.type], route = definition.scope === 'route' ? event.target.split('~') : null;
      const reports = event.reports.filter(report => report.day <= day);
      const isPublic = event.startDay <= day, detailLevel = isPublic || reports.length === 2 ? 'detail' : 'hint';
      const view = { id: event.id, type: event.type, name: definition.name, scope: definition.scope, target: event.target,
        city: route ? null : event.target, route: route ? { from: route[0], to: route[1] } : null,
        detailLevel, isActive: this._eventActive(event, day), isPublic,
        reports: reports.map(report => ({ ...clone(report), text: this._newsText(event, report.source, report.detail) })),
        message: isPublic ? this._newsText(event, 'public', 'detail')
          : reports.length ? this._newsText(event, reports[reports.length - 1].source, detailLevel) : '' };
      if (detailLevel === 'detail') Object.assign(view, { startDay: event.startDay, endDay: event.endDay,
        good: event.good, goods: this._eventGoods(event), description: definition.description,
        travelMultiplier: definition.travelMultiplier, stockMultiplier: definition.stockMultiplier,
        priceMultiplier: definition.priceMultiplier, dailyConsumption: definition.dailyConsumption });
      return view;
    }
    _eventForecastDays(definition, duration) {
      return definition.scope === 'route' ? this.rules.events.rainForecastDays
        : duration + (definition.scope === 'market' ? this.rules.events.harvestForecastExtraDays : this.rules.events.festivalForecastExtraDays);
    }
    _scheduleWorldEvent() {
      const types = Object.values(this.eventTypes);
      if (!types.length || this._random() >= this.rules.events.dailyChance) return;
      const definition = types[Math.floor(this._random() * types.length)];
      const duration = definition.minDays + Math.floor(this._random() * (definition.maxDays - definition.minDays + 1));
      const startDay = this.state.day + this._eventForecastDays(definition, duration), endDay = startDay + duration - 1;
      let targets;
      if (definition.scope === 'route') targets = (this.data.routes || []).map(route => ({ target: this._routeKey(route.from, route.to), good: null }));
      else if (definition.scope === 'city') targets = this.data.cities.filter(city => Object.keys(city.market || {}).some(good => definition.eligibleGoods.includes(good))).map(city => ({ target: city.id, good: null }));
      else targets = this.data.cities.flatMap(city => Object.keys(city.market || {}).filter(good => definition.eligibleGoods.includes(good)).map(good => ({ target: city.id, good })));
      const available = targets.filter(target => !this.state.worldEvents.some(event =>
        event.type === definition.id && event.target === target.target && event.good === target.good &&
        event.startDay <= endDay && startDay <= event.endDay));
      if (!available.length) return;
      const target = available[Math.floor(this._random() * available.length)];
      this.state.worldEvents.push({ id: `event-${++this.state.eventCounter}`, type: definition.id, ...target, startDay, endDay, reports: [] });
    }
    _marketEvent(cityId, goodId, day = this.state.day) {
      return this.state.worldEvents.find(event => this.eventTypes[event.type].scope === 'market' &&
        event.target === cityId && event.good === goodId && this._eventActive(event, day));
    }
    _marketPriceMultiplier(cityId, goodId) {
      return this.state.worldEvents.filter(event => event.target === cityId && this._eventActive(event) &&
        (this.eventTypes[event.type].scope === 'market' ? event.good === goodId
          : this.eventTypes[event.type].scope === 'city' && this.eventTypes[event.type].eligibleGoods.includes(goodId)))
        .reduce((value, event) => value * this.eventTypes[event.type].priceMultiplier, 1);
    }
    _marketStockCap(cityId, goodId) {
      const event = this._marketEvent(cityId, goodId);
      return this.cities[cityId].market[goodId].stock * (event ? this.eventTypes[event.type].stockMultiplier : 1);
    }
    _travelMultiplier(from, to, day, knownOnly = false) {
      const key = this._routeKey(from, to);
      const event = this.state.worldEvents.find(event => this.eventTypes[event.type].scope === 'route' &&
        event.target === key && this._eventActive(event, day) &&
        (!knownOnly || event.startDay <= this.state.day || event.reports.some(report => report.detail === 'detail')));
      return event ? this.eventTypes[event.type].travelMultiplier : 1;
    }
    _canReportEvent(event) {
      return event.startDay > this.state.day && event.reports.length < 2;
    }
    _queueEventNotice(event, kind, source, report, events) {
      const view = this._eventView(event), message = view.message;
      const notice = { id: `notice-${++this.state.noticeCounter}`, eventId: event.id, kind, source,
        day: this.state.day, event: view, report: report ? clone(report) : null, message };
      this.state.eventNotices.push(notice); this.log(message); events.push(message);
      return notice;
    }
    _reportEvent(event, source, events) {
      if (!this._canReportEvent(event)) return;
      const report = { source, day: this.state.day, detail: event.reports.length ? 'detail' : 'hint' };
      event.reports.push(report);
      this._queueEventNotice(event, report.detail === 'hint' ? 'heard' : 'detail', source, report, events);
      return report;
    }
    _syncWorldEvents(events) {
      const ended = this.state.worldEvents.filter(event => event.endDay < this.state.day);
      this.state.worldEvents = this.state.worldEvents.filter(event => event.endDay >= this.state.day);
      for (const event of ended) {
        if (this.eventTypes[event.type].scope === 'market') {
          const stock = this.state.markets[event.target][event.good];
          stock.stock = Math.min(stock.stock, this._marketStockCap(event.target, event.good));
        }
        const text = `${this._eventPlace(event)}的${this.eventTypes[event.type].name}已经结束。`;
        this.log(text); events.push(text);
      }
      const fresh = new Set();
      for (const event of this.state.worldEvents.filter(event => event.startDay === this.state.day)) {
        const definition = this.eventTypes[event.type];
        if (definition.scope === 'market') {
          const stock = this.state.markets[event.target][event.good];
          stock.stock = Math.min(stock.stock * definition.stockMultiplier, this._marketStockCap(event.target, event.good));
          fresh.add(`${event.target}/${event.good}`);
        }
        this._queueEventNotice(event, 'started', 'public', null, events);
      }
      return fresh;
    }
    _consumeFestivalStock() {
      for (const event of this.state.worldEvents.filter(event => this.eventTypes[event.type].scope === 'city' && this._eventActive(event))) {
        for (const good of this._eventGoods(event)) {
          const stock = this.state.markets[event.target][good];
          stock.stock = Math.max(0, stock.stock - this.eventTypes[event.type].dailyConsumption);
        }
      }
    }
    getKnownEvents() {
      return this.state.worldEvents.filter(event => event.startDay <= this.state.day || event.reports.length).map(event => this._eventView(event));
    }
    getActiveEvents() {
      return this.state.worldEvents.filter(event => this._eventActive(event)).map(event => this._eventView(event));
    }
    getLocalEvents(cityId = this.state.city) {
      if (!Object.hasOwn(this.cities, cityId)) return [];
      return this.state.worldEvents.filter(event => this._eventActive(event) &&
        (this.eventTypes[event.type].scope === 'route' ? event.target.split('~').includes(cityId) : event.target === cityId)).map(event => this._eventView(event));
    }
    getEventNotices() { return clone(this.state.eventNotices); }
    acknowledgeEventNotice(id) {
      if (!this.state.eventNotices.length || this.state.eventNotices[0].id !== id) return no('请先确认当前显示的消息。');
      this.state.eventNotices.shift();
      return yes('已经记下这条消息。');
    }
    buyInformation(eventId = null) {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后再打听消息。');
      if (this.state.lastTavernDay === this.state.day) return no('今日已在酒馆打听过，明天再来吧。');
      const event = eventId === null
        ? this.state.worldEvents.find(event => this._canReportEvent(event) && !event.reports.length)
        : this.state.worldEvents.find(event => event.id === eventId && this._canReportEvent(event) && event.reports.length === 1);
      if (eventId !== null && !event) return no('请选择一条尚未生效、还没问清的初闻。');
      const cost = this.rules.events.tavernCost;
      if (this.state.money < cost) return no('手头银币不够支付打听消息的费用。');
      this.state.money = round(this.state.money - cost);
      this.state.lastTavernDay = this.state.day;
      if (!event) {
        const message = this.data.newsNoInformation;
        this.log(message);
        return yes(message, { cost, events: [] });
      }
      const events = [], report = this._reportEvent(event, 'tavern', events);
      return yes(events[0], { events, event: this._eventView(event), report: clone(report), cost });
    }
    _purchaseTemplate(id) { return (this.data.purchaseNotices || []).find(t => t.id === id); }
    _prunePurchaseHistory() {
      this.state.purchaseHistory = this.state.purchaseHistory.slice(-200);
    }
    _syncPurchaseBoard() {
      for (const board of this.state.purchaseBoard) {
        const template = this._purchaseTemplate(board.templateId);
        let changed = true;
        while (changed) {
          changed = false;
          if (board.status === 'published' && this.state.day > board.dueDay) {
            board.status = 'cooldown'; board.closedDay = board.dueDay + 1; board.closedReason = 'expired';
            board.nextPublishDay = board.closedDay + template.refreshDays;
            changed = true;
          }
          if (board.status === 'cooldown' && this.state.day >= board.nextPublishDay) {
            board.cycle++;
            board.id = `publication-${template.id}-${board.cycle}`;
            board.publishedDay = board.nextPublishDay; board.dueDay = board.publishedDay + template.listingDays;
            board.status = 'published'; board.nextPublishDay = null; board.closedDay = null; board.closedReason = null;
            changed = true;
          }
        }
      }
    }
    _purchaseDeliveryReason(board, template) {
      if (this.state.journey) return '正在商路上赶路，抵达城镇后才能交货。';
      if (board.status !== 'published' || this.state.day > board.dueDay) return '这期收购公告已经结束。';
      if (!this.goods[template.good] || this.cities[template.destination]?.market?.[template.good]) return '这份公告不符合当地收购规则。';
      if (!this.state.unlockedCities.includes(template.destination)) return '收购地的商路尚未开放。';
      if (this.state.city !== template.destination) return `请到${this.cities[template.destination].name}交货，截止${this.formatDate(board.dueDay)}。`;
      if ((this.state.inventory[template.good] || 0) < template.quantity) return `还需要${this.goods[template.good].name} ${template.quantity - (this.state.inventory[template.good] || 0)} ${this.goods[template.good].unit || '件'}。`;
      return '';
    }
    getPurchaseOffers(cityId) {
      return this.state.purchaseBoard.filter(b => b.status === 'published' && (cityId === undefined || this._purchaseTemplate(b.templateId).destination === cityId)).map(board => {
        const template = this._purchaseTemplate(board.templateId), reason = this._purchaseDeliveryReason(board, template);
        return { ...clone(template), templateId: template.id, id: board.id, publicationId: board.id, cycle: board.cycle, publishedDay: board.publishedDay, dueDay: board.dueDay, nextPublishDay: null, totalPrice: round(template.unitPrice * template.quantity), remainingDays: Math.max(0, board.dueDay - this.state.day), available: true, canDeliver: !reason, reason, status: 'offered' };
      });
    }
    getUpcomingPurchases(cityId) {
      return this.state.purchaseBoard.filter(b => b.status === 'cooldown' && (cityId === undefined || this._purchaseTemplate(b.templateId).destination === cityId)).map(board => ({ ...clone(this._purchaseTemplate(board.templateId)), templateId: board.templateId, nextPublishDay: board.nextPublishDay, dueDay: board.nextPublishDay + this._purchaseTemplate(board.templateId).listingDays, cycle: board.cycle + 1 }));
    }
    getPurchaseStatus(publicationId) {
      const offer = this.getPurchaseOffers().find(t => t.id === publicationId);
      if (offer) return { ...offer, completed: false };
      const completed = this.state.purchaseHistory.some(c => c.publicationId === publicationId);
      return { available: false, canDeliver: false, completed, reason: completed ? '这期收购公告已经交付，不能重复收款。' : '这期收购公告已经结束，请查看最新公告。' };
    }
    deliverPurchase(publicationId) {
      const check = this.getPurchaseStatus(publicationId); if (!check.canDeliver) return no(check.reason);
      const board = this.state.purchaseBoard.find(b => b.id === publicationId && b.status === 'published');
      if (!board) return no('这期收购公告已经结束，请查看最新公告。');
      const template = this._purchaseTemplate(board.templateId);
      const cost = this.removeGoods(template.good, template.quantity), income = round(template.unitPrice * template.quantity);
      const record = { ...clone(template), id: board.id, templateId: template.id, publicationId: board.id, cycle: board.cycle, publishedDay: board.publishedDay, dueDay: board.dueDay, totalPrice: income, status: 'delivered', settledDay: this.state.day };
      this.state.money = round(this.state.money + income); this.state.totalProfit = round(this.state.totalProfit + income - cost);
      this.recordSale(template.good, template.quantity); this.state.tradeCount++; this.state.purchaseCompleted++;
      this.state.purchaseHistory.push(record); this._prunePurchaseHistory();
      board.status = 'cooldown'; board.closedDay = this.state.day; board.closedReason = 'delivered'; board.nextPublishDay = this.state.day + template.refreshDays;
      this.log(`向收购公告「${template.title}」交货：${this.goods[template.good].name} ${template.quantity} 件，收到 ${fmt(income)} 特雷尼银币；下次发布${this.formatDate(board.nextPublishDay)}。`);
      return yes(`交货完成，收到 ${fmt(income)} 特雷尼银币。`, { record: clone(record), amount: income, profit: round(income - cost), nextPublishDay: board.nextPublishDay });
    }

    hasMechanic(id) {
      return this.state.unlockedMechanics.includes(id);
    }
    getLoad() { return measure(this.state.cargo.reduce((sum, stack) => sum + stack.quantity * this.goods[stack.good].weight, 0)); }
    getCity() { return this.cities[this.state.city]; }
    log(text) {
      this.state.journal.unshift({ day: this.state.day, text });
      this.state.journal = this.state.journal.slice(0, 80);
    }
    quote(goodId, cityId = this.state.city) {
      if (typeof goodId !== 'string' || typeof cityId !== 'string' || !Object.hasOwn(this.goods, goodId) || !Object.hasOwn(this.cities, cityId)) return null;
      const good = this.goods[goodId];
      const city = this.cities[cityId];
      const listing = Object.hasOwn(city.market || {}, goodId) ? city.market[goodId] : null;
      if (!good || !listing) return null;
      // Quotes remain stable until the configured market period advances.
      const seed = [...cityId + goodId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const rules = this.rules.market;
      const phase = (Math.floor((this.state.day - 1) / rules.pricePeriodDays) + seed) % rules.priceSteps;
      const wave = 1 + (phase - (rules.priceSteps - 1) / 2) * rules.priceAmplitude;
      const multiplier = this._marketPriceMultiplier(cityId, goodId);
      const buy = round(Math.max(0.25, listing.price * wave * multiplier));
      const sell = roundReceipt(Math.max(0.25, buy * (listing.sellRate ?? rules.sellRate)));
      return { buy, sell, stock: this.state.markets[cityId]?.[goodId]?.stock || 0, owned: this.state.inventory[goodId] || 0, weight: good.weight, good: goodId, city: cityId };
    }
    buy(goodId, quantity) {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后才能交易。');
      if (!whole(quantity)) return no('购买数量必须是 1 至 10000 的整数。');
      const quote = this.quote(goodId);
      if (!quote) return no('这里没有出售这种货物。');
      if (quantity > quote.stock) return no('商人的库存不足。');
      const amount = round(quote.buy * quantity);
      const plan = this._planAdd(goodId, quantity, { totalCost: amount });
      if (!plan.ok) return no(plan.message);
      if (amount > this.state.money) return no('手头的银币不够。');
      this.state.money = round(this.state.money - amount);
      this.state.cargo = plan.cargo; this.state.cargoCounter = plan.counter;
      this.state.inventory[goodId] += quantity;
      this.state.costBasis[goodId] = round(this.state.costBasis[goodId] + amount);
      this.state.markets[this.state.city][goodId].stock -= quantity;
      this.state.tradeCount++;
      const message = `买入${this.goods[goodId].name} × ${quantity}，支出 ${fmt(amount)} 银币。`;
      this.log(message);
      return yes(message, { amount });
    }
    sell(goodId, quantity) {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后才能交易。');
      if (!whole(quantity)) return no('出售数量必须是 1 至 10000 的整数。');
      const quote = this.quote(goodId);
      if (!quote) return no('这里暂不收购这种货物。');
      if (quantity > this.state.inventory[goodId]) return no('马车里没有这么多货物。');
      const amount = round(quote.sell * quantity);
      const cost = this.removeGoods(goodId, quantity);
      this.state.money = round(this.state.money + amount);
      const market = this.state.markets[this.state.city][goodId];
      market.stock = Math.min(market.stock + quantity, this._marketStockCap(this.state.city, goodId));
      this.recordSale(goodId, quantity);
      this.state.tradeCount++;
      this.state.totalProfit = round(this.state.totalProfit + amount - cost);
      const message = `售出${this.goods[goodId].name} × ${quantity}，收入 ${fmt(amount)} 银币。`;
      this.log(message);
      return yes(message, { amount, profit: round(amount - cost) });
    }
    recordSale(goodId, quantity) {
      const town = this.state.soldAt[this.state.city] ||= {};
      town[goodId] = (town[goodId] || 0) + quantity;
    }
    removeGoods(goodId, quantity) {
      const owned=this.state.inventory[goodId];if(!whole(quantity)||!whole(owned,quantity,100000))return 0;
      const stacks=this.state.cargo.filter(s=>s.good===goodId).sort((a,b)=>(a.expiresDay??Infinity)-(b.expiresDay??Infinity)||a.purchasedDay-b.purchasedDay||Number(a.id.slice(6))-Number(b.id.slice(6)));
      let remaining=quantity,cost=0;
      for(const stack of stacks){if(!remaining)break;const taken=Math.min(remaining,stack.quantity),takenCost=taken===stack.quantity?stack.cost:round(stack.cost*taken/stack.quantity);stack.quantity-=taken;stack.cost=round(stack.cost-takenCost);remaining-=taken;cost=round(cost+takenCost);}
      this.state.cargo=this.state.cargo.filter(s=>s.quantity>0);this.state.inventory[goodId]-=quantity;this.state.costBasis[goodId]=this.state.inventory[goodId]?round(this.state.costBasis[goodId]-cost):0;
      return cost;
    }
    getPerishableCargo() { return this.getCargoLayout().stacks.filter(s=>s.expiresDay!==null); }
    getAvailableRoutes() {
      return (this.data.routes || []).filter(route => route.from === this.state.city || route.to === this.state.city).map(route => {
        const city = route.from === this.state.city ? route.to : route.from;
        return { ...route, city, destination: city, unlocked: this.state.unlockedCities.includes(city), name: this.cities[city]?.name, affordable: this.state.money >= route.cost };
      });
    }
    previewTravel(cityId) {
      if (this.state.journey) return no('马车正在商路上，请先完成当前行程。');
      const route = this.getAvailableRoutes().find(item => item.city === cityId);
      if (!route) return no('两座城镇之间没有直接相连的商路。');
      if (!route.unlocked) return no('这条商路尚未开放。推进主线可解锁新的地区。');
      const maximumMultiplier = Math.max(1, ...Object.values(this.eventTypes).filter(event => event.scope === 'route').map(event => event.travelMultiplier));
      if (this.state.day + Math.ceil(route.days * maximumMultiplier) > 100000) return no('剩余行商历不足以完成这段商路。');
      const days = this._estimateTravelDays(this.state.city, cityId, 0), arrivalDay = this.state.day + days;
      return { ...route, days, baseDays: route.days, arrivalDay,
        spoiling: this.getPerishableCargo().filter(stack => stack.expiresDay <= arrivalDay), ok: route.affordable,
        message: route.affordable ? `前往${route.name}预计需 ${days} 天，旅费 ${fmt(route.cost)} 银币；途中情况可能改变抵达日期。` : '旅费不足。可以先出售货物、履行收购公告，或到驿站帮工。' };
    }
    _accrueLoanInterest() {
      if (!this.state.debt) return;
      this.state.interestAccrued = measure(this.state.interestAccrued + this.state.debt * this.rules.loan.dailyRate);
      const charged = roundReceipt(this.state.interestAccrued);
      if (charged) {
        this.state.debt = round(this.state.debt + charged);
        this.state.interestAccrued = measure(this.state.interestAccrued - charged);
      }
    }
    _restockMarkets(fresh = new Set()) {
      const rules = this.rules.market;
      for (const town of this.data.cities) {
        for (const [id, listing] of Object.entries(town.market || {})) {
          if (fresh.has(`${town.id}/${id}`)) continue;
          const market = this.state.markets[town.id][id];
          const replenished = Math.max(rules.minimumRestock, Math.ceil(listing.stock / rules.restockDivisor));
          market.stock = Math.min(this._marketStockCap(town.id, id), market.stock + replenished);
        }
      }
    }
    _spoilExpiredCargo(events) {
      const spoiled = this.state.cargo.filter(stack => stack.expiresDay !== null && this.state.day >= stack.expiresDay);
      if (!spoiled.length) return;
      const totals = {};
      for (const stack of spoiled) {
        this.state.inventory[stack.good] -= stack.quantity;
        this.state.costBasis[stack.good] = round(this.state.costBasis[stack.good] - stack.cost);
        this.state.spoiledGoods[stack.good] = (this.state.spoiledGoods[stack.good] || 0) + stack.quantity;
        totals[stack.good] = (totals[stack.good] || 0) + stack.quantity;
      }
      const expiredIds = new Set(spoiled.map(stack => stack.id));
      this.state.cargo = this.state.cargo.filter(stack => !expiredIds.has(stack.id));
      for (const [id, quantity] of Object.entries(totals)) {
        if (!this.state.inventory[id]) this.state.costBasis[id] = 0;
        const text = `${this.goods[id].name} ${quantity} ${this.goods[id].unit}已到腐坏日，从马车中丢弃。`;
        this.log(text);
        events.push(text);
      }
    }
    _advanceCalendarDay(events) {
      this.state.day++;
      this._accrueLoanInterest();
      const fresh = this._syncWorldEvents(events);
      this._restockMarkets(fresh);
      this._consumeFestivalStock();
      this._spoilExpiredCargo(events);
      this._syncPurchaseBoard();
      this._scheduleWorldEvent();
    }
    advanceDays(days) {
      if (this.state.journey || !Number.isInteger(days) || days < 0 || this.state.day + days > 100000) return [];
      const events = [];
      for (let i = 0; i < days; i++) this._advanceCalendarDay(events);
      return events;
    }
    _estimateTravelDays(from, to, progress) {
      const route = (this.data.routes || []).find(route => this._routeKey(route.from, route.to) === this._routeKey(from, to));
      let days = 0;
      while (progress + 0.000001 < route.days) {
        days++;
        progress += 1 / this._travelMultiplier(from, to, this.state.day + days, true);
      }
      return days;
    }
    getTravelStatus() {
      const journey = this.state.journey;
      if (!journey) return null;
      const route = (this.data.routes || []).find(route => this._routeKey(route.from, route.to) === this._routeKey(journey.from, journey.to));
      const remainingDays = this._estimateTravelDays(journey.from, journey.to, journey.progress);
      return { ...clone(journey), totalDays: route.days, remainingDays, estimatedArrivalDay: this.state.day + remainingDays };
    }
    startTravel(cityId) {
      const preview = this.previewTravel(cityId);
      if (!preview.ok) return no(preview.message);
      const from = this.state.city;
      this.state.money = round(this.state.money - preview.cost);
      this.state.journey = { from, to: cityId, startedDay: this.state.day, progress: 0, elapsedDays: 0, cost: preview.cost };
      const events = [];
      const message = `从${this.cities[from].name}出发前往${this.cities[cityId].name}，支付旅费 ${fmt(preview.cost)} 银币。`;
      this.log(message);
      return yes(message, { events, from, to: cityId, arrived: false, journey: this.getTravelStatus() });
    }
    advanceTravelDay() {
      const journey = this.state.journey;
      if (!journey) return no('马车当前没有在赶路。');
      if (this.state.day >= 100000) return no('已经抵达行商历的日期上限。');
      const events = [];
      this._advanceCalendarDay(events);
      const multiplier = this._travelMultiplier(journey.from, journey.to, this.state.day);
      journey.progress = measure(journey.progress + 1 / multiplier); journey.elapsedDays++;
      if (multiplier > 1) events.push('大暴雨使道路泥泞，马车今天只能以较慢速度前进。');
      if (Object.keys(this.eventTypes).length && this._random() < this.rules.events.travelerChance) {
        const unknown = this.state.worldEvents.filter(event => this._canReportEvent(event));
        if (unknown.length) this._reportEvent(unknown[Math.floor(this._random() * unknown.length)], 'traveler', events);
      }
      const { from, to } = journey, route = (this.data.routes || []).find(route => this._routeKey(route.from, route.to) === this._routeKey(from, to));
      const arrived = journey.progress + 0.000001 >= route.days;
      let message = `赶路第 ${journey.elapsedDays} 天。`;
      if (arrived) {
        this.state.city = to;
        if (!this.state.visited.includes(to)) this.state.visited.push(to);
        this.state.travelLog.push({ from, to, day: this.state.day, days: journey.elapsedDays });
        this.state.travelLog = this.state.travelLog.slice(-100);
        this._gainRelationship(this.rules.relationship.travelGain);
        this.state.journey = null;
        message = `抵达${this.cities[to].name}。实际行程 ${journey.elapsedDays} 天，花费 ${fmt(journey.cost)} 银币。`;
        this.log(message);
      }
      return yes(message, { events, from, to, arrived, journey: this.getTravelStatus() });
    }
    travel(cityId) {
      const result = this.startTravel(cityId);
      if (!result.ok) return result;
      const events = [...result.events];
      let day;
      while (this.state.journey) {
        day = this.advanceTravelDay();
        if (!day.ok) return day;
        events.push(...day.events);
      }
      return { ...day, events };
    }
    rest(days = 1) {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后才能住宿。');
      if (!whole(days, 1, this.rules.rest.maxDays)) return no(`休息时间应为 1 至 ${this.rules.rest.maxDays} 天。`);
      if (this.state.day + days > 100000) return no('休息时间超过行商历的日期上限。');
      const cost = days * this.rules.rest.dailyCost;
      if (this.state.money < cost) return no('住宿费用不足。');
      this.state.money = round(this.state.money - cost);
      const events = this.advanceDays(days);
      this._gainRelationship(this.rules.rest.relationshipGain);
      this.log(`在${this.getCity().name}休息 ${days} 天，支出 ${cost} 银币。`);
      return yes('一夜好眠。集市补充了货物，行情也可能已有变化。', { events });
    }
    getActiveStory() { return (this.data.story || [])[this.state.storyIndex] || null; }
    canAdvanceStory() {
      if (this.state.journey) return { ok: false, message: '正在商路上赶路，抵达城镇后才能继续主线。', missing: ['抵达城镇'] };
      const story = this.getActiveStory();
      if (!story) return { ok: false, message: '当前篇章已完成，可以继续自由行商。', missing: [] };
      const conditions = story.conditions || {};
      const missing = [];
      if (conditions.city && conditions.city !== this.state.city) missing.push(`前往${this.cities[conditions.city]?.name || conditions.city}`);
      if (conditions.purchaseCompleted && this.state.purchaseCompleted < conditions.purchaseCompleted) missing.push(`完成 ${conditions.purchaseCompleted} 份收购公告`);
      if (conditions.soldAt && (this.state.soldAt[conditions.soldAt.city]?.[conditions.soldAt.good] || 0) < conditions.soldAt.quantity) missing.push(`在${this.cities[conditions.soldAt.city]?.name}售出${this.goods[conditions.soldAt.good]?.name} ${conditions.soldAt.quantity} 件`);
      return { ok: missing.length === 0, message: missing.length ? missing.join('；') : '可以继续这段旅程。', missing };
    }
    applyReward(raw) {
      const reward = raw || {};
      const events = [];
      if (reward.money) { this.state.money = round(this.state.money + reward.money); events.push(`获得 ${fmt(reward.money)} 银币`); }
      for (const city of reward.unlockCities || []) if (this.cities[city] && !this.state.unlockedCities.includes(city)) { this.state.unlockedCities.push(city); events.push(`商路开放：${this.cities[city].name}`); }
      for (const mechanic of reward.unlockMechanics || []) if (!this.state.unlockedMechanics.includes(mechanic)) { this.state.unlockedMechanics.push(mechanic); events.push(`新机制：${mechanicNames[mechanic] || '新的经营技巧'}`); }
      for (const flag of reward.flags || []) if (!this.state.flags.includes(flag)) this.state.flags.push(flag);
      if (reward.relationship) this._gainRelationship(reward.relationship);
      return events;
    }
    advanceStory() {
      const check = this.canAdvanceStory();
      if (!check.ok) return no(check.message);
      const story = this.getActiveStory();
      const events = this.applyReward(story.reward);
      this.state.storyIndex++;
      this._gainRelationship(this.rules.relationship.storyGain);
      this.state.chapterComplete = this.state.storyIndex >= (this.data.story || []).length;
      this.log(`主线完成：${story.title}`);
      return yes(this.state.chapterComplete ? '这一篇旅程已告一段落。商路仍在前方延伸，你可以继续自由行商。' : `完成「${story.title}」。`, { events, story, chapterComplete: this.state.chapterComplete });
    }
    getLoanPayoff() { return this.state.debt; }
    getLoanSummary() {
      const rules = this.rules.loan;
      return {
        debt: this.state.debt,
        payoff: this.getLoanPayoff(),
        creditAvailable: Math.max(0, roundReceipt(rules.limit - this.state.debt)),
        accruedInterest: this.state.interestAccrued,
        ...rules
      };
    }
    takeLoan(amount) {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后才能借款。');
      if (!this.hasMechanic('loan')) return no('商会借贷尚未解锁。');
      const rules = this.rules.loan;
      if (!coinAmount(amount, .25, rules.limit)) return no(`借款须为¼银币的整数倍，单次最多${fmt(rules.limit)}银币。`);
      if (this.state.debt + amount > rules.limit) return no(`商会提供的总信用额度为${fmt(rules.limit)}银币。`);
      this.state.money = round(this.state.money + amount);
      this.state.debt = round(this.state.debt + amount);
      this.state.loanDueDay ||= this.state.day + rules.termDays;
      this.log(`向商会借入 ${fmt(amount)} 银币。日息${Number((rules.dailyRate * 100).toFixed(6))}%，累计满¼银币后记入欠款。`);
      return yes(`借入 ${fmt(amount)} 银币。利息按日累计至¼银币结算。`);
    }
    repayLoan(amount) {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后才能还款。');
      if(!coinAmount(amount,.25))return no('还款须为正数且是¼银币的整数倍。');
      if(!this.state.debt)return no('目前没有需要偿还的借款。');
      const payment=Math.min(amount,this.getLoanPayoff());if(payment>this.state.money)return no('手头银币不足以偿还这笔钱。');
      this.state.money=round(this.state.money-payment);this.state.debt=round(this.state.debt-payment);
      if(!this.state.debt){this.state.loanDueDay=null;this.state.interestAccrued=0;}
      this.log(`偿还商会借款 ${fmt(payment)} 银币。`);return yes(`已偿还 ${fmt(payment)} 银币。`);
    }
    rescue() {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后才能帮工。');
      const rules = this.rules.rescue;
      if (this.state.money >= rules.cashThreshold || this.getLoad() > 0) return no('帮工机会留给暂时没有资金和货物的旅人。');
      if (this.state.day + rules.days > 100000) return no('帮工时间超过行商历的日期上限。');
      const events = this.advanceDays(rules.days);
      this.state.money = round(this.state.money + rules.reward);
      this.log(`替驿站搬运货物${rules.days}天，赚到 ${fmt(rules.reward)} 银币，可以重新开始行商。`);
      return yes(`忙碌了${rules.days}天。驿站支付了 ${fmt(rules.reward)} 银币。`, { events });
    }
    _gainRelationship(amount) {
      this.state.relationship = Math.min(this.rules.relationship.max, this.state.relationship + amount);
    }
    shareApple() {
      if (this.state.journey) return no('正在商路上赶路，抵达城镇后再分享苹果。');
      if (this.state.lastGiftDay === this.state.day) return no('今天已经和赫萝分享过苹果了，明天再带一份吧。');
      if (!this.goods.apple || (this.state.inventory.apple || 0) < 1) return no('马车里还没有苹果。可以先去集市买一篮。');
      this.removeGoods('apple', 1);
      this.state.lastGiftDay = this.state.day;
      this._gainRelationship(this.rules.relationship.appleGain);
      this.log('和赫萝分享了一篮苹果。她心满意足地替你留好了御者台的另一半位置。');
      return yes(`赫萝接过苹果，尾巴轻轻晃了起来。旅伴默契 +${this.rules.relationship.appleGain}。`);
    }
    getNetWorth() {
      const cargo=this.data.goods.reduce((n,g)=>n+(this.state.inventory[g.id]||0)*(this.quote(g.id)?.sell||g.basePrice*this.rules.market.sellRate),0);
      return round(this.state.money+cargo-this.state.debt);
    }
    exportSave() {
      return JSON.stringify({ format: 'spice-wolf-travel-save', version: VERSION, balanceRevision: this.data.balanceRevision, savedAt: new Date().toISOString(), state: this.state }, null, 2);
    }
    validateState(state) {
      const check=(ok,text)=>{if(!ok)throw new Error(text);};
      const list=(items,valid,name)=>check(Array.isArray(items)&&items.length<=1000&&new Set(items).size===items.length&&items.every(x=>typeof x==='string'&&valid(x)),name+'无效。');
      check(plain(state)&&state.schemaVersion===VERSION,'存档版本或游戏状态无效。');
      check(Object.keys(state).length===Object.keys(this.state).length&&Object.keys(state).every(key=>Object.hasOwn(this.state,key)),'存档包含无效字段。');
      check(whole(state.day,1,100000)&&Object.hasOwn(this.cities,state.city),'存档日期或城镇无效。');
      this._validateEventState(state, check);
      check(coinAmount(state.money)&&coinAmount(state.debt)&&validNumber(state.interestAccrued,0,.2499999),'银币或借款不是有效的¼单位。');
      check(whole(state.storyIndex,0,(this.data.story||[]).length),'主线进度无效。');
      list(state.unlockedCities,id=>Object.hasOwn(this.cities,id),'商路');check(state.unlockedCities.includes(state.city),'当前城镇尚未开放。');
      const mechanics=new Set([...Object.keys(mechanicNames),...(this.data.initial?.unlockedMechanics||[]),...(this.data.story||[]).flatMap(s=>s.reward?.unlockMechanics||[])]);
      list(state.unlockedMechanics,id=>mechanics.has(id),'经营机制');
      const flags=new Set([...(this.data.story||[]).flatMap(s=>[...(s.reward?.flags||[])])]);
      list(state.flags,id=>flags.has(id),'剧情标记');
      for(const field of ['inventory','costBasis','spoiledGoods'])check(plain(state[field])&&Object.keys(state[field]).every(id=>Object.hasOwn(this.goods,id)),field+'包含未知货物。');
      for(const g of this.data.goods){check(whole(state.inventory[g.id],0,100000)&&coinAmount(state.costBasis[g.id]),'货物数量或成本无效。');if(!state.inventory[g.id])check(state.costBasis[g.id]===0,'空货物仍有账面成本。');for(const field of ['spoiledGoods'])if(Object.hasOwn(state[field],g.id))check(whole(state[field][g.id],0,10000000),'货物统计无效。');}
      const wagon=state.wagon;check(plain(wagon)&&whole(wagon.cols,1,30)&&whole(wagon.rows,1,1000)&&validNumber(wagon.maxWeight,1,1000),'马车规格无效。');
      check(Array.isArray(state.cargo)&&state.cargo.length<=10000&&whole(state.cargoCounter,0,10000000),'货舱记录无效。');
      const cargoIds=new Set(),totals=Object.fromEntries(this.data.goods.map(g=>[g.id,{quantity:0,cost:0}]));let weight=0;
      for(const stack of state.cargo){check(plain(stack)&&typeof stack.id==='string'&&/^cargo-[1-9]\d*$/.test(stack.id)&&!cargoIds.has(stack.id),'货栈编号无效。');cargoIds.add(stack.id);check(Number(stack.id.slice(6))<=state.cargoCounter&&Object.hasOwn(this.goods,stack.good),'货栈项目无效。');const g=this.goods[stack.good];check(whole(stack.quantity,1,g.stackLimit)&&typeof stack.rotated==='boolean'&&Object.keys(stack).length===9&&Object.keys(stack).every(key=>['id','good','quantity','x','y','rotated','purchasedDay','expiresDay','cost'].includes(key))&&coinAmount(stack.cost),'货栈数量、归属或成本无效。');check(whole(stack.purchasedDay,1,state.day),'货物购入日期无效。');check(g.shelfLifeDays?stack.expiresDay===stack.purchasedDay+g.shelfLifeDays&&stack.expiresDay>state.day:stack.expiresDay===null,'货物腐坏日期无效或已过期。');check(this._fits(stack,state.cargo,wagon),'货物重叠或超出货舱边界。');totals[g.id].quantity+=stack.quantity;totals[g.id].cost=round(totals[g.id].cost+stack.cost);weight+=stack.quantity*g.weight;}
      for(const g of this.data.goods)check(totals[g.id].quantity===state.inventory[g.id]&&totals[g.id].cost===state.costBasis[g.id],'货栈批次与库存账簿不一致。');check(weight<=wagon.maxWeight+.001,'货物超重。');
      check(plain(state.markets)&&Object.keys(state.markets).length===this.data.cities.length,'市场资料不完整。');
      for(const town of this.data.cities){const market=state.markets[town.id],known=Object.keys(town.market||{});check(plain(market)&&Object.keys(market).length===known.length&&Object.keys(market).every(id=>known.includes(id)),'市场含未开放商品。');for(const id of known){const active=state.worldEvents.find(event=>this.eventTypes[event.type].scope==='market'&&event.target===town.id&&event.good===id&&event.startDay<=state.day&&state.day<=event.endDay),cap=town.market[id].stock*(active?this.eventTypes[active.type].stockMultiplier:1);check(plain(market[id])&&Object.keys(market[id]).length===1&&whole(market[id].stock,0,cap),'市场库存无效。');}}
      check(plain(state.soldAt)&&Object.keys(state.soldAt).every(id=>Object.hasOwn(this.cities,id)),'城镇销售统计无效。');for(const town of Object.values(state.soldAt))check(plain(town)&&Object.entries(town).every(([id,n])=>Object.hasOwn(this.goods,id)&&whole(n,0,10000000)),'销售数量无效。');
      check(whole(state.tradeCount,0,10000000)&&coinAmount(state.totalProfit,-MONEY_LIMIT,MONEY_LIMIT),'交易账簿无效。');
      list(state.visited,id=>Object.hasOwn(this.cities,id),'到访记录');check(state.visited.includes(state.city),'当前城镇缺少到访记录。');
      check(validNumber(state.relationship,0,this.rules.relationship.max)&&typeof state.chapterComplete==='boolean'&&state.chapterComplete===(state.storyIndex>=(this.data.story||[]).length),'关系或章节完成状态无效。');
      check(state.lastTavernDay===null||whole(state.lastTavernDay,this.data.initial.day,state.day),'酒馆打听日期无效。');
      check(state.lastGiftDay===null||whole(state.lastGiftDay,1,state.day),'旅途日期无效。');check(state.loanDueDay===null||whole(state.loanDueDay,1,100000),'借款日期无效。');
      check(Array.isArray(state.travelLog)&&state.travelLog.length<=100,'旅行记录无效。');for(const t of state.travelLog)check(plain(t)&&Object.hasOwn(this.cities,t.from)&&Object.hasOwn(this.cities,t.to)&&whole(t.day,1,state.day)&&whole(t.days,1,100000),'旅行路线无效。');
      check(Array.isArray(state.journal)&&state.journal.length<=80,'日志无效。');for(const entry of state.journal)check(plain(entry)&&whole(entry.day,1,state.day)&&typeof entry.text==='string'&&entry.text.length<=1000,'日志条目无效。');
      this._validatePurchaseState(state, check);
      return true;
    }
    _validateEventRecord(event, state, check, allowEnded = false) {
      const keys = ['id', 'type', 'target', 'good', 'startDay', 'endDay', 'reports'];
      check(plain(event) && Object.keys(event).length === keys.length && Object.keys(event).every(key => keys.includes(key)), '世界事件字段无效。');
      const definition = Object.hasOwn(this.eventTypes, event.type) && this.eventTypes[event.type];
      check(definition && typeof event.id === 'string' && /^event-[1-9]\d*$/.test(event.id) && Number(event.id.slice(6)) <= state.eventCounter, '世界事件类型或编号无效。');
      const forecast = this._eventForecastDays(definition, event.endDay - event.startDay + 1);
      check(whole(event.startDay, this.data.initial.day + 1, state.day + forecast) && whole(event.endDay, event.startDay + definition.minDays - 1, event.startDay + definition.maxDays - 1) && (allowEnded || event.endDay >= state.day), '世界事件时间无效。');
      if (definition.scope === 'route') {
        check(event.good === null && (this.data.routes || []).some(route => event.target === this._routeKey(route.from, route.to)), '暴雨商路无效。');
      } else {
        check(typeof event.target === 'string' && Object.hasOwn(this.cities, event.target), '事件城镇无效。');
        if (definition.scope === 'market') check(typeof event.good === 'string' && definition.eligibleGoods.includes(event.good) && Object.hasOwn(this.cities[event.target].market || {}, event.good), '丰收商品无效。');
        else check(event.good === null && this._eventGoods(event).length > 0, '节庆商品无效。');
      }
      check(Array.isArray(event.reports) && event.reports.length <= 2, '事件消息记录无效。');
      for (let index = 0; index < event.reports.length; index++) {
        const report = event.reports[index];
        check(plain(report) && Object.keys(report).length === 3 && Object.keys(report).every(key => ['source', 'day', 'detail'].includes(key)) && ['tavern', 'traveler'].includes(report.source) && report.detail === (index === 0 ? 'hint' : 'detail') && whole(report.day, Math.max(this.data.initial.day, event.startDay - forecast), Math.min(state.day, event.startDay - 1)) && (!index || report.day >= event.reports[index - 1].day), '事件消息来源、层级或日期无效。');
      }
      return definition;
    }
    _validateEventNotices(state, check) {
      check(whole(state.noticeCounter, 0, state.eventCounter * 3) && Array.isArray(state.eventNotices) && state.eventNotices.length <= state.noticeCounter, '事件通知队列无效。');
      const keys = ['id', 'eventId', 'kind', 'source', 'day', 'event', 'report', 'message'];
      const baseKeys = ['id', 'type', 'name', 'scope', 'target', 'city', 'route', 'detailLevel', 'isActive', 'isPublic', 'reports', 'message'];
      const detailKeys = ['startDay', 'endDay', 'good', 'goods', 'description', 'travelMultiplier', 'stockMultiplier', 'priceMultiplier', 'dailyConsumption'];
      const seen = new Set(), archived = new Map(); let lastDay = this.data.initial.day;
      const pendingStarts = new Set(state.eventNotices.filter(notice => notice?.kind === 'started').map(notice => notice.eventId));
      const same = (left, right) => left === right || (Array.isArray(left) && Array.isArray(right)
        ? left.length === right.length && left.every((value, index) => same(value, right[index]))
        : plain(left) && plain(right) && Object.keys(left).length === Object.keys(right).length && Object.keys(left).every(key => Object.hasOwn(right, key) && same(left[key], right[key])));
      for (const notice of state.eventNotices) {
        const view = notice?.event;
        if (!plain(view) || view.detailLevel !== 'detail' || !Array.isArray(view.reports) || !view.reports.every(plain)) continue;
        const record = { id: view.id, type: view.type, target: view.target, good: view.good, startDay: view.startDay, endDay: view.endDay,
          reports: view.reports.map(({ source, day, detail }) => ({ source, day, detail })) };
        if (!archived.has(view.id) || record.reports.length >= archived.get(view.id).reports.length) archived.set(view.id, record);
      }
      for (let index = 0; index < state.eventNotices.length; index++) {
        const notice = state.eventNotices[index];
        check(plain(notice) && Object.keys(notice).length === keys.length && Object.keys(notice).every(key => keys.includes(key)), '事件通知字段无效。');
        check(notice.id === `notice-${state.noticeCounter - state.eventNotices.length + index + 1}` && whole(notice.day, lastDay, state.day) && ['started', 'heard', 'detail'].includes(notice.kind) && !seen.has(`${notice.eventId}/${notice.kind}`), '事件通知编号或顺序无效。');
        seen.add(`${notice.eventId}/${notice.kind}`); lastDay = notice.day;
        check(notice.kind === 'started' ? notice.source === 'public' && notice.report === null
          : ['tavern', 'traveler'].includes(notice.source) && plain(notice.report) && Object.keys(notice.report).length === 3 && Object.keys(notice.report).every(key => ['source', 'day', 'detail'].includes(key)) && notice.report.source === notice.source && notice.report.day === notice.day && notice.report.detail === (notice.kind === 'heard' ? 'hint' : 'detail'), '事件通知来源或报告无效。');
        const view = notice.event;
        check(plain(view) && ['hint', 'detail'].includes(view.detailLevel), '事件通知快照无效。');
        const viewKeys = view.detailLevel === 'hint' ? baseKeys : [...baseKeys, ...detailKeys];
        check(Object.keys(view).length === viewKeys.length && Object.keys(view).every(key => viewKeys.includes(key)) && view.id === notice.eventId && Object.hasOwn(this.eventTypes, view.type) && Array.isArray(view.reports) && view.reports.length <= 2, '事件通知快照字段或类型无效。');
        for (const report of view.reports) check(plain(report) && Object.keys(report).length === 4 && Object.keys(report).every(key => ['source', 'day', 'detail', 'text'].includes(key)) && typeof report.text === 'string', '通知中的消息报告无效。');
        const current = state.worldEvents.find(event => event.id === notice.eventId);
        let event = current || archived.get(notice.eventId);
        if (event && !current) {
          this._validateEventRecord(event, state, check, true);
          check(event.endDay < state.day, '通知引用了缺失的未来或当前事件。');
        }
        check(event, '通知缺少对应事件或完整快照。');
        if (notice.kind !== 'started' && event.startDay <= state.day) check(pendingStarts.has(notice.eventId), '未确认的消息缺少后续事件开始通知。');
        const expected = this._eventView(notice.kind === 'started' ? event : { ...event, reports: event.reports.slice(0, notice.kind === 'heard' ? 1 : 2) }, notice.day);
        check(viewKeys.every(key => same(view[key], expected[key])) && notice.message === expected.message && typeof notice.message === 'string' && notice.message.length <= 1000, '事件通知快照或文本遭到修改。');
        if (notice.kind === 'started') check(notice.day === event.startDay && view.isPublic && view.isActive, '事件开始通知日期无效。');
        else check(same(notice.report, event.reports[notice.kind === 'heard' ? 0 : 1]) && !view.isPublic, '消息通知与报告不一致。');
      }
    }
    _validateEventState(state, check) {
      check(whole(state.randomState, 0, 0xffffffff) && whole(state.eventCounter, 0, state.day - this.data.initial.day + 1), '随机状态或事件编号无效。');
      check(Array.isArray(state.worldEvents) && state.worldEvents.length <= 1000, '世界事件队列无效。');
      if (!Object.keys(this.eventTypes).length) check(!state.worldEvents.length && state.eventCounter === 0, '没有启用世界事件。');
      const minimumNotices = state.worldEvents.reduce((count, event) => count + (Array.isArray(event?.reports) ? event.reports.length : 0) + (event?.startDay <= state.day ? 1 : 0), 0);
      check(state.noticeCounter >= minimumNotices, '世界事件缺少已产生的通知记录。');
      const ids = new Set();
      for (const event of state.worldEvents) {
        this._validateEventRecord(event, state, check);
        check(!ids.has(event.id), '世界事件编号或排定日期重复。');
        ids.add(event.id);
      }
      for (let index = 0; index < state.worldEvents.length; index++) {
        const event = state.worldEvents[index];
        check(!state.worldEvents.slice(index + 1).some(other => event.type === other.type && event.target === other.target && event.good === other.good && event.startDay <= other.endDay && other.startDay <= event.endDay), '世界事件重复叠加。');
      }
      this._validateEventNotices(state, check);
      if (state.journey === null) return;
      const journey = state.journey, journeyKeys = ['from', 'to', 'startedDay', 'progress', 'elapsedDays', 'cost'];
      check(plain(journey) && Object.keys(journey).length === journeyKeys.length && Object.keys(journey).every(key => journeyKeys.includes(key)), '在途行程字段无效。');
      const route = (this.data.routes || []).find(route => journey.from !== journey.to && journey.from === state.city && this._routeKey(route.from, route.to) === this._routeKey(journey.from, journey.to));
      check(route && Array.isArray(state.unlockedCities) && state.unlockedCities.includes(journey.to) && journey.cost === route.cost && whole(journey.startedDay, this.data.initial.day, state.day) && whole(journey.elapsedDays, 0, 100000) && journey.elapsedDays === state.day - journey.startedDay, '在途商路或日期无效。');
      const maximumMultiplier = Math.max(1, ...Object.values(this.eventTypes).filter(event => event.scope === 'route').map(event => event.travelMultiplier));
      check(validNumber(journey.progress, 0, route.days) && journey.progress < route.days && journey.progress <= journey.elapsedDays + .000001 && journey.progress + .000001 >= journey.elapsedDays / maximumMultiplier && (journey.elapsedDays === 0 ? journey.progress === 0 : journey.progress > 0), '在途路程进度无效。');
      // Only rain changes speed. Each elapsed day is either a full step or one rain step.
      if (maximumMultiplier === 1) check(journey.progress === journey.elapsedDays, '在途路程步长无效。');
      else {
        const slowDays = Math.round((journey.elapsedDays - journey.progress) / (1 - 1 / maximumMultiplier));
        const expected = journey.elapsedDays - slowDays + slowDays / maximumMultiplier;
        check(whole(slowDays, 0, journey.elapsedDays) && Math.abs(expected - journey.progress) <= .000001 * Math.max(1, journey.elapsedDays), '在途路程步长无效。');
      }
    }
    _validatePurchaseState(state, check) {
      const templates = this.data.purchaseNotices || [];
      check(whole(state.purchaseCompleted, 0, 10000000), '收购统计无效。');
      check(Array.isArray(state.purchaseBoard) && state.purchaseBoard.length === templates.length, '收购公告不完整。');
      check(Array.isArray(state.purchaseHistory) && state.purchaseHistory.length <= 200, '交货历史过长。');
      const boards = new Map(), boardKeys = ['templateId','id','cycle','publishedDay','dueDay','status','nextPublishDay','closedDay','closedReason'];
      for (const b of state.purchaseBoard) {
        const t = this._purchaseTemplate(b?.templateId);
        check(plain(b) && t && !boards.has(t.id) && Object.keys(b).length === boardKeys.length && Object.keys(b).every(k => boardKeys.includes(k)), '收购公告项目无效。');
        boards.set(t.id, b);
        check(whole(b.cycle, 0, 100000), '收购期数无效。');
        if (b.cycle === 0) {
          check(b.status === 'cooldown' && b.id === null && b.publishedDay === null && b.dueDay === null && b.closedDay === null && b.closedReason === null && b.nextPublishDay === t.initialPublishDay && b.nextPublishDay > state.day, '首次发布日期无效。');
          continue;
        }
        check(b.id === `publication-${t.id}-${b.cycle}` && whole(b.publishedDay, t.initialPublishDay, state.day) && b.dueDay === b.publishedDay + t.listingDays, '公告发布或截止日期无效。');
        check(b.publishedDay >= t.initialPublishDay + (b.cycle - 1) * t.refreshDays && b.publishedDay <= t.initialPublishDay + (b.cycle - 1) * (t.listingDays + 1 + t.refreshDays), '收购发布周期无效。');
        if (b.cycle === 1) check(b.publishedDay === t.initialPublishDay, '首期公告不能延后发布。');
        check(['published','cooldown'].includes(b.status), '公告状态无效。');
        if (b.status === 'published') {
          check(b.dueDay >= state.day && b.nextPublishDay === null && b.closedDay === null && b.closedReason === null, '有效公告日期或状态无效。');
        } else {
          check(whole(b.closedDay, b.publishedDay, state.day) && ['expired','delivered'].includes(b.closedReason) && b.nextPublishDay === b.closedDay + t.refreshDays && b.nextPublishDay > state.day, '收购刷新冷却无效。');
          check(b.closedReason === 'expired' ? b.closedDay === b.dueDay + 1 : b.closedDay <= b.dueDay, '公告结束日期无效。');
        }
      }
      const ids = new Set();
      for (const c of state.purchaseHistory) {
        const t = this._purchaseTemplate(c?.templateId), b = boards.get(c?.templateId);
        check(plain(c) && t && typeof c.id === 'string' && c.id === c.publicationId && !ids.has(c.id), '交货记录编号无效。');
        ids.add(c.id);
        for (const key of Object.keys(t)) if (key !== 'id') check(JSON.stringify(c[key]) === JSON.stringify(t[key]), '收购公告条款遭到修改。');
        const keys = new Set([...Object.keys(t), 'templateId','publicationId','cycle','publishedDay','dueDay','totalPrice','status','settledDay']);
        check(Object.keys(c).length === keys.size && Object.keys(c).every(k => keys.has(k)), '交货记录包含无效字段。');
        check(!this.cities[c.destination].market[c.good] && coinAmount(c.unitPrice, .25) && c.totalPrice === round(c.unitPrice * c.quantity), '收购货物或货款无效。');
        check(whole(c.cycle, 1, b.cycle) && c.publicationId === `publication-${t.id}-${c.cycle}` && whole(c.publishedDay, t.initialPublishDay, state.day) && c.dueDay === c.publishedDay + t.listingDays, '交货记录发布或截止日期无效。');
        check(c.publishedDay >= t.initialPublishDay + (c.cycle - 1) * t.refreshDays && c.publishedDay <= t.initialPublishDay + (c.cycle - 1) * (t.listingDays + 1 + t.refreshDays), '交货记录发布周期无效。');
        if (c.cycle === 1) check(c.publishedDay === t.initialPublishDay, '首期交货记录日期无效。');
        check(c.status === 'delivered' && whole(c.settledDay, c.publishedDay, Math.min(c.dueDay, state.day)), '收购交货状态或日期无效。');
        if (c.cycle === b.cycle) check(c.publishedDay === b.publishedDay && c.dueDay === b.dueDay && b.status === 'cooldown' && b.closedReason === 'delivered' && b.closedDay === c.settledDay, '交货记录与刷新冷却不一致。');
      }
      for (const b of boards.values()) if (b.status === 'cooldown' && b.closedReason === 'delivered') check(ids.has(b.id), '已交货公告缺少交货记录。');
      check(state.purchaseHistory.length <= state.purchaseCompleted && (state.purchaseCompleted <= 200 ? state.purchaseHistory.length === state.purchaseCompleted : state.purchaseHistory.length === 200), '收购完成统计无效。');
    }

    importSave(input) {
      try {
        if (typeof input === 'string' && input.length > 2000000) return no('存档文件过大。');
        const envelope = typeof input === 'string' ? JSON.parse(input) : clone(input);
        if (!plain(envelope) || envelope.format !== 'spice-wolf-travel-save' || envelope.version !== VERSION || envelope.balanceRevision !== this.data.balanceRevision) return no('存档版本或数值配置不匹配，请开启新旅程。');
        this.validateState(envelope.state);
        this.state = clone(envelope.state);
        return yes('存档已载入，日期、货物批次和收购公告均已恢复。');
      } catch (error) { return no(`无法读取存档：${error instanceof Error ? error.message : '文件格式无效'}`); }
    }

  }
  root.SWEngine = { Game, VERSION };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.SWEngine;
})(typeof globalThis === 'undefined' ? window : globalThis);
