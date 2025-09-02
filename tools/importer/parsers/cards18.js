/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content grid (centered article)
  let mainContent = element.querySelector('.container.center-content');
  if (!mainContent) mainContent = element;
  const mainGrid = mainContent.querySelector('.aem-Grid');
  if (!mainGrid) return;
  const children = Array.from(mainGrid.children);

  // Prepare Cards block header
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Helper to get only the direct content of a text block (no duplication)
  function extractCleanTextContent(textDiv) {
    // Only clone the direct children of the .cmp-text div
    const cmpText = textDiv.querySelector('.cmp-text');
    if (!cmpText) return '';
    const fragment = document.createDocumentFragment();
    Array.from(cmpText.children).forEach((node) => {
      fragment.appendChild(node.cloneNode(true));
    });
    return fragment;
  }

  // Card extraction logic:
  // Cards are visually: image, text, (optional button)
  // We'll find each image block, pair it with the nearest preceding text, and a button if present after image
  let i = 0;
  while (i < children.length) {
    // Find next image block
    while (i < children.length && !children[i].classList.contains('image')) i++;
    if (i >= children.length) break;
    const imageDiv = children[i];

    // Find preceding text block
    let textDiv = null;
    for (let j = i - 1; j >= 0; j--) {
      if (children[j].classList.contains('text')) {
        textDiv = children[j];
        break;
      }
      if (children[j].classList.contains('image') || children[j].classList.contains('separator')) break;
    }

    // Find following button block (CTA)
    let buttonDiv = null;
    for (let j = i + 1; j < children.length; j++) {
      if (children[j].classList.contains('button')) {
        buttonDiv = children[j];
        break;
      }
      if (children[j].classList.contains('image') || children[j].classList.contains('text') || children[j].classList.contains('separator')) break;
    }

    // Only add if both image and text are present
    if (imageDiv && textDiv) {
      // Compose cell: image, text (+button if present)
      const imageCell = imageDiv;
      // Use only the direct content of the .cmp-text block
      const textCell = buttonDiv ? [extractCleanTextContent(textDiv), buttonDiv] : extractCleanTextContent(textDiv);
      rows.push([imageCell, textCell]);
    }
    i++;
  }

  // If no cards found, do nothing
  if (rows.length === 1) return;

  // Create the Cards table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
