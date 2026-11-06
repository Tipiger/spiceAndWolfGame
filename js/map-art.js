/*
 * Generated terrain based on the official 375 x 533 world map.
 * Interaction coordinates are exactly 2x the reference; roads are gameplay.
 * Source: https://spicy-wolf.com/1st/original/world.html
 * Official hit areas: https://spicy-wolf.com/1st/assets/css/original.css
 * See docs/sources.md for anchors, uncertainty and the map's original credit.
 */
(() => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  // Four anchors are official clickable-label rectangle centers. Yorentz is the
  // hand-read center of the source label (there is no official clickable region).
  const anchors = {
    pazzio: { x: 160, y: 442.5 },
    pasloe: { x: 210, y: 465 },
    yorentz: { x: 249, y: 459 },
    poroson: { x: 209.5, y: 398.5 },
    ruvenheigen: { x: 136, y: 377.5 }
  };
  const point = cityOrId => {
    const id = typeof cityOrId === 'string' ? cityOrId : cityOrId?.id;
    const p = anchors[id] || cityOrId?.canonicalPixel;
    return p ? { x: p.x * 2, y: p.y * 2 } : { x: 375, y: 850 };
  };
  // Control points are laid over the south of the official map. The roads and
  // travel times are explicitly gameplay links, not purported canonical roads.
  const curves = {
    'pasloe-yorentz': [[420,930],[444,940],[480,938],[498,918]],
    'pasloe-pazzio': [[420,930],[391,915],[358,895],[320,885]],
    'yorentz-pazzio': [[498,918],[448,868],[367,851],[320,885]],
    'pazzio-poroson': [[320,885],[354,846],[387,799],[419,797]],
    'poroson-ruvenheigen': [[419,797],[366,815],[302,799],[272,755]],
    'pazzio-ruvenheigen': [[320,885],[301,856],[301,798],[272,755]]
  };
  function routePath(fromId, toId) {
    const forward = curves[`${fromId}-${toId}`];
    const reverse = curves[`${toId}-${fromId}`];
    const curve = forward || (reverse ? [...reverse].reverse() : null);
    if (!curve) { const a=point(fromId), b=point(toId); return `M ${a.x} ${a.y} L ${b.x} ${b.y}`; }
    return `M ${curve[0].join(' ')} C ${curve[1].join(' ')} ${curve[2].join(' ')} ${curve[3].join(' ')}`;
  }
  const assets=Object.freeze({map:'assets/runtime/map/world-map-v3.webp',village:'assets/runtime/map/village-v3.webp',harbor:'assets/runtime/map/harbor-v3.webp',cathedral:'assets/runtime/map/cathedral-v3.webp'});
  const cityArt=id=>id==='pazzio'?assets.harbor:id==='ruvenheigen'?assets.cathedral:assets.village;
  function town(c,state){const p=point(c),current=state.city===c.id,locked=!(state.unlockedCities||[]).includes(c.id),labels={pazzio:{x:-35,y:4,anchor:'end',line:'M -20 0 L -31 0'},pasloe:{x:0,y:25,anchor:'middle',line:'M 0 8 L 0 16'},yorentz:{x:29,y:1,anchor:'start',line:'M 17 0 L 26 -3'},poroson:{x:31,y:2,anchor:'start',line:'M 18 0 L 27 -3'},ruvenheigen:{x:32,y:4,anchor:'start',line:'M 20 0 L 29 -2'}},l=labels[c.id];return `<g class="town-node${current?' current':''}${locked?' locked':''}" data-city="${esc(c.id)}" transform="translate(${p.x} ${p.y})" tabindex="0" role="button" aria-label="${esc(c.name)}${current?'，马车所在':locked?'，商路尚未开放':''}"><circle class="town-hit" cy="-13" r="29"/><image class="town-building-image" href="${cityArt(c.id)}" x="-29" y="-47" width="58" height="49" preserveAspectRatio="xMidYMid meet"/><path d="${l.line}" fill="none" stroke="#99845c" stroke-width=".65"/><path class="town-label-hit" d="${l.line}" fill="none" stroke="transparent" stroke-width="17"/><circle class="town-dot" r="3" fill="${current?'#315a39':'#f5e8c4'}" stroke="#7b6e4b" stroke-width="1"/><text class="town-label" x="${l.x}" y="${l.y}" text-anchor="${l.anchor}" font-family="var(--serif)" font-size="13" fill="#465337">${esc(c.name)}</text><text class="town-alias" x="${l.x}" y="${l.y+11}" text-anchor="${l.anchor}" font-size="6.5" fill="#8f8d70">${esc(c.japaneseName||'')}</text></g>`;}
  function distant(x,y,name,jp,type='village',dx=0,dy=16){const src=assets[type]||assets.village;return `<g class="map-distant-place map-feature" data-map-title="${esc(name)}" data-map-info="远在北方的城镇，离眼下的商路还很遥远。" transform="translate(${x*2} ${y*2})"><image href="${src}" x="-20" y="-29" width="40" height="32" preserveAspectRatio="xMidYMid meet"/><text x="${dx}" y="${dy}" text-anchor="middle" fill="#6e7256" stroke="#f1e6cd" stroke-width="2" paint-order="stroke" font-size="10" font-family="var(--serif)">${esc(name)}</text><text x="${dx}" y="${dy+9}" text-anchor="middle" fill="#9a927c" font-size="6">${esc(jp)}</text></g>`;}
  function wagon(state,data){
    const p=point(state.city||'pasloe'),name=data.cities.find(c=>c.id===state.city)?.name||'\u65c5\u9014\u4e2d';
    const offsets={pazzio:[80,0],pasloe:[-75,5],yorentz:[95,-35],poroson:[0,-90],ruvenheigen:[-110,-5]},[dx,dy]=offsets[state.city]||[75,0];
    return `<g id="map-wagon" class="map-wagon" transform="translate(${p.x} ${p.y})" pointer-events="none" aria-label="\u4f60\u7684\u9a6c\u8f66\u4f4d\u4e8e${esc(name)}"><g id="map-wagon-visual"><circle class="player-halo" r="19"/><circle class="player-core" r="5"/><path d="M0 0 L${dx} ${dy-7}" fill="none" stroke="#315a39" stroke-width="1.3" stroke-dasharray="3 3"/><g transform="translate(${dx} ${dy})"><g class="wagon-picture" role="img" aria-label="${esc(data.mapWagonArt.description)}">${data.mapWagonArt.frames.map((src,index)=>`<image class="wagon-frame${index===1?' second':''}" href="${esc(src)}" x="-56" y="-101" width="112" height="80" preserveAspectRatio="xMidYMid meet" aria-hidden="true"/>`).join('')}</g><rect class="player-tag" x="-52" y="-17" width="104" height="20" rx="5"/><text id="wagon-place-label" x="0" y="-3" text-anchor="middle">\u9a6c\u8f66 \u00b7 ${esc(name)}</text></g></g></g>`;
  }
  function render(data,game){const state=game.state||game;return `<defs><filter id="road-earth" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".28" numOctaves="2" seed="14" result="earth"/><feDisplacementMap in="SourceGraphic" in2="earth" scale="1.3" xChannelSelector="R" yChannelSelector="G"/></filter></defs><image class="painted-map" href="${assets.map}" x="0" y="0" width="750" height="1066" preserveAspectRatio="none"/><g fill="none" stroke="#8d784e" opacity=".5" pointer-events="none"><rect x="9" y="9" width="732" height="1048" stroke-width="1.1"/><rect x="15" y="15" width="720" height="1036" stroke-width=".5"/></g><g class="map-geographical-labels" pointer-events="none" fill="#728c7a" font-family="var(--serif)"><text x="164" y="953" transform="rotate(-4 164 953)" font-size="12" letter-spacing="3" stroke="#f2e7cb" stroke-width="3" paint-order="stroke">斯劳德河 · スラウド川</text><text x="550" y="517" font-size="10" letter-spacing="2" stroke="#f2e7cb" stroke-width="2" paint-order="stroke">罗姆河 · ローム川</text><text x="429" y="300" transform="rotate(-10 429 300)" fill="#a09470" font-size="20" letter-spacing="8">北方平原</text><text x="525" y="412" fill="#9c8e6e" font-size="10">约伊兹 · ヨイツ</text></g><g class="map-northern-places">${distant(93,165,'温菲尔王国','ウィンフィール王国','cathedral',-12,25)}${distant(166,201,'凯尔贝','ケルーベ','harbor',0,23)}${distant(216,227,'雷诺斯','レノス','village',26,0)}${distant(207,272,'特雷欧','テレオ','village',22,0)}${distant(202,287,'恩贝尔克','エンベルク','village',28,10)}${distant(132,314,'库梅尔森','クメルスン','village',-4,-29)}${distant(349,192,'纽希拉','ニョッヒラ','village',0,25)}</g><g class="map-feature" data-map-title="斯劳德河与渡口" data-map-info="帕兹欧是斯劳德河中流的商港。河上没有桥梁，渡船、码头与集市汇集旅人。"><path d="M94 914C138 924 180 910 224 908S300 898 354 904 410 926 440 930 496 930 538 918" fill="none" stroke="transparent" stroke-width="17" pointer-events="stroke"/></g><g class="map-roads">${data.routes.map(r=>{const locked=!state.unlockedCities.includes(r.from)||!state.unlockedCities.includes(r.to);const d=routePath(r.from,r.to);return `<g class="road-hover${locked?' locked':''}" data-from="${r.from}" data-to="${r.to}"><g class="road-surface" aria-hidden="true"><path class="road-shoulder" d="${d}"/><path id="route-${r.from}-${r.to}" class="map-road" d="${d}"/><path class="road-median" d="${d}"/></g><path class="road-hit" d="${d}"/></g>`;}).join('')}</g><g class="map-towns">${data.cities.map(c=>town(c,state)).join('')}</g>${wagon(state,data)}`;}
  globalThis.SWMapArt=Object.freeze({render,point,routePath,cityArt,assets,initialView:Object.freeze({x:50,y:650,width:600,height:400}),fullView:Object.freeze({x:0,y:0,width:750,height:1066}),source:Object.freeze({width:375,height:533,url:'https://spicy-wolf.com/1st/original/world.html',credit:'原作地图 / 出光秀匡；本游戏地形与马车图像为AI重新绘制'})});
})();
