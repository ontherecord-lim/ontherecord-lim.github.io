(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const decode = (value = '') => {
    const node = document.createElement('textarea');
    let text = String(value);
    for (let i = 0; i < 3; i += 1) {
      node.innerHTML = text;
      if (node.value === text) break;
      text = node.value;
    }
    return text;
  };

  const cleanTitle = (value = '') => decode(value)
    .replace(/\s*[-–—|]\s*The Korea Herald\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const cleanText = (value = '', limit = 180) => {
    const text = decode(value).replace(/\s+/g, ' ').trim();
    if (text.length <= limit) return text;
    return `${text.slice(0, limit - 1).replace(/\s+\S*$/, '')}…`;
  };

  const esc = (value = '') => String(value).replace(/[&<>'"]/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[ch]));

  const articleImage = (article, className) => `
    <a class="${className} image-shell" href="${esc(article.url)}" target="_blank" rel="noopener noreferrer">
      <img src="${esc(article.image)}" alt="${esc(cleanTitle(article.title))}" loading="lazy">
    </a>`;

  async function loadArticles() {
    try {
      const response = await fetch(`data/articles.json?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const articles = Array.isArray(data.articles)
        ? data.articles.filter((article) => article?.title && article?.url && article?.image)
        : [];
      if (!articles.length) throw new Error('No article data');

      const lead = articles[0];
      const leadTitle = $('#leadTitle');
      const leadImage = $('#leadImage');
      const leadImageLink = $('#leadImageLink');

      leadTitle.textContent = cleanTitle(lead.title);
      leadTitle.href = lead.url;
      $('#leadDeck').textContent = cleanText(lead.description, 300);
      $('#leadMeta').textContent = `By Lim Ye-jin · ${lead.date || 'Latest'} · The Korea Herald`;
      $('#leadRubric').textContent = lead.category || 'The Korea Herald · Business';
      leadImage.src = lead.image;
      leadImage.alt = cleanTitle(lead.title);
      leadImageLink.href = lead.url;
      leadImageLink.hidden = false;
      leadImage.onerror = () => { leadImageLink.hidden = true; };

      $('#selectedGrid').innerHTML = articles.map((article, index) => `
        <article class="photo-story">
          ${articleImage(article, 'photo-story-image')}
          <p class="story-index">${String(index + 1).padStart(2, '0')} · ${esc((article.category || 'Business').replace(/^Business\s*·\s*/i, ''))}</p>
          <p class="rubric">${esc(article.category || 'The Korea Herald · Business')}</p>
          <h3><a href="${esc(article.url)}" target="_blank" rel="noopener noreferrer">${esc(cleanTitle(article.title))}</a></h3>
          <p>${esc(cleanText(article.description, 200))}</p>
          <p class="story-meta">${esc(article.date || 'Latest')} · The Korea Herald</p>
        </article>
      `).join('');

      const tickerItems = articles
        .map((article) => `<span>${esc(cleanTitle(article.title))}</span><i>◆</i>`)
        .join('');

      $('#tickerTrack').innerHTML = tickerItems + tickerItems;

      if (data.generatedAt) {
        const d = new Date(data.generatedAt);

        if (!Number.isNaN(d.getTime())) {
          $('#latestUpdated').textContent = `Updated ${new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'Asia/Seoul'
          }).format(d)}`;
        }
      }

      $$('img', $('#selectedGrid')).forEach((img) => {
        img.addEventListener('error', () => {
          const shell = img.closest('.image-shell');
          if (shell) shell.style.display = 'none';
        }, { once: true });
      });
    } catch (error) {
      console.warn('Article feed unavailable:', error);
    }
  }

  const fxPairs = [
    { quote: 'USD', label: 'USD / KRW', units: 1 },
    { quote: 'EUR', label: 'EUR / KRW', units: 1 },
    { quote: 'JPY', label: 'JPY / KRW · 100', units: 100 },
    { quote: 'GBP', label: 'GBP / KRW', units: 1 },
    { quote: 'CNY', label: 'CNY / KRW', units: 1 }
  ];

  let marketIndex = 0;
  let marketTimer = null;

  async function loadMarkets() {
    const stage = $('#marketStage');

    try {
      const end = new Date();
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - 10);

      const ymd = (date) => date.toISOString().slice(0, 10);
      const quotes = fxPairs.map((pair) => pair.quote).join(',');

      const url = `https://api.frankfurter.dev/v2/rates?base=KRW&quotes=${quotes}&from=${ymd(start)}&to=${ymd(end)}`;

      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const rows = await response.json();

      if (!Array.isArray(rows)) throw new Error('Unexpected FX response');

      const grouped = new Map();

      rows.forEach((row) => {
        if (!row?.quote || !Number.isFinite(Number(row.rate))) return;
        if (!grouped.has(row.quote)) grouped.set(row.quote, []);
        grouped.get(row.quote).push(row);
      });

      const rates = fxPairs.map((pair) => {
        const history = (grouped.get(pair.quote) || [])
          .sort((a, b) => String(a.date).localeCompare(String(b.date)));

        if (!history.length) return null;

        const latest = history.at(-1);
        const previous = history.at(-2) || latest;
        const value = pair.units / Number(latest.rate);
        const prev = pair.units / Number(previous.rate);
        const change = prev ? ((value - prev) / prev) * 100 : 0;

        return { ...pair, value, change };
      }).filter(Boolean);

      if (!rates.length) throw new Error('No rates');

      stage.innerHTML = rates.map((rate, index) => `
        <div class="market-quote${index === 0 ? ' is-active' : ''}">
          <span>${esc(rate.label)}</span>
          <span class="market-price">${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(rate.value)}</span>
          <span class="market-move">${rate.change > .005 ? '▲' : rate.change < -.005 ? '▼' : '—'} ${Math.abs(rate.change).toFixed(2)}%</span>
        </div>
      `).join('');

      if (marketTimer) clearInterval(marketTimer);

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && rates.length > 1) {
        marketIndex = 0;

        marketTimer = setInterval(() => {
          const slides = $$('.market-quote', stage);
          const current = slides[marketIndex];
          const nextIndex = (marketIndex + 1) % slides.length;
          const next = slides[nextIndex];

          current.classList.remove('is-active');
          current.classList.add('is-exit');
          next.classList.add('is-active');

          setTimeout(() => current.classList.remove('is-exit'), 650);

          marketIndex = nextIndex;
        }, 4000);
      }
    } catch (error) {
      stage.innerHTML = '<div class="market-status">Reference rates temporarily unavailable.</div>';
    }
  }

  function weatherLabel(code) {
    if (code === 0) return 'Clear';
    if ([1, 2].includes(code)) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if ([45, 48].includes(code)) return 'Fog';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
    if ([95, 96, 99].includes(code)) return 'Thunderstorms';

    return 'Current conditions';
  }

  async function loadWeatherCity(selector, latitude, longitude, timezone) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');

    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('current', 'temperature_2m,weather_code');
    url.searchParams.set('temperature_unit', 'celsius');
    url.searchParams.set('timezone', timezone);

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const root = $(selector);

    root.querySelector('.weather-value').textContent =
      `${Math.round(Number(data.current.temperature_2m))}°C`;

    root.querySelector('.weather-condition').textContent =
      weatherLabel(Number(data.current.weather_code));
  }

  async function loadWeather() {
    try {
      await Promise.all([
        loadWeatherCity('#weatherSeoul', '37.5665', '126.9780', 'Asia/Seoul'),
        loadWeatherCity('#weatherSanDiego', '32.7157', '-117.1611', 'America/Los_Angeles')
      ]);
    } catch (error) {
      $$('.weather-condition').forEach((element) => {
        element.textContent = 'Unavailable';
      });
    }
  }

  function setCurrentDate() {
    const node = $('#currentDate');

    if (!node) return;

    const now = new Date();

    node.textContent = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Seoul'
    }).format(now);
  }

  async function loadOffTheRecord() {
    const grid = $('#offRecordGrid');

    if (!grid) return;

    try {
      const response = await fetch(`data/off-the-record.json?v=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      const posts = Array.isArray(data.posts)
        ? data.posts.filter((post) => post?.title)
        : [];

      if (!posts.length) return;

      grid.innerHTML = posts.slice(0, 6).map((post) => {
        const gatedContentId =
          post.gatedContentId || 'off-the-record-full-access';

        const hostedContentId =
          post.hostedContentId || '';

        const image = post.image
          ? `<div class="off-record-cover image-shell">
               <img
                 src="${esc(post.image)}"
                 alt="${esc(post.imageAlt || post.title)}"
                 loading="lazy">
             </div>`
          : '';

        const secureContent = hostedContentId
          ? `<div
               class="off-record-member-content"
               data-ms-content="${esc(gatedContentId)}"
               data-ms-bind:style="display:block"
               style="display:none">
               <div data-ms-secure-html="${esc(hostedContentId)}"></div>
             </div>`
          : '';

        return `
          <article class="off-record-card off-record-feature">
            ${image}

            <div class="off-record-copy">
              <p class="story-index">
                ${esc(post.category || 'Essay')} · ${esc(post.date || '')}
              </p>

              <h3>${esc(post.title)}</h3>

              ${post.excerpt
                ? `<p class="off-record-preview">${esc(cleanText(post.excerpt, 240))}</p>`
                : ''}

              <div
                class="off-record-paywall"
                data-ms-content="!${esc(gatedContentId)}">

                <p class="paywall-label">🔒 Subscribers only</p>

                <p>
                  The rest of this Off the Record entry is available to paid members.
                </p>

                <div class="paywall-actions">
                  <a
                    href="#"
                    class="paywall-primary"
                    data-ms-price:add="prc_off-the-record-full-access-t7da0shc"
                    data-ms-modal="signup">
                    Subscribe to continue reading
                  </a>

                  <a
                    href="#"
                    class="paywall-secondary"
                    data-ms-modal="login">
                    Already a member? Log in
                  </a>
                </div>
              </div>

              ${secureContent}
            </div>
          </article>`;
      }).join('');
    } catch (error) {
      console.warn('Off the Record feed unavailable:', error);
    }
  }

  function initNewsletter() {
    const form = $('#newsletterForm');
    const input = $('#newsletterEmail');
    const message = $('#newsletterMessage');
    const widget = $('#newsletterWidget');
    const close = $('#newsletterWidgetClose');

    if (close && widget) {
      close.addEventListener('click', () => {
        widget.classList.add('is-hidden');
      });
    }

    if (!form || !input || !message) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      message.classList.remove('is-error');

      if (!input.checkValidity()) {
        message.textContent = 'Please enter a valid email address.';
        message.classList.add('is-error');
        input.focus();
        return;
      }

      message.textContent =
        'Newsletter signup is not connected yet. Your email has not been stored.';

      input.value = '';
    });
  }

  function initCursor() {
    const finePointer =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || reducedMotion) return;

    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');

    let x = -50;
    let y = -50;
    let rx = -50;
    let ry = -50;

    document.addEventListener('pointermove', (event) => {
      x = event.clientX;
      y = event.clientY;

      document.body.classList.add('cursor-ready');

      document.body.classList.toggle(
        'cursor-on-link',
        Boolean(event.target.closest('a,button,input'))
      );

      const shell = event.target.closest('.image-shell');

      if (shell) {
        const img = $('img', shell);

        if (img) {
          const rect = shell.getBoundingClientRect();

          const ox =
            ((event.clientX - rect.left) / rect.width - .5) * 6;

          const oy =
            ((event.clientY - rect.top) / rect.height - .5) * 6;

          img.style.transform =
            `scale(1.025) translate3d(${ox}px,${oy}px,0)`;
        }
      }
    }, { passive: true });

    document.addEventListener('pointerout', (event) => {
      const shell = event.target.closest?.('.image-shell');

      if (shell && !shell.contains(event.relatedTarget)) {
        const img = $('img', shell);

        if (img) img.style.transform = '';
      }
    });

    const loop = () => {
      rx += (x - rx) * .18;
      ry += (y - ry) * .18;

      dot.style.transform =
        `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;

      ring.style.transform =
        `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  setCurrentDate();
  loadArticles();
  loadOffTheRecord();
  loadMarkets();
  loadWeather();
  initNewsletter();
  initCursor();

  setInterval(loadMarkets, 60 * 60 * 1000);
  setInterval(loadWeather, 10 * 60 * 1000);
})();// Memberstack Off the Record signup, checkout and login
(() => {
  const PRICE_ID = 'prc_off-the-record-full-access-t7da0shc';
  const PENDING_CHECKOUT = 'offRecordPendingCheckout';

  function whenMemberstackReady(callback) {
    if (window.$memberstackReady && window.$memberstackDom) {
      callback();
    } else {
      document.addEventListener('memberstack.ready', callback, { once: true });
    }
  }

  async function beginCheckout() {
    const memberstack = window.$memberstackDom;

    try {
      const { data: member } = await memberstack.getCurrentMember();

      if (!member) return false;

      // Prevent a checkout loop after Stripe sends the reader back.
      sessionStorage.removeItem(PENDING_CHECKOUT);

      await memberstack.purchasePlansWithCheckout({
        priceId: PRICE_ID,
        successUrl:
          window.location.origin +
          window.location.pathname +
          '#off-the-record',
        cancelUrl:
          window.location.origin +
          window.location.pathname +
          '#off-the-record'
      });

      return true;
    } catch (error) {
      console.error('Memberstack checkout error:', error);
      return false;
    }
  }

  // If signup caused a page redirect/reload, continue to Stripe
  // automatically once Memberstack confirms the reader is logged in.
  whenMemberstackReady(async () => {
    if (sessionStorage.getItem(PENDING_CHECKOUT) === '1') {
      await beginCheckout();
    }
  });

  document.addEventListener(
    'click',
    (event) => {
      const subscribeButton = event.target.closest('.paywall-primary');
      const loginButton = event.target.closest('.paywall-secondary');

      if (!subscribeButton && !loginButton) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      whenMemberstackReady(async () => {
        const memberstack = window.$memberstackDom;

        // SUBSCRIBE
        if (subscribeButton) {
          try {
            // Remember that this reader still needs to reach Stripe.
            sessionStorage.setItem(PENDING_CHECKOUT, '1');

            // Keep the reader at the Off the Record section.
            history.replaceState(
              null,
              '',
              window.location.pathname +
                window.location.search +
                '#off-the-record'
            );

            const { data: member } =
              await memberstack.getCurrentMember();

            // Already has a Memberstack account/login:
            // go directly to Stripe.
            if (member) {
              await beginCheckout();
              return;
            }

            // New reader: create account first.
            await memberstack.openModal('SIGNUP');

            memberstack.hideModal();

            // If Memberstack did not reload the page,
            // continue to Stripe immediately.
            await beginCheckout();
          } catch (error) {
            console.error('Memberstack signup error:', error);
          }

          return;
        }

        // LOGIN
        if (loginButton) {
          try {
            sessionStorage.removeItem(PENDING_CHECKOUT);

            await memberstack.openModal('LOGIN');

            memberstack.hideModal();

            window.location.hash = 'off-the-record';
            window.location.reload();
          } catch (error) {
            console.error('Memberstack login error:', error);
          }
        }
      });
    },
    true
  );
})();
  }
}, true);
