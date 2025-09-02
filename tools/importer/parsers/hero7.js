/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero7)'];

  // Row 2: Background image (none in this HTML)
  const imageRow = ['']; // No image present

  // Row 3: Content (extract all text content from the block)
  // Get the main heading (h2)
  const heading = element.querySelector('h2');
  let contentRow = [''];
  if (heading) {
    // Use the heading directly
    contentRow = [heading];
  }

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
