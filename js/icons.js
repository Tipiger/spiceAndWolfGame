/* Shared vector interface icons. */
(() => {
  const icons = {
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18M7 15h2m6 0h2m-10 3h2m6 0h2"/>',
    map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z"/><path d="M9 3v16m6-14v16"/>',
    market:'<path d="M3 10h18l-2-6H5l-2 6Zm1 0v10h16V10M9 20v-7h6v7M3 10c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0"/>',
    book:'<path d="M12 5C9 2 5 3 3 4v16c3-1 6-1 9 1 3-2 6-2 9-1V4c-2-1-6-2-9 1Zm0 0v16"/><path d="M6 8h3m-3 4h3m6-4h3m-3 4h3"/>',
    guild:'<path d="m3 8 9-5 9 5H3Zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18M4 18h16"/>',
    journal:'<path d="M5 3h14v18H5V3Zm3 4h8m-8 4h8m-8 4h5M3 6h3m-3 5h3m-3 5h3"/>',
    coin:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><path d="M14.5 8.5c-5-2-6 4-2.5 3.5s3.5 5-2.5 3.5M12 6v12"/>',
    cart:'<path d="M2 4h3l2 12h12l2-8H6M9 8V5m5 3V4m4 4V5"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    save:'<path d="M4 3h13l4 4v14H3V3h1Zm3 0v7h10V3M7 21v-7h10v7"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',
    upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    heart:'<path d="M12 21 3.5 12.5a5.3 5.3 0 0 1 8.5-6 5.3 5.3 0 0 1 8.5 6L12 21Z"/>',
    flag:'<path d="M5 22V3m0 0c5-3 9 3 15 0v11c-6 3-10-3-15 0"/>',
    moon:'<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z"/>',
    sound:'<path d="m4 9 4 0 5-4v14l-5-4H4V9Zm13-2c3 3 3 7 0 10m3-13c5 5 5 11 0 16"/>',
    mute:'<path d="m4 9 4 0 5-4v14l-5-4H4V9Zm13 1 5 5m0-5-5 5"/>',
    home:'<path d="m3 10 9-7 9 7M5 9v12h14V9m-10 12v-7h6v7"/>',
    wheat:'<path d="M12 22V3m0 6C6 9 5 6 5 3c5 0 7 3 7 6Zm0 5C6 14 5 11 5 8c5 0 7 3 7 6Zm0 5c-6 0-7-3-7-6 5 0 7 3 7 6Zm0-12c6 0 7-3 7-6-5 0-7 3-7 6Zm0 5c6 0 7-3 7-6-5 0-7 3-7 6Zm0 5c6 0 7-3 7-6-5 0-7 3-7 6Z"/>',
    fur:'<path d="m8 3 4 3 4-3 5 4-3 4 2 9-5-1-3 2-3-2-5 1 2-9-3-4 5-4Z"/><path d="m9 9 3 2 3-2m-6 5 3 2 3-2"/>',
    salt:'<path d="M7 5h10v4l3 10-2 2H6l-2-2L7 9V5Zm0 4h10M7 5V3h10v2m-7 10h.1m4 2h.1m-2-5h.1"/>',
    apple:'<path d="M12 7C5 2 1 10 5 17c3 6 5 3 7 3s4 3 7-3c4-7 0-15-7-10Zm0 0c0-4 2-5 4-5m-4 5C8 7 7 5 7 3c4 0 5 2 5 4Z"/>',
    pepper:'<path d="M8 3h8v5l4 12-2 2H6l-2-2L8 8V3Zm0 5h8M8 5h8m-8 10h.1m4 2h.1m4 2h.1M8 19h.1m5-7h.1"/>',
    wine:'<path d="M9 2h6v8l3 5v7H6v-7l3-5V2Zm0 4h6M6 16h12m-9 2h6"/>',
    honey:'<path d="M7 4h10v4l3 4v8l-2 2H6l-2-2v-8l3-4V4Zm0 4h10M7 2h10v2H7V2ZM4 14h16m-11 3h6"/>',
    cheese:'<path d="m3 12 15-9 3 9v9H3v-9Zm0 0h18M7 17h.1m5 1h.1m5-3h.1M12 9h.1m4-2h.1"/>',
    parcel:'<path d="m3 7 9-4 9 4v13l-9 3-9-3V7Zm0 0 9 4 9-4M12 11v12M7 5l10 4v5"/>',
    scroll:'<path d="M5 3h13v15h-1M5 3c-4 0-4 6 0 6h2V6M5 3v15c0 4 4 4 4 0h12c0 4-4 4-4 0M9 7h6m-6 4h6"/>',
    talk:'<path d="M21 12c0 5-5 8-10 7l-6 3 1-6C-2 6 7 0 15 3c4 1 6 4 6 9Zm-14-1h.1m5 0h.1m5 0h.1"/>',
    tavern:'<path d="M4 7h12v14H4V7Zm12 2h3c4 0 4 8 0 8h-3M4 3h12v4M8 11v6m4-6v6"/>',
    restore:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-4v6l4 2"/>'
  };
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.parcel}</svg>`;
  const goodIcon = good => icon(icons[good.icon] ? good.icon : good.id);
  globalThis.SWIcons = { icon, goodIcon };
})();
