/* Published builds supply an image manifest; file:// remains directly playable. */
globalThis.SWAssetsReady = (async () => {
  if (!globalThis.SW_IMAGE_MANIFEST) return;
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;inset:0;z-index:99999;display:grid;place-content:center;text-align:center;background:#f4ead5;color:#493923;padding:24px';
  document.body.append(panel);
  const label = document.createElement('p');
  label.setAttribute('role', 'status');
  panel.append(label);
  let persistent = false;
  try {
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('image-cache-sw.js');
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise(resolve => {
        navigator.serviceWorker.addEventListener('controllerchange', resolve, {once:true});
      });
      persistent = true;
    }
  } catch { /* Image preloading still works when persistent caching is unavailable. */ }
  const images = globalThis.SW_IMAGE_MANIFEST;
  const loaded = new Set();
  async function load() {
    let cursor = 0;
    const failed = [];
    await Promise.all(Array.from({length:4}, async () => {
      while (cursor < images.length) {
        const path = images[cursor++];
        if (loaded.has(path)) continue;
        label.textContent = `正在准备旅途图片 ${loaded.size} / ${images.length}…`;
        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            const timer = setTimeout(() => { img.src = ''; reject(Error('timeout')); }, 45000);
            img.onload = async () => { try { await img.decode(); clearTimeout(timer); resolve(); } catch(e) { clearTimeout(timer); reject(e); } };
            img.onerror = () => { clearTimeout(timer); reject(Error(path)); };
            img.src = path;
          });
          loaded.add(path);
        } catch { failed.push(path); }
      }
    }));
    if (failed.length) {
      label.textContent = `还有 ${failed.length} 张图片未能加载，请检查网络后重试。`;
      await new Promise(resolve => {
        const button = document.createElement('button');
        button.textContent = '重试加载';
        button.onclick = () => { button.remove(); resolve(); };
        panel.append(button);
      });
      return load();
    }
  }
  await load();
  if (!persistent) console.info('持久图片缓存不可用，已完成本次预加载。');
  panel.remove();
})();
