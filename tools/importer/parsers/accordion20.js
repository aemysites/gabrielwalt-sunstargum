/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct children of the main grid
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const sections = Array.from(grid.children);

  // Header row
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // Find all step text blocks (those with h2 starting with 1., 2., 3.)
  const stepTexts = sections.filter(
    el => el.classList.contains('text') &&
      el.querySelector('h2') &&
      /^\s*\d\./.test(el.querySelector('h2').textContent.trim())
  );

  stepTexts.forEach((textBlock, idx) => {
    // Find previous image (if any)
    let imageBlock = null;
    for (let i = sections.indexOf(textBlock) - 1; i >= 0; i--) {
      if (sections[i].classList.contains('image')) {
        imageBlock = sections[i];
        break;
      }
    }
    // Find next button (if any)
    let buttonBlock = null;
    for (let i = sections.indexOf(textBlock) + 1; i < sections.length; i++) {
      if (sections[i].classList.contains('button')) {
        buttonBlock = sections[i];
        break;
      }
      if (sections[i].classList.contains('text')) break;
    }
    // Title: heading from text block
    const heading = textBlock.querySelector('h2');
    // Content: image, all paragraphs, button
    const contentElements = [];
    if (imageBlock) {
      contentElements.push(imageBlock);
    }
    Array.from(textBlock.children).forEach(child => {
      if (!child.matches('h2')) {
        contentElements.push(child);
      }
    });
    if (buttonBlock) {
      contentElements.push(buttonBlock);
    }
    rows.push([
      heading ? heading : '',
      contentElements.length === 1 ? contentElements[0] : contentElements
    ]);
  });

  // Add summary/info block after last step
  const lastStepIdx = sections.indexOf(stepTexts[stepTexts.length - 1]);
  let summaryText = null;
  for (let i = lastStepIdx + 1; i < sections.length; i++) {
    if (sections[i].classList.contains('text')) {
      summaryText = sections[i];
      break;
    }
  }
  if (summaryText) {
    // Find next image (if any)
    let summaryImage = null;
    for (let i = sections.indexOf(summaryText) + 1; i < sections.length; i++) {
      if (sections[i].classList.contains('image')) {
        summaryImage = sections[i];
        break;
      }
      if (sections[i].classList.contains('text')) break;
    }
    const contentElements = [];
    if (summaryImage) {
      contentElements.push(summaryImage);
    }
    Array.from(summaryText.children).forEach(child => {
      contentElements.push(child);
    });
    rows.push([
      '',
      contentElements.length === 1 ? contentElements[0] : contentElements
    ]);
  }

  // Final call-to-action row ("Prêt/e à commencer ?" and two buttons)
  let readyHeading = null;
  let readyButtons = [];
  for (let i = sections.length - 1; i >= 0; i--) {
    if (sections[i].classList.contains('text')) {
      const h2 = sections[i].querySelector('h2');
      if (h2 && /Prêt/.test(h2.textContent)) {
        readyHeading = h2;
        break;
      }
    }
  }
  if (readyHeading) {
    const readyHeadingIdx = sections.findIndex(
      el => el.classList.contains('text') && el.contains(readyHeading)
    );
    for (let i = readyHeadingIdx + 1; i < sections.length; i++) {
      if (sections[i].classList.contains('button')) {
        readyButtons.push(sections[i]);
      }
      if (readyButtons.length === 2) break;
    }
    rows.push([
      readyHeading,
      readyButtons.length === 1 ? readyButtons[0] : readyButtons
    ]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
