/* global WebImporter */
export default function parse(element, { document }) {
  // Find the FAQ accordion block
  const accordion = element.querySelector('.accordion.panelcontainer, .cmp-accordion');
  if (!accordion) return;

  // Header row as per guidelines
  const headerRow = ['Accordion (accordion31)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the .cmp-accordion__title text
    let title = item.querySelector('.cmp-accordion__title');
    let titleCell;
    if (title) {
      titleCell = title.textContent.trim();
    } else {
      // fallback: try button text
      const btn = item.querySelector('.cmp-accordion__button');
      titleCell = btn ? btn.textContent.trim() : '';
    }

    // Content cell: get the panel content
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Only include direct children that are not wrappers/metadata
      // e.g., <p>, <ul>, <ol>, <img>, <a>, <strong>, <em>, etc.
      const allowedTags = ['P', 'UL', 'OL', 'IMG', 'A', 'STRONG', 'EM', 'TABLE', 'VIDEO', 'PICTURE', 'FIGURE', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      const contentNodes = Array.from(panel.children).filter(node => allowedTags.includes(node.tagName));
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0].cloneNode(true);
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes.map(node => node.cloneNode(true));
      } else {
        // fallback: use panel text
        contentCell = panel.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
