/* Map-first, local single-player browser game. All assets are bundled. */
(() => {
  'use strict';
  const D=globalThis.SW_DATA, {Game}=globalThis.SWEngine, {icon,goodIcon}=globalThis.SWIcons;
  const $=(s,p=document)=>p.querySelector(s), app=$('#app'), drawerRoot=$('#drawer-root'), overlayRoot=$('#overlay-root'), tooltip=$('#map-tooltip');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const M=globalThis.SWMoney;
  const num=v=>M.format(Number(v||0));
  const percent=value=>Number((value*100).toFixed(4)).toString();
  function parseCoin(value){const s=String(value).trim().replace(/,/g,'').replace(/−/g,'-'),f=s.match(/^(-?)(\d*)\s*([¼½¾])$/);if(f)return (f[1]?-1:1)*(Number(f[2]||0)+({'¼':.25,'½':.5,'¾':.75}[f[3]]));const r=s.match(/^(?:(-?\d+)\s+)?([123])\/([24])$/);if(r)return Number(r[1]||0)+Number(r[2])/Number(r[3]);return Number(s);}
  const moneyText=value=>String(value).replace(/([−-]?\d[\d,]*\.\d+)(?=\s*银币)/g,n=>num(Number(n.replace(/,/g,'').replace('−','-'))));
  const good=id=>D.goods.find(g=>g.id===id),city=id=>D.cities.find(c=>c.id===id);
  const SAVE=`spice-wolf-journey-v${SWEngine.VERSION}`,CHECKPOINT=`spice-wolf-checkpoint-v${SWEngine.VERSION}`;
  const read=k=>{try{return localStorage.getItem(k);}catch{return null;}};
  const readSave=()=>read(SAVE);
  const readCheckpoint=()=>read(CHECKPOINT);
  let game=new Game(D),active=false,drawer=null,drawerCleanup=null,overlayCleanup=null,autosaveOK=true;
  let camera=null,travelling=false,finishTravel=null,travelTimer=null,travelFrame=null,eventNoticeId=null,noticeContinuation=null,audio=null,soundOn=false,consultTab='events',noticeCityFilter='all',journalTab='journal';
  const novelArt=D.novelArt;
  const novelImage=key=>'assets/runtime/novel/'+novelArt.find(a=>a.key===key).file;
  const catalogUI=SWGoodsCatalog.install({getGame:()=>game,data:D,esc,icon,goodIcon});
  const MAP=()=>globalThis.SWMapArt;
  const date=day=>game.formatDate(day);
  let calendarState={offset:0,selectedDay:1};
  const tutorial=SWTutorial.install({getContext:()=>({game,active,story:game.getActiveStory(),busy:travelling||!!$('.vn-scene')||!!eventNoticeId,closePanels:()=>{closeDrawer();closeOverlay();}}),esc});
  function persist(checkpoint=false){try{localStorage.setItem(SAVE,game.exportSave());if(checkpoint)localStorage.setItem(CHECKPOINT,game.exportSave());autosaveOK=true;}catch{autosaveOK=false;}}
  function toast(message,error=false){const n=document.createElement('div');n.className='toast'+(error?' error':'');n.innerHTML=icon(error?'info':'check')+'<span>'+esc(message)+'</span>';const host=$('#toast-root');while(host.children.length>=2)host.firstElementChild.remove();host.appendChild(n);setTimeout(()=>n.remove(),4300);}
  function closeOverlay(force=false){if(eventNoticeId&&!force)return;overlayCleanup?.();overlayCleanup=null;overlayRoot.innerHTML='';app.inert=false;drawerRoot.inert=false;}
  function modal(body,wide=false){if(eventNoticeId)return;closeOverlay();hideTooltip();app.inert=true;drawerRoot.inert=true;overlayRoot.innerHTML=`<div class="overlay"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="旅途窗口"><button class="modal-close" data-action="close-overlay" aria-label="关闭窗口">${icon('close')}</button>${body}</section></div>`;$('.overlay').onclick=e=>{if(e.target.classList.contains('overlay'))closeOverlay();};setTimeout(()=>$('.modal button,.modal input,.modal select')?.focus(),0);}
  function commit(result,{close=true}={}){
    if(!result?.ok){toast(result?.message||'暂时无法完成。',true);return false;}
    persist();if(close)closeOverlay();renderWorld();if(drawer)renderDrawer();
    if(game.getEventNotices().length)showEventNotices();else toast(result.message);
    return true;
  }
  function title(){stopTravelAnimation();travelling=false;closeDrawer();app.innerHTML=`<main class="title-screen"><div class="title-art"></div><div class="title-content"><div class="title-brand"><img src="assets/runtime/crest.svg" alt=""><span>狼与香辛料</span></div><div class="eyebrow">SPICE & WOLF · A MERCHANT'S JOURNEY</div><h1>风起麦浪间<span>行 商 旅 记</span></h1><p class="title-description">打开地图，让车轮循着商路前行。<br>装下货物，也为同行的人留一席位置。</p><div class="title-actions"><button class="btn primary" data-action="new">开启新的旅程 ${icon('arrow')}</button><button class="btn" data-action="continue" ${readSave()?'':'disabled'}>继续上次旅程 ${icon('book')}</button><button class="btn" data-action="import">读取存档文件 ${icon('upload')}</button></div><p class="title-version">第一章 · 银币与北行</p></div><div class="title-caption">旅途的价值，<br>从来不只在账簿之上。</div><div class="title-footnote">麦浪起伏，商路向北。</div></main>`;}
  function launchNew(){if(readSave())return modal(`<div class="eyebrow">A NEW JOURNEY</div><h2>重新打开这张地图</h2><p class="modal-description">新的旅程会替换自动存档。你可以先把原来的旅程导出，放进自己的行囊。</p><div class="modal-actions"><button class="btn" data-action="export-previous">导出原有旅程</button><button class="btn primary" data-action="start-new">开始新旅程</button></div>`);startNew();}
  function startNew(){closeOverlay();game=new Game(D);tutorial.reset();active=true;camera=null;closeDrawer();persist(true);renderWorld();playScene(D.prologue,'麦穗中的约定',()=>{commit(game.advanceStory());persist(true);});}
  function resume(){const raw=readSave();if(!raw)return toast('还没有记下的旅程。',true);const result=game.importSave(raw);if(!result.ok)return toast(result.message,true);active=true;closeOverlay();closeDrawer();persist();renderWorld();if(game.state.storyIndex===0)playScene(D.prologue,'麦穗中的约定',()=>{commit(game.advanceStory());persist(true);});else if(game.getTravelStatus())resumeTravel();else{toast('马车还在原地。旅途可以继续了。');showEventNotices();}}

  function goalSummary(){const story=game.getActiveStory();if(!story)return {title:'商路仍在前方',detail:'自由行商 · 查看新的收购公告',ready:false};const can=game.canAdvanceStory();return {title:story.title,detail:can.ok?'新的线索已齐备，点击查看':story.objective,ready:can.ok};}
  function playerPanel(state,usage,today,soonest,readyNotices){
    const knownEvents=game.getKnownEvents(),signal=knownEvents.length+readyNotices.length;
    return `<div class="player-panel" role="group" aria-label="旅程信息与行囊">
      <div class="journey-status">
        <button class="world-stat calendar-trigger" data-action="drawer" data-drawer="calendar" aria-label="打开日历">${icon('calendar')}<div><small>行商历 · 第 ${state.day} 天</small><strong>${today.month}月${today.day}日</strong></div><span class="stat-hint">日历</span></button>
        <button class="world-stat silver-balance" data-action="drawer" data-drawer="journal" aria-label="打开旅途手账">${icon('coin')}<div><small>特雷尼银币</small><strong>${num(state.money)}</strong></div><span class="stat-hint">手账</span></button>
      </div>
      <nav class="player-tools" aria-label="旅程导航">
        <button class="player-tool information-trigger" data-action="drawer" data-drawer="consult" aria-label="打开资讯">${icon('talk')}<strong>资讯</strong>${signal?`<i class="player-count" title="已知事件 ${knownEvents.length} 则 · 可交货公告 ${readyNotices.length} 则">${signal}</i>`:''}</button>
        <button class="player-tool cargo-trigger" data-action="drawer" data-drawer="cargo" aria-label="打开马车货舱" aria-description="货舱 ${usage.usedCells}/${usage.totalCells} 格，承重 ${usage.weight}/${usage.maxWeight}">${icon('cart')}<strong>马车<span class="cargo-summary"> ${usage.usedCells}/${usage.totalCells} 格</span></strong>${soonest<=2?`<i class="player-expiry">余${soonest}天</i>`:''}</button>
        <button class="player-tool saves-trigger" data-action="drawer" data-drawer="saves" aria-label="打开存档">${icon('save')}<strong>存档</strong></button>
        <button class="player-tool more-trigger" data-action="drawer" data-drawer="more" aria-label="打开更多">${icon('info')}<strong>更多</strong></button>
      </nav>
    </div>`;
  }

  function renderWorld(){if(!active)return title();hideTooltip();const s=game.state,usage=game.getCargoUsage(),goal=goalSummary(),soonest=Math.min(...s.cargo.filter(c=>c.expiresDay!==null).map(c=>c.expiresDay-s.day));const today=game.getCalendar(),readyNotices=game.getPurchaseOffers().filter(c=>c.canDeliver);const initialCamera=!camera;
    app.innerHTML=`<main class="world ${travelling?'is-travelling':''}"><svg id="world-map" class="world-map" viewBox="${camera?.x||0} ${camera?.y||0} ${camera?.width||750} ${camera?.height||1066}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="北行商路地图，城镇可悬浮和点击">${MAP().render(D,game)}</svg><header class="world-header"><div class="brand-plate"><img src="assets/runtime/crest.svg" alt=""><div><h1>狼与香辛料</h1><p>A MERCHANT'S JOURNEY</p></div></div>${playerPanel(s,usage,today,soonest,readyNotices)}</header><button class="goal-anchor" data-action="drawer" data-drawer="objective"><div class="goal-top">${icon('flag')}当前目标<span>${s.storyIndex} / ${D.story.length}</span></div><strong>${esc(goal.title)}</strong><p class="${goal.ready?'goal-ready':''}">${esc(goal.detail)}</p></button><nav class="edge-dock city-dock" aria-label="${esc(city(s.city).name)}的城镇设施"><button class="location-anchor" data-action="locate-wagon" aria-label="定位马车">${icon('map')}<span>马车停靠 <strong>${esc(city(s.city).name)}</strong></span><small>定位 ${icon('arrow')}</small></button><div class="city-facilities">${[['market','market','市场'],['guild','guild','商会'],['tavern','tavern','酒馆']].map(([id,ico,label])=>`<button class="edge-button ${drawer?.type===id?'active':''}" data-action="drawer" data-drawer="${id}" aria-label="打开${label}">${icon(ico)}<span>${label}</span></button>`).join('')}</div></nav><button class="companion-anchor" data-action="drawer" data-drawer="companion"><img src="assets/runtime/official/holo.webp" alt="旅伴赫萝"><div><strong>赫萝 <span class="badge">同行</span></strong><p>${s.city==='pasloe'?'“汝先看路，再看银币。”':'“这一程，会有什么新鲜事？”'}</p></div></button><div class="map-compass">N<svg viewBox="0 0 80 80" fill="none"><path d="m40 5 9 26 26 9-26 9-9 26-9-26L5 40l26-9 9-26Z" stroke="currentColor"/><path d="M40 5v70M5 40h70m-35-35 9 26-9 9V5Z" fill="currentColor"/></svg>S</div><div class="map-controls" aria-label="地图缩放"><button data-action="zoom" data-factor="0.8" aria-label="放大地图">+</button><button data-action="zoom" data-factor="1.25" aria-label="缩小地图">−</button><button data-action="map-full" aria-label="查看完整地图">全图</button></div><div class="map-hint"><span class="map-hint-desktop">点击城镇查看行情 · 拖动地图 · 滚轮缩放</span><span class="map-hint-touch">点选城镇 · 拖动探索</span></div><footer class="world-foot"><div class="foot-links"><button data-action="atlas">${icon('map')}商路舆图</button><button data-action="help">${icon('info')}行商指南</button><button data-action="sound">${icon(soundOn?'sound':'mute')}环境音</button><button data-action="title">${icon('home')}标题</button></div><span class="map-caption">商路与银币 · 北行旅记</span><span class="save-status">${autosaveOK?'○ 旅程已记下':'请导出文件保存旅程'}</span></footer><div id="travel-layer"></div></main>`;
    syncDrawerNavigation();
    if(initialCamera)camera=journeyView();
    bindMap();updateCamera();
  }
  function updateCamera(){const map=$('#world-map');if(map)map.setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.width} ${camera.height}`);updateMarkerScale();hideTooltip();}
  function updateMarkerScale(){const svg=$('#world-map'),visual=$('#map-wagon-visual');if(!svg||!visual)return;const matrix=svg.getScreenCTM(),scale=matrix?Math.hypot(matrix.a,matrix.b):1,target=innerWidth<=700 ? .48 : (camera?.width>=720 ? .65 : 1);visual.setAttribute('transform','scale('+Math.min(2.8,Math.max(.35,target/scale))+')');}
  function journeyView(){
    const svg=$('#world-map'),width=svg?.clientWidth||innerWidth,height=svg?.clientHeight||innerHeight;
    if(innerWidth>700)return {...MAP().initialView};
    const viewWidth=430,viewHeight=viewWidth*height/width,p=MAP().point(game.state.city);
    return {x:Math.max(0,Math.min(750-viewWidth,p.x-viewWidth/2)),y:Math.max(0,Math.min(1066-viewHeight,p.y-viewHeight/2)),width:viewWidth,height:viewHeight};
  }
  function locateWagon(){const p=MAP().point(game.state.city),v=journeyView();camera={x:Math.max(0,Math.min(750-v.width,p.x-v.width/2)),y:Math.max(0,Math.min(1066-v.height,p.y-v.height/2)),width:v.width,height:v.height};updateCamera();}
  function zoom(factor,x=.5,y=.5){const w=Math.max(180,Math.min(1600,camera.width*factor)),h=w*(camera.height/camera.width);camera.x+=(camera.width-w)*x;camera.y+=(camera.height-h)*y;camera.width=w;camera.height=h;updateCamera();}
  function hideTooltip(){tooltip.hidden=true;tooltip.classList.remove('is-route-preview');catalogUI.hide();}
  function showTownTooltip(node){if(travelling||innerWidth<=700)return;const place=city(node.dataset.city);if(!place)return;const unlocked=game.state.unlockedCities.includes(place.id);const items=D.goods.filter(g=>place.market[g.id]).sort((a,b)=>place.market[a.id].price/a.basePrice-place.market[b.id].price/b.basePrice).slice(0,3);tooltip.innerHTML=`<div class="eyebrow">${place.id===game.state.city?'马车所在':'城镇行情'}</div><h3>${esc(place.name)}</h3><p>${esc(place.subtitle)}</p><div class="tooltip-goods">${items.map(g=>`<div><span>${esc(g.name)}</span><span>售 ${num(game.quote(g.id,place.id).buy)} / 收 ${num(game.quote(g.id,place.id).sell)}</span></div>`).join('')}</div><div class="tooltip-currency">${icon('coin','small-icon')} 特雷尼银币</div><div class="tooltip-instruction">${unlocked?'点击查看完整集市与收购公告':'商路未开放 · 点击查看城镇'}</div>`;positionTooltip(node);}
  function positionTooltip(node){const r=node.getBoundingClientRect();tooltip.hidden=false;const edge=drawer?$('.drawer').getBoundingClientRect().left-12:innerWidth-15;if(edge<tooltip.offsetWidth+15){tooltip.hidden=true;return;}const x=Math.max(15,Math.min(edge-tooltip.offsetWidth,r.left+r.width*.6)),y=r.top>300?r.top-tooltip.offsetHeight-12:r.bottom+10;tooltip.style.left=x+'px';tooltip.style.top=Math.max(15,Math.min(innerHeight-tooltip.offsetHeight-15,y))+'px';}
  function showRouteTooltip(node,point){
    const a=city(node.dataset.from),b=city(node.dataset.to),route=D.routes.find(r=>r.from===a.id&&r.to===b.id);
    if(!route||drawer||travelling)return;
    tooltip.classList.add('is-route-preview');
    tooltip.innerHTML=`<button class="route-preview-close" data-action="close-route" aria-label="关闭路程信息">${icon('close')}</button><div class="eyebrow">商路</div><h3>${esc(a.name)} — ${esc(b.name)}</h3><p>${route.days} 天路程 · 食宿旅费 ${num(route.cost)} 银币</p><div class="tooltip-instruction">途中天气可能改变抵达日期。</div>`;
    positionTooltip(point?{getBoundingClientRect:()=>({left:point.x,top:point.y,bottom:point.y,width:0})}:node);
  }
  function bindMap(){const svg=$('#world-map');let pan=null,moved=false;
    svg.addEventListener('click',e=>{if(moved||(innerWidth>700&&e.pointerType!=='touch'))return;const route=e.target.closest('.road-hover');if(route)showRouteTooltip(route,{x:e.clientX,y:e.clientY});});
    svg.addEventListener('pointerover',e=>{if(innerWidth<=700||e.pointerType==='touch')return;const town=e.target.closest('.town-node');if(town){if(!town.contains(e.relatedTarget))showTownTooltip(town);return;}const route=e.target.closest('.road-hover');if(route&&!drawer&&!travelling){const a=city(route.dataset.from),b=city(route.dataset.to),r=D.routes.find(r=>r.from===a.id&&r.to===b.id);tooltip.innerHTML=`<div class="eyebrow">商路</div><h3>${esc(a.name)} — ${esc(b.name)}</h3><p>${r.days} 天路程 · 食宿旅费 ${r.cost} 银币</p><div class="tooltip-instruction">沿路可运送货物，交期按抵达日计算。</div>`;positionTooltip(route);}const feature=e.target.closest('[data-map-info]');if(feature&&!drawer){tooltip.innerHTML=`<h3>${esc(feature.dataset.mapTitle)}</h3><p>${esc(feature.dataset.mapInfo)}</p>`;positionTooltip(feature);}});
    svg.addEventListener('pointerout',e=>{const n=e.target.closest('.town-node,.road-hover,[data-map-info]');if(n&&!n.contains(e.relatedTarget)&&!tooltip.classList.contains('is-route-preview'))hideTooltip();});
    svg.addEventListener('focusin',e=>{const n=e.target.closest('.town-node');if(n)showTownTooltip(n);});svg.addEventListener('focusout',hideTooltip);
    svg.addEventListener('pointerdown',e=>{if(travelling||e.button!==0||e.target.closest('.town-node'))return;pan={x:e.clientX,y:e.clientY,cam:{...camera}};moved=false;});
    svg.addEventListener('pointermove',e=>{if(!pan)return;const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.abs(dx)+Math.abs(dy)<4&&!moved)return;if(!moved)svg.setPointerCapture(e.pointerId);moved=true;svg.classList.add('panning');const scale=Math.min(svg.clientWidth/pan.cam.width,svg.clientHeight/pan.cam.height);camera.x=pan.cam.x-dx/scale;camera.y=pan.cam.y-dy/scale;updateCamera();});
    svg.addEventListener('pointerup',()=>{pan=null;svg.classList.remove('panning');});svg.addEventListener('pointercancel',()=>{pan=null;svg.classList.remove('panning');});
    svg.addEventListener('wheel',e=>{if(travelling)return;e.preventDefault();const r=svg.getBoundingClientRect();zoom(e.deltaY<0?.9:1.1,(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);},{passive:false});
  }
  const drawerLabels={calendar:['calendar','行商日历','DATES ALONG THE ROAD'],city:['market','城镇详情','TOWNS ALONG THE ROAD'],market:['market','城镇集市','THE TOWN MARKET'],cargo:['cart','马车货舱','A PLACE FOR EVERY PARCEL'],objective:['flag','当前目标','THE ROAD WE PROMISED'],consult:['talk','资讯','NEWS & MERCHANT NOTICES'],guild:['guild','商会与银币','SILVER & TRUST'],tavern:['tavern','酒馆与消息','NEWS BY THE FIRESIDE'],journal:['journal','旅途手账','A MERCHANT’S JOURNAL'],saves:['save','记下旅程','KEEP THE JOURNEY'],companion:['heart','同行的旅伴','BESIDE YOU ON THE ROAD'],more:['info','旅途选项','LITTLE THINGS FOR THE ROAD']};
  function syncDrawerNavigation(){document.querySelectorAll('.world [data-drawer]').forEach(n=>{const selected=n.dataset.drawer===drawer?.type;n.classList.toggle('active',selected);n.setAttribute('aria-expanded',String(selected));});}
  function closeDrawer(){const type=drawer?.type,hadFocus=drawerRoot.contains(document.activeElement);drawerCleanup?.();drawerCleanup=null;drawer=null;drawerRoot.innerHTML='';hideTooltip();syncDrawerNavigation();if(hadFocus&&type)$(`.world [data-drawer="${type}"]`)?.focus({preventScroll:true});}
  function openDrawer(type,placeId){if(travelling||eventNoticeId)return;if(type==='calendar'&&drawer?.type!=='calendar')calendarState={offset:0,selectedDay:game.state.day};if(drawer?.type===type&&!placeId){closeDrawer();return;}drawerCleanup?.();drawerCleanup=null;drawer={type,city:placeId||game.state.city,tab:'market'};hideTooltip();renderDrawer(true);syncDrawerNavigation();}
  function renderDrawer(fresh=false){if(!drawer)return;catalogUI.hide();drawerCleanup?.();drawerCleanup=null;const [ico,label,kicker]=drawerLabels[drawer.type],titleText=drawer.type==='city'?city(drawer.city).name:label;
    if(fresh||!$('.drawer',drawerRoot))drawerRoot.innerHTML=`<div class="drawer-shade"></div><section class="drawer ${drawer.type==='cargo'?'wagon-drawer':''}" role="dialog" aria-label="${esc(titleText)}"><header class="drawer-header"><div class="drawer-emblem">${icon(ico)}</div><div><div class="eyebrow">${kicker}</div><h2>${esc(titleText)}</h2></div><button class="drawer-close" data-action="close-drawer" aria-label="收起面板">${icon('close')}</button></header><div class="drawer-body"></div></section>`;
    const container=$('.drawer-body',drawerRoot);const type=drawer.type;
    if(fresh)$('.drawer-close',drawerRoot)?.focus({preventScroll:true});
    container.innerHTML=type==='cargo'?SWCargoUI.render(game,{esc,icon,goodIcon,toast}):type==='city'||type==='market'?cityDrawer():type==='objective'?objectiveDrawer():type==='consult'?consultDrawer():type==='calendar'?SWCalendarUI.render(game,calendarState,{esc,icon}):type==='guild'?guildDrawer():type==='tavern'?tavernDrawer():type==='journal'?journalDrawer():type==='saves'?saveDrawer():type==='more'?moreDrawer():companionDrawer();
    if(type==='cargo')drawerCleanup=SWCargoUI.mount(container,game,result=>{if(result?.ok){persist();renderWorld();renderDrawer();}else toast(result?.message||'无法移动货物。',true);},{esc,icon,goodIcon,toast});
  }
  function cityDrawer(){
    const place=city(drawer.city),here=place.id===game.state.city,unlocked=game.state.unlockedCities.includes(place.id),route=game.previewTravel(place.id),shortfall=route.affordable===false;
    return `<div class="city-illustration illustrated-town"><img src="${MAP().cityArt(place.id)}" alt="${esc(place.name)}城镇插画"><div><h3>${esc(place.name)}</h3><p>${esc(place.subtitle)}</p></div></div><p class="city-description">${esc(place.description)}</p>${!here?`<div class="city-travel"><h3>前往${esc(place.name)} <span class="badge ${unlocked?'green':''}">${unlocked?'商路已开放':'尚未开放'}</span></h3><p>${esc(route.message)}</p>${route.days?`<p>按已知路况预计 ${esc(date(route.arrivalDay))} 抵达 · 旅费 ${num(route.cost)} 银币</p><p class="travel-uncertainty">途中天气仍可能改变抵达日期。</p>`:''}${travelWarnings(route.days)}<button class="btn primary wide" data-action="travel" data-city="${place.id}" ${route.ok?'':'disabled'} ${shortfall?'aria-describedby="travel-cost-reason"':''}>沿商路启程 ${icon('arrow')}</button>${shortfall?`<p id="travel-cost-reason" class="travel-cost-reason">旅费不足，无法启程：需要 ${num(route.cost)} 银币，现有 ${num(game.state.money)} 银币，还差 ${num(route.cost-game.state.money)} 银币。</p>`:''}</div>`:`<p class="notice">${icon('cart','small-icon')} 马车正停在这里 · ${esc(date(game.state.day))}</p>`}<div class="drawer-tabs"><button data-action="city-tab" data-tab="market" class="${drawer.tab==='market'?'active':''}">货物行情</button><button data-action="city-tab" data-tab="notices" class="${drawer.tab==='notices'?'active':''}">收购公告</button><button data-action="city-tab" data-tab="tavern" class="${drawer.tab==='tavern'?'active':''}">酒馆</button></div>${drawer.tab==='notices'?purchaseBoard(place.id):drawer.tab==='tavern'?tavernDrawer(place.id):marketTable(place,here)}`;
  }

  function travelWarnings(days){
    if(!days)return '';
    const arrival=game.state.day+days,late=game.getPurchaseOffers(drawer?.city).filter(c=>arrival>c.dueDay&&(game.state.inventory[c.good]||0)>=c.quantity),spoiling=game.state.cargo.filter(s=>s.expiresDay!==null&&s.expiresDay<=arrival);
    return (late.length?`<div class="notice warning"><strong>抵达时将错过以下公告</strong><br>${late.map(c=>`「${esc(c.title)}」于 ${esc(date(c.dueDay))} 截止，本次预计 ${esc(date(arrival))} 抵达。`).join('<br>')}</div>`:'')+(spoiling.length?`<div class="notice warning"><strong>途中会腐坏</strong><br>${spoiling.map(s=>`${esc(good(s.good).name)} × ${s.quantity}：${esc(date(s.expiresDay))} 腐坏`).join('<br>')}<br>抵达前会从货舱移除，请重新考虑路线或交货安排。</div>`:'');
  }

  function moreDrawer(){return `<p class="page-intro">带上地图与指南，随时继续这段旅程。</p><div class="journey-options">${[['atlas','map','商路舆图'],['help','info','行商指南'],['sound',soundOn?'sound':'mute',soundOn?'关闭环境音':'开启环境音'],['title','home','返回标题']].map(([action,ico,label])=>`<button class="btn" data-action="${action}">${icon(ico)}${label}${icon('arrow')}</button>`).join('')}</div>`;}

  function marketEventLabels(events){
    return events.map(event=>`<small class="market-event-label">${esc(event.name)} · 价格 ${percent(event.priceMultiplier)}%${event.scope==='city'?' · 每日额外消耗 '+event.dailyConsumption:' · 库存上限 ×'+event.stockMultiplier} · 至${esc(game.formatDate(event.endDay,{short:true}))}</small>`).join('');
  }

  function marketTable(place,here){const localEvents=game.getActiveEvents().filter(event=>event.city===place.id);const goods=D.goods.filter(g=>place.market[g.id]),missing=D.goods.filter(g=>!place.market[g.id]);return `<div class="table-scroll"><table class="market-table"><thead><tr><th>货物 / ${here?'自有':'随车自有'}</th><th>购入价</th><th>收购价</th><th>库存</th>${here?'<th>交易</th>':'<th>随车估价</th>'}</tr></thead><tbody>${goods.map(g=>{const q=game.quote(g.id,place.id),marketEvents=localEvents.filter(event=>event.good===g.id||event.goods.includes(g.id));return `<tr class="${marketEvents.length?'market-event-row':''}"><td><button type="button" class="good-name good-catalog-trigger" data-catalog-good="${g.id}" data-catalog-city="${place.id}" aria-label="${esc(g.name)}商品图鉴" aria-describedby="goods-tooltip" aria-expanded="false"><span class="good-icon">${goodIcon(g)}</span><span>${esc(g.name)}<br><small>自有 ${q.owned} ${esc(g.unit)}${g.shelfLifeDays?' · 保鲜 '+g.shelfLifeDays+' 天':''}</small>${marketEventLabels(marketEvents)}</span></button></td><td><span class="price">${num(q.buy)}</span></td><td><span class="price">${num(q.sell)}</span></td><td>${q.stock}<small> ${esc(g.unit)}</small></td><td>${here?`<div class="trade-pair"><button data-action="trade" data-good="${g.id}" data-mode="buy" ${q.stock?'':'disabled'}>买</button><button data-action="trade" data-good="${g.id}" data-mode="sell" ${q.owned?'':'disabled'}>卖</button></div>`:`${q.owned?`<span class="number">${num(q.owned*q.sell)}</span>`:'<span class="muted">—</span>'}`}</td></tr>`;}).join('')}</tbody></table></div><div class="market-availability"><span>本城集市不交易：${missing.map(g=>esc(g.name)).join('、')}。</span><button class="text-btn" data-action="city-tab" data-tab="notices">查看本城收购公告 ${icon('arrow')}</button></div><p class="page-intro" style="margin-top:15px">悬浮商品或按 Tab 查看图鉴，点击可固定。单价以特雷尼银币计。${here?'货物按购入批次保鲜，较早腐坏的批次优先出售。不同到期日不会合并，补买新货也不能延长旧货寿命。':'估价只计算本城参与交易的货物。实际抵达时行情可能变化，需另扣旅费，并留意保鲜时间。'}</p>${!here?cargoEstimate(place):''}`;}

  function cargoEstimate(place){const all=D.goods.filter(g=>game.state.inventory[g.id]>0),goods=all.filter(g=>game.quote(g.id,place.id)),missing=all.filter(g=>!game.quote(g.id,place.id)),r=game.previewTravel(place.id);if(!all.length)return '';const value=goods.reduce((n,g)=>n+game.quote(g.id,place.id).sell*game.state.inventory[g.id],0),cost=goods.reduce((n,g)=>n+game.state.costBasis[g.id],0);return `<div class="financial-card"><h3>可在当地售出的随车货物</h3>${goods.length?`<div class="summary-row"><span>当地收购估值</span><strong>${num(value)}</strong></div><div class="summary-row"><span>这些货物的账面成本</span><span>${num(cost)}</span></div>${r.days?`<div class="summary-row"><span>此程食宿旅费</span><span>${num(r.cost)}</span></div><div class="summary-row"><span>估计收益（扣此程旅费）</span><strong>${num(value-cost-r.cost)}</strong></div>`:''}`:'<p>当前自有货物不在本城集市交易。</p>'}${missing.length?`<p style="margin-top:12px">${missing.map(g=>esc(g.name)).join('、')}不计入上面的售货估值，可查看本城是否有单独的收购公告。</p>`:''}</div>`;}

  function terms(t){
    const g=good(t.good),remaining=t.dueDay-game.state.day;
    return `<dl class="notice-terms"><div><dt>交付地点</dt><dd>${esc(city(t.destination).name)}</dd></div><div><dt>自行采购的货物</dt><dd>${esc(g.name)} × ${t.quantity} ${esc(g.unit)}</dd></div><div><dt>公告发布日期</dt><dd>${esc(date(t.publishedDay))}</dd></div><div><dt>收购截止日期</dt><dd class="${remaining<=2&&remaining>=0?'deadline-near':''}">${esc(date(t.dueDay))}<small class="term-note">截止当日可交货${remaining===0?' · 今日截止':remaining>0?' · 还有 '+remaining+' 天':''}</small></dd></div><div><dt>收购单价</dt><dd class="number">${num(t.unitPrice)} <small>银币 / ${esc(g.unit)}</small></dd></div><div><dt>交付后货款</dt><dd class="number">${num(t.totalPrice??t.quantity*t.unitPrice)} <small>银币</small></dd></div><div><dt>货物保鲜</dt><dd>${g.shelfLifeDays?`购入 ${g.shelfLifeDays} 天后腐坏`:'耐储存货物'}</dd></div></dl>`;
  }

  function offerCard(t){const g=good(t.good),owned=game.state.inventory[t.good]||0,route=game.previewTravel(t.destination),practice=game.getActiveStory()?.id==='silver-resolution'&&game.quote(t.good)&&route.ok&&route.arrivalDay<=t.dueDay;return `<article class="notice-card purchase-notice ${t.canDeliver?'is-deliverable':''}"><header><div class="npc-seal">${esc(t.issuer.slice(0,1))}</div><div><div class="npc-name">${esc(city(t.destination).name)} · ${esc(t.issuer)} · ${esc(t.issuerRole)}</div><h3>${esc(t.title)}</h3></div>${t.canDeliver?'<span class="badge green">可交货</span>':''}</header><p class="notice-story">${esc(t.description)}</p>${terms(t)}<div class="purchase-cargo-progress">随车 ${esc(g.name)}：${owned} / ${t.quantity} ${esc(g.unit)}${g.shelfLifeDays?'<span>食品按购入批次计时</span>':''}</div><footer><p>${esc(t.reason||'货物齐备，可直接交货收款。')}</p><div><button class="btn small" data-action="show-city" data-city="${t.destination}">查看地点</button>${practice?`<button class="btn small" data-wizard-notice="${esc(t.id)}">用这笔练习</button>`:''}<button class="btn small primary" data-action="purchase-deliver" data-notice="${esc(t.id)}" ${t.canDeliver?'':'disabled'}>交货收款</button></div></footer></article>`;}

  function purchaseBoard(cityId){
    if(!game.hasMechanic('purchase'))return '<p class="notice">完成帕兹欧的毛皮交易主线后开放收购公告。先查看当前目标。</p>';
    const offers=game.getPurchaseOffers(cityId),upcoming=game.getUpcomingPurchases(cityId);
    return `<p class="page-intro">${cityId?esc(city(cityId).name)+'的收购公告':'全地图公开的收购公告'}。无需领取，备齐自有货物后，在截止当日或之前抵达收购地，便可直接交货收款。当地集市不交易公告所需货物。</p><div class="notice-count">正在收购 ${offers.length} 则${cityId?'':' · 含尚未开放商路的城镇'}</div>${offers.length?offers.map(offerCard).join(''):'<div class="empty"><h3>今天没有正在收购的公告</h3><p>可以先做其他生意，再按日历安排下一程。</p></div>'}${upcoming.length?`<section class="purchase-upcoming"><h3 class="section-heading">${icon('calendar')}买家的下次收购</h3>${upcoming.map(t=>`<div class="purchase-refresh-row"><div><strong>${esc(t.title)}</strong><small>${esc(city(t.destination).name)} · ${esc(t.issuer)}</small></div><time>${esc(date(t.nextPublishDay))}</time></div>`).join('')}</section>`:''}`;
  }

  function completedNotice(t){return `<article class="notice-card"><header><div class="npc-seal">${esc(t.issuer.slice(0,1))}</div><div><span class="badge green">已成交</span><h3>${esc(t.title)}</h3><p class="npc-name">${esc(city(t.destination).name)} · ${esc(t.issuer)}</p></div></header>${terms(t)}<footer><p>${esc(date(t.settledDay))} 交付 · 已收入 ${num(t.totalPrice)} 特雷尼银币</p></footer></article>`;}

  function consultationFilter(){
    return `<label class="notice-filter" for="notice-city-filter">城镇 <select id="notice-city-filter"><option value="all" ${noticeCityFilter==='all'?'selected':''}>全部城镇</option>${D.cities.map(place=>`<option value="${place.id}" ${noticeCityFilter===place.id?'selected':''}>${esc(place.name)}${game.state.unlockedCities.includes(place.id)?'':' · 商路未开放'}</option>`).join('')}</select></label>`;
  }
  function consultDrawer(){
    const activeEvents=game.getActiveEvents(),future=game.getKnownEvents().filter(event=>!event.isActive),matches=event=>noticeCityFilter==='all'||event.city===noticeCityFilter||event.route&&[event.route.from,event.route.to].includes(noticeCityFilter),history=game.state.purchaseHistory.filter(record=>noticeCityFilter==='all'||record.destination===noticeCityFilter);
    const current=activeEvents.filter(matches),forecasts=future.filter(matches);
    return `<p class="page-intro">各地正在发生的事情、沿途听到的消息与收购生意，都在这里汇拢。</p><div class="drawer-tabs consult-tabs"><button data-action="consult-tab" data-tab="events" class="${consultTab==='events'?'active':''}">事件与消息</button><button data-action="consult-tab" data-tab="offers" class="${consultTab==='offers'?'active':''}">收购公告</button><button data-action="consult-tab" data-tab="history" class="${consultTab==='history'?'active':''}">成交记录</button></div>${consultationFilter()}${consultTab==='events'?`<h3 class="section-heading">${icon('map')}各地近况</h3><p class="page-intro">已经生效的事件公开可查，无需购买消息。</p>${current.length?current.map(eventCard).join(''):'<div class="empty"><h3>此刻商路平静</h3><p>还没有正在生效的事件。</p></div>'}<h3 class="section-heading">${icon('talk')}未至的风声</h3><p class="page-intro">这里只记下已经听到的部分。初闻只听到大意，再向知情人问问，就能逐步补上日期、货物和影响。</p>${forecasts.length?forecasts.map(eventCard).join(''):'<div class="empty"><h3>还没有新的风声</h3><p>酒馆与路上的旅人，也许知道一些事情。</p></div>'}`:consultTab==='offers'?purchaseBoard(noticeCityFilter==='all'?undefined:noticeCityFilter):(history.length?history.slice().reverse().map(completedNotice).join(''):'<div class="empty"><h3>还没有成交记录</h3><p>在收购地点交货后，货款与日期会记在这里。</p></div>')}`;
  }
  function objectiveDrawer(){const story=game.getActiveStory(),can=game.canAdvanceStory();return `<p class="page-intro">只记下旅途中的关键路标。先做眼前的生意，再在熟悉的故事里认出自己所处的位置。</p><section class="objective-card"><div class="story-progress">${D.story.map((_,i)=>`<i class="${i<game.state.storyIndex?'done':''}"></i>`).join('')}</div><div class="eyebrow">${esc(story?.canonPosition||'继续自由行商')}</div><h3>${esc(story?.title||'把故事留在身后，商路仍在前方')}</h3><p>${esc(story?.summary||'本篇路标已完成。所有已开放的城镇都可以往返，新的收购公告在各地等待。')}</p><div class="objective-text">${esc(story?.objective||'规划下一程的货物与运送路线。')}</div>${story?`<p>${esc(can.ok?'准备好了，可以继续眼前的故事。':can.message)}</p><button class="btn primary wide" style="margin-top:19px" data-action="story" ${can.ok?'':'disabled'}>查看这段旅途 ${icon('arrow')}</button>`:''}</section><h3 class="section-heading">${icon('check')}已走过的路标</h3>${game.state.storyIndex?D.story.slice(0,game.state.storyIndex).map(s=>`<article class="story-history">${icon('check')}<div><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><small class="muted">${esc(s.canonPosition||'')}</small></div></article>`).join(''):'<p class="empty">第一段约定，还在御者台上等待。</p>'}`;}


  function eventPlace(event){
    return event.route?`${city(event.route.from).name} — ${city(event.route.to).name}`:`${city(event.city).name}${event.good?' · '+good(event.good).name:''}`;
  }
  function eventEffect(event){
    if(event.detailLevel==='hint')return '';
    if(event.scope==='route')return `生效日行程耗时 ×${event.travelMultiplier}，天气转好后恢复正常。`;
    const goods=event.good?good(event.good).name:event.goods.map(id=>good(id).name).join('、');
    return event.scope==='city'?`${goods}的买卖价格为通常的 ${percent(event.priceMultiplier)}%，当地每天额外消耗各 ${event.dailyConsumption} 件。`:`${goods}库存上限 ×${event.stockMultiplier}，买卖价格为通常的 ${percent(event.priceMultiplier)}%。`;
  }
  function eventCard(event){
    const hint=event.detailLevel==='hint',report=event.reports[event.reports.length-1],source=report?.source,image=D.eventArt[event.isActive?event.type:source];
    return `<button class="event-card-button ${event.isActive?'is-active':'is-upcoming'}" data-action="event-detail" data-event="${esc(event.id)}"><img src="${esc(image)}" alt="${esc(event.isActive?event.name:source==='tavern'?'酒馆场景':'旅途场景')}" loading="lazy"><span class="event-card-copy">${event.isActive?'':`<span class="event-card-source">${icon('talk')}${esc(D.newsSpeakers[source])} <span class="badge">${hint?'初闻':'已问明'}</span></span>`}<span class="event-card-place">${esc(eventPlace(event))}</span><span class="event-card-title">${esc(event.name)}</span><span class="event-card-message">${esc(event.message)}</span>${hint?'':`<time>${esc(date(event.startDay))} — ${esc(date(event.endDay))}</time>`}<span class="event-card-read">${event.isActive?'查看影响':'重读消息'} ${icon('arrow')}</span></span></button>`;
  }
  function eventFacts(event){
    if(event.detailLevel==='hint')return '<p class="event-unconfirmed">目前只听到大意，准确日期与具体影响还没问清。</p>';
    return `<dl class="event-facts"><div><dt>地点</dt><dd>${esc(eventPlace(event))}</dd></div><div><dt>日期</dt><dd><time>${esc(date(event.startDay))} — ${esc(date(event.endDay))}</time></dd></div><div><dt>影响</dt><dd>${esc(eventEffect(event))}</dd></div></dl>`;
  }
  function eventReports(event){
    return event.reports.length?`<section class="event-reports"><h3>沿途听到的话</h3>${event.reports.map(report=>`<article><div><strong>${esc(D.newsSpeakers[report.source])}</strong><time>${esc(game.formatDate(report.day,{short:true}))} · ${report.detail==='hint'?'初闻':'进一步打听'}</time></div><p>${esc(report.text)}</p></article>`).join('')}</section>`:'';
  }
  function showEventDetail(id){
    const event=game.getKnownEvents().find(event=>event.id===id);if(!event)return toast('这件事已经告一段落。');
    const report=event.reports[event.reports.length-1],source=event.isActive?'public':report.source;
    modal(eventDialogContent(event,{source,day:report?.day,message:event.message,headline:event.name,actions:'<button class="btn primary" data-action="close-overlay">收起详情</button>',history:true}),true);
    const dialog=$('.modal');dialog.classList.add('event-dialog',event.isActive?'notice-event':'notice-news');dialog.removeAttribute('aria-label');dialog.setAttribute('aria-labelledby','event-dialog-title');
  }
  function eventDialogContent(event,{source,day,message,headline,actions,history=false}){
    const isEvent=source==='public';
    const opening=isEvent?`<figure class="event-dialog-art"><img src="${esc(D.eventArt[event.type])}" alt="${esc(event.name)}"></figure>`:'';
    const speaker=isEvent?'':`<div class="news-speaker"><img src="${esc(D.eventArt[source])}" alt="${source==='tavern'?'酒馆场景':'旅途场景'}"><div><strong>${esc(D.newsSpeakers[source])}</strong><span>${event.detailLevel==='hint'?'初次听闻':'进一步打听'}</span></div><time>${esc(game.formatDate(day,{short:true}))}</time></div>`;
    const speech=isEvent?`<p class="event-scene-summary">${esc(message)}</p>`:`<blockquote class="event-dialog-speech"><p>${esc(message)}</p></blockquote>`;
    const reports=history?eventReports(isEvent?event:{...event,reports:event.reports.slice(0,-1)}):'';
    return `${opening}<section class="event-dialog-copy"><h2 id="event-dialog-title">${esc(headline)}</h2>${speaker}${speech}${eventFacts(event)}${reports}<div class="modal-actions">${actions}</div></section>`;
  }
  function showEventNotices(onDone){
    if(onDone)noticeContinuation=onDone;
    const notice=game.getEventNotices()[0];
    if(!notice){eventNoticeId=null;const continuation=noticeContinuation;noticeContinuation=null;continuation?.();return;}
    stopTravelAnimation();closeOverlay(true);eventNoticeId=notice.id;
    app.inert=true;drawerRoot.inert=true;
    const isEvent=notice.kind==='started',headline=isEvent?notice.event.name:notice.kind==='detail'?'又问明白了一些':'听到一则消息';
    const label=isEvent?(game.getEventNotices().length>1?'查看下一则':game.getTravelStatus()?'继续旅程':'知道了'):'记下这条消息';
    const actions=`<button class="btn primary" data-action="event-notice-ack" data-notice="${esc(notice.id)}">${label} ${icon('check')}</button>`;
    overlayRoot.innerHTML=`<div class="overlay event-notice-overlay"><section class="modal wide event-dialog event-notice-dialog ${isEvent?'notice-event':'notice-news'}" role="dialog" aria-modal="true" aria-labelledby="event-dialog-title">${eventDialogContent(notice.event,{source:notice.source,day:notice.day,message:notice.message,headline,actions})}</section></div>`;
    persist();setTimeout(()=>$('[data-action="event-notice-ack"]',overlayRoot)?.focus(),0);
  }
  function acknowledgeEventNotice(id){
    const result=game.acknowledgeEventNotice(id);if(!result.ok)return toast(result.message,true);
    eventNoticeId=null;closeOverlay(true);persist();renderWorld();if(drawer)renderDrawer();showEventNotices();
  }
  function tavernDrawer(placeId=game.state.city){
    if(!game.hasMechanic('information'))return '<p class="notice">完成公告教学，回帕兹欧推进主线后开放酒馆消息。旅途中遇到的见闻仍会记入资讯。</p>';
    const place=city(placeId),here=placeId===game.state.city,known=game.getKnownEvents().filter(event=>!event.isActive),used=game.state.lastTavernDay===game.state.day,disabled=used||game.state.money<D.rules.events.tavernCost;
    return `<section class="tavern-room"><div class="tavern-heading">${icon('tavern')}<div><small>火炉边的行商消息</small><h3>${esc(place.name)}的酒馆</h3></div></div><p class="page-intro">先听个大概，再向知情人问清细节。酒馆里的话与路上的见闻，都会记在资讯中。</p>${here?`<div class="information-purchase"><div><strong>请老板聊聊近来的风声</strong><small>每天一次，各城共用 · 每次 ${num(D.rules.events.tavernCost)} 银币，可能没有新消息</small></div><button class="btn primary small" data-action="buy-information" ${disabled?'disabled':''}>${used?'今日已打听':'随意打听'}</button></div>`:`<p class="notice">抵达${esc(place.name)}后，可以进酒馆向当地人买消息。</p>`}</section><h3 class="section-heading">${icon('talk')}已经听到的风声</h3>${known.length?known.map(event=>eventCard(event)+(here&&event.detailLevel==='hint'?`<button class="btn wide" data-action="buy-information" data-event="${esc(event.id)}" ${disabled?'disabled':''}>追问这条初闻 · ${num(D.rules.events.tavernCost)} 银币</button>`:'')).join(''):'<div class="empty"><h3>还没有确切的消息</h3><p>可以问问老板，也可以留心路上的旅人。</p></div>'}<button class="btn wide" data-action="drawer" data-drawer="consult">打开资讯，看看各地近况</button>`;
  }

  function guildDrawer(){
    const enabled=game.hasMechanic('loan');
    return `<p class="page-intro">${esc(game.getCity().name)}的商会账房。货款、旅费和借贷都以特雷尼银币结算。</p><div class="summary-row"><span>手头银币</span><strong>${num(game.state.money)}</strong></div><div class="summary-row"><span>已完成收购</span><span>${game.state.purchaseCompleted} 份</span></div><section class="financial-card"><h3>商会信用</h3><p>信用额度 ${num(D.rules.loan.limit)} 银币，日息 ${percent(D.rules.loan.dailyRate)}%。利息按日累计，满 ¼ 银币后记入欠款；结清时不足 ¼ 的尾息免收。</p><div class="summary-row"><span>当前可结清欠款</span><strong>${num(game.getLoanPayoff())}</strong></div>${game.state.loanDueDay?`<div class="summary-row"><span>约定还款日期</span><span>${esc(date(game.state.loanDueDay))}</span></div>`:''}${enabled?`<button class="btn primary" data-action="loan">申请借款</button><button class="btn" data-action="repay" ${game.state.debt?'':'disabled'}>偿还欠款</button>`:'<p class="notice">完成第一章的营救、脱险与商会结算后开放。</p>'}</section>`;
  }

  function journalDrawer(){const s=game.state;return `<div class="summary-row"><span>净资产估值</span><strong>${num(game.getNetWorth())}</strong></div><div class="summary-row"><span>已成交公告 / 累计交易</span><span>${s.purchaseCompleted} 则 / ${s.tradeCount} 笔</span></div><div class="drawer-tabs" style="margin-top:20px"><button data-action="journal-tab" data-tab="journal" class="${journalTab==='journal'?'active':''}">沿途见闻</button><button data-action="journal-tab" data-tab="goods" class="${journalTab==='goods'?'active':''}">货物图鉴</button><button data-action="journal-tab" data-tab="gallery" class="${journalTab==='gallery'?'active':''}">旅途画页</button></div>${journalTab==='journal'?s.journal.map(e=>`<article class="journal-entry"><div class="journal-day">${esc(game.formatDate(e.day,{short:true}))}<small>行商历 ${game.getCalendar(e.day).year} 年</small></div><p>${esc(moneyText(e.text))}</p></article>`).join(''):journalTab==='goods'?D.goods.map(g=>`<article class="goods-entry"><span class="good-icon">${goodIcon(g)}</span><div><h3>${esc(g.name)}</h3><p>${esc(g.description)}</p><p>${g.cargoW} × ${g.cargoH} 格 · 每栈最多 ${g.stackLimit} ${esc(g.unit)} · 单${esc(g.unit)}重 ${g.weight} · ${g.shelfLifeDays?'保鲜 '+g.shelfLifeDays+' 天':'耐储存'}</p><p class="goods-canon-note">${esc(g.catalog?.canonContext||'')}</p><p>${esc(g.catalog?.origin||'')}</p></div></article>`).join(''):journeyGallery()}`;}

  function journeyGallery(){return `<p class="page-intro">把同行时的片刻夹进手账，留待歇脚时慢慢翻看。</p><h3 class="section-heading">${icon('book')}旅途画页</h3><div class="novel-gallery">${novelArt.map(a=>`<figure><a href="assets/runtime/novel/${a.file}" target="_blank" rel="noopener" aria-label="打开${esc(a.title)}画页"><img src="assets/runtime/novel/${a.file}" alt="${esc(a.title)}" loading="lazy"></a><figcaption><strong>${esc(a.title)}</strong><p>${esc(a.note)}</p></figcaption></figure>`).join('')}</div><button class="btn small" data-action="atlas">${icon('map')}翻看商路舆图</button>`;}

  function saveDrawer(){const s=game.state;return `<p class="page-intro">自动存档留在这台浏览器。导出一份文件，就能把沿途的收获与约定一起带走。</p><div class="summary-row"><span>当前旅程</span><span>${esc(date(s.day))} · ${esc(game.getCity().name)}</span></div><div class="summary-row"><span>当前路标</span><span>${s.storyIndex} / ${D.story.length} · ${esc(game.getActiveStory()?.title||'自由行商')}</span></div><div class="summary-row"><span>已成交收购公告</span><span>${s.purchaseCompleted} 则</span></div><div class="save-actions"><button class="btn primary" data-action="export">${icon('download')}导出存档文件 <small>.json</small></button><button class="btn" data-action="import">${icon('upload')}读取存档文件</button><button class="btn" data-action="checkpoint" ${readCheckpoint()?'':'disabled'}>${icon('restore')}查看最近路标的回退记录</button></div><p class="notice">读取或回退将替换当前旅程，请先导出你想保留的进展。${autosaveOK?'':' 当前浏览器不允许自动保存，请使用文件存档。'}</p><div class="action-row"><button class="btn small" data-action="help">${icon('info')}行商指南</button><button class="btn small" data-action="title">${icon('home')}返回标题</button></div>`;}
  function companionDrawer(){const r=game.state.relationship;return `<div class="companion-large"><img src="assets/runtime/official/holo.webp" alt="赫萝"><div><div class="eyebrow">ヨイツの賢狼</div><h3>赫萝</h3><p>“地图再大，也得先走好眼前这一程。”</p><p>同行关系 · ${r>=D.rules.relationship.intimacyThreshold?'心意相通':r>=D.rules.relationship.trustThreshold?'彼此信赖':'初识的旅伴'}<br><span class="positive">${'◆'.repeat(Math.ceil(r/D.rules.relationship.max*5))}${'◇'.repeat(Math.max(0,5-Math.ceil(r/D.rules.relationship.max*5)))}</span></p></div></div><h3 class="section-heading">${icon('talk')}御者台上的闲谈</h3><div class="save-actions"><button class="btn" data-action="talk-market">聊聊这一带的生意</button><button class="btn" data-action="share-apple" ${game.state.inventory.apple?'':'disabled'}>分一篮苹果给赫萝 <small>自有 ${game.state.inventory.apple} 篮</small></button><button class="btn" data-action="rest">${icon('moon')}在旅店休息一天 <small>${num(D.rules.rest.dailyCost)} 银币</small></button></div><p class="page-intro">旅行与共同经历会自然加深关系，不需要每天送礼。苹果也有保鲜期限，分食前先想想接下来的交货安排。</p>`;}
  function openTrade(id,mode){const g=good(id),q=game.quote(id);if(!q)return;let max=q.owned;if(mode==='buy'){max=Math.max(0,Math.min(q.stock,Math.floor((game.state.money+1e-8)/q.buy),Math.floor((game.state.wagon.maxWeight-game.getLoad()+1e-8)/g.weight)));let lo=0,hi=max;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(game.canFitCargo(id,mid).ok)lo=mid;else hi=mid-1;}max=lo;}
    modal(`<div class="eyebrow">A MERCHANT'S DEAL</div><h2>${mode==='buy'?'购入':'售出'}货物</h2><div class="trade-good"><span class="good-icon">${goodIcon(g)}</span><div><h3>${esc(g.name)}</h3><p>每${esc(g.unit)} ${num(q[mode])} 银币 · ${g.cargoW} × ${g.cargoH} 格 / 栈 · 每栈最多 ${g.stackLimit} ${esc(g.unit)}${g.shelfLifeDays?(mode==='buy'?`<br><strong>今日购入，${esc(date(game.state.day+g.shelfLifeDays))} 开始腐坏</strong>`:'<br><strong>按较早到期的购入批次优先售出</strong>'):''}</p></div></div><div class="trade-guidance"></div><label class="field-label" for="trade-qty">数量 · 最多 ${max} ${esc(g.unit)}</label><div class="quantity-control"><button id="qty-minus" aria-label="减少数量">−</button><input id="trade-qty" type="number" min="1" step="1" max="${Math.max(1,max)}" value="${max?1:0}"><button id="qty-plus" aria-label="增加数量">+</button><button id="qty-max" class="max">最大</button></div><div class="summary-row"><span>交易后总重量</span><span id="trade-weight"></span></div><div class="summary-row"><span>交易后银币</span><span id="trade-balance"></span></div><div class="summary-row total"><span>本次${mode==='buy'?'支出':'收入'}</span><strong id="trade-total"></strong></div><p class="form-error" id="trade-error"></p><div class="modal-actions"><button class="btn" data-action="close-overlay">再想一想</button><button class="btn primary" id="trade-confirm">确认${mode==='buy'?'购入':'售出'}</button></div>`);
    const input=$('#trade-qty'),update=()=>{const n=Number(input.value),valid=Number.isInteger(n)&&n>0&&n<=max;$('#trade-total').textContent=num(n*q[mode])+' 银币';$('#trade-balance').textContent=num(game.state.money+(mode==='buy'?-1:1)*n*q[mode]);$('#trade-weight').textContent=(Math.round((game.getLoad()+(mode==='buy'?1:-1)*n*g.weight)*100)/100)+' / '+game.state.wagon.maxWeight;$('#trade-confirm').disabled=!valid;$('#trade-error').textContent=!max?(mode==='buy'?'银币、重量或可摆放的空位不足。可以先整理货舱。':'没有可出售的自有货物。'):valid?'':'请输入可交易范围内的整数。';};
    input.oninput=update;$('#qty-minus').onclick=()=>{input.value=Math.max(1,Number(input.value)-1);update();};$('#qty-plus').onclick=()=>{input.value=Math.min(max,Number(input.value)+1);update();};$('#qty-max').onclick=()=>{input.value=max;update();};$('#trade-confirm').onclick=()=>commit(game[mode](id,Number(input.value)));update();
  }




  function loan(repay=false){const max=repay?Math.min(game.state.money,game.getLoanPayoff()):Math.max(0,game.getLoanSummary().creditAvailable),title=repay?'偿还商会借款':'商会周转借款';modal(`<div class="eyebrow">CREDIT & TRUST</div><h2>${title}</h2><p class="modal-description">${repay?'不足 ¼ 银币的累计尾息在结清时免收。':`日息 ${percent(D.rules.loan.dailyRate)}%，累计满 ¼ 银币才计入欠款，可随时提前还款。`}</p><label class="field-label" for="loan-amount">金额 · 最多 ${num(max)} 银币</label><input class="field-input" id="loan-amount" type="text" inputmode="decimal" value="${num(repay?max:Math.min(50,max))}"><p class="form-error" id="loan-error"></p><div class="modal-actions"><button class="btn" data-action="close-overlay">取消</button><button class="btn primary" id="loan-confirm">确认${repay?'偿还':'借款'}</button></div>`);$('#loan-confirm').onclick=()=>{const result=game[repay?'repayLoan':'takeLoan'](parseCoin($('#loan-amount').value));if(!result.ok)$('#loan-error').textContent=result.message;else commit(result);};}

  function exportSave(previous=false){let raw=previous?(readSave()||game.exportSave()):game.exportSave(),day=game.state.day;try{day=JSON.parse(raw).state.day;}catch{}const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`狼与香辛料-${game.formatDate(day)}-v${D.releaseVersion}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('旅程已写入存档文件。');}
  function checkpoint(){const raw=readCheckpoint();if(!raw)return toast('还没有路标记录。',true);const copy=new Game(D),check=copy.importSave(raw);if(!check.ok)return toast(check.message,true);const target=copy.state;modal(`<div class="eyebrow">RETURN TO A WAYPOINT</div><h2>回到此前的路标</h2><p class="modal-description">将用以下记录替换当前旅程。记录之后的交易、公告成交、旅行和货舱摆放都会回退。</p><div class="summary-row"><span>回退目标</span><span>${esc(date(target.day))} · ${esc(city(target.city).name)}</span></div><div class="summary-row"><span>目标主线</span><span>${target.storyIndex} / ${D.story.length} · ${esc(D.story[target.storyIndex]?.title||'自由行商')}</span></div><div class="summary-row"><span>银币变化</span><span>${num(game.state.money)} → ${num(target.money)}</span></div><div class="summary-row"><span>已成交收购公告</span><span>${game.state.purchaseCompleted} → ${target.purchaseCompleted}</span></div><div class="modal-actions"><button class="btn" data-action="export">先导出当前旅程</button><button class="btn primary" id="restore-confirm">确认回到此路标</button></div>`);$('#restore-confirm').onclick=()=>{const result=game.importSave(raw);if(!result.ok)return toast(result.message,true);stopTravelAnimation();travelling=false;noticeContinuation=null;closeOverlay();closeDrawer();camera=null;persist();renderWorld();if(game.getTravelStatus())resumeTravel();else showEventNotices();toast('已回到所选路标。');};}
  function advanceStory(){const story=game.getActiveStory(),check=game.canAdvanceStory();if(!story||!check.ok)return toast(check.message,true);persist(true);closeDrawer();playScene(story.scene,story.title,()=>{const result=game.advanceStory();commit(result);if(result.ok&&result.events?.length)toast(result.events.join(' · '));});}
  function playScene(pages,titleText,onFinish){
    closeOverlay();
    if(!pages?.length)return onFinish?.();
    overlayCleanup=SWStoryUI.play({pages,title:titleText,background:D.storyBackground,onFinish,host:overlayRoot,app,drawers:drawerRoot,esc,icon,close:closeOverlay});
  }

  function stopTravelAnimation(){
    clearTimeout(travelTimer);cancelAnimationFrame(travelFrame);travelTimer=null;travelFrame=null;finishTravel=null;
  }
  function startTravel(id){
    if(travelling||eventNoticeId)return;
    const result=game.startTravel(id);
    if(!result.ok)return toast(result.message,true);
    persist();resumeTravel();
  }
  function resumeTravel(){
    const status=game.getTravelStatus();if(!status)return;
    stopTravelAnimation();closeDrawer();closeOverlay();hideTooltip();travelling=true;
    drawTravel(status,status.progress,[]);
    showEventNotices(()=>scheduleTravelStep(650));
  }
  function scheduleTravelStep(delay=1100){
    if(!active)return;
    const status=game.getTravelStatus();if(!status)return completeTravel();
    travelling=true;finishTravel=skipTravel;drawTravel(status,status.progress,[]);
    travelTimer=setTimeout(stepTravel,delay);
  }
  function drawTravel(status,fromProgress,messages){
    cancelAnimationFrame(travelFrame);travelFrame=null;
    renderWorld();
    const layer=$('#travel-layer'),rain=game.getKnownEvents().find(event=>event.scope==='route'&&event.startDay<=game.state.day&&event.endDay>=game.state.day&&event.route&&[event.route.from,event.route.to].includes(status.from)&&[event.route.from,event.route.to].includes(status.to));
    layer.innerHTML=`<section class="travel-bar" aria-live="polite"><div class="travel-heading"><h2>${esc(city(status.from).name)} → ${esc(city(status.to).name)}</h2><button class="text-btn" data-action="travel-skip">略过行进</button></div><p id="travel-days">${esc(date(game.state.day))} · 已行 ${status.elapsedDays} 天${rain?' · 暴雨中缓行':' · 车轮继续向前'}</p><div class="track"><i id="travel-progress"></i></div><p class="travel-outlook">标准路程 ${status.totalDays} 天 · ${status.progress>=status.totalDays?'已经抵达':`按已知路况还需约 ${status.remainingDays} 天`} · 天气变化可能延误</p>${messages.length?`<ul class="travel-news">${messages.map(message=>`<li>${esc(message)}</li>`).join('')}</ul>`:''}<div class="travel-save-actions"><button class="text-btn" data-action="export">导出途中存档</button><button class="text-btn" data-action="travel-title">记下旅程并返回标题</button></div></section>`;
    let path=$(`#route-${status.from}-${status.to}`),reverse=false;
    if(!path){path=$(`#route-${status.to}-${status.from}`);reverse=true;}
    path?.classList.add('travelling');
    const wagon=$('#map-wagon'),location=$('.location-anchor'),tag=$('#wagon-place-label');
    wagon?.setAttribute('aria-label','马车正在前往'+city(status.to).name);
    if(tag)tag.textContent='前往'+city(status.to).name;
    if(location){location.querySelector('span').textContent='前往 '+city(status.to).name;location.querySelector('small').textContent='行进中';location.disabled=true;}
    const a=MAP().point(status.from),b=MAP().point(status.to),length=path?.getTotalLength(),begin=performance.now(),duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:700;
    function position(fraction){
      const point=path?path.getPointAtLength(length*(reverse?1-fraction:fraction)):{x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction};
      wagon?.setAttribute('transform',`translate(${point.x} ${point.y})`);
      const bar=$('#travel-progress');if(bar)bar.style.width=(fraction*100)+'%';
    }
    function animate(now){
      const t=duration?Math.min(1,(now-begin)/duration):1,smooth=t*t*(3-2*t),progress=fromProgress+(status.progress-fromProgress)*smooth;
      position(Math.min(1,progress/status.totalDays));
      if(t<1)travelFrame=requestAnimationFrame(animate);
    }
    animate(begin);
  }
  function travelDayMessages(result){
    const noticeMessages=new Set(game.getEventNotices().map(notice=>notice.message));
    return (result.events||[]).filter(message=>!noticeMessages.has(message));
  }
  function stepTravel(){
    travelTimer=null;
    if(game.getEventNotices().length)return showEventNotices(()=>scheduleTravelStep(650));
    const before=game.getTravelStatus();if(!before)return completeTravel();
    const result=game.advanceTravelDay();
    if(!result.ok){stopTravelAnimation();travelling=false;renderWorld();return toast(result.message,true);}
    persist();
    const after=game.getTravelStatus(),shown=after||{...before,progress:before.totalDays,elapsedDays:before.elapsedDays+1,remainingDays:0},pending=game.getEventNotices().length>0,messages=travelDayMessages(result);
    drawTravel(shown,pending?shown.progress:before.progress,messages);
    if(pending)return showEventNotices(()=>after?scheduleTravelStep(650):completeTravel());
    travelTimer=setTimeout(after?stepTravel:completeTravel,messages.length?1900:1100);
  }
  function skipTravel(){
    if(eventNoticeId)return;
    stopTravelAnimation();
    if(game.getEventNotices().length)return showEventNotices(skipTravel);
    while(game.getTravelStatus()){
      const before=game.getTravelStatus(),result=game.advanceTravelDay();
      if(!result.ok){travelling=false;renderWorld();return toast(result.message,true);}
      persist();
      const after=game.getTravelStatus();
      if(game.getEventNotices().length){
        const shown=after||{...before,progress:before.totalDays,elapsedDays:before.elapsedDays+1,remainingDays:0};
        drawTravel(shown,shown.progress,travelDayMessages(result));
        return showEventNotices(()=>after?skipTravel():completeTravel());
      }
      for(const message of travelDayMessages(result))toast(message,true);
    }
    completeTravel();
  }
  function completeTravel(){
    if(game.getEventNotices().length)return showEventNotices(completeTravel);
    stopTravelAnimation();travelling=false;persist();renderWorld();
    toast(`抵达${game.getCity().name}，今天是${date(game.state.day)}。`);
  }
  function help(){
    modal(`<div class="eyebrow">A GUIDE FOR THE ROAD</div><h2>看公告，算好下一程</h2><h3 class="section-heading">全图收购公告</h3><p class="modal-description">公告对全地图公开，无需领取。自行采购货物，在截止当日或之前抵达收购地，直接交货收款。当地普通集市不交易公告指定商品；尚未开放商路的城镇也可提前查看公告，待商路通行后才能前往。</p><h3 class="section-heading">下一期收购</h3><p class="modal-description">截止次日公告撤下。交付或自然截止后，买家会间隔几天再发布新一期，公告栏和日历显示下次发布日期。每期公告只能成交一次。</p><h3 class="section-heading">商品图鉴</h3><p class="modal-description">在市场悬浮商品名称或用 Tab 聚焦，可查看占位、重量、保鲜期限、货物见闻与供货市集；点击商品可固定图鉴，触屏同样适用。按 Esc 或点击外部收起。</p><h3 class="section-heading">行商日历与食品</h3><p class="modal-description">点顶部日期查看月份。翻日历、看图、理货和读对白不耗时；旅行、休息和帮工才推进时间。食品按购入批次计时，腐坏当天自动移出货舱，补买新货不能刷新旧货。</p><h3 class="section-heading">酒馆与沿途消息</h3><p class="modal-description">每座城镇都有酒馆，抵达后可花银币打听新消息。暴雨提前 ${D.rules.events.rainForecastDays} 天，丰收提前其持续天数，节庆提前其持续天数加 ${D.rules.events.festivalForecastExtraDays} 天可获悉；路上每天也可能遇见旅人免费提供消息。已经问明的日期会记入日历，初闻与详细消息都收在资讯中。每天只能在酒馆打听一次，各城共用。可随意打听新消息，或选择初闻追问详情；无论有无收获都付酒钱。旅人消息免费且不占次数。</p><h3 class="section-heading">资讯与商路事件</h3><p class="modal-description">资讯统一收录事件、消息、收购公告和成交记录。各地正在生效的事件直接公开，未来的消息要向人打听。初闻未必知道日期和货物，再问会逐步补全。消息传来或事件开始时须按“知道了”继续，旅途和略过行进都会停下来等候。暴雨影响道路，丰收改变货源，节庆则带动当地需求。</p><h3 class="section-heading">银币与货舱</h3><p class="modal-description">全部交易使用特雷尼银币，金额保留 ¼、½、¾ 刻度。马车同时受空间和重量限制，可拖动摆放、旋转或自动整理。绿色定位圈与标签指出你的马车所在。日期打开日历，银币打开手账；资讯、马车与存档集中在旅程导航，手机上位于底部。地图下方的市场、商会与酒馆属于马车停靠的城镇。</p><div class="modal-actions"><button class="btn" id="rescue-btn">缺少本钱时帮工一天</button><button class="btn primary" data-action="close-overlay">记下了</button></div>`,true);
    $('#rescue-btn').onclick=()=>commit(game.rescue());
  }

  function atlas(){modal(`<div class="eyebrow">ROADS TO THE NORTH</div><h2>商路舆图</h2><p class="modal-description">沿着城镇、河流与海岸寻找下一站。南方的集市渐渐远去，北方的道路仍伸向远处。</p><img src="assets/runtime/official/world-map.webp" alt="北行旅途的城镇与河流舆图" style="display:block;max-width:100%;max-height:63dvh;margin:16px auto;object-fit:contain">`,true);}
  function talkMarket(){const place=game.getCity(),routes=game.getAvailableRoutes().filter(r=>r.unlocked),options=[];for(const g of D.goods){const local=game.quote(g.id);if(!local)continue;for(const r of routes){const q=game.quote(g.id,r.city);if(q)options.push({g,r,q,gain:q.sell-local.buy,local});}}options.sort((a,b)=>b.gain-a.gain);const best=options[0];closeDrawer();playScene([{speaker:'赫萝',text:best?`这里的${best.g.name}每${best.g.unit}要 ${num(best.local.buy)} 银币，${city(best.r.city).name}现在收 ${num(best.q.sell)}。汝还得算上 ${num(best.r.cost)} 银币的旅费${best.g.shelfLifeDays?'，以及购入后 '+best.g.shelfLifeDays+' 天的保鲜期':''}。别只盯着货款。`:'本城有的货，别处的集市未必肯收。汝可以看看收购公告，稀缺的货色往往值个好价。',scene:'dawn',image:novelImage('banter'),imageCaption:'北行路上的闲谈'}],'御者台上的商谈',()=>{});}

  function sound(){if(soundOn){audio?.close();audio=null;soundOn=false;renderWorld();return;}try{audio=new(window.AudioContext||window.webkitAudioContext)();const gain=audio.createGain();gain.gain.value=.018;gain.connect(audio.destination);[130.81,196,261.63].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;g.gain.value=i?.15:.4;o.connect(g);g.connect(gain);o.start();});soundOn=true;renderWorld();toast('环境音已开启。');}catch{toast('这个浏览器暂时无法开启环境音。',true);}}
  document.addEventListener('click',e=>{if(!e.target.closest('.road-hover,#map-tooltip'))hideTooltip();const town=e.target.closest('.town-node');if(town&&!travelling){openDrawer('city',town.dataset.city);return;}const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const action=b.dataset.action;if(eventNoticeId&&action!=='event-notice-ack')return;if(travelling&&!['travel-skip','export','travel-title','event-notice-ack'].includes(action))return;
    switch(action){
      case 'close-route':hideTooltip();break;
      case 'new':launchNew();break;case 'start-new':startNew();break;case 'continue':resume();break;
      case 'drawer':if(b.dataset.drawer==='consult'){noticeCityFilter='all';consultTab='events';}openDrawer(b.dataset.drawer);break;case 'close-drawer':closeDrawer();break;case 'close-overlay':closeOverlay();break;
      case 'calendar-month':calendarState.offset+=Number(b.dataset.step);calendarState.selectedDay=null;renderDrawer();break;case 'calendar-today':calendarState={offset:0,selectedDay:game.state.day};renderDrawer();break;case 'calendar-select':{const day=Number(b.dataset.day),selected=game.getCalendar(day),now=game.getCalendar();calendarState={selectedDay:day,offset:(selected.year-now.year)*D.calendar.monthsPerYear+selected.month-now.month};renderDrawer();break;}
      case 'city-tab':drawer.tab=b.dataset.tab;renderDrawer();break;case 'consult-tab':consultTab=b.dataset.tab;renderDrawer();break;case 'event-detail':showEventDetail(b.dataset.event);break;case 'journal-tab':journalTab=b.dataset.tab;renderDrawer();break;
      case 'trade':openTrade(b.dataset.good,b.dataset.mode);break;case 'travel':startTravel(b.dataset.city);break;case 'travel-skip':finishTravel?.();break;
      case 'buy-information':commit(game.buyInformation(b.dataset.event||null));break;case 'event-notice-ack':acknowledgeEventNotice(b.dataset.notice);break;
      case 'purchase-deliver':commit(game.deliverPurchase(b.dataset.notice));break;
      case 'show-city':openDrawer('city',b.dataset.city);break;
      case 'story':advanceStory();break;case 'loan':loan();break;case 'repay':loan(true);break;
      case 'export':exportSave();break;case 'export-previous':exportSave(!active);break;case 'import':$('#save-file').click();break;case 'checkpoint':checkpoint();break;
      case 'share-apple':commit(game.shareApple());break;case 'talk-market':talkMarket();break;case 'rest':{const result=game.rest();if(commit(result))for(const message of travelDayMessages(result))toast(message,true);break;}
      case 'help':help();break;case 'atlas':atlas();break;case 'sound':sound();if(drawer?.type==='more')renderDrawer();break;
      case 'zoom':zoom(Number(b.dataset.factor));break;case 'locate-wagon':locateWagon();break;case 'map-full':camera={...MAP().fullView};updateCamera();break;
      case 'travel-title':persist();stopTravelAnimation();travelling=false;active=false;title();break;
      case 'title':persist();closeOverlay();closeDrawer();active=false;title();break;
    }
  });
  document.addEventListener('change',e=>{if(e.target.id==='notice-city-filter'){noticeCityFilter=e.target.value;renderDrawer();}});
  document.addEventListener('keydown',e=>{if(eventNoticeId&&e.key==='Escape'){e.preventDefault();return;}if(e.key==='Escape'&&catalogUI.isVisible()){catalogUI.hide(true);e.preventDefault();return;}if(e.key==='Escape'&&!$('.vn-scene')){if($('.overlay'))closeOverlay();else closeDrawer();}if((e.key==='Enter'||e.key===' ')&&e.target.matches('.town-node')){e.preventDefault();openDrawer('city',e.target.dataset.city);}const scope=$('.modal')||$('.vn-log:not([hidden])')||$('.vn-scene');if(e.key==='Tab'&&scope){const items=[...scope.querySelectorAll('button:not(:disabled),input,select,a[href]')].filter(el=>!el.closest('[hidden],[inert]')&&el.getClientRects().length);if(!items.length)return;if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus();}}});
  $('#save-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2_000_000)throw Error('请选择本游戏导出的存档文件。');const result=game.importSave(await file.text());if(!result.ok)throw Error(result.message);stopTravelAnimation();travelling=false;noticeContinuation=null;active=true;closeOverlay();closeDrawer();camera=null;persist(true);renderWorld();toast('存档已恢复，旅途与已知消息都已记下。');if(game.getTravelStatus())resumeTravel(true);else if(game.state.storyIndex===0)playScene(D.prologue,'麦穗中的约定',()=>{commit(game.advanceStory());persist(true);});else showEventNotices();}catch(error){toast(error.message||'无法读取这个存档。',true);}e.target.value='';});
  let compactMap=innerWidth<=700;
  window.addEventListener('resize',()=>{if(active){const compact=innerWidth<=700;if(compact||compact!==compactMap){camera=journeyView();updateCamera();}compactMap=compact;updateMarkerScale();hideTooltip();}});
  Promise.resolve(globalThis.SWAssetsReady).then(title);
})();
