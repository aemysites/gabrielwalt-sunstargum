/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser content block
  const teaser = element.querySelector('.cmp-teaser__content') || element;

  // Find the title (h1)
  const title = teaser.querySelector('h1');

  // Find the description (usually a div with a p inside)
  const descriptionContainer = teaser.querySelector('.cmp-teaser__description');
  let description = null;
  if (descriptionContainer) {
    // Use the whole container for resilience (may contain more than just <p>)
    description = descriptionContainer;
  }

  // Find the CTA button (if present)
  let cta = null;
  const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
  if (actionContainer) {
    // Use the whole action container for resilience
    cta = actionContainer;
  }

  // Compose the content cell for row 3
  const contentCell = [];
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  // Table rows
  const headerRow = ['Hero (hero28)'];
  const imageRow = ['']; // No background image in this HTML
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
