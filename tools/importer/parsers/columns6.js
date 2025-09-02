/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find a direct child by class
  function findChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Get the footerWrapper (main content area)
  const footerWrapper = element.querySelector('#footerWrapper');
  if (!footerWrapper) return;

  // 2. Get the first column: logo and text
  let logoTextCol = null;
  const logoContainer = footerWrapper.querySelector('#containerLogo');
  if (logoContainer) {
    logoTextCol = logoContainer;
  }

  // 3. Get the two navigation columns
  // They have class 'navigation', and are siblings
  const navs = Array.from(footerWrapper.querySelectorAll(':scope > .navigation'));
  const nav1 = navs[0] || null;
  const nav2 = navs[1] || null;

  // 4. Get the rightmost column: button and social links
  let rightCol = null;
  // There is a nested responsivegrid > #buttonAndSocialLinks
  const responsiveGrids = Array.from(footerWrapper.querySelectorAll(':scope > .container.responsivegrid'));
  for (const grid of responsiveGrids) {
    const btnAndSocial = grid.querySelector('#buttonAndSocialLinks');
    if (btnAndSocial) {
      rightCol = btnAndSocial;
      break;
    }
  }

  // Defensive: If not found, try fallback
  if (!rightCol) {
    rightCol = footerWrapper.querySelector('#buttonAndSocialLinks');
  }

  // 5. Compose the columns array
  const columns = [
    logoTextCol,
    nav1,
    nav2,
    rightCol
  ].filter(Boolean); // Remove any nulls

  // 6. Build the table rows
  const headerRow = ['Columns (columns6)'];
  const contentRow = columns;
  const tableArr = [headerRow, contentRow];

  // 7. Create the block table
  const block = WebImporter.DOMUtils.createTable(tableArr, document);

  // 8. Replace the original element
  element.replaceWith(block);
}
