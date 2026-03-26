/**
 * glossary.js - Clickable term definition popup system
 */
const GLOSSARY = {
  "API Gravity": "Density measurement for crude oil. Higher number = lighter oil. Scale invented by the American Petroleum Institute. Light crude > 31\u00b0, Heavy crude < 22\u00b0.",
  "Backwardation": "Futures curve where near-month prices exceed far-month prices. Signals tight supply and strong near-term demand. The market is saying oil is more valuable today than tomorrow.",
  "Barrel": "Standard unit of oil measurement. 1 barrel (bbl) = 42 US gallons \u2248 159 liters.",
  "BOE": "Barrels of Oil Equivalent. Converts natural gas production to oil-equivalent for comparison. 6 mcf of gas = 1 BOE.",
  "BOEPD": "Barrels of Oil Equivalent Per Day. Standard measure of combined oil and gas production.",
  "Breakeven Price": "The oil price at which an E&P company covers all costs (capex + opex + dividends + debt service) and generates zero free cash flow. US shale avg: $45\u201365/bbl.",
  "Brent": "Global benchmark crude priced on ICE London. Light sweet grade from the North Sea. Prices approximately 75% of world oil.",
  "Capital Discipline": "Post-2020 E&P strategy of limiting capex growth and returning free cash flow to shareholders instead of drilling aggressively.",
  "Contango": "Futures curve where far-month prices exceed near-month prices. Signals oversupply or weak near-term demand. Incentivizes inventory builds and storage plays.",
  "Crack Spread": "The margin between crude oil input cost and refined product output prices. The refiner\u2019s gross profit metric. The 3-2-1 spread: 2 bbls gasoline + 1 bbl distillate from 3 bbls crude.",
  "Decline Rate": "The rate at which a well\u2019s production decreases over time. Shale wells typically decline 50\u201370% in Year 1.",
  "E&P": "Exploration & Production. Upstream companies that find and extract oil and gas. Revenue = production volume \u00d7 oil price.",
  "EIA": "US Energy Information Administration. Publishes the weekly crude inventory report every Wednesday \u2014 the single most market-moving oil data point.",
  "FCF Yield": "Free Cash Flow / Market Cap. The most important valuation metric for E&P companies in the current capital-discipline era.",
  "Force Majeure": "Legal clause allowing companies to suspend contractual obligations due to extraordinary events beyond their control (wars, natural disasters, blockades).",
  "Fracking": "Hydraulic fracturing. Technique of injecting high-pressure fluid into rock to fracture it and release trapped oil/gas. The technology behind the US shale revolution.",
  "IEA": "International Energy Agency. Paris-based intergovernmental body that monitors global energy markets and publishes demand/supply forecasts.",
  "IRGC": "Islamic Revolutionary Guard Corps. Iran\u2019s elite military force responsible for closing the Strait of Hormuz in March 2026.",
  "LNG": "Liquefied Natural Gas. Natural gas cooled to \u2013260\u00b0F to become liquid for shipping. Qatar is the world\u2019s largest exporter. Cheniere (LNG) is the largest US exporter.",
  "MLP": "Master Limited Partnership. Tax-advantaged corporate structure used by many midstream companies. Issues K-1 tax forms instead of 1099s. Offers high distribution yields.",
  "NGL": "Natural Gas Liquids. Ethane, propane, butane extracted from natural gas processing. Valuable petrochemical feedstock.",
  "NYMEX": "New York Mercantile Exchange. Part of CME Group. Where WTI crude oil futures are traded.",
  "ICE": "Intercontinental Exchange. London-based exchange where Brent crude oil futures are traded.",
  "DME": "Dubai Mercantile Exchange. Where Dubai/Oman crude oil futures are traded, pricing Asia-Pacific oil.",
  "OFAC": "Office of Foreign Assets Control. US Treasury department that administers sanctions programs, including Venezuela and Iran sanctions.",
  "OPEC+": "Organization of Petroleum Exporting Countries plus allies (notably Russia). Controls ~40% of global oil supply through production quotas set at periodic meetings.",
  "Orinoco Belt": "Vast extra-heavy oil region in eastern Venezuela containing over 75% of the country\u2019s reserves. API gravity 5\u201315\u00b0, sulfur 4\u20136%. Requires upgraders or diluents.",
  "PDVSA": "Petr\u00f3leos de Venezuela S.A. Venezuela\u2019s state-owned oil company. Currently operates under US sanctions with payments routed through US-controlled accounts.",
  "Permian Basin": "Largest US oil-producing region spanning West Texas and SE New Mexico. The crown jewel of US shale. Home to top E&Ps like Diamondback, EOG, and Devon.",
  "Rig Count": "Baker Hughes weekly report (every Friday) of active US drilling rigs. Leading indicator for future oil production and OFS demand.",
  "SPR": "Strategic Petroleum Reserve. US government emergency oil stockpile. ~400 million barrels as of early 2026. Releases add supply to cap prices.",
  "Sweet Crude": "Crude oil with sulfur content below 0.5%. Easier and cheaper to refine. Commands a premium price. Most desirable for refiners.",
  "Sour Crude": "Crude oil with sulfur content above 0.5%. Requires additional hydrotreating/hydrodesulfurization. More expensive to refine. Trades at a discount.",
  "Take-or-Pay": "Midstream contract where the shipper pays regardless of whether they actually use the pipeline capacity. Provides revenue stability.",
  "Turnaround": "Scheduled refinery maintenance shutdown for repairs and upgrades. Temporarily reduces throughput and earnings. Planned weeks/months in advance.",
  "WTI": "West Texas Intermediate. US benchmark crude priced at Cushing, Oklahoma via NYMEX. Light sweet grade (39.6\u00b0 API, 0.24% sulfur).",
  "FCC": "Fluid Catalytic Cracking. Uses a catalyst and heat to crack heavy gas oil into gasoline. The most important conversion unit in US refineries.",
  "Hydrocracking": "Uses hydrogen and a catalyst under high pressure. Produces cleaner diesel and jet fuel. More expensive but yields higher-quality products.",
  "Nelson Complexity Index": "Measure of a refinery\u2019s ability to process different crude types. Higher complexity = ability to run cheaper heavy/sour crude = structural margin advantage.",
  "OFS": "Oilfield Services. Companies that provide equipment, technology, and expertise to E&P companies. Key players: SLB, HAL, BKR.",
  "WCS": "Western Canada Select. Canadian heavy crude benchmark. Trades at a discount to WTI. Venezuelan heavy crude competes directly with WCS for refinery throughput.",
};

