/* Calendar drawer: reading dates never advances the merchant's journey. */
(() => {
  'use strict';
  const fallbackEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const integer = value => Number.isInteger(value);

  function schedules(game) {
    const cities = game.data.cities || [], events = [];
    const cityName = id => cities.find(c => c.id === id)?.name || '收购城镇';
    for (const offer of game.getPurchaseOffers()) {
      if (!integer(offer.dueDay) || offer.dueDay < game.state.day) continue;
      events.push({
        key: `deadline:${offer.publicationId}`, type: 'deadline', absoluteDay: offer.dueDay,
        title: offer.title, city: cityName(offer.destination),
        detail: '截止当日仍可交付；带齐货物抵达收购地即可交货。'
      });
      if (offer.cycle > 1 && integer(offer.publishedDay)) {
        events.push({
          key: `refresh:${offer.publicationId}`, type: 'refresh', absoluteDay: offer.publishedDay, published: true,
          title: offer.title, city: cityName(offer.destination),
          detail: `本期已在这天发布，截止${game.formatDate(offer.dueDay)}。`
        });
      }
    }
    for (const next of game.getUpcomingPurchases()) {
      if (!integer(next.nextPublishDay) || next.nextPublishDay < game.state.day) continue;
      events.push({
        key: `refresh:${next.templateId}:${next.nextPublishDay}`, type: 'refresh', absoluteDay: next.nextPublishDay,
        title: next.title, city: cityName(next.destination),
        detail: `公告目前冷却中，将在这天再次发布；新一期截止${game.formatDate(next.dueDay)}。`
      });
    }
    for (const event of game.getKnownEvents()) {
      if(!integer(event.startDay)||!integer(event.endDay))continue;
      const place=event.route?`${cityName(event.route.from)} — ${cityName(event.route.to)}`:`${cityName(event.city)}${event.good?' · '+game.goods[event.good].name:''}`;
      const effect=event.scope==='city'?`买卖价格为通常的 ${Number((event.priceMultiplier*100).toFixed(2))}%，每日额外消耗各 ${event.dailyConsumption} 件`:event.scope==='route'?`生效日行程耗时 ×${event.travelMultiplier}`:`库存上限 ×${event.stockMultiplier}，价格为通常的 ${Number((event.priceMultiplier*100).toFixed(2))}%`;
      events.push({
        key:`world:${event.id}`,type:'world',absoluteDay:Math.max(game.state.day,event.startDay),
        startDay:event.startDay,endDay:event.endDay,title:event.name,city:place,
        detail:`${game.formatDate(event.startDay)}至${game.formatDate(event.endDay)}，${effect}。`
      });
    }
    return events.sort((a, b) => a.absoluteDay - b.absoluteDay || a.type.localeCompare(b.type) || String(a.title).localeCompare(String(b.title)));
  }

  function render(game, view = {}, helpers = {}) {
    const esc = helpers.esc || fallbackEscape, icon = helpers.icon || (() => '');
    const now = game.getCalendar(), config = game.data.calendar || globalThis.SW_BALANCE.calendar;
    const months = config.monthsPerYear;
    const epoch = config.epoch;
    const startMonth = (epoch.year - 1) * months + epoch.month - 1;
    const currentMonth = (now.year - 1) * months + now.month - 1;
    const offset = integer(view.offset) ? view.offset : 0;
    const monthIndex = Math.max(startMonth, currentMonth + offset);
    const year = Math.floor(monthIndex / months) + 1, month = monthIndex % months + 1;
    const dates = globalThis.SWCalendar.getMonth(year, month, config);
    const first = dates[0], dateByAbsoluteDay = new Map(dates.map(d => [d.absoluteDay, d]));
    const requested = integer(view.selectedDay) ? view.selectedDay : game.state.day;
    const selected = dateByAbsoluteDay.get(requested) || (dateByAbsoluteDay.get(game.state.day)) || dates.find(d => d.absoluteDay >= 1) || first;
    const allSchedules = schedules(game);
    const allSeasonal = (config.events || []).filter(event => event.month === month && (!event.year || event.year === year));
    const forDay = date => [
      ...allSeasonal.filter(e => e.day === date.day).map(e => ({ ...e, type: 'seasonal', absoluteDay: date.absoluteDay })),
      ...allSchedules.filter(e => e.type==='world'?date.absoluteDay>=e.startDay&&date.absoluteDay<=e.endDay:e.absoluteDay === date.absoluteDay)
    ];
    const cells = [];
    const weekdayOffset = ((first.absoluteDay - 1) % 7 + 7) % 7;
    for (let i = 0; i < weekdayOffset; i++) cells.push('<span class="calendar-blank" aria-hidden="true"></span>');
    for (const date of dates) {
      const items = forDay(date), deadline = items.filter(e => e.type === 'deadline').length;
      const refresh = items.filter(e => e.type === 'refresh').length, seasonal = items.some(e => e.type === 'seasonal'), world = items.some(e=>e.type==='world');
      const today = date.absoluteDay === game.state.day, chosen = date.absoluteDay === selected.absoluteDay;
      const caption = [date.label, today ? '今天' : '', deadline ? `${deadline}份公告截止` : '', refresh ? `${refresh}份公告再次发布` : '', seasonal ? '节令参考' : '', world?'已知商路事件':''].filter(Boolean).join('，');
      cells.push(`<button type="button" class="calendar-day${today ? ' is-today' : ''}${chosen ? ' is-selected' : ''}" data-action="calendar-select" data-day="${date.absoluteDay}" aria-label="${esc(caption)}" aria-pressed="${chosen}" ${today ? 'aria-current="date"' : ''} ${date.absoluteDay < 1 ? 'disabled' : ''}><span class="calendar-day-number">${date.day}</span>${today ? '<small class="calendar-today-label">今</small>' : ''}<span class="calendar-day-signals" aria-hidden="true">${deadline ? `<i class="calendar-dot deadline"></i><small>${deadline}</small>` : ''}${refresh ? `<i class="calendar-dot refresh"></i><small>${refresh}</small>` : ''}${seasonal ? '<i class="calendar-dot seasonal"></i>' : ''}${world?'<i class="calendar-dot calendar-world-event"></i>':''}</span></button>`);
    }
    const selectedItems = forDay(selected), upcoming = allSchedules.filter(e => e.absoluteDay >= game.state.day);
    const eventHTML = item => {
      const type = item.type, badge = type === 'deadline' ? '公告截止' : type === 'refresh' ? (item.published ? '本期已发布' : '再次发布') : type==='world'?'商路消息':'节令参考';
      const eventClass=type==='world'?'calendar-world-event':type;
      const description = type === 'seasonal' ? item.description : `${item.city} · ${item.detail}`;
      return `<article class="calendar-event ${eventClass}"><span class="calendar-event-kind">${esc(badge)}</span><div><h4>${esc(item.title)}</h4><p>${esc(description || '')}</p></div></article>`;
    };
    return `<section class="calendar-ui"><div class="calendar-current"><div><small>马车行至</small><strong>${esc(now.label)}</strong></div><span>${esc(now.seasonName)}</span></div><p class="calendar-intro">翻阅日历不消耗时间。收购公告面向全地图公开，截止日期自发布时确定。带齐货物抵达收购地即可交货，截止次日公告结束。</p><div class="calendar-month-heading"><button type="button" class="calendar-nav" data-action="calendar-month" data-step="-1" aria-label="上个月" ${monthIndex <= startMonth ? 'disabled' : ''}>‹</button><div><h3>行商历 ${year} 年 · ${month} 月</h3><button type="button" class="text-btn" data-action="calendar-today">回到本月</button></div><button type="button" class="calendar-nav" data-action="calendar-month" data-step="1" aria-label="下个月">›</button></div><div class="calendar-weekdays" aria-hidden="true">${['一','二','三','四','五','六','日'].map(day => `<span>${day}</span>`).join('')}</div><div class="calendar-month-grid" role="group" aria-label="行商历${year}年${month}月，选择日期查看安排">${cells.join('')}</div><div class="calendar-legend"><span><i class="calendar-dot deadline"></i>收购截止</span><span><i class="calendar-dot refresh"></i>再次发布</span><span><i class="calendar-dot seasonal"></i>节令参考</span><span><i class="calendar-dot calendar-world-event"></i>已知事件</span></div><section class="calendar-selection" aria-live="polite"><h3>${esc(selected.label)}${selected.absoluteDay === game.state.day ? ' · 今天' : ''}</h3>${selectedItems.length ? selectedItems.map(eventHTML).join('') : '<p class="calendar-empty-day">这天没有当前已知的收购、商路事件或节令安排。</p>'}</section><section class="calendar-upcoming"><h3 class="section-heading">${icon('scroll')}近期收购与商路日程</h3><p class="calendar-intro">显示全地图收购截止与再发布日，以及已经公开或问明准确日期的商路事件。只有大意的初闻记在资讯中。</p>${upcoming.length ? upcoming.map(item => `<button type="button" class="calendar-agenda-button ${item.type==='world'?'calendar-world-event':item.type}" data-action="calendar-select" data-day="${item.absoluteDay}"><span class="calendar-agenda-date">${esc(game.formatDate(item.absoluteDay, {short:true}))}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.city)} · ${item.type === 'deadline' ? '收购公告截止' : item.type==='world' ? item.detail : (item.published ? '本期已发布' : '冷却结束，再次发布')}</small></span></button>`).join('') : '<p class="calendar-empty-day">目前没有已知的收购公告排期。</p>'}</section><p class="calendar-rule-note">本作采用模拟行商历：每年 ${months} 个月，每月 ${config.daysPerMonth} 天，每周七天。具体纪年、日期与节令排期是经营设定；原作节令作为氛围参考。</p></section>`;
  }

  globalThis.SWCalendarUI = Object.freeze({ render });
})();
