/* A fictional merchant calendar: twelve 30-day months, independent of real time. */
(function (root) {
  'use strict';
  const defaults = (root.SW_BALANCE || (typeof require === 'function' ? require('./balance.generated.js') : null)).calendar;
  function settings(config = {}) {
    return { ...defaults, ...config, epoch: { ...defaults.epoch, ...config.epoch } };
  }
  function ordinal(year, month, day, config) {
    return (year - 1) * config.monthsPerYear * config.daysPerMonth + (month - 1) * config.daysPerMonth + day - 1;
  }
  function getDate(absoluteDay, config = {}) {
    const c = settings(config);
    if (!Number.isInteger(absoluteDay)) throw new Error('旅途日期必须是整数。');
    const n = ordinal(c.epoch.year, c.epoch.month, c.epoch.day, c) + absoluteDay - 1;
    if (n < 0) throw new Error('日期早于行商历元年。');
    const year = Math.floor(n / (c.monthsPerYear * c.daysPerMonth)) + 1;
    const month = Math.floor((n % (c.monthsPerYear * c.daysPerMonth)) / c.daysPerMonth) + 1;
    const day = n % c.daysPerMonth + 1;
    const season = month >= 3 && month <= 5 ? 'spring' : month >= 6 && month <= 8 ? 'summer' : month >= 9 && month <= 11 ? 'autumn' : 'winter';
    const seasonName = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' }[season];
    const events = (c.events || []).filter(e => e.month === month && e.day === day && (!e.year || e.year === year));
    return { year, month, day, season, seasonName, label: `行商历${year}年${month}月${day}日`, shortLabel: `${month}月${day}日`, absoluteDay, events };
  }
  function getMonth(year, month, config = {}) {
    const c = settings(config);
    if (!Number.isInteger(year) || year < 1 || !Number.isInteger(month) || month < 1 || month > c.monthsPerYear) throw new Error('月份无效。');
    const first = ordinal(year, month, 1, c) - ordinal(c.epoch.year, c.epoch.month, c.epoch.day, c) + 1;
    return Array.from({ length: c.daysPerMonth }, (_, i) => getDate(first + i, c));
  }
  const api = { getDate, getMonth, formatDate: (day, config = {}, { short = false } = {}) => getDate(day, config)[short ? 'shortLabel' : 'label'] };
  root.SWCalendar = Object.freeze(api);
  if (typeof module !== 'undefined' && module.exports) module.exports = root.SWCalendar;
})(globalThis);
