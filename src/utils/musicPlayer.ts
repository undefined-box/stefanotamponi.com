export function createMusicIcon() {
  const musicIcon = document.createElement('button');
  musicIcon.className = 'music-toggle';
  musicIcon.setAttribute('aria-label', 'Toggle music');
  musicIcon.setAttribute('aria-pressed', 'false');
  musicIcon.innerText = '♪';
  musicIcon.style.display = 'none';
  return musicIcon;
}

export function setupResumeButton() {
  const resumeButton = document.querySelector('.link[href*="resume"]');
  const overlay = document.getElementById('overlay');
  const overlayIcon = document.getElementById('overlay-icon');
  const audio = new Audio('sounds/song.mp3');
  audio.preload = 'auto';
  const musicIcon = createMusicIcon();
  const themeToggle = document.querySelector('.theme-toggle');
  themeToggle?.parentNode?.insertBefore(musicIcon, themeToggle);

  if (resumeButton && overlay && overlayIcon) {
    let isPlaying = false;

    const resetUI = () => {
      isPlaying = false;
      resumeButton.textContent = 'Resume';
      musicIcon.style.display = 'none';
      musicIcon.setAttribute('aria-pressed', 'false'); // Update aria-pressed
    };

    const toggleMusic = () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        resumeButton.textContent = 'Pause';
        overlayIcon.className = 'play-icon';
        musicIcon.style.display = 'inline-flex';
        audio.volume = 0.2;
        audio.play();
        musicIcon.setAttribute('aria-pressed', 'true');
      } else {
        resumeButton.textContent = 'Resume';
        overlayIcon.className = 'pause-icon';
        musicIcon.style.display = 'none';
        audio.pause();
      musicIcon.setAttribute('aria-pressed', 'false');
      }
    };

    resumeButton.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMusic();

      overlay.classList.add('visible');
      setTimeout(() => {
        overlay.classList.remove('visible');
      }, 1000);
    });

    musicIcon.addEventListener('click', () => {
      toggleMusic();
    });

    audio.addEventListener('ended', () => {
      resetUI();
    });
  }
}
