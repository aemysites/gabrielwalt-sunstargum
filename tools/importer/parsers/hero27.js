/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main embed block
  const embed = element.querySelector('.cmp-embed');
  if (!embed) return;

  // Find the poster image (background image for hero)
  let posterImg = null;
  const posterDiv = embed.querySelector('.cmp-embed__youtube-poster');
  if (posterDiv) {
    posterImg = posterDiv.querySelector('img');
  }

  // Compose the table rows
  const headerRow = ['Hero (hero27)'];
  // Row 2: Background image (optional)
  const imageRow = [posterImg ? posterImg : ''];

  // Only add the third row if there is content (title/subheading/CTA)
  // In this HTML, there is none, so do not add an empty row
  const cells = [headerRow, imageRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
