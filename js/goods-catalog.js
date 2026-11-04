/* Market field notes. Hover or focus to read; click to pin the card. */
(() => {
  'use strict';
  function install({getGame,data,esc,icon,goodIcon}) {
    const panel=document.getElementById('goods-tooltip');
    let anchor=null,pinned=false,suppressFocus=false;
    function hide(restoreFocus=false) {
      const previous=anchor;
      if(previous)previous.setAttribute('aria-expanded','false');
      panel.hidden=true;panel.classList.remove('is-pinned');panel.setAttribute('role','tooltip');
      anchor=null;pinned=false;
      if(restoreFocus&&previous?.isConnected){suppressFocus=true;previous.focus({preventScroll:true});suppressFocus=false;}
    }
    function show(node,pin=false) {
      if(pinned&&anchor===node&&!pin)return;
      const game=getGame(),g=data.goods.find(g=>g.id===node.dataset.catalogGood);
      if(!g)return;
      if(anchor&&anchor!==node)anchor.setAttribute('aria-expanded','false');
      const catalog=g.catalog||{},suppliers=data.cities.filter(c=>c.market?.[g.id]);
      const place=data.cities.find(c=>c.id===node.dataset.catalogCity)||game.getCity();
      const q=game.quote(g.id,place.id);
      anchor=node;pinned=pin;
      panel.innerHTML=`<button type="button" class="goods-catalog-close" data-catalog-close aria-label="关闭商品图鉴">${icon('close')}</button><div class="catalog-eyebrow">行商人的货物图鉴</div><header class="catalog-heading"><span class="good-icon">${goodIcon(g)}</span><div><h3>${esc(g.name)}</h3><span>${g.shelfLifeDays?'保鲜货物':'耐储存货物'} · 按${esc(g.unit)}交易</span></div></header><p class="catalog-description">${esc(g.description)}</p><dl class="catalog-numbers"><div><dt>单${esc(g.unit)}重量</dt><dd>${g.weight}</dd></div><div><dt>每栈占位</dt><dd>${g.cargoW} × ${g.cargoH} 格</dd></div><div><dt>每栈上限</dt><dd>${g.stackLimit} ${esc(g.unit)}</dd></div><div><dt>保鲜期限</dt><dd>${g.shelfLifeDays?'购入后 '+g.shelfLifeDays+' 天':'本版不计短期腐坏'}</dd></div></dl><section><h4>原作中的货物</h4><p>${esc(catalog.canonContext||g.sourceNote||'沿商路流通的货物。')}</p>${catalog.origin?`<p class="catalog-origin">${esc(catalog.origin)}</p>`:''}</section><section><h4>行商笔记</h4><p>${esc(catalog.merchantNote||'比较各地报价，也要算上旅费与马车的装载空间。')}</p><p class="catalog-markets"><span>本版经营市集</span>${suppliers.map(c=>esc(c.name)).join('、')}</p>${q?`<p class="catalog-market-quote">${esc(place.name)} · 买 ${esc(SWMoney.format(q.buy))} / 卖 ${esc(SWMoney.format(q.sell))} 银币</p>`:''}</section>${catalog.sourceRef?`<footer class="catalog-source"><strong>${esc(catalog.sourceRef)}</strong>${catalog.sourceNote?`<p>${esc(catalog.sourceNote)}</p>`:''}</footer>`:''}<div class="catalog-hint">${pinned?'已固定 · 点外部或 Esc 收起':'点击商品可固定图鉴 · Esc 收起'}</div>`;
      panel.hidden=false;panel.classList.toggle('is-pinned',pin);
      panel.setAttribute('role',pin?'dialog':'tooltip');panel.setAttribute('aria-label',g.name+'商品图鉴');node.setAttribute('aria-expanded','true');
      panel.style.maxHeight='';
      const r=node.getBoundingClientRect(),width=panel.offsetWidth;
      let left=r.left-width-14;
      let top;
      if(left<12&&r.right+14+width>innerWidth-12){
        // Keep the product reachable when there is no room beside it.
        left=Math.max(12,Math.min(innerWidth-width-12,r.left));
        const above=Math.max(0,r.top-24),below=Math.max(0,innerHeight-r.bottom-24),under=below>=above;
        panel.style.maxHeight=Math.max(70,Math.min(panel.offsetHeight,under?below:above))+'px';
        top=under?r.bottom+12:r.top-panel.offsetHeight-12;
      }else{
        if(left<12)left=r.right+14;
        const height=panel.offsetHeight;
        top=Math.max(12,Math.min(innerHeight-height-12,r.top-Math.min(80,height/4)));
      }
      panel.style.left=left+'px';panel.style.top=top+'px';
    }
    document.addEventListener('pointerover',e=>{
      if(e.pointerType==='touch'||pinned)return;
      const node=e.target.closest('[data-catalog-good]');
      if(node&&!node.contains(e.relatedTarget))show(node);
    });
    document.addEventListener('pointerout',e=>{
      const node=e.target.closest('[data-catalog-good]');
      if(node&&!node.contains(e.relatedTarget)&&!pinned&&document.activeElement!==node)hide();
    });
    document.addEventListener('focusin',e=>{
      if(suppressFocus)return;
      const node=e.target.closest('[data-catalog-good]');
      if(node)show(node);else if(!panel.contains(e.target))hide();
    });
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-catalog-close]'))return hide(true);
      const node=e.target.closest('[data-catalog-good]');
      if(node){if(pinned&&anchor===node)hide();else show(node,true);}
      else if(!panel.contains(e.target))hide();
    });
    document.addEventListener('scroll',e=>{if(!panel.contains(e.target))hide();},true);
    return Object.freeze({hide,isVisible:()=>!panel.hidden});
  }
  globalThis.SWGoodsCatalog=Object.freeze({install});
})();
