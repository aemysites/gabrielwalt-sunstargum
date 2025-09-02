/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section with the two cards under "Pourquoi participer ?"
  // Locate the h2 with "Pourquoi participer ?"
  const h2 = Array.from(element.querySelectorAll('h2')).find(h => h.textContent.trim().toLowerCase().includes('pourquoi participer'));
  if (!h2) return;

  // Find the next two .cmp-teaser blocks after this h2
  let teasers = [];
  let sibling = h2.parentElement.parentElement.nextElementSibling;
  while (sibling && teasers.length < 2) {
    const teaser = sibling.querySelector && sibling.querySelector('.cmp-teaser');
    if (teaser) teasers.push(teaser);
    sibling = sibling.nextElementSibling;
  }
  if (teasers.length !== 2) return;

  // Build table rows
  const rows = [
    ['Cards (cards25)']
  ];
  teasers.forEach(teaser => {
    // Image cell
    let imgCell = null;
    const imgWrap = teaser.querySelector('.cmp-teaser__image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imgCell = imgWrap;
    }
    // Text cell
    const content = teaser.querySelector('.cmp-teaser__content');
    let textCell = [];
    if (content) {
      // Title
      const title = content.querySelector('.cmp-teaser__title');
      if (title) textCell.push(title);
      // Description (list or ul)
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) textCell.push(desc);
      // CTA button
      const btn = content.querySelector('.cmp-button');
      if (btn) textCell.push(btn);
    }
    rows.push([
      imgCell,
      textCell
    ]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Insert table after the h2 block
  h2.parentElement.parentElement.after(table);
}
