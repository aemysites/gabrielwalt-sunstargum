/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Block header as required
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];

  // Each accordion item is a <li.productcollection__filter>
  const filterItems = element.querySelectorAll(':scope > ul > li.productcollection__filter');

  filterItems.forEach((filterItem) => {
    // Title cell: label.productcollection__filter-header (reference the actual element)
    const label = filterItem.querySelector('.productcollection__filter-header');
    if (!label) return; // Defensive: skip if no label

    // Content cell: the <ul.productcollection__filter-items> (reference the actual element)
    const contentList = filterItem.querySelector('.productcollection__filter-items');
    let contentCell;
    if (contentList) {
      contentCell = contentList;
    } else {
      // If no content, provide an empty div
      contentCell = document.createElement('div');
    }

    rows.push([label, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
