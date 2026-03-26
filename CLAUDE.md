# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive HTML presentation ("Oil 101") for the oil industry, built with Reveal.js and designed for GitHub Pages hosting. Dark navy + gold theme matching the trading-slides project.

## Tech Stack

- **Reveal.js** (CDN) — slide framework with transitions, keyboard nav, progress bar
- **TradingView Lightweight Charts v4** (CDN) — candlestick charts with EMA/MACD indicators
- **Vanilla JS** (ES6+) — no build tools, no bundler, runs directly in browser
- **Python 3.13** + `yfinance` — one-time data fetching script (not runtime)
- **Google Fonts** — Poppins

## Commands

### Refresh stock data (18 oil sector tickers, 3 years daily OHLCV)
```
py -3.13 fetch_data.py
```
Requires `yfinance` installed: `py -3.13 -m pip install yfinance`

### Local preview
Open `index.html` directly in a browser, or use any static server. Reveal.js and TradingView Charts load from CDN.

## Architecture

All content lives in a single `index.html` with Reveal.js slide sections. Four JS modules handle interactivity:

| File | Purpose | Key pattern |
|------|---------|-------------|
| `js/main.js` | Reveal.js init (1280x720), slide-change event handling, barrel bar animations | Entry point, loads first |
| `js/charts.js` | Stock chart modal — click any `.ticker` element to open. Computes EMA (20/50/200) and MACD (12/26/9) client-side from JSON data. Tabs: Chart / Financials / Balance Sheet | Disables Reveal keyboard while modal is open |
| `js/glossary.js` | Term popup system — click any `.term` element. 45+ oil industry definitions in `GLOSSARY` object | Smart viewport boundary positioning |
| `js/quiz.js` | 5 multiple-choice quizzes in `QUIZZES` object. Tracks cumulative score across quizzes | Renders into `.quiz-slide[data-quiz="quizN"]` containers |

### Data flow
- `fetch_data.py` → `data/{TICKER}.json` (18 files, OHLCV format for TradingView)
- Chart modal fetches JSON via `fetch()`, caches in memory (`dataCache` object)
- EMA and MACD are computed in JS from close prices (no server needed)

### Interactive element markup conventions
- Glossary terms: `<span class="term" data-term="API Gravity">API Gravity</span>`
- Clickable tickers: `<span class="ticker" data-ticker="COP">COP</span>`
- Quiz slides: `<section class="quiz-slide" data-quiz="quiz1"><div class="quiz-container"></div></section>`

## Styling

Color palette from trading-slides `slide_config.py`:
- Background: `#0A1A2A` (navy), lighter variants `#0F2236`, `#142A3E`
- Accent: `#FFD700` (bright gold), `#AD8834` (subdued gold)
- Text: `#E6E6E6` (off-white), negative: `#E63946` (red)
- Table headers: gold bg (`#AD8834`) with navy text (`#0A1A2A`), alternating navy row shades
- Font: Poppins throughout

## Content Source

The `Oil-101-Analyst-Primer_1.docx` is the **source of truth** for all presentation content. The `.pptx` informs slide layout/structure. When updating content, reference the docx.

## Tickers covered (18)

E&P: COP, DVN, EOG, FANG, OXY | Midstream: EPD, WMB, KMI, ET, LNG | Refiners: VLO, MPC, PSX | Supermajors: XOM, CVX | OFS: SLB, HAL, BKR
