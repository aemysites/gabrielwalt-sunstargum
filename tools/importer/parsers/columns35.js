/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Get the .cmp-teaser element (main content block)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // 2. Get the image column (left)
  const teaserImage = getChildByClass(teaser, 'cmp-teaser__image');
  let imageContent = null;
  if (teaserImage) {
    // Use the entire image block (not just <img>) for resilience
    imageContent = teaserImage;
  }

  // 3. Get the content column (right)
  const teaserContent = getChildByClass(teaser, 'cmp-teaser__content');
  let contentCol = document.createElement('div');
  if (teaserContent) {
    // Compose content: pretitle, title, description
    // Get pretitle
    const pretitle = getChildByClass(teaserContent, 'cmp-teaser__pretitle');
    if (pretitle) contentCol.appendChild(pretitle);
    // Get title
    const title = getChildByClass(teaserContent, 'cmp-teaser__title');
    if (title) contentCol.appendChild(title);
    // Get description
    const desc = getChildByClass(teaserContent, 'cmp-teaser__description');
    if (desc) contentCol.appendChild(desc);
  }

  // 4. Build the table
  const headerRow = ['Columns (columns35)'];
  const contentRow = [imageContent, contentCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 5. Replace original element
  element.replaceWith(table);
}
