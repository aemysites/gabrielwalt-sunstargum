/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list block for related articles
  const imageList = element.querySelector('.image-list-related-articles .cmp-image-list');
  if (!imageList) return;

  // Header row for the Cards block
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Get all card items (li elements)
  const cardItems = imageList.querySelectorAll('.cmp-image-list__item');

  cardItems.forEach((li) => {
    // Image (first cell)
    const imageDiv = li.querySelector('.cmp-image');
    let imageEl = null;
    if (imageDiv) {
      imageEl = imageDiv.querySelector('img');
    }

    // Text content (second cell)
    // Instead of only picking title and description, collect all text content in the card
    const textCell = [];

    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const heading = document.createElement('h3');
      heading.textContent = titleLink.textContent.trim();
      textCell.push(heading);
    }

    // Description
    const descriptionSpan = li.querySelector('.cmp-image-list__item-description');
    if (descriptionSpan) {
      const desc = document.createElement('p');
      desc.textContent = descriptionSpan.textContent.trim();
      textCell.push(desc);
    }

    // Add row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
