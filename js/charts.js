/**
 * charts.js - TradingView Lightweight Charts modal with EMA + MACD
 */

const COMPANY_NAMES = {
  COP: "ConocoPhillips", DVN: "Devon Energy", EOG: "EOG Resources",
  FANG: "Diamondback Energy", OXY: "Occidental Petroleum",
  EPD: "Enterprise Products", WMB: "Williams Companies", KMI: "Kinder Morgan",
  ET: "Energy Transfer", LNG: "Cheniere Energy",
  VLO: "Valero Energy", MPC: "Marathon Petroleum", PSX: "Phillips 66",
  XOM: "ExxonMobil", CVX: "Chevron",
  SLB: "SLB (Schlumberger)", HAL: "Halliburton", BKR: "Baker Hughes",
};

const dataCache = {};

/** Read a computed CSS variable value from :root */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function initCharts() {
  document.addEventListener('click', function(e) {
    const ticker = e.target.closest('.ticker');
    if (ticker) {
      e.preventDefault();
      e.stopPropagation();
      openChartModal(ticker.getAttribute('data-ticker') || ticker.textContent.trim());
    }
  });
}

async function fetchTickerData(ticker) {
  if (dataCache[ticker]) return dataCache[ticker];
  try {
    const resp = await fetch(`data/${ticker}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    dataCache[ticker] = data;
    return data;
  } catch (err) {
    console.error(`Failed to load data for ${ticker}:`, err);
    return null;
  }
}

function computeEMA(data, period) {
  const result = [];
  const k = 2 / (period + 1);
  let ema = null;
  for (let i = 0; i < data.length; i++) {
    const close = data[i].close;
    if (ema === null) {
      if (i < period - 1) continue;
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
      ema = sum / period;
    } else {
      ema = close * k + ema * (1 - k);
    }
    result.push({ time: data[i].time, value: Math.round(ema * 100) / 100 });
  }
  return result;
}

function computeMACD(data, fast = 12, slow = 26, signal = 9) {
  const closes = data.map(d => d.close);
  const times = data.map(d => d.time);

  function emaArr(arr, period) {
    const out = [];
    const k = 2 / (period + 1);
    let ema = null;
    for (let i = 0; i < arr.length; i++) {
      if (ema === null) {
        if (i < period - 1) { out.push(null); continue; }
        let sum = 0;
        for (let j = i - period + 1; j <= i; j++) sum += arr[j];
        ema = sum / period;
      } else {
        ema = arr[i] * k + ema * (1 - k);
      }
      out.push(ema);
    }
    return out;
  }

  const fastEma = emaArr(closes, fast);
  const slowEma = emaArr(closes, slow);

  const macdLine = [];
  for (let i = 0; i < closes.length; i++) {
    if (fastEma[i] != null && slowEma[i] != null) {
      macdLine.push(fastEma[i] - slowEma[i]);
    } else {
      macdLine.push(null);
    }
  }

  const validMacd = macdLine.filter(v => v !== null);
  const signalEma = emaArr(validMacd, signal);

  let si = 0;
  const macdResult = [], signalResult = [], histResult = [];
  const posColor = getCSSVar('--primary') || '#f2d801';
  const negColor = getCSSVar('--error') || '#E63946';
  for (let i = 0; i < closes.length; i++) {
    if (macdLine[i] === null) continue;
    const m = Math.round(macdLine[i] * 1000) / 1000;
    const s = signalEma[si] != null ? Math.round(signalEma[si] * 1000) / 1000 : null;
    macdResult.push({ time: times[i], value: m });
    if (s !== null) {
      signalResult.push({ time: times[i], value: s });
      histResult.push({
        time: times[i],
        value: Math.round((m - s) * 1000) / 1000,
        color: m - s >= 0 ? posColor + '99' : negColor + '99',
      });
    }
    si++;
  }

  return { macd: macdResult, signal: signalResult, histogram: histResult };
}

async function openChartModal(ticker) {
  const existing = document.querySelector('.chart-modal-overlay');
  if (existing) existing.remove();

  const companyName = COMPANY_NAMES[ticker] || ticker;

  const overlay = document.createElement('div');
  overlay.className = 'chart-modal-overlay';
  overlay.innerHTML = `
    <div class="chart-modal">
      <div class="chart-modal-header">
        <h3>${companyName} <span style="color: var(--primary-dim)">(${ticker})</span></h3>
        <button class="chart-modal-close" title="Close">&times;</button>
      </div>
      <div class="chart-modal-tabs">
        <button class="chart-modal-tab active" data-tab="chart">Chart</button>
        <button class="chart-modal-tab" data-tab="financials">Financials</button>
        <button class="chart-modal-tab" data-tab="balance">Balance Sheet</button>
      </div>
      <div class="chart-modal-body">
        <div id="tab-chart" class="tab-content" style="display:flex; flex-direction:column; height:100%;">
          <div class="chart-legend">
            <span><span class="dot" style="background:#00BCD4"></span> 20 EMA</span>
            <span><span class="dot" style="background:#FF9800"></span> 50 EMA</span>
            <span><span class="dot" style="background:#E040FB"></span> 200 EMA</span>
          </div>
          <div id="price-chart" class="chart-container" style="flex: 3; min-height:0;"></div>
          <div id="macd-chart" class="chart-container" style="flex: 1.5; min-height:0; margin-top: 8px;"></div>
        </div>
        <div id="tab-financials" class="tab-content" style="display:none;">
          <div class="financials-placeholder">
            <div class="icon">&#128202;</div>
            <p>Earnings & financial data for <strong>${ticker}</strong> will be available soon.</p>
            <p style="font-size:0.8em; color: var(--on-surface-variant)">Awaiting data from analyst screenshots.</p>
          </div>
        </div>
        <div id="tab-balance" class="tab-content" style="display:none;">
          <div class="financials-placeholder">
            <div class="icon">&#128200;</div>
            <p>Balance sheet data for <strong>${ticker}</strong> will be available soon.</p>
            <p style="font-size:0.8em; color: var(--on-surface-variant)">Awaiting data from analyst screenshots.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  if (window.Reveal) Reveal.configure({ keyboard: false });

  overlay.querySelector('.chart-modal-close').onclick = () => closeChartModal(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeChartModal(overlay);
  });
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeChartModal(overlay);
      document.removeEventListener('keydown', escHandler);
    }
  });

  overlay.querySelectorAll('.chart-modal-tab').forEach(tab => {
    tab.onclick = () => {
      overlay.querySelectorAll('.chart-modal-tab').forEach(t => t.classList.remove('active'));
      overlay.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).style.display = '';
    };
  });

  const data = await fetchTickerData(ticker);
  if (!data || data.length === 0) return;

  renderPriceChart(data, overlay.querySelector('#price-chart'));
  renderMACDChart(data, overlay.querySelector('#macd-chart'));
}

