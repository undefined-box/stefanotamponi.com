import { Article, AppData } from '../types';

export function createArticle(article: Article, data: AppData, onBack: () => void) {
  const el = document.createElement('section');
  el.className = 'article-page reveal';

  const galleryHTML = article.gallery.map((img, index) => `
    <button class="modal-trigger" data-index="${index}">${img.title}</button>
  `).join('<span class="gallery-separator">/</span>');

  const componentsHTML = article.components.map(comp => `
    <li>${comp}</li>
  `).join('');

  const linksHTML = data.links
    .map(link => `<a class="link" href="${link.href}" aria-label="${link.ariaLabel}">${link.label}</a>`)
    .join('')

  // Helper for conditional inversion
  const getImgClass = (shouldInvert?: boolean) => shouldInvert ? 'invert-dark' : '';

  // First section is the Lead
  const leadSection = article.sections[0];
  
  // Remaining sections go into columns
  const otherSectionsHTML = article.sections.slice(1).map((section, index) => {
    let html = `
      <h2 class="article-section-title">${section.title}</h2>
      <p>${section.content}</p>
    `;
    
    // Inject secondary image if configured in JSON after first section in columns
    if (index === 0 && article.secondaryImage) {
      html += `
        <div class="article-inline-image">
          <img src="${article.secondaryImage.src}" alt="${article.secondaryImage.alt}" class="${getImgClass(article.secondaryImage.shouldInvert)}">
          <p class="image-caption">${article.secondaryImage.caption}</p>
        </div>
      `;
    }
    
    return html;
  }).join('');

  el.innerHTML = `
    <div class="article-container">
      <header class="typography-card">
        <h1 class="display" id="article-home-link" style="cursor: pointer;">${data.personalInfo.name}</h1>
        <p class="subtitle">${data.personalInfo.title} — ${data.personalInfo.location}</p>
      </header>

      <div class="article-nav">
        <button class="article-back-link back-link" id="back-to-home"><--   BACK TO HOME   --></button>
      </div>
      
      <header class="article-header">
        <h1 class="article-title">${article.title}</h1>
        <p class="article-subtitle">${article.subtitle}</p>
      </header>

      <div class="article-content">
        <div class="article-body">
          <!-- Lead Section with Floating Image -->
          <div class="article-feature-row">
            <div class="article-main-image">
              <img src="${article.mainImage.src}" alt="${article.mainImage.alt}" class="schematic-img ${getImgClass(article.mainImage.shouldInvert)}">
              <p class="image-caption">${article.mainImage.caption}</p>
            </div>
            
            <p class="lead">${leadSection.content}</p>

            <section class="article-list-section intro-components">
              <h3 class="list-title">Core Components</h3>
              <ul class="newspaper-list">
                ${componentsHTML}
              </ul>
            </section>
          </div>

          <hr class="article-divider">

          <div class="article-columns">
            ${otherSectionsHTML}

            <section class="article-list-section" style="column-span: all; margin-top: 32px;">
              <h3 class="list-title">Project Gallery</h3>
              <div class="gallery-compact">
                ${galleryHTML}
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <div class="article-footer-links links">
        ${linksHTML}
      </div>

      <div class="section-rule" style="margin-top: 64px;"></div>
    </div>

    <!-- Article Modal -->
    <div id="article-modal" class="modal-overlay">
      <button class="modal-close" id="close-modal">[ CLOSE ]</button>

      <div class="modal-click-zone left" id="modal-click-prev">
        <div class="modal-nav-btn prev">[ < ]</div>
      </div>
      
      <div class="modal-content">
        <div class="modal-image-wrapper">
          <img id="modal-image" src="" alt="Gallery Image">
        </div>
        <div class="modal-info">
          <h4 id="modal-title" class="modal-info-title"></h4>
          <p id="modal-desc" class="modal-info-desc"></p>
        </div>
      </div>

      <div class="modal-click-zone right" id="modal-click-next">
        <div class="modal-nav-btn next">[ > ]</div>
      </div>
    </div>
  `;

  // Navigation
  el.querySelector('#back-to-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    onBack();
  });

  el.querySelector('#article-home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    onBack();
  });

  // Modal Logic
  const modal = el.querySelector('#article-modal') as HTMLElement;
  const modalImg = el.querySelector('#modal-image') as HTMLImageElement;
  const modalWrapper = el.querySelector('.modal-image-wrapper') as HTMLElement;
  const modalTitle = el.querySelector('#modal-title') as HTMLElement;
  const modalDesc = el.querySelector('#modal-desc') as HTMLElement;
  const closeModal = el.querySelector('#close-modal');
  const clickNext = el.querySelector('#modal-click-next');
  const clickPrev = el.querySelector('#modal-click-prev');

  let currentIndex = 0;

  const updateModal = (index: number) => {
    currentIndex = index;
    const imgData = article.gallery[currentIndex];
    
    // Set loading state
    modalWrapper.classList.add('loading');
    
    modalImg.src = imgData.src;
    modalTitle.textContent = imgData.title;
    modalDesc.textContent = imgData.desc;
  };

  // Remove loading state when image is loaded
  modalImg.addEventListener('load', () => {
    modalWrapper.classList.remove('loading');
  });

  // Also remove loading if there's an error
  modalImg.addEventListener('error', () => {
    modalWrapper.classList.remove('loading');
  });

  el.querySelectorAll('.modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const index = parseInt(trigger.getAttribute('data-index') || '0');
      updateModal(index);
      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
  });

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % article.gallery.length;
    updateModal(currentIndex);
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + article.gallery.length) % article.gallery.length;
    updateModal(currentIndex);
  };

  clickNext?.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  clickPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!modal.classList.contains('visible')) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  closeModal?.addEventListener('click', () => {
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    }
  });

  return el;
}
