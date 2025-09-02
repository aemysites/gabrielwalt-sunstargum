/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a card
  function getCardImage(card) {
    const imgContainer = card.querySelector('.product__card__image');
    if (!imgContainer) return '';
    const img = imgContainer.querySelector('img');
    if (!img) return '';
    // Reference the existing image element
    return img;
  }

  // Helper to extract the text content (title + description + CTA) from a card
  function getCardText(card) {
    const frag = document.createDocumentFragment();
    // Title
    const titleDiv = card.querySelector('.product__card__title');
    if (titleDiv) {
      const h3 = document.createElement('h3');
      h3.textContent = titleDiv.textContent.trim();
      frag.appendChild(h3);
    }
    // Description (from image caption if present)
    const captionSpan = card.querySelector('.cmp-image__title');
    if (captionSpan) {
      const p = document.createElement('p');
      p.textContent = captionSpan.textContent.trim();
      frag.appendChild(p);
    }
    // CTA (button)
    const ctaDiv = card.querySelector('.product__card__cta');
    if (ctaDiv) {
      const button = ctaDiv.querySelector('button');
      if (button) {
        // Wrap button in a link if possible
        const link = card.querySelector('a');
        if (link && link.href) {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = button.textContent.trim();
          frag.appendChild(a);
        } else {
          frag.appendChild(button.cloneNode(true));
        }
      }
    }
    return frag;
  }

  // Find all cards
  const cardsContainer = element.querySelector('.productcarousel__cardscontainer');
  if (!cardsContainer) return;
  const cards = Array.from(cardsContainer.querySelectorAll('.product__card'));
  if (!cards.length) return;

  // Build table rows
  const rows = [];
  // Header row - must match block name exactly
  const headerRow = ['Cards (cards10)'];
  rows.push(headerRow);

  // Card rows
  cards.forEach(card => {
    const img = getCardImage(card);
    const textFrag = getCardText(card);
    rows.push([
      img || '',
      textFrag
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
