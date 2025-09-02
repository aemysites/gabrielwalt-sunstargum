/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Columns (columns16)'];

  // Get the main grid inside the container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the text block above the online retailers
  const textBlocks = Array.from(grid.querySelectorAll('.text .cmp-text'));
  // The second text block is the one introducing the online retailers
  const onlineTextBlock = textBlocks.length > 1 ? textBlocks[1] : null;

  // Find all teaser blocks (retailer logos)
  const teasers = Array.from(grid.querySelectorAll('.teaser-where-to-buy'));

  // Defensive: Only proceed if we have at least one teaser and the text block
  if (!onlineTextBlock || teasers.length === 0) return;

  // We'll split teasers into two rows of three, but only create rows with actual content (no empty columns)
  const firstRowTeasers = teasers.slice(0, 3);
  const secondRowTeasers = teasers.slice(3, 6);

  // First content row: intro text in first cell, then first two logos (if present)
  const row1 = [
    (() => {
      const div = document.createElement('div');
      Array.from(onlineTextBlock.childNodes).forEach(node => div.appendChild(node.cloneNode(true)));
      return div;
    })()
  ];
  firstRowTeasers.forEach(teaser => {
    row1.push(teaser.cloneNode(true));
  });

  // Second content row: up to three logos, only if present
  const row2 = [];
  secondRowTeasers.forEach(teaser => {
    row2.push(teaser.cloneNode(true));
  });

  // Compose the table rows, only add non-empty rows
  const rows = [
    headerRow,
    row1,
  ];
  if (row2.length > 0) rows.push(row2);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
