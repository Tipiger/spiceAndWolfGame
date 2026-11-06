/* Join authored content with compiled planning tables. No balancing values live here. */
(function (root) {
  'use strict';
  const content = root.SW_CONTENT || (typeof require === 'function' ? require('./content.js') : null);
  const balance = root.SW_BALANCE || (typeof require === 'function' ? require('./balance.generated.js') : null);
  if (!content || !balance) throw new Error('缺少游戏内容或数值表，请运行 npm run balance。');

  function expand(text, values) {
    return String(text || '').replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!Object.hasOwn(values, key)) throw new Error('未定义的文本参数：' + key);
      return values[key];
    });
  }

  const goods = content.goods.map(item => ({
    ...item,
    ...balance.goods.find(row => row.id === item.id),
    supplyCities: content.cities.filter(city => balance.markets[city.id]?.[item.id]).map(city => city.id)
  }));
  const purchaseNotices = content.purchaseNotices.map(item => {
    const row = balance.purchaseNotices.find(row => row.id === item.id);
    const good = goods.find(good => good.id === row.good);
    return { ...item, ...row, description: expand(item.description, { ...row, unit: good.unit, goodName: good.name }) };
  });
  const story = content.story.map(item => {
    const row = item.narrativeOnly ? {} : balance.story.find(row => row.id === item.id);
    const conditions = { ...item.conditions };
    if (conditions.soldAt) conditions.soldAt = { ...conditions.soldAt, quantity: row.saleQuantity };
    if (row.purchaseCompleted) conditions.purchaseCompleted = row.purchaseCompleted;
    return { ...item, conditions, objective: expand(item.objective, row), reward: { ...item.reward, money: row.money } };
  });
  root.SW_DATA = {
    ...content,
    balanceRevision: balance.revision,
    releaseVersion: balance.releaseVersion,
    rules: balance.rules,
    initial: { ...content.initial, ...balance.initial },
    calendar: { ...content.calendar, ...balance.calendar },
    goods,
    worldEvents: content.worldEvents.map(item => ({ ...item, ...balance.worldEvents.find(row => row.id === item.id) })),
    cities: content.cities.map(city => ({ ...city, market: balance.markets[city.id] })),
    routes: balance.routes,
    purchaseNotices,
    story
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.SW_DATA;
})(globalThis);
