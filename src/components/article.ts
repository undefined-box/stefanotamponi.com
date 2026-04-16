import { Article } from '../types';

export function createArticle(article: Article, onBack: () => void) {
  const el = document.createElement('section');
  el.className = 'article-page reveal';

  const galleryHTML = article.gallery.map((img, index) => `
    <button class="modal-trigger" data-index="${index}">${img.title}</button>
  `).join('<span class="gallery-separator">/</span>');

  const componentsHTML = article.components.map(comp => `
    <li>${comp}</li>
  `).join('');

  const sectionsHTML = article.sections.map(section => `
    <h2 class="article-section-title">${section.title}</h2>
    <p class="${section.isLead ? 'lead' : ''}">${section.content}</p>
  `).join('');

  el.innerHTML = `
    <div class="article-container">
      <div class="article-nav">
        <button class="article-back-link" id="back-to-home">← BACK TO HOME</button>
      </div>
      
      <header class="article-header">
        <h1 class="article-title">${article.title}</h1>
        <p class="article-subtitle">${article.subtitle}</p>
      </header>

      <div class="article-content">
        <div class="article-body">
          <div class="article-main-image">
            <img src="${article.mainImage.src}" alt="${article.mainImage.alt}" class="schematic-img">
            <p class="image-caption">${article.mainImage.caption}</p>
          </div>

          <section class="article-list-section">
            <h3 class="list-title">Core Components</h3>
            <ul class="newspaper-list">
              ${componentsHTML}
            </ul>
          </section>
          
          ${sectionsHTML}

          <section class="article-list-section">
            <h3 class="list-title">Project Gallery</h3>
            <div class="gallery-compact">
              ${galleryHTML}
            </div>
          </section>
        </div>
      </div>
      
      <div class="section-rule"></div>
    </div>

    <!-- Article Modal -->
    <div id="article-modal" class="modal-overlay">
      <div class="modal-nav-btn prev" id="modal-prev">‹</div>
      <div class="modal-content">
        <button class="modal-close" id="close-modal">×</button>
        <div class="modal-image-wrapper">
          <img id="modal-image" src="" alt="Gallery Image">
        </div>
        <div class="modal-info">
          <h4 id="modal-title" class="modal-info-title"></h4>
          <p id="modal-desc" class="modal-info-desc"></p>
        </div>
      </div>
      <div class="modal-nav-btn next" id="modal-next">›</div>
    </div>
  `;

  // Navigation
  el.querySelector('#back-to-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    onBack();
  });

  // Modal Logic
  const modal = el.querySelector('#article-modal') as HTMLElement;
  const modalImg = el.querySelector('#modal-image') as HTMLImageElement;
  const modalTitle = el.querySelector('#modal-title') as HTMLElement;
  const modalDesc = el.querySelector('#modal-desc') as HTMLElement;
  const closeModal = el.querySelector('#close-modal');
  const nextBtn = el.querySelector('#modal-next');
  const prevBtn = el.querySelector('#modal-prev');

  let currentIndex = 0;

  const updateModal = (index: number) => {
    currentIndex = index;
    const imgData = article.gallery[currentIndex];
    modalImg.src = imgData.src;
    modalTitle.textContent = imgData.title;
    modalDesc.textContent = imgData.desc;
  };

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

  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

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
