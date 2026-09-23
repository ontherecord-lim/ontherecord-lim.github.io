(() => {
  'use strict';

  const lang = document.body?.dataset.lang === 'ko' ? 'ko' : 'en';
  const isKo = lang === 'ko';
  const basePrefix = isKo ? '../' : '';
  const articleDataUrl = `${basePrefix}data/articles.json`;
  const placeholderImage = `${basePrefix}assets/placeholder.svg`;

  const $ = (selector, root = document) => root.querySelector(selector);

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[ch]));

  function setCurrentDate() {
    const node = $('#currentDate');
    if (!node) return;

    try {
      node.textContent = new Intl.DateTimeFormat(isKo ? 'ko-KR' : 'en-US', {
        weekday: isKo ? undefined : 'long',
        year: 'numeric',
        month: isKo ? 'numeric' : 'short',
        day: 'numeric',
        timeZone: 'Asia/Seoul'
      }).format(new Date());
    } catch {
      node.textContent = isKo ? '서울' : 'Seoul';
    }
  }

  async function loadArticles() {
    const grid = $('#articleGrid');
    const ticker = $('#tickerTrack');
    if (!grid || !ticker) return;

    try {
      const response = await fetch(`${articleDataUrl}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Article data HTTP ${response.status}`);
      const payload = await response.json();
      const articles = Array.isArray(payload.articles)
        ? payload.articles.filter((article) => article?.title && article?.url)
        : [];
      if (!articles.length) throw new Error('No articles found');

      grid.innerHTML = articles.map((article) => {
        const title = isKo && article.titleKo ? article.titleKo : article.title;
        const date = isKo && article.dateKo ? article.dateKo : (article.date || '');
        const image = article.image || placeholderImage;
        const linkLabel = isKo ? '영문 기사 보기 ↗' : 'Read full story ↗';
        const alt = `${title}`;

        return `
          <article class="article-card">
            <a class="article-image" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}" loading="lazy" referrerpolicy="no-referrer">
            </a>
            <h3><a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></h3>
            <div class="story-footer">
              <time${article.isoDate ? ` datetime="${escapeHtml(article.isoDate)}"` : ''}>${escapeHtml(date)}</time>
              <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">${linkLabel}</a>
            </div>
          </article>
        `;
      }).join('');

      grid.querySelectorAll('img').forEach((img) => {
        img.addEventListener('error', () => {
          if (img.dataset.fallbackApplied) return;
          img.dataset.fallbackApplied = 'true';
          img.src = placeholderImage;
          img.removeAttribute('referrerpolicy');
        }, { once: true });
      });

      const tickerItems = articles.slice(0, 12).map((article) => {
        const title = isKo && article.titleKo ? article.titleKo : article.title;
        return `<span>${escapeHtml(title)}</span><i aria-hidden="true">◆</i>`;
      }).join('');
      ticker.innerHTML = tickerItems + tickerItems;

      const updated = $('#articleUpdated');
      if (updated && payload.generatedAt) {
        const date = new Date(payload.generatedAt);
        if (!Number.isNaN(date.getTime())) {
          updated.textContent = isKo
            ? `${new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'Asia/Seoul' }).format(date)} 업데이트`
            : `Updated ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Seoul' }).format(date)}`;
        }
      }
    } catch (error) {
      console.warn('Article feed unavailable:', error);
      grid.innerHTML = `<p class="loading-state">${isKo ? '기사를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.' : 'Stories are temporarily unavailable. Please check back shortly.'}</p>`;
      ticker.innerHTML = `<span>${isKo ? '기사 목록을 불러오지 못했습니다.' : 'Reporting feed temporarily unavailable.'}</span>`;
    }
  }

  function weatherLabel(code) {
    const labels = isKo
      ? {
          0: '맑음', 1: '대체로 맑음', 2: '구름 조금', 3: '흐림',
          45: '안개', 48: '안개', 51: '이슬비', 53: '이슬비', 55: '이슬비',
          61: '비', 63: '비', 65: '강한 비', 71: '눈', 73: '눈', 75: '강한 눈',
          80: '소나기', 81: '소나기', 82: '강한 소나기', 95: '뇌우', 96: '뇌우', 99: '뇌우'
        }
      : {
          0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
          45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
          61: 'Rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Snow', 73: 'Snow', 75: 'Heavy snow',
          80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
        };
    return labels[code] || (isKo ? '현재 날씨' : 'Current');
  }

  async function loadWeatherCity(selector, latitude, longitude, timezone) {
    const root = $(selector);
    if (!root) return;
    const value = $('.weather-value', root);
    const condition = $('.weather-condition', root);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=${encodeURIComponent(timezone)}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);
      const data = await response.json();
      const temperature = Number(data?.current?.temperature_2m);
      const code = Number(data?.current?.weather_code);
      if (!Number.isFinite(temperature)) throw new Error('Invalid weather data');
      value.textContent = `${Math.round(temperature)}°C`;
      condition.textContent = weatherLabel(code);
    } catch (error) {
      console.warn(`Weather unavailable for ${selector}:`, error);
      value.textContent = '—';
      condition.textContent = isKo ? '정보 없음' : 'Unavailable';
    }
  }

  async function loadWeather() {
    await Promise.allSettled([
      loadWeatherCity('#weatherSeoul', '37.5665', '126.9780', 'Asia/Seoul'),
      loadWeatherCity('#weatherSanDiego', '32.7157', '-117.1611', 'America/Los_Angeles')
    ]);
  }

  async function loadMarkets() {
    const stage = $('#marketStage');
    if (!stage) return;

    const getRates = async () => {
      try {
        const response = await fetch('https://api.frankfurter.dev/v2/rates?base=usd&quotes=krw,jpy', { cache: 'no-store' });
        if (!response.ok) throw new Error(`FX v2 HTTP ${response.status}`);
        const rows = await response.json();
        if (!Array.isArray(rows)) throw new Error('Unexpected FX v2 response');
        const rates = Object.fromEntries(rows.map((row) => [String(row.quote || '').toUpperCase(), Number(row.rate)]));
        if (!Number.isFinite(rates.KRW) || !Number.isFinite(rates.JPY)) throw new Error('Invalid FX v2 data');
        return rates;
      } catch (primaryError) {
        console.warn('FX v2 unavailable, trying v1:', primaryError);
        const response = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW,JPY', { cache: 'no-store' });
        if (!response.ok) throw new Error(`FX v1 HTTP ${response.status}`);
        const data = await response.json();
        const rates = { KRW: Number(data?.rates?.KRW), JPY: Number(data?.rates?.JPY) };
        if (!Number.isFinite(rates.KRW) || !Number.isFinite(rates.JPY)) throw new Error('Invalid FX v1 data');
        return rates;
      }
    };

    try {
      const rates = await getRates();
      stage.innerHTML = `
        <div class="market-quotes">
          <div class="market-quote"><span class="market-symbol">USD / KRW</span><strong class="market-price">${rates.KRW.toLocaleString(isKo ? 'ko-KR' : 'en-US', { maximumFractionDigits: 2 })}</strong></div>
          <div class="market-quote"><span class="market-symbol">USD / JPY</span><strong class="market-price">${rates.JPY.toLocaleString(isKo ? 'ko-KR' : 'en-US', { maximumFractionDigits: 2 })}</strong></div>
        </div>`;
    } catch (error) {
      console.warn('FX data unavailable:', error);
      stage.innerHTML = `<span class="data-loading">${isKo ? '환율 정보 없음' : 'Reference rates unavailable'}</span>`;
    }
  }

  setCurrentDate();
  loadArticles();
  loadWeather();
  loadMarkets();
})();
