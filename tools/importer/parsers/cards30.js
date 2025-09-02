/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract teaser cards
  function extractCard(teaser) {
    // Get image
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    let img = null;
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // Get content
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    let textContent = [];
    if (contentContainer) {
      // Description block
      const desc = contentContainer.querySelector('.cmp-teaser__description');
      if (desc) {
        // Collect all <p> blocks, preserving <b> and text structure
        const ps = Array.from(desc.querySelectorAll('p'));
        let hasHeading = false;
        ps.forEach((p, idx) => {
          // If <b> is present, treat as heading
          if (p.querySelector('b')) {
            const strong = document.createElement('strong');
            strong.textContent = p.textContent.trim();
            textContent.push(strong);
            hasHeading = true;
          } else if (p.textContent.trim()) {
            // Description paragraphs
            const descDiv = document.createElement('div');
            descDiv.innerHTML = p.innerHTML;
            textContent.push(descDiv);
          }
        });
      }
      // CTA button
      const action = contentContainer.querySelector('.cmp-teaser__action-container a.cmp-button');
      if (action) {
        textContent.push(action.cloneNode(true));
      }
    }
    return [img, textContent];
  }

  // Find all teaser cards
  const teasers = Array.from(element.querySelectorAll('.teaser'));

  // Compose table rows
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];
  for (const teaser of teasers) {
    const [img, textContent] = extractCard(teaser);
    rows.push([img, textContent]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
