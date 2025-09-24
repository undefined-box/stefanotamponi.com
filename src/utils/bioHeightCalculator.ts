import { AppData } from '../types';

export function calculateAndSetBioMinHeight(data: AppData, bioElement: HTMLElement) {
  let longestText = data.personalInfo.bio;
  for (const skill in data.skillDescriptions) {
    if (data.skillDescriptions[skill].length > longestText.length) {
      longestText = data.skillDescriptions[skill];
    }
  }

  // For measurement, just use the text part of the links
  const plainText = longestText.replace(/(\[[^\]]+\]\([^)]+\))/g, '$1');

  const tempBio = document.createElement('div');
  tempBio.style.position = 'absolute';
  tempBio.style.visibility = 'hidden';
  tempBio.style.height = 'auto';
  tempBio.style.width = bioElement.offsetWidth + 'px';
  tempBio.style.padding = getComputedStyle(bioElement).padding;
  tempBio.style.fontSize = getComputedStyle(bioElement).fontSize;
  tempBio.style.lineHeight = getComputedStyle(bioElement).lineHeight;
  tempBio.style.textAlign = getComputedStyle(bioElement).textAlign;
  tempBio.style.whiteSpace = 'pre-line'; // Also apply this style for measurement

  // Measure height with longest text *without* the back-link first
  tempBio.textContent = plainText;
  document.body.appendChild(tempBio);
  const maxHeightWithoutLink = tempBio.offsetHeight;
  document.body.removeChild(tempBio);
  tempBio.innerHTML = ''; // Clear it

  // Measure height with longest text *with* the back-link
  const backLink = document.createElement('small');
  backLink.className = 'back-link';
  backLink.textContent = '<--   CLICK TO GO BACK   -->';
  tempBio.appendChild(backLink);
  tempBio.appendChild(document.createTextNode(plainText));
  document.body.appendChild(tempBio);
  const maxHeightWithLink = tempBio.offsetHeight;
  document.body.removeChild(tempBio);

  // Use the maximum of the two heights
  const finalMaxHeight = Math.max(maxHeightWithoutLink, maxHeightWithLink);

  bioElement.style.minHeight = finalMaxHeight + 'px';
}
