const searchPages = [["Our forecasts and update schedule","forecasts.html","Latest available forecast; updates every two months with October and December 2026 and February 2027 ECMWF cycles; preceding-month ERA5 and ERA5T; seven complete forecast months."],["The 2026 carbon outlook","outlook.html","Global carbon balance, 51 members, NBP anomalies and regional risks."],["Key results for 2026","key-results.html","Brazil, South America, carbon-sink hotspots, peatlands and fire."],["Carbon-sink map","figures.html#map","Spatial NBP anomalies, ensemble agreement and maps."],["Fire outlook","figures.html#fire","Equatorial Asia, Indonesia, burned area and peatlands."],["Regional risk windows","key-results.html#windows","Monthly timing in Brazil, Africa, Australia and North America."],["How the outlook is made","methods.html","ECMWF, ERA5, JULES, ORCHIDEE-MICT, random forest, LSTM, validation."],["The Data Hub","data.html","Data sources, inputs, Figshare, source code and research-material enquiries."],["News and agency updates","context.html","NOAA, WMO, NASA and Nature reporting about super El Niño."],["FAQs about El Niño and carbon","faq.html","Carbon sinks, NBP, forecasts, super El Niño and uncertainty."],["About the carbon outlook","research.html","Research collaboration and the purpose of this outlook."],["Contact us","contact.html","Wei Li, Tsinghua University, research and media enquiries."],["Image credits","credits.html","Pacific Ocean, satellite images, NASA attribution, observation dates and image-use terms."]];

const searchDialog = document.querySelector('.search-dialog');
const searchInput = document.getElementById('site-search');
const searchResults = document.querySelector('.search-results');
function showSearchResults() {
  const words = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  searchResults.replaceChildren();
  const matches = searchPages.filter(page => words.every(word => page.join(' ').toLowerCase().includes(word)));
  matches.forEach(([title, url, description]) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    const summary = document.createElement('span');
    summary.textContent = description;
    link.append(summary);
    item.append(link);
    searchResults.append(item);
  });
  if (matches.length) return;
  const item = document.createElement('li');
  item.textContent = 'No matching pages. Try carbon, fire, data or NOAA.';
  searchResults.append(item);
}
document.querySelector('.search-toggle').addEventListener('click', () => {
  showSearchResults();
  searchDialog.showModal();
  searchInput.focus();
});
searchInput.addEventListener('input', showSearchResults);
searchDialog.querySelector('.dialog-close').addEventListener('click', () => searchDialog.close());

const topButton = document.querySelector('.to-top');
function updateTopButton() { topButton.hidden = window.scrollY < 450; }
window.addEventListener('scroll', updateTopButton, { passive: true });
updateTopButton();
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'auto' }));

const filterButtons = [...document.querySelectorAll('.filter-button')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const cards = [...document.querySelectorAll('.source-card')];
  cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
  const count = cards.filter(card => !card.hidden).length;
  document.getElementById('source-count').textContent = count + (count === 1 ? ' source shown' : ' sources shown');
  const tiles = document.querySelector('.news-tiles');
  tiles.hidden = ![...tiles.children].some(tile => !tile.hidden);
  const resources = document.querySelector('.source-resources');
  resources.hidden = ![...resources.children].some(card => !card.hidden);
  resources.previousElementSibling.hidden = resources.hidden;
}));

const figureDialog = document.querySelector('.figure-dialog');
let figureTrigger;
document.querySelectorAll('.enlarge-figure').forEach(button => button.addEventListener('click', () => {
  const figure = button.closest('figure');
  const source = figure.querySelector(':scope > svg, :scope > img');
  const copy = source.cloneNode(true);
  copy.querySelectorAll('[id]').forEach(node => { node.id += '-dialog'; });
  if (copy.hasAttribute('aria-labelledby')) copy.setAttribute('aria-labelledby', copy.getAttribute('aria-labelledby') + '-dialog');
  figureDialog.querySelector('h2').textContent = figure.dataset.title;
  figureDialog.querySelector('.dialog-figure').replaceChildren(copy);
  figureDialog.querySelector('.dialog-note').textContent = figure.querySelector('figcaption').textContent;
  figureTrigger = button;
  figureDialog.showModal();
}));
figureDialog.querySelector('.dialog-close').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('close', () => { if (figureTrigger) figureTrigger.focus(); });
