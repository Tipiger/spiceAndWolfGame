/* The wagon's spatial inventory: browser-only presentation over SWEngine. */
(function (root) {
  'use strict';

  const selections = new WeakMap();
  const mounts = new WeakMap();
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const number = value => Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits:2 });
  const integer = (value, fallback = 1) => Number.isInteger(value) && value > 0 ? value : fallback;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const cargoIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="m3 7 9-4 9 4v13l-9 3-9-3V7Zm0 0 9 4 9-4M12 11v12M7 5l10 4v5"/></svg>';
  const rotateIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 10a8 8 0 1 1 2 9M4 4v6h6"/><path d="M9 11h7v7H9z"/></svg>';
  const arrangeIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/></svg>';

  function dimensions(stack, good) {
    const w = good.cargoW, h = good.cargoH;
    return stack.rotated ? { w:h, h:w } : { w, h };
  }
  function dataFor(game) {
    const goods = game.data.goods;
    const byId = Object.fromEntries(goods.map(g => [g.id,g]));
    const layout = game.getCargoLayout();
    return { ...layout, formatDate:day=>game.formatDate(day,{short:true}),goods,byId,cargo:layout.stacks,day:game.state.day };
  }
  function freshness(stack, data) {
    if (!Number.isInteger(stack.expiresDay)) return { perishable:false, className:'', label:'耐储存，本版不计短期腐坏' };
    const remainingDays = Math.max(0, Number.isFinite(stack.remainingDays) ? stack.remainingDays : stack.expiresDay-data.day);
    const className = remainingDays<=1 ? ' cargo-expiring' : remainingDays<=2 ? ' cargo-expiring-soon' : '';
    return { perishable:true,remainingDays,className,label:`${data.formatDate(stack.expiresDay)}开始腐坏，还剩${remainingDays}天` };
  }
  function getSelected(game, data) {
    const id = selections.get(game);
    const stack = data.cargo.find(s=>s.id===id);
    if (!stack) selections.delete(game);
    return stack || null;
  }
  function selectedHTML(game, stack, data, helpers) {
    const esc = helpers.esc || escapeHTML;
    if (!stack) return '<div class="cargo-selected-empty"><span class="cargo-instruction-marker">↖</span><div><strong>点选货栈，查看购入批次与保鲜期</strong><p>拖动或点选空格移动；方向键微调，R 键旋转。不同腐坏日的同类货物分别占栈。</p></div></div>';
    const good = data.byId[stack.good], d = dimensions(stack,good), fresh = freshness(stack,data);
    const purchased = Number.isInteger(stack.purchasedDay) ? data.formatDate(stack.purchasedDay) : '未记录';
    const freshnessHTML = fresh.perishable
      ? `<div class="cargo-freshness-line${fresh.className}"><span>购入 <b>${esc(purchased)}</b></span><span>腐坏 <b>${esc(data.formatDate(stack.expiresDay))}</b></span><strong>还剩 ${esc(fresh.remainingDays)} 天</strong></div><p class="cargo-preserve-note">${esc(data.formatDate(stack.expiresDay))}开始自动腐坏并移除。移动、旋转与整理不刷新保鲜期。</p>`
      : `<div class="cargo-freshness-line"><span>购入 <b>${esc(purchased)}</b></span><strong class="cargo-storage-label">耐储存</strong><span>本版不计短期腐坏</span></div>`;
    return `<div class="cargo-selection-title"><span class="cargo-detail-symbol">${helpers.goodIcon ? helpers.goodIcon(good) : cargoIcon}</span><div><strong>${esc(good?.name || stack.good)}</strong><p>自有货物 · 可出售或用于收购公告交货</p></div><span class="cargo-selected-quantity">${esc(stack.quantity)}<small> / ${integer(good?.stackLimit)} ${esc(good?.unit || '份')}</small></span></div><div class="cargo-detail-stats"><span>占位 <b>${d.w} × ${d.h}</b></span><span>单件重量 <b>${number(good?.weight)}</b></span><span>整栈重量 <b>${number((good?.weight || 0)*stack.quantity)}</b></span><span>格位 <b>${stack.x+1}, ${stack.y+1}</b></span></div>${freshnessHTML}`;
  }

  function render(game, helpers = {}) {
    const esc = helpers.esc || escapeHTML;
    const data = dataFor(game), selected = getSelected(game,data);
    const weightRatio = clamp(data.weight/data.maxWeight*100,0,100), spaceRatio = clamp(data.usedCells/data.totalCells*100,0,100);
    const cells = [];
    const occupied = new Set();
    data.cargo.forEach(stack=>{const d=dimensions(stack,data.byId[stack.good]);for(let y=stack.y;y<stack.y+d.h;y++)for(let x=stack.x;x<stack.x+d.w;x++)occupied.add(`${x},${y}`);});
    for (let y=0;y<data.rows;y++) for (let x=0;x<data.cols;x++) {
      cells.push(occupied.has(`${x},${y}`) ? `<span class="cargo-cell" aria-hidden="true" style="grid-column:${x+1};grid-row:${y+1}"></span>` : `<button type="button" class="cargo-cell" data-cargo-cell="${x},${y}" aria-label="空格，第 ${x+1} 列第 ${y+1} 行" style="grid-column:${x+1};grid-row:${y+1}" tabindex="-1"></button>`);
    }
    const stacks = data.cargo.map(stack=>{
      const good=data.byId[stack.good],d=dimensions(stack,good),fresh=freshness(stack,data);
      const label = `${good?.name || stack.good}，${stack.quantity}${good?.unit || '份'}，占位${d.w}乘${d.h}，${fresh.label}`;
      return `<button type="button" class="cargo-stack${selected?.id===stack.id?' is-selected':''}${fresh.perishable?' cargo-perishable':''}${fresh.className}${d.h>1?' is-tall':''}${d.w>1?' is-wide':''}" data-cargo-stack="${esc(stack.id)}" aria-label="${esc(label)}" aria-pressed="${selected?.id===stack.id?'true':'false'}" title="${esc(label)}" style="grid-column:${stack.x+1}/span ${d.w};grid-row:${stack.y+1}/span ${d.h}">${fresh.perishable?`<span class="cargo-freshness-badge" aria-hidden="true">余${esc(fresh.remainingDays)}天</span>`:''}<span class="cargo-tile-symbol">${helpers.goodIcon ? helpers.goodIcon(good) : cargoIcon}</span><span class="cargo-tile-name">${esc(good?.name || stack.good)}</span><span class="cargo-stack-count">${esc(stack.quantity)}<small>/${integer(good?.stackLimit)}</small></span></button>`;
    }).join('');
    const canRotate = selected && integer(data.byId[selected.good]?.cargoW)!==integer(data.byId[selected.good]?.cargoH);
    return `<section class="cargo-ui" data-cargo-ui><div class="cargo-capacity-row"><div class="cargo-capacity-item"><div><span>货舱空间</span><strong>${data.usedCells}<small> / ${data.totalCells} 格</small></strong></div><div class="cargo-meter"><i style="width:${spaceRatio}%"></i></div></div><div class="cargo-capacity-item"><div><span>马车载重</span><strong>${number(data.weight)}<small> / ${number(data.maxWeight)}</small></strong></div><div class="cargo-meter${weightRatio>85?' is-heavy':''}"><i style="width:${weightRatio}%"></i></div></div></div><div class="cargo-board-heading"><span>${data.cols} × ${data.rows} 货舱</span><span class="cargo-freshness-legend"><span><i></i>耐储存</span><span><i class="perishable"></i>保鲜货</span><span><i class="expiring"></i>临期≤2天</span></span></div><div class="cargo-board" role="group" aria-label="马车货舱格子，${data.cols}列${data.rows}行。点选货物后点击空格可移动，R键旋转。" style="--cargo-cols:${data.cols};--cargo-rows:${data.rows}">${cells.join('')}${stacks}<div class="cargo-drag-preview" aria-hidden="true" hidden></div></div><div class="cargo-tool-row"><span class="cargo-drag-instructions">拖动货物摆放，或点选后点击空格</span><div><button type="button" class="cargo-tool-button" data-cargo-action="rotate" ${canRotate?'':'disabled'}>${rotateIcon}<span>旋转</span><kbd>R</kbd></button><button type="button" class="cargo-tool-button" data-cargo-action="arrange" ${data.cargo.length?'':'disabled'}>${arrangeIcon}<span>自动整理</span></button></div></div><div class="cargo-selected-detail" data-cargo-detail>${selectedHTML(game,selected,data,helpers)}</div><p class="cargo-status" role="status" aria-live="polite" data-cargo-status></p><details class="cargo-guide"><summary>货物占位、堆叠与保鲜 <span>不同到期批次分别占栈</span></summary><div class="cargo-goods-guide">${data.goods.map(g=>`<div class="cargo-good-guide"><span class="cargo-guide-symbol">${helpers.goodIcon ? helpers.goodIcon(g) : cargoIcon}</span><strong>${esc(g.name)}</strong><span>${integer(g.cargoW)} × ${integer(g.cargoH)} 格</span><span>每${esc(g.unit || '件')}重 ${number(g.weight)}</span><span>每栈最多 ${integer(g.stackLimit)}</span><span class="cargo-guide-freshness${g.shelfLifeDays?' is-perishable':''}">${g.shelfLifeDays?`购入后 ${esc(g.shelfLifeDays)} 天腐坏`:'耐储存'}</span></div>`).join('')}</div></details><div class="cargo-upgrade-note">轮轴、车厢与承重都有改良的余地。往后的商路上，也许能遇见手艺可靠的车匠。</div></section>`;
  }

  function mount(container, game, onChange, helpers = {}) {
    const previous = mounts.get(container);
    if (previous) previous();
    const ui = container.matches?.('[data-cargo-ui]') ? container : container.querySelector('[data-cargo-ui]');
    if (!ui) return () => {};
    const board = ui.querySelector('.cargo-board'), preview = ui.querySelector('.cargo-drag-preview');
    let drag = null, swallowClickUntil = 0;

    function select(id, focus = false) {
      const data=dataFor(game),stack=data.cargo.find(s=>s.id===id) || null;
      if(stack) selections.set(game,stack.id); else selections.delete(game);
      ui.querySelectorAll('[data-cargo-stack]').forEach(node=>{const picked=node.dataset.cargoStack===stack?.id;node.classList.toggle('is-selected',picked);node.setAttribute('aria-pressed',String(picked));});
      ui.querySelector('[data-cargo-detail]').innerHTML=selectedHTML(game,stack,data,helpers);
      const rotate = ui.querySelector('[data-cargo-action="rotate"]');
      rotate.disabled = !stack || integer(data.byId[stack.good]?.cargoW)===integer(data.byId[stack.good]?.cargoH);
      if(focus&&stack) ui.querySelectorAll('[data-cargo-stack]').forEach(node=>{if(node.dataset.cargoStack===stack.id)node.focus({preventScroll:true});});
    }
    function message(text, error = false) {
      const status=ui.querySelector('[data-cargo-status]');
      if(status){status.textContent=text;status.classList.toggle('is-error',error);}
      if(error&&helpers.toast) helpers.toast(text,true);
    }
    function commit(result) {
      if(!result?.ok){message(result?.message || '这个位置放不下货物。',true);return;}
      if(typeof onChange==='function') onChange(result);
      else {
        const next=render(game,helpers);
        if(container===ui){const holder=document.createElement('div');holder.innerHTML=next;const replacement=holder.firstElementChild;ui.replaceWith(replacement);mount(replacement,game,onChange,helpers);}
        else {container.innerHTML=next;mount(container,game,onChange,helpers);}
      }
      // The owning drawer may have been redrawn; preserve keyboard continuity.
      requestAnimationFrame(()=>{
        const host=container.isConnected?container:null;
        if(!host)return;
        const chosen=selections.get(game);
        host.querySelectorAll('[data-cargo-stack]').forEach(node=>{if(node.dataset.cargoStack===chosen)node.focus({preventScroll:true});});
      });
    }
    function selectedStack() {return getSelected(game,dataFor(game));}
    function rotate() {
      const stack=selectedStack();
      if(!stack)return message('先点选要旋转的货物。');
      commit(game.rotateCargo(stack.id));
    }
    function click(event) {
      if(performance.now()<swallowClickUntil)return;
      const action=event.target.closest('[data-cargo-action]');
      if(action){
        if(action.disabled)return;
        if(action.dataset.cargoAction==='rotate')rotate();
        if(action.dataset.cargoAction==='arrange')commit(game.autoArrangeCargo());
        return;
      }
      const tile=event.target.closest('[data-cargo-stack]');
      if(tile){select(tile.dataset.cargoStack);return;}
      const cell=event.target.closest('[data-cargo-cell]'),stack=selectedStack();
      if(cell&&stack){const[x,y]=cell.dataset.cargoCell.split(',').map(Number);commit(game.moveCargo(stack.id,x,y,stack.rotated));}
    }
    function keydown(event) {
      if(event.target.matches('input,textarea,select')||event.ctrlKey||event.metaKey||event.altKey)return;
      const stack=selectedStack();
      if(event.key==='Escape'&&stack){event.stopPropagation();select(null);return;}
      if(!stack)return;
      if(event.key.toLowerCase()==='r'){event.preventDefault();event.stopPropagation();rotate();return;}
      const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
      if(delta){event.preventDefault();event.stopPropagation();commit(game.moveCargo(stack.id,stack.x+delta[0],stack.y+delta[1],stack.rotated));}
    }
    function metrics() {
      const rect=board.getBoundingClientRect(),style=getComputedStyle(board),data=dataFor(game);
      const borderX=parseFloat(style.borderLeftWidth)||0,borderY=parseFloat(style.borderTopWidth)||0;
      const padX=(parseFloat(style.paddingLeft)||0)+borderX;
      const padY=(parseFloat(style.paddingTop)||0)+borderY;
      const gap=parseFloat(style.columnGap)||0;
      const cellW=(rect.width-padX*2-gap*(data.cols-1))/data.cols;
      const cellH=(rect.height-padY*2-gap*(data.rows-1))/data.rows;
      return {rect,padX,padY,borderX,borderY,gap,cellW,cellH,stepX:cellW+gap,stepY:cellH+gap};
    }
    function targetFrom(event,m) {
      return {x:Math.floor((event.clientX-m.rect.left-m.padX)/m.stepX)-drag.offsetX,y:Math.floor((event.clientY-m.rect.top-m.padY)/m.stepY)-drag.offsetY};
    }
    function validPosition(stack,x,y,data) {
      const d=dimensions(stack,data.byId[stack.good]);
      return x>=0&&y>=0&&x+d.w<=data.cols&&y+d.h<=data.rows&&!data.cargo.some(other=>{
        if(other.id===stack.id)return false;
        const od=dimensions(other,data.byId[other.good]);
        return x<other.x+od.w&&x+d.w>other.x&&y<other.y+od.h&&y+d.h>other.y;
      });
    }
    function pointerdown(event) {
      const tile=event.target.closest('[data-cargo-stack]');
      if(!tile || event.button!==0)return;
      const data=dataFor(game),stack=data.cargo.find(s=>s.id===tile.dataset.cargoStack);
      if(!stack)return;
      select(stack.id);
      const m=metrics(),rect=tile.getBoundingClientRect(),d=dimensions(stack,data.byId[stack.good]);
      drag={id:stack.id,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,offsetX:clamp(Math.floor((event.clientX-rect.left)/m.stepX),0,d.w-1),offsetY:clamp(Math.floor((event.clientY-rect.top)/m.stepY),0,d.h-1),moved:false,target:{x:stack.x,y:stack.y}};
    }
    function pointermove(event) {
      if(!drag || drag.pointerId!==event.pointerId)return;
      if(!drag.moved&&Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)<6)return;
      if(!drag.moved){drag.moved=true;ui.setPointerCapture?.(event.pointerId);ui.classList.add('is-dragging');}
      event.preventDefault();
      const data=dataFor(game),stack=data.cargo.find(s=>s.id===drag.id);if(!stack)return;
      const m=metrics(),target=targetFrom(event,m),d=dimensions(stack,data.byId[stack.good]);drag.target=target;
      preview.hidden=false;
      preview.style.left=`${m.padX-m.borderX+target.x*m.stepX}px`;preview.style.top=`${m.padY-m.borderY+target.y*m.stepY}px`;
      preview.style.width=`${d.w*m.cellW+(d.w-1)*m.gap}px`;preview.style.height=`${d.h*m.cellH+(d.h-1)*m.gap}px`;
      preview.classList.toggle('is-invalid',!validPosition(stack,target.x,target.y,data));
    }
    function pointerup(event) {
      if(!drag || drag.pointerId!==event.pointerId)return;
      const info=drag;drag=null;preview.hidden=true;ui.classList.remove('is-dragging');
      if(ui.hasPointerCapture?.(event.pointerId))ui.releasePointerCapture(event.pointerId);
      if(info.moved){swallowClickUntil=performance.now()+300;const stack=dataFor(game).cargo.find(s=>s.id===info.id);if(stack)commit(game.moveCargo(stack.id,info.target.x,info.target.y,stack.rotated));}
    }
    function cancel() {drag=null;preview.hidden=true;ui.classList.remove('is-dragging');}
    // Match the row height to the measured columns, including the frame and gaps.
    // This keeps cells square when the drawer narrows or the viewport is short.
    function fitBoard() {
      const m=metrics(),data=dataFor(game);
      if(m.cellW<=0)return;
      const height=m.cellW*data.rows+m.gap*(data.rows-1)+m.padY*2;
      if(Math.abs(m.rect.height-height)>.1)board.style.height=`${height}px`;
    }
    fitBoard();
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(fitBoard):null;
    if(observer)observer.observe(board);
    else root.addEventListener?.('resize',fitBoard);
    ui.addEventListener('click',click);
    ui.addEventListener('keydown',keydown);
    ui.addEventListener('pointerdown',pointerdown);
    ui.addEventListener('pointermove',pointermove);
    ui.addEventListener('pointerup',pointerup);
    ui.addEventListener('pointercancel',cancel);
    function preventNativeDrag(event){event.preventDefault();}
    ui.addEventListener('dragstart',preventNativeDrag);
    const dispose=()=>{if(observer)observer.disconnect();else root.removeEventListener?.('resize',fitBoard);ui.removeEventListener('click',click);ui.removeEventListener('keydown',keydown);ui.removeEventListener('pointerdown',pointerdown);ui.removeEventListener('pointermove',pointermove);ui.removeEventListener('pointerup',pointerup);ui.removeEventListener('pointercancel',cancel);ui.removeEventListener('dragstart',preventNativeDrag);cancel();mounts.delete(container);};
    mounts.set(container,dispose);
    return dispose;
  }

  root.SWCargoUI={render,mount};
})(typeof globalThis==='undefined'?window:globalThis);
