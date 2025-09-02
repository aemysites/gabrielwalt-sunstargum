/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Find image column
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  let imageCell = '';
  if (imageWrapper) {
    // Use the image block directly
    imageCell = imageWrapper;
  }

  // Find content column (title + description)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentWrapper) {
    // Use the content block directly
    contentCell = contentWrapper;
  }

  // Table header
  const headerRow = ['Columns (columns3)'];
  // Table content row: [image, content]
  const contentRow = [imageCell, contentCell];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with block
  element.replaceWith(block);
}
