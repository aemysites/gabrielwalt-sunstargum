/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main product form
  const productForm = element.querySelector('form.productFullDetail__root');
  if (!productForm) return;

  // --- COLUMN 1: IMAGES ---
  // Find the image carousel section
  const carouselSection = productForm.querySelector('.productFullDetail__imageCarousel');
  let imagesCol = [];
  if (carouselSection) {
    // Get all thumbnails (for multiple images)
    const thumbnails = carouselSection.querySelectorAll('.thumbnail__image');
    if (thumbnails.length > 0) {
      imagesCol = Array.from(thumbnails);
    } else {
      // Fallback: get main image
      const mainImg = carouselSection.querySelector('img.carousel__currentImage');
      if (mainImg) imagesCol = [mainImg];
    }
  }

  // --- COLUMN 2: TITLE + DESCRIPTION ---
  // Find the title section
  const titleSection = productForm.querySelector('.productFullDetail__title');
  let titleEl = null;
  if (titleSection) {
    titleEl = titleSection.querySelector('h1');
  }

  // Find the description section
  const descSection = productForm.querySelector('.productFullDetail__description');
  let descEls = [];
  if (descSection) {
    // Get all paragraphs inside the description
    const richText = descSection.querySelector('.richText__root');
    if (richText) {
      descEls = Array.from(richText.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
    }
  }

  // Compose the right column: title + all description paragraphs
  let rightCol = [];
  if (titleEl) rightCol.push(titleEl);
  rightCol = rightCol.concat(descEls);

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns (columns1)'];
  const contentRow = [imagesCol, rightCol];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
