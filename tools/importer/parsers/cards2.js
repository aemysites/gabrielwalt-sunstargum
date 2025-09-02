/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process <a> elements with the expected class
  if (!element || !element.matches('a.productcollection__item')) return;

  // Header row as required
  const headerRow = ['Cards (cards2)'];

  // --- IMAGE CELL ---
  // Find the image inside the card
  let imageCell = null;
  const imagesDiv = element.querySelector('.productcollection__item-images');
  if (imagesDiv) {
    // Find the first <img> inside
    const img = imagesDiv.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // --- TEXT CELL ---
  // We'll build a fragment containing all text content (title, price, etc.)
  const textFragment = document.createElement('div');

  // Title (as plain text, not heading, to match screenshot)
  const titleDiv = element.querySelector('.productcollection__item-title');
  if (titleDiv) {
    const titleSpan = titleDiv.querySelector('span');
    if (titleSpan) {
      // Just append the text as-is (no heading)
      textFragment.appendChild(document.createTextNode(titleSpan.textContent));
    }
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [imageCell, textFragment],
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