function renderPriceChart(data, container) {
  const surface = getCSSVar('--surface') || '#0c141f';
  const textColor = getCSSVar('--on-surface') || '#dbe3f4';
  const fontBody = getCSSVar('--font-body') || 'Inter';
  const gridColor = 'rgba(74, 85, 104, 0.1)';
  const scaleColor = 'rgba(74, 85, 104, 0.2)';
  const upColor = getCSSVar('--primary') || '#f2d801';
  const downColor = getCSSVar('--error') || '#E63946';

  const chart = LightweightCharts.createChart(container, {
    layout: {
      background: { type: 'solid', color: surface },
      textColor: textColor,
      fontFamily: fontBody,
    },
    grid: {
      vertLines: { color: gridColor },
      horzLines: { color: gridColor },
    },
    crosshair: { mode: 0 },
    rightPriceScale: { borderColor: scaleColor },
    timeScale: {
      borderColor: scaleColor,
      timeVisible: false,
    },
    handleScale: { axisPressedMouseMove: true },
    handleScroll: { mouseWheel: true, pressedMouseMove: true },
  });

  const candleSeries = chart.addCandlestickSeries({
    upColor: upColor,
    downColor: downColor,
    borderUpColor: upColor,
    borderDownColor: downColor,
    wickUpColor: upColor,
    wickDownColor: downColor,
  });
  candleSeries.setData(data);

  const ema20 = chart.addLineSeries({
    color: '#00BCD4', lineWidth: 1, priceLineVisible: false,
    lastValueVisible: false, crosshairMarkerVisible: false,
  });
  ema20.setData(computeEMA(data, 20));

  const ema50 = chart.addLineSeries({
    color: '#FF9800', lineWidth: 1, priceLineVisible: false,
    lastValueVisible: false, crosshairMarkerVisible: false,
  });
  ema50.setData(computeEMA(data, 50));

  const ema200 = chart.addLineSeries({
    color: '#E040FB', lineWidth: 1, priceLineVisible: false,
    lastValueVisible: false, crosshairMarkerVisible: false,
  });
  ema200.setData(computeEMA(data, 200));

  chart.timeScale().fitContent();

  const ro = new ResizeObserver(() => {
    chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
  });
  ro.observe(container);
}

function renderMACDChart(data, container) {
  const surface = getCSSVar('--surface') || '#0c141f';
  const textColor = getCSSVar('--on-surface') || '#dbe3f4';
  const fontBody = getCSSVar('--font-body') || 'Inter';
  const gridColor = 'rgba(74, 85, 104, 0.06)';
  const scaleColor = 'rgba(74, 85, 104, 0.2)';

  const chart = LightweightCharts.createChart(container, {
    layout: {
      background: { type: 'solid', color: surface },
      textColor: textColor,
      fontFamily: fontBody,
      fontSize: 10,
    },
    grid: {
      vertLines: { color: gridColor },
      horzLines: { color: gridColor },
    },
    crosshair: { mode: 0 },
    rightPriceScale: { borderColor: scaleColor },
    timeScale: {
      borderColor: scaleColor,
      timeVisible: false,
    },
    handleScale: { axisPressedMouseMove: true },
    handleScroll: { mouseWheel: true, pressedMouseMove: true },
  });

  const { macd, signal, histogram } = computeMACD(data);

  const histSeries = chart.addHistogramSeries({
    priceLineVisible: false, lastValueVisible: false,
    priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
  });
  histSeries.setData(histogram);

  const macdSeries = chart.addLineSeries({
    color: '#00BCD4', lineWidth: 1.5, priceLineVisible: false,
    lastValueVisible: false, crosshairMarkerVisible: false,
  });
  macdSeries.setData(macd);

  const signalSeries = chart.addLineSeries({
    color: '#FF9800', lineWidth: 1.5, priceLineVisible: false,
    lastValueVisible: false, crosshairMarkerVisible: false,
  });
  signalSeries.setData(signal);

  chart.timeScale().fitContent();

  const ro = new ResizeObserver(() => {
    chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
  });
  ro.observe(container);
}

function closeChartModal(overlay) {
  overlay.remove();
  if (window.Reveal) Reveal.configure({ keyboard: true });
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharts);
} else {
  initCharts();
}
