/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Header row as specified
  const headerRow = ['Columns (columns9)'];

  // --- COLUMN 1: IMAGE ---
  let imageCell = '';
  const teaserImageDiv = getChildByClass(element, 'cmp-teaser__image');
  if (teaserImageDiv) {
    // Use the <img> element only for the image cell
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageCell = img.cloneNode(true);
    }
  }

  // --- COLUMN 2: CONTENT ---
  let contentCell = '';
  const teaserContentDiv = getChildByClass(element, 'cmp-teaser__content');
  if (teaserContentDiv) {
    // Gather all text content and inline elements (including pretitle, title, address, phone)
    const frag = document.createElement('div');
    // Add pretitle if present
    const pretitle = teaserContentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      frag.appendChild(pretitle.cloneNode(true));
    }
    // Add title if present
    const title = teaserContentDiv.querySelector('.cmp-teaser__title');
    if (title) {
      frag.appendChild(title.cloneNode(true));
    }
    // Add description if present
    const desc = teaserContentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Only add non-empty paragraphs
      Array.from(desc.children).forEach((p) => {
        if (p.textContent.trim() || p.querySelector('a')) {
          frag.appendChild(p.cloneNode(true));
        }
      });
    }
    contentCell = frag;
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [imageCell, contentCell],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
