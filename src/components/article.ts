import { renderTextWithLinks } from './hero';

export function createArticle(onBack: () => void) {
  const el = document.createElement('section');
  el.className = 'article-page reveal';

  const galleryImages = [
    { src: 'assets/cameraberry3.png', title: 'Frontal View', desc: 'Main interface showing the mechanical buttons and lens alignment.' },
    { src: 'assets/cameraberry3.png', title: 'Internal View', desc: 'Detailed look at the Raspberry Pi 3 B+ integration and custom wiring.' },
    { src: 'assets/cameraberry3.png', title: 'Settings View', desc: 'Custom UI for adjusting ISO, Shutter Speed, and White Balance.' },
    { src: 'assets/cameraberry3.png', title: 'Preview Mode', desc: 'Real-time feedback from the IMX477 sensor on the IPS display.' },
    { src: 'assets/cameraberry3.png', title: 'Remote Mode', desc: 'Interface for controlling the camera via web dashboard.' },
    { src: 'assets/cameraberry3.png', title: 'Example Photo', desc: 'A sample shot demonstrating the high-fidelity capture of the system.' }
  ];

  const galleryHTML = galleryImages.map((img, index) => `
    <button class="modal-trigger" data-index="${index}">${img.title}</button>
  `).join('<span class="gallery-separator">/</span>');

  el.innerHTML = `
    <div class="article-container">
      <div class="article-nav">
        <button class="article-back-link" id="back-to-home">← BACK TO HOME</button>
      </div>
      
      <header class="article-header">
        <h1 class="article-title">Cameraberry 3</h1>
        <p class="article-subtitle">A MODERN DIY RETRO CAMERA</p>
      </header>

      <div class="article-content">
        <div class="article-body">
          <div class="article-main-image">
            <img src="assets/cameraberry3.png" alt="Cameraberry 3 Schematic" class="schematic-img">
            <p class="image-caption">Fig 1.1: Schematic of the Cameraberry 3 final version.</p>
          </div>

          <section class="article-list-section">
            <h3 class="list-title">Core Components</h3>
            <ul class="newspaper-list">
              <li>Raspberry Pi 3 Model B+</li>
              <li>Raspberry Pi Camera 3</li>
              <li>Thermal Printer</li>
              <li>1.4" IPS Display</li>
              <li>3D Printed PLA Chassis</li>
              <li>Mechanical Tactile Buttons</li>
              <li>Status LEDs</li>
              <li>Internal 10000mAh Li-Po Battery</li>
            </ul>
          </section>
          
          <h2 class="article-section-title">A Statement of Personality</h2>
          <p class="lead">In an era of mass-produced, powerful, and ready-to-use imaging devices, the Cameraberry project emerges as a statement of technical personality. The third iteration of this series, documented here, stands as a monument to the art of DIY electronics and retro-inspired design.</p>
          
          <h2 class="article-section-title">Beyond a Simple Camera</h2>
          <p>The Cameraberry 3 is not merely a camera; it is a surprisingly powerful computer built for deep experimentation, merged with the soul of an instant camera. Utilizing a custom-designed chassis and incorporating a thermal printer, it bridges the gap between raw hardware components and sophisticated software capabilities.</p>

          <h2 class="article-section-title">Technical Backbone</h2>
          <p>The schematic reveals a compact, rugged design. Key features include physical controls for manual interaction—a nod to the tactile nature of classic photography—integrated with a modern digital backbone. The system is connected to a self-hosted backend, enabling LLM-powered image descriptions and n8n-powered workflows for on-the-go image and prompt manipulation. Additionally, a dedicated service hosts a YOLO instance for real-time object recognition, while a remote web server allows for wireless capture and full control.</p>
          
          <h2 class="article-section-title">The Backend Ecosystem</h2>
          <p>The dedicated backend infrastructure deserves a special mention: it is powered by two additional Raspberry Pi 5 boards. One functions as a secure internet gateway, hosting the web server and remote control services plus an n8n instance, while the second is overclocked to 3GHz to handle the demanding LLM and YOLO processes—all seamlessly and securely integrated into a unified ecosystem.</p>
          
          <h2 class="article-section-title">Intelligent Processing</h2>
          <p>The backend provides two distinct processing modes: a 'fast' mode that delivers abstract, poetic descriptions in just 15 seconds—using YOLO object detection to feed the LLM prompt and bypass full image inference time—and a 'detailed' mode that generates comprehensive analysis by processing the entire image through the LLM within about a minute. These processes run in parallel with the printing phase for near-instant feedback. Through the n8n-powered workflow, the system can also archive the original high-resolution image for further processing or instant mobile notifications. Of course, the camera remains fully functional for traditional offline shooting whenever needed.</p>
          
          <h2 class="article-section-title">A Personal Milestone</h2>
          <p>This project is a milestone in my personal research into hardware-software integration, demonstrating that sophisticated tools can be built from the ground up with enough curiosity and persistent debugging.</p>

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
    const imgData = galleryImages[currentIndex];
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
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateModal(currentIndex);
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
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
