/* Visual novel reader. Story content supplies images and captions per page. */
(() => {
  'use strict';

  function play({ pages, title, onFinish, host, app, drawers, esc, icon, close }) {
    const document = host.ownerDocument;
    const find = selector => host.querySelector(selector);
    const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
    let index = 0;
    let timer = null;
    let typing = false;
    let seen = 0;
    let front = 0;
    let lastImage = '';
    let finished = false;

    app.inert = true;
    drawers.inert = true;
    host.innerHTML = `
      <section class="vn-scene" role="dialog" aria-modal="true" aria-label="旅途故事">
        <div class="vn-background" id="vn-bg-a"></div>
        <div class="vn-background secondary" id="vn-bg-b"></div>
        <div class="vn-shade"></div>
        <header class="vn-top">
          <span>狼与香辛料 · 行商旅记</span>
          <div class="vn-tools">
            <button id="vn-history">回看对白</button>
            <button id="vn-skip">跳过这一段</button>
          </div>
        </header>
        <h2 class="vn-title"><small>原作路标 · 北行旅途</small>${esc(title)}</h2>
        <figure class="vn-novel-plate" hidden>
          <img id="vn-novel-image" alt="文仓十原作插图">
          <figcaption id="vn-novel-caption"></figcaption>
        </figure>
        <section class="vn-dialog">
          <div class="vn-speaker" id="vn-speaker"></div>
          <div class="vn-text" id="vn-text"></div>
          <footer class="vn-footer">
            <span id="vn-count"></span>
            <div>
              <button class="vn-back" id="vn-back">上一句</button>
              <button class="btn primary" id="vn-next">继续 ${icon('arrow')}</button>
            </div>
          </footer>
        </section>
        <section class="vn-log" id="vn-log" hidden></section>
      </section>`;

    function imageFor(page) {
      if (page.image) {
        return {
          image: page.image,
          caption: page.imageCaption || '原作旅途插页 · 插画：文仓十'
        };
      }
      const night = ['night', 'rain', 'underground', 'wolf'].includes(page.scene);
      return {
        image: night ? 'assets/night.jpg' : page.scene === 'wheat' ? 'assets/holo.jpg' : 'assets/hero.jpg',
        caption: ''
      };
    }

    function setBackground(page) {
      const { image, caption } = imageFor(page);
      const book = image.startsWith('assets/novel/');
      find('.vn-scene').classList.toggle('with-novel-plate', book);
      find('.vn-novel-plate').hidden = !book;
      if (book) {
        find('#vn-novel-caption').textContent = caption;
        if (image !== lastImage) {
          find('#vn-novel-image').src = image;
          find('#vn-novel-image').alt = caption + ' · 文仓十原作插图';
        }
      }
      if (image === lastImage) return;

      const incoming = find(front ? '#vn-bg-a' : '#vn-bg-b');
      const outgoing = find(front ? '#vn-bg-b' : '#vn-bg-a');
      incoming.style.backgroundImage = book ? 'none' : `url('${image}')`;
      incoming.style.backgroundSize = image.includes('hero') ? 'cover' : 'auto 120%';
      incoming.style.backgroundRepeat = 'no-repeat';
      incoming.style.backgroundPosition = image.includes('hero') ? 'center 32%' : 'right 24%';
      incoming.style.backgroundColor = '#2e423b';
      incoming.style.opacity = '1';
      outgoing.style.opacity = '0';
      front = front ? 0 : 1;
      lastImage = image;
    }

    function show() {
      clearInterval(timer);
      const page = pages[index];
      seen = Math.max(seen, index);
      setBackground(page);
      find('#vn-speaker').textContent = page.speaker || '旁白';
      find('#vn-count').textContent = String(index + 1).padStart(2, '0') + ' / ' +
        String(pages.length).padStart(2, '0') + ' · 空格继续';
      find('#vn-back').disabled = index === 0;
      find('#vn-next').innerHTML = (index === pages.length - 1 ? '回到地图' : '继续') + ' ' + icon('arrow');

      const text = find('#vn-text');
      text.textContent = '';
      typing = !reducedMotion;
      if (reducedMotion) {
        text.textContent = page.text;
      } else {
        let characters = 0;
        timer = setInterval(() => {
          text.textContent = page.text.slice(0, ++characters);
          if (characters >= page.text.length) {
            clearInterval(timer);
            typing = false;
          }
        }, 18);
      }
    }

    function cleanup() {
      clearInterval(timer);
      document.removeEventListener('keydown', key);
    }

    function finish() {
      if (finished) return;
      finished = true;
      cleanup();
      close();
      onFinish?.();
    }

    function next() {
      if (!find('#vn-log').hidden) return;
      if (typing) {
        clearInterval(timer);
        find('#vn-text').textContent = pages[index].text;
        typing = false;
        return;
      }
      if (index === pages.length - 1) return finish();
      index++;
      show();
    }

    function back() {
      if (index === 0) return;
      index--;
      show();
    }

    function closeHistory() {
      find('#vn-log').hidden = true;
      find('#vn-history').focus();
    }

    function key(event) {
      const advanceKey = event.code === 'Space' || event.code === 'Enter';
      if (advanceKey && event.target.closest('button,a,input,select,textarea')) return;
      if (advanceKey) {
        event.preventDefault();
        next();
      }
      if (event.code === 'ArrowLeft') {
        event.preventDefault();
        back();
      }
      if (event.code === 'Escape' && !find('#vn-log').hidden) closeHistory();
    }

    find('#vn-next').onclick = next;
    find('#vn-text').onclick = next;
    find('#vn-back').onclick = back;
    find('#vn-skip').onclick = finish;
    find('#vn-history').onclick = () => {
      const log = find('#vn-log');
      log.innerHTML = `
        <button class="btn small" id="vn-log-close">返回阅读</button>
        <h3>沿途对白</h3>
        ${pages.slice(0, seen + 1).map(page => `
          <article>
            <strong>${esc(page.speaker || '旁白')}</strong>
            <p>${esc(page.text)}</p>
          </article>`).join('')}`;
      log.hidden = false;
      find('#vn-log-close').focus();
      find('#vn-log-close').onclick = closeHistory;
    };
    document.addEventListener('keydown', key);
    show();
    return cleanup;
  }

  globalThis.SWStoryUI = Object.freeze({ play });
})();
