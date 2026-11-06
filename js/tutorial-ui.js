/* Guided practice uses real controls; no simulated trades or economic state. */
(function(root){
  'use strict';
  root.SWTutorial={install({getContext,esc}){
    const panel=document.createElement('aside');panel.className='tutorial-wizard';panel.setAttribute('aria-label','赫萝的行商引导');document.body.append(panel);
    let current='',index=0,paused=false,target=null;
    const progress=new WeakMap();
    let practice=null;
    const basePurchases=()=>steps['silver-resolution'].slice(0,2);
    const button=(drawer)=>`[data-action="drawer"][data-drawer="${drawer}"]`;
    const steps={
      packing:[['打开马车','先点亮起的马车按钮，看看两个人的行李。',button('cargo')],['选中毛皮','点一栈毛皮，查看它的重量与占位。','[data-cargo-stack]'],['整理货舱','点自动整理，试一次真实的货舱操作。','[data-cargo-action="arrange"]'],['看看账本','打开银币手账，认识货款与旅费的记录。',button('journal')],['准备出发','回到当前目标，继续这段旅途。',button('objective')]],
      'fur-deal':[['查看目的地','点帕兹欧，查看前往河港的商路。','.town-node[data-city="pazzio"]'],['沿路启程','点启程，旅行会逐日结算旅费与天气。','[data-action="travel"][data-city="pazzio"]'],['打开市场','抵达后打开市场，找到随车毛皮。',button('market')],['售出毛皮','点毛皮的售出按钮，进入交易确认。','[data-action="trade"][data-good="fur"][data-mode="sell"]'],['确认交易','选择数量，再确认售出。目标数量见当前目标。','#trade-confirm','sale'],['返回主线','售货条件满足后，回当前目标继续。',button('objective')]],
      'silver-resolution':[['查看城镇','点买家所在的城镇，看看当地需要什么。','.town-node'],['查看公告','切到城镇的收购公告，选择你想做的生意。','[data-action="city-tab"][data-tab="notices"]']],
      'money-changer':[['走进酒馆','酒馆消息已开放，先看看老板的打听选项。',button('tavern')],['查看近况','打听会收费，也可能没有消息；这次先打开资讯看看公开近况。','[data-action="drawer"][data-drawer="consult"]'],['回到调查','回当前目标，核对银币线索。',button('objective')]],
      northbound:[['商会信用','先打开商会，查看额度、日息与还款规则。',button('guild')],['准备胡椒','借款由你决定。打开市场，准备下一程胡椒。',button('market')]]
    };
    function render(){
      const c=getContext(),id=c.story?.id;
      const tradeGuide=document.querySelector('.trade-guidance'),host=tradeGuide||document.body;
      if(panel.parentElement!==host)host.append(panel);
      panel.classList.toggle('is-inline',!!tradeGuide);
      if(id!==current){current=id;index=progress.get(c.game)?.[id]||0;paused=false;}
      if(id==='fur-deal'&&index===4&&!document.querySelector('#trade-confirm'))index=3;
      if(id==='fur-deal'&&c.game.state.city==='pazzio'&&index<2)index=2;
      if(id==='fur-deal'&&c.game.canAdvanceStory().ok&&index<5)index=5;
      if(id==='fur-deal')steps[id][4][1]=`本次还需售出至少 ${Math.max(0,c.story.conditions.soldAt.quantity-(c.game.state.soldAt.pazzio?.fur||0))} 份毛皮。输入数量，再确认售出。`;
      if(id==='silver-resolution'){
        if(practice&&!c.game.getPurchaseOffers().some(o=>o.id===practice.id)&&c.game.state.purchaseCompleted<c.story.conditions.purchaseCompleted){practice=null;index=0;}
        const offer=practice||c.game.getPurchaseOffers().find(o=>{const route=c.game.previewTravel(o.destination);return c.game.quote(o.good)&&route.ok&&route.arrivalDay<=o.dueDay;});
        const town=c.game.cities[offer?.destination||c.game.state.city];
        steps[id][0]=['查看城镇',`点${town.name}城镇，公告无需领取，先看看买家要什么。`,`.town-node[data-city="${town.id}"]`];
        const first=basePurchases();
        const returnSteps=[['回帕兹欧','公告已成交，点帕兹欧，查看返回调查地点的商路。','.town-node[data-city="pazzio"]'],['返程启程','沿商路回帕兹欧，继续银币调查。','[data-action="travel"][data-city="pazzio"]'],['继续调查','已回到帕兹欧，打开当前目标继续调查。',button('objective')]];
        if(practice){
          if(index===6&&!document.querySelector('#trade-confirm'))index=5;
          if(c.game.state.inventory[practice.good]>=practice.quantity&&index>=4&&index<7)index=7;
          const g=c.game.goods[practice.good],place=c.game.cities[practice.destination];
          steps[id]=[...first,['选一笔练习','在公告卡片上点“用这笔练习”。只推荐当前城市能采购、预计来得及送达的公告。','[data-wizard-notice]'],['查截止日','打开日历，核对采购与送达所需时间。',button('calendar')],['打开货源市场',`这笔需要${g.name}，先打开当前市场。`,button('market')],['采购货物',`点${g.name}的买入，准备${practice.quantity}${g.unit}。`,`[data-action="trade"][data-good="${g.id}"][data-mode="buy"]`],['确认采购',`数量填${practice.quantity}，确认银币与重量后买入。`,'#trade-confirm','buy'],['查看交货地',`货物备齐后点${place.name}，核对抵达日期。`,`.town-node[data-city="${place.id}"]`],['运到买家',`沿商路前往${place.name}，途中消息确认后继续。`,`[data-action="travel"][data-city="${place.id}"]`],['查看买家城镇',`抵达后点${place.name}城镇，打开当地详情。`,`.town-node[data-city="${place.id}"]`],['找到买家','切到城镇的收购公告。','[data-action="city-tab"][data-tab="notices"]'],['交货收款',`找到${practice.title}，点击交货收款。`,`[data-action="purchase-deliver"][data-notice="${practice.id}"]`,'delivery'],...returnSteps];
          if(c.game.state.city===practice.destination&&index>=7&&index<9)index=9;
        }else steps[id]=[...first,['选一笔练习','在城镇的收购公告中，选择一张带“用这笔练习”的公告卡片。','[data-wizard-notice]'],...returnSteps];
        if(c.game.state.purchaseCompleted>=c.story.conditions.purchaseCompleted){const returnIndex=practice?12:3;index=Math.max(index,returnIndex);if(c.game.state.city==='pazzio')index=Math.max(index,returnIndex+2);}
      }
      document.querySelectorAll('.tutorial-target').forEach(n=>n.classList.remove('tutorial-target'));
      target=null;
      if(!c.active||c.busy||!steps[id]||index>=steps[id].length){panel.hidden=true;return;}
      panel.hidden=false;
      if(paused){panel.innerHTML='<button type="button" data-wizard="resume">继续操作引导</button>';return;}
      const [title,text,selector]=steps[id][index];
      target=[...document.querySelectorAll(selector)].find(n=>n.getClientRects().length&&!n.disabled&&!n.closest('[inert]'));
      target?.classList.add('tutorial-target');
      if(target){const r=target.getBoundingClientRect(),bottom=innerWidth<=700?150:85,above=(r.top+r.bottom)/2>(innerHeight-bottom+16)/2;panel.style.top=above?'16px':'auto';panel.style.bottom=above?'auto':`${bottom}px`;}
      panel.innerHTML=`<small>赫萝的行商引导 · ${index+1} / ${steps[id].length}</small><strong>${esc(title)}</strong><p>${esc(text)}</p><div><button type="button" data-wizard="locate">${target?'定位操作位置':'返回地图找入口'}</button><button type="button" data-wizard="pause">暂时收起</button></div>`;
    }
    panel.addEventListener('click',e=>{const a=e.target.closest('[data-wizard]')?.dataset.wizard;if(a==='pause')paused=true;if(a==='resume')paused=false;if(a==='locate'){if(target){if(target.closest('#app')&&document.querySelector('#drawer-root .drawer'))getContext().closePanels();target.scrollIntoView({block:'center',behavior:'smooth'});target.focus({preventScroll:true});}else getContext().closePanels();}render();});
    document.addEventListener('click',e=>{
      if(panel.contains(e.target))return;
      const c=getContext();
      const pick=e.target.closest('[data-wizard-notice]');
      if(pick&&c.story?.id==='silver-resolution'){
        practice=c.game.getPurchaseOffers().find(o=>o.id===pick.dataset.wizardNotice);index=3;render();return;
      }
      const step=steps[current]?.[index];
      if(!paused&&step&&target?.contains(e.target)){
        const sales=c.game.state.soldAt.pazzio?.fur||0, deliveries=c.game.state.purchaseCompleted, inventory=practice?c.game.state.inventory[practice.good]:0, captured=current, capturedIndex=index;
        setTimeout(()=>{const now=getContext();if(current!==captured||index!==capturedIndex)return;if(step[3]==='buy'&&(!practice||now.game.state.inventory[practice.good]<practice.quantity||now.game.state.inventory[practice.good]<=inventory))return;if(step[3]==='sale'&&(now.game.state.soldAt.pazzio?.fur||0)<=sales)return;if(step[3]==='delivery'&&now.game.state.purchaseCompleted<=deliveries)return;index++;const saved=progress.get(now.game)||{};saved[current]=index;progress.set(now.game,saved);render();},0);
      }
    },true);
    let scheduled=false;
    const observer=new MutationObserver(records=>{if(records.every(record=>panel.contains(record.target))||scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;render();});});
    for(const id of ['app','drawer-root','overlay-root'])observer.observe(document.getElementById(id),{childList:true,subtree:true});
    return {reset(){current='';index=0;paused=false;practice=null;render();}};
  }};
})(globalThis);
