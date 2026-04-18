let isPlaying = false;
let audio: HTMLAudioElement | null = null;
let musicIcon: HTMLButtonElement | null = null;

export function createMusicIcon() {
  if (musicIcon) return musicIcon;
  
  musicIcon = document.createElement('button');
  musicIcon.className = 'music-toggle';
  musicIcon.setAttribute('aria-label', 'Toggle music');
  musicIcon.setAttribute('aria-pressed', 'false');
  musicIcon.innerText = '♪';
  musicIcon.style.display = 'none';
  
  musicIcon.addEventListener('click', () => {
    toggleMusic();
  });

  return musicIcon;
}

export function updateResumeButtons() {
  const resumeButtons = document.querySelectorAll('.link[href*="resume"]');
  resumeButtons.forEach(btn => {
    btn.textContent = isPlaying ? 'Pause' : 'Resume';
  });
}

function toggleMusic() {
  if (!audio || !musicIcon) return;
  
  isPlaying = !isPlaying;
  const overlayIcon = document.getElementById('overlay-icon');
  
  if (isPlaying) {
    if (overlayIcon) overlayIcon.className = 'play-icon';
    musicIcon.style.display = 'inline-flex';
    audio.volume = 0.2;
    audio.play();
    musicIcon.setAttribute('aria-pressed', 'true');
  } else {
    if (overlayIcon) overlayIcon.className = 'pause-icon';
    musicIcon.style.display = 'none';
    audio.pause();
    musicIcon.setAttribute('aria-pressed', 'false');
  }
  
  updateResumeButtons();
}

export function setupResumeButton() {
  if (!audio) {
    audio = new Audio('sounds/song.mp3');
    audio.preload = 'auto';
    audio.addEventListener('ended', () => {
      isPlaying = false;
      if (musicIcon) {
        musicIcon.style.display = 'none';
        musicIcon.setAttribute('aria-pressed', 'false');
      }
      updateResumeButtons();
    });
  }

  const overlay = document.getElementById('overlay');
  
  // Use event delegation for all resume links (Home and Articles)
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('.link[href*="resume"]')) {
      e.preventDefault();
      toggleMusic();

      if (overlay) {
        overlay.classList.add('visible');
        setTimeout(() => {
          overlay.classList.remove('visible');
        }, 1000);
      }
    }
  });

  // Ensure icon is mounted
  const app = document.getElementById('app');
  const themeToggle = document.querySelector('.theme-toggle');
  const icon = createMusicIcon();
  
  if (themeToggle) {
    themeToggle.parentNode?.insertBefore(icon, themeToggle);
  } else if (app) {
    app.appendChild(icon);
  }
}