let activePopup = null;

function initGlossary() {
  document.addEventListener('click', function(e) {
    const term = e.target.closest('.term');
    if (term) {
      e.preventDefault();
      e.stopPropagation();
      showTermPopup(term);
      return;
    }
    if (activePopup && !e.target.closest('.term-popup')) {
      closePopup();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activePopup) {
      closePopup();
    }
  });
}

function showTermPopup(el) {
  closePopup();

  const termKey = el.getAttribute('data-term') || el.textContent.trim();
  const definition = GLOSSARY[termKey];
  if (!definition) return;

  const popup = document.createElement('div');
  popup.className = 'term-popup';
  popup.innerHTML = `
    <div class="popup-title">${termKey}</div>
    <div class="popup-body">${definition}</div>
  `;

  document.body.appendChild(popup);
  activePopup = popup;

  // Position near the term element
  const rect = el.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();

  let top = rect.bottom + 8;
  let left = rect.left;

  // Keep within viewport
  if (top + popupRect.height > window.innerHeight - 20) {
    top = rect.top - popupRect.height - 8;
  }
  if (left + popupRect.width > window.innerWidth - 20) {
    left = window.innerWidth - popupRect.width - 20;
  }
  if (left < 20) left = 20;

  popup.style.top = top + 'px';
  popup.style.left = left + 'px';
}

function closePopup() {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlossary);
} else {
  initGlossary();
}
