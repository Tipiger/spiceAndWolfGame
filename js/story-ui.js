/* Visual novel reader. Story content supplies images and captions per page. */
(() => {
  'use strict';

  function play({ pages, title, background, onFinish, host, app, drawers, esc, icon, close }) {
    const document = host.ownerDocument;
    const find = selector => host.querySelector(selector);
    const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const continueHint = matchMedia('(pointer:coarse)').matches ? '轻触继续' : '空格继续';
    let index = 0;
    let timer = null;
    let typing = false;
    let seen = 0;
    let lastImage = '';
    let finished = false;

    app.inert = true;
    drawers.inert = true;
    host.innerHTML = `
      <section class="vn-scene" role="dialog" aria-modal="true" aria-label="旅途故事">
        <div class="vn-background"></div>
        <div class="vn-shade"></div>
        <header class="vn-top">
          <span>狼与香辛料 · 行商旅记</span>
          <div class="vn-tools">
            <button id="vn-history">回看对白</button>
            <button id="vn-skip">跳过这一段</button>
          </div>
        </header>
        <h2 class="vn-title"><small>旅途纪事 · 一路向北</small>${esc(title)}</h2>
        <figure class="vn-novel-plate" hidden>
          <img id="vn-novel-image" alt="旅途画页">
          <figcaption id="vn-novel-caption"></figcaption>
        </figure>
        <section class="vn-dialog">
          <div class="vn-speaker" id="vn-speaker"></div>
          <div class="vn-text" tabindex="0" aria-label="本页剧情">
            <span class="vn-text-measure" aria-hidden="true"></span>
            <span id="vn-text"></span>
          </div>
          <footer class="vn-footer">
            <span id="vn-count"></span>
            <div>
              <button class="vn-back" id="vn-back">上一页</button>
              <button class="btn primary" id="vn-next">继续 ${icon('arrow')}</button>
            </div>
          </footer>
        </section>
        <section class="vn-log" id="vn-log" hidden></section>
      </section>`;

    // Resolve from the page index so going back restores the same illustration.
    // Only an explicit background page ends an illustration's run.
    function imageFor() {
      for (let i = index; i >= 0; i--) {
        if (pages[i].background) break;
        if (pages[i].image) return pages[i];
      }
      return {};
    }

    find('.vn-background').style.backgroundImage = `url('${background}')`;

    function setBackground() {
      const { image = '', imageCaption, imageLayout } = imageFor();
      const caption = imageCaption || '同行的片刻';
      const book = Boolean(image);
      find('.vn-scene').classList.toggle('with-novel-plate', book);
      find('.vn-scene').classList.toggle('with-wide-plate', book && imageLayout === 'wide');
      find('.vn-novel-plate').hidden = !book;
      if (book) {
        find('#vn-novel-caption').textContent = caption;
        if (image !== lastImage) {
          find('#vn-novel-image').src = image;
          find('#vn-novel-image').alt = caption;
        }
      }
      lastImage = image;
    }

    function show() {
      clearInterval(timer);
      const page = pages[index];
      seen = Math.max(seen, index);
      setBackground();
      find('#vn-speaker').textContent = page.speaker || '旁白';
      find('#vn-count').textContent = String(index + 1).padStart(2, '0') + ' / ' +
        String(pages.length).padStart(2, '0') + ' · ' + continueHint;
      find('#vn-back').disabled = index === 0;
      find('#vn-next').innerHTML = (index === pages.length - 1 ? '回到地图' : '继续') + ' ' + icon('arrow');

      const text = find('#vn-text');
      find('.vn-text-measure').textContent = page.text;
      find('.vn-text').scrollTop = 0;
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
    find('.vn-text').onclick = next;
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
