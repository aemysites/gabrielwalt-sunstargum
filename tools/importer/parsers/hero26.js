/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Hero (hero26)'];

  // Find the main content container
  const teaserContent = element.querySelector('.cmp-teaser__content') || element;
  const heading = teaserContent.querySelector('h3, h2, h1');

  // Collect all description lines and paragraphs as a single subheading string
  const description = teaserContent.querySelector('.cmp-teaser__description');
  let subheadingText = '';
  if (description) {
    // Gather all .ewa-rteLine and non-empty paragraphs as plain text
    const lines = Array.from(description.querySelectorAll('.ewa-rteLine'));
    const paragraphs = Array.from(description.querySelectorAll('p')).filter(p => p.textContent.trim());
    const allText = [...lines, ...paragraphs].map(node => node.textContent.trim()).filter(Boolean);
    if (allText.length) {
      subheadingText = allText.join(' ');
    }
  }

  // Compose the content cell for the third row
  const contentCell = document.createElement('div');
  if (heading) contentCell.appendChild(heading.cloneNode(true));
  if (subheadingText) {
    const subheadingEl = document.createElement('p');
    subheadingEl.textContent = subheadingText;
    contentCell.appendChild(subheadingEl);
  }
  // No CTA in this HTML

  // Always create 3 rows: header, image (empty), content
  const cells = [headerRow, [''], [contentCell]];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
