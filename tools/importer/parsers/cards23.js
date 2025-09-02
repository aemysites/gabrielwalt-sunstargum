/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct child elements of a grid
  function getGridChildren(grid) {
    return Array.from(grid.children).filter((child) => child.nodeType === 1);
  }

  // Find the main grid inside the container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const children = getGridChildren(grid);

  // Find all card-like teasers (each is a card)
  const teasers = children.filter((el) => el.classList.contains('teaser'));

  // Find all images that are not inside teasers (for cards with image + text)
  const images = children.filter((el) => el.classList.contains('image'));

  // Find all text blocks that are not inside teasers (for cards with text only)
  const texts = children.filter((el) => el.classList.contains('text'));

  // --- Build cards from teasers ---
  const cards = [];
  // Teaser cards
  teasers.forEach((teaser) => {
    // Image
    const imgWrap = teaser.querySelector('.cmp-teaser__image .cmp-image');
    let img = null;
    if (imgWrap) {
      img = imgWrap.querySelector('img');
    }
    // Text: title + description + button
    const content = teaser.querySelector('.cmp-teaser__content');
    const title = content ? content.querySelector('.cmp-teaser__title') : null;
    const desc = content ? content.querySelector('.cmp-teaser__description') : null;
    // Some teasers have a button
    const actionContainer = content ? content.querySelector('.cmp-teaser__action-container') : null;
    let button = null;
    if (actionContainer) {
      button = actionContainer.querySelector('.cmp-button');
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) {
      // Include all child nodes (not just the element)
      Array.from(desc.childNodes).forEach((node) => {
        textCell.appendChild(node.cloneNode(true));
      });
    }
    if (button) textCell.appendChild(button.cloneNode(true));
    cards.push([
      img ? img.cloneNode(true) : '',
      textCell
    ]);
  });

  // --- Build cards from image + text pairs (not inside teasers) ---
  // We'll look for images followed by text blocks
  let i = 0;
  while (i < children.length) {
    const el = children[i];
    if (el.classList.contains('image')) {
      // Next non-separator is likely the text
      let j = i + 1;
      while (j < children.length && children[j].classList.contains('separator')) j++;
      if (j < children.length && children[j].classList.contains('text')) {
        // Compose card
        const img = el.querySelector('img');
        const textBlock = children[j].querySelector('.cmp-text') || children[j];
        // Include all child nodes for full text content
        const textCell = document.createElement('div');
        Array.from(textBlock.childNodes).forEach((node) => {
          textCell.appendChild(node.cloneNode(true));
        });
        cards.push([
          img ? img.cloneNode(true) : '',
          textCell
        ]);
        i = j;
      }
    }
    i++;
  }

  // --- Product carousel as a card ---
  const carousel = children.find((el) => el.classList.contains('productcarousel'));
  if (carousel) {
    // Carousel title
    const carouselTitle = carousel.querySelector('.productcarousel__title');
    // Carousel cards
    const cardEls = carousel.querySelectorAll('.product__card');
    cardEls.forEach((cardEl) => {
      // Image
      const img = cardEl.querySelector('img');
      // Title
      const title = cardEl.querySelector('.product__card__title');
      // Compose text cell
      const textCell = document.createElement('div');
      if (title) textCell.appendChild(title.cloneNode(true));
      cards.push([
        img ? img.cloneNode(true) : '',
        textCell
      ]);
    });
  }

  // --- Build the table ---
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow, ...cards];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
