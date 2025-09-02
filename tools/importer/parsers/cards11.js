/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the cards
  const grid = element.querySelector('.cmp-container .aem-Grid');
  if (!grid) return;

  // Get all immediate card containers (each card is a .image div)
  const cardDivs = Array.from(grid.children).filter(child => child.classList.contains('image'));

  // Build rows for each card (image in first cell, second cell is mandatory but empty)
  const rows = cardDivs.map(cardDiv => {
    // Find the image element (mandatory)
    const imgWrapper = cardDiv.querySelector('[data-cmp-is="image"]');
    let imgEl = null;
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }
    // Defensive: If no image, skip this card
    if (!imgEl) return null;
    // Two columns: image, empty string (second column is mandatory for block structure)
    return [imgEl, ''];
  }).filter(Boolean);

  // Table header
  const headerRow = ['Cards (cards11)'];

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
