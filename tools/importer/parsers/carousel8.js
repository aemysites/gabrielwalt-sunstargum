/* global WebImporter */
export default function parse(element, { document }) {
  // Only process <li> blocks with expected structure
  if (!element || !element.classList.contains('cmp-contenthub__item')) return;

  // Helper to extract image element
  function getImageEl(el) {
    const imgDiv = el.querySelector('.cmp-contenthub__item__image');
    if (!imgDiv) return '';
    const img = imgDiv.querySelector('img');
    return img || '';
  }

  // Helper to extract all text content (date + title)
  function getTextContent(el) {
    const titleDiv = el.querySelector('.cmp-contenthub__item__title');
    if (!titleDiv) return '';
    // Create a fragment to hold all text
    const frag = document.createElement('div');
    // Extract date (if present)
    const dateSpan = titleDiv.querySelector('span');
    if (dateSpan) {
      const dateEl = document.createElement('div');
      dateEl.textContent = dateSpan.textContent.trim();
      frag.appendChild(dateEl);
    }
    // Extract title text (after date span)
    // Remove the date span so only the title remains
    const titleClone = titleDiv.cloneNode(true);
    if (titleClone.querySelector('span')) titleClone.querySelector('span').remove();
    const titleText = titleClone.textContent.trim();
    if (titleText) {
      const titleEl = document.createElement('div');
      titleEl.textContent = titleText;
      frag.appendChild(titleEl);
    }
    return frag.childNodes.length ? frag : '';
  }

  // Build table rows
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  const imgEl = getImageEl(element);
  const textEl = getTextContent(element);
  rows.push([
    imgEl,
    textEl,
  ]);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
