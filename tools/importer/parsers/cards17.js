/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel cards container
  const cardsContainer = element.querySelector('.productcarousel__cardscontainer');
  if (!cardsContainer) return;

  // Table header row
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Get all product cards
  const cardEls = Array.from(cardsContainer.children).filter(card => card.classList.contains('product__card'));

  cardEls.forEach(card => {
    // Defensive: find anchor
    const anchor = card.querySelector('a');
    // Defensive: find image block
    const imgBlock = card.querySelector('.product__card__image');
    // Defensive: find title block
    const titleBlock = card.querySelector('.product__card__title');
    // Defensive: find CTA block
    const ctaBlock = card.querySelector('.product__card__cta');

    // First cell: image (with caption if present)
    let imageCell = null;
    if (imgBlock) {
      // Use the entire image block (contains img and caption)
      imageCell = imgBlock;
    }

    // Second cell: text content (title + CTA)
    const textCellContent = [];
    if (titleBlock) textCellContent.push(titleBlock);
    if (ctaBlock) textCellContent.push(ctaBlock);
    // If no title or CTA, fallback to anchor title
    if (textCellContent.length === 0 && anchor && anchor.title) {
      const fallbackTitle = document.createElement('div');
      fallbackTitle.textContent = anchor.title;
      textCellContent.push(fallbackTitle);
    }

    // Add row: [image, text]
    rows.push([
      imageCell,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
