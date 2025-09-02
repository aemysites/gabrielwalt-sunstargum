/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel container
  const carousel = element.querySelector('.productcarousel__container');
  if (!carousel) return;

  // Find the cards container
  const cardsContainer = carousel.querySelector('.productcarousel__cardscontainer');
  if (!cardsContainer) return;

  // Get all product cards
  const cards = Array.from(cardsContainer.querySelectorAll('.card.product__card'));

  // Table header
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  cards.forEach((card) => {
    // Defensive: find the link
    const link = card.querySelector('a');
    // Defensive: find card content
    const cardContent = link ? link.querySelector('.product__card__content') : null;
    if (!cardContent) return;

    // Image cell
    const imageDiv = cardContent.querySelector('.product__card__image');
    let imageCell = null;
    if (imageDiv) {
      // Use the whole image div (contains img and caption)
      imageCell = imageDiv;
    }

    // Text cell: title and CTA
    const titleDiv = cardContent.querySelector('.product__card__title');
    // Defensive: get text content
    let titleElem = null;
    if (titleDiv) {
      // Create heading element for title
      titleElem = document.createElement('strong');
      titleElem.textContent = titleDiv.textContent.trim();
    }

    // CTA: use the link's href and button text
    let ctaElem = null;
    const ctaDiv = cardContent.querySelector('.product__card__cta');
    if (ctaDiv && link) {
      const btn = ctaDiv.querySelector('button');
      if (btn) {
        ctaElem = document.createElement('a');
        ctaElem.href = link.href;
        ctaElem.textContent = btn.textContent.trim();
      }
    }

    // Compose text cell
    const textCellContent = [];
    if (titleElem) textCellContent.push(titleElem);
    if (ctaElem) textCellContent.push(document.createElement('br'), ctaElem);
    // If only one element, use it directly, otherwise use array
    const textCell = textCellContent.length === 1 ? textCellContent[0] : textCellContent;

    // Add row: [image, text]
    rows.push([imageCell, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
