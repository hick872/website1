const iconWindows = {
  'icon-0': 'window-0',
  'icon-1': 'window-1',
  'icon-2': 'window-2',
  'icon-3': 'window-3'
};

const windowState = {};
Object.values(iconWindows).forEach((windowId) => {
  windowState[windowId] = false;
});

function clampToViewport(el, left, top) {
  const rect = el.getBoundingClientRect();
  const width = rect.width || el.offsetWidth || 300;
  const height = rect.height || el.offsetHeight || 200;
  const maxLeft = Math.max(0, window.innerWidth - width);
  const maxTop = Math.max(0, window.innerHeight - height - 36);

  return {
    left: Math.min(Math.max(0, left), maxLeft),
    top: Math.min(Math.max(0, top), maxTop)
  };
}

document.querySelectorAll('.window').forEach((windowEl) => {
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const titlebar = windowEl.querySelector('.window-titlebar');
  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - windowEl.offsetLeft;
    dragOffsetY = e.clientY - windowEl.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const clamped = clampToViewport(windowEl, e.clientX - dragOffsetX, e.clientY - dragOffsetY);
      windowEl.style.left = `${clamped.left}px`;
      windowEl.style.top = `${clamped.top}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
});

const musicBar = document.getElementById('music-bar');
let isDraggingMusic = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

if (musicBar) {
  musicBar.addEventListener('mousedown', (e) => {
    isDraggingMusic = true;
    const rect = musicBar.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    musicBar.style.position = 'absolute';
    musicBar.style.left = `${rect.left}px`;
    musicBar.style.top = `${rect.top}px`;
    musicBar.style.transform = 'none';
    musicBar.style.bottom = 'auto';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDraggingMusic) {
      const clamped = clampToViewport(musicBar, e.clientX - dragOffsetX, e.clientY - dragOffsetY);
      musicBar.style.left = `${clamped.left}px`;
      musicBar.style.top = `${clamped.top}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDraggingMusic = false;
  });
}

window.addEventListener('resize', () => {
  document.querySelectorAll('.window').forEach((windowEl) => {
    if (windowEl.style.left && windowEl.style.top) {
      const clamped = clampToViewport(windowEl, parseFloat(windowEl.style.left) || 0, parseFloat(windowEl.style.top) || 0);
      windowEl.style.left = `${clamped.left}px`;
      windowEl.style.top = `${clamped.top}px`;
    }
  });

  if (musicBar && musicBar.style.left && musicBar.style.top) {
    const clamped = clampToViewport(musicBar, parseFloat(musicBar.style.left) || 0, parseFloat(musicBar.style.top) || 0);
    musicBar.style.left = `${clamped.left}px`;
    musicBar.style.top = `${clamped.top}px`;
  }
});

const audioPlayer = document.getElementById('audio-player');
const musicInfo = document.querySelector('.music-info');
const playBtn = document.getElementById('play-btn');
const volumeIndicator = document.getElementById('volume-indicator');

function updateVolumeIndicator() {
  const volumePercent = Math.round(audioPlayer.volume * 100);
  volumeIndicator.textContent = `${volumePercent}%`;
}

if (audioPlayer) {
  audioPlayer.volume = 0.2;
  updateVolumeIndicator();
  audioPlayer.addEventListener('loadedmetadata', () => {
    musicInfo.textContent = 'The Great KIM';
  });

  playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playBtn.textContent = '⏸';
      musicInfo.textContent = 'Playing: The Great KIM';
    } else {
      audioPlayer.pause();
      playBtn.textContent = '▶';
      musicInfo.textContent = 'Paused: The Great KIM';
    }
  });

  document.getElementById('prev-btn').addEventListener('click', () => {
    audioPlayer.currentTime = 0;
    if (!audioPlayer.paused) {
      musicInfo.textContent = 'Restarted: The Great KIM';
    } else {
      musicInfo.textContent = 'The Great KIM';
    }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    audioPlayer.currentTime = 0;
    if (!audioPlayer.paused) {
      musicInfo.textContent = 'Restarted: The Great KIM';
    } else {
      musicInfo.textContent = 'The Great KIM';
    }
  });

  document.getElementById('vol-down-btn').addEventListener('click', () => {
    if (audioPlayer.volume > 0.1) {
      audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
      updateVolumeIndicator();
    }
  });

  document.getElementById('vol-up-btn').addEventListener('click', () => {
    if (audioPlayer.volume < 1.0) {
      audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
      updateVolumeIndicator();
    }
  });

  let isRepeatEnabled = false;
  const repeatBtn = document.getElementById('repeat-btn');
  repeatBtn.addEventListener('click', () => {
    isRepeatEnabled = !isRepeatEnabled;
    if (isRepeatEnabled) {
      repeatBtn.classList.add('repeat-active');
      musicInfo.textContent = 'Repeat: ON - The Great KIM';
    } else {
      repeatBtn.classList.remove('repeat-active');
      if (!audioPlayer.paused) {
        musicInfo.textContent = 'Playing: The Great KIM';
      } else {
        musicInfo.textContent = 'The Great KIM';
      }
    }
  });

  audioPlayer.addEventListener('ended', () => {
    if (isRepeatEnabled) {
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      playBtn.textContent = '⏸';
      musicInfo.textContent = 'Repeat: ON - The Great KIM';
    } else {
      playBtn.textContent = '▶';
      musicInfo.textContent = 'Finished: The Great KIM';
    }
  });
}

const taskbarApps = document.getElementById('taskbar-apps');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const clock = document.getElementById('clock');

const windowTitles = {
  'window-0': 'Recycle Bin',
  'window-1': 'Profile.prof',
  'window-2': 'Social Media.txt',
  'window-3': 'Portfolio.doc'
};

const windowIcons = {
  'window-0': 'recycle.png',
  'window-1': 'locked.png',
  'window-2': 'locked.png',
  'window-3': 'text.png'
};

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  clock.textContent = `${hours}:${minutes} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock(); // Initial update

function createTaskbarButton(windowId) {
  const button = document.createElement('div');
  button.className = 'taskbar-button';
  button.id = `taskbar-${windowId}`;
  button.innerHTML = `
    <img class="taskbar-button-icon" src="${windowIcons[windowId]}" alt="" onerror="this.style.display='none'">
    <span>${windowTitles[windowId]}</span>
  `;

  button.addEventListener('click', () => {
    const windowEl = document.getElementById(windowId);
    const isOpen = windowEl.classList.contains('open');

    if (isOpen) {
      // Minimize window
      windowEl.classList.remove('open');
      windowState[windowId] = false;
      button.classList.remove('active');

      // Update icon
      const iconId = Object.keys(iconWindows).find((key) => iconWindows[key] === windowId);
      const img = document.getElementById(iconId).querySelector('.icon-image');
      img.src = 'locked.png';
      if (windowId === 'window-0') img.src = 'recycle.png';
      if (windowId === 'window-3') img.src = 'text.png';
    } else {
      // Restore window
      windowEl.classList.add('open');
      windowState[windowId] = true;
      button.classList.add('active');

      // Update icon
      const iconId = Object.keys(iconWindows).find((key) => iconWindows[key] === windowId);
      const img = document.getElementById(iconId).querySelector('.icon-image');
      img.src = 'unlocked.png';
      if (windowId === 'window-0') img.src = 'recycle.png';
      if (windowId === 'window-3') img.src = 'text.png';
    }
  });

  return button;
}

function updateTaskbarButtons() {
  // Clear existing buttons
  taskbarApps.innerHTML = '';

  // Add buttons for open windows
  Object.keys(windowState).forEach((windowId) => {
    if (windowState[windowId]) {
      const button = createTaskbarButton(windowId);
      button.classList.add('active');
      taskbarApps.appendChild(button);
    }
  });
}

const originalIconClickHandler = (iconId) => {
  const icon = document.getElementById(iconId);
  const windowId = iconWindows[iconId];
  const img = icon.querySelector('.icon-image');

  windowState[windowId] = !windowState[windowId];

  const windowEl = document.getElementById(windowId);
  if (windowState[windowId]) {
    windowEl.classList.add('open');
    img.src = 'unlocked.png';
  } else {
    windowEl.classList.remove('open');
    img.src = 'locked.png';
  }

  if (windowId === 'window-0') {
    img.src = 'recycle.png';
  }

  if (windowId === 'window-3') {
    img.src = 'text.png';
  }

  updateTaskbarButtons();
};

Object.keys(iconWindows).forEach((iconId) => {
  const icon = document.getElementById(iconId);
  icon.addEventListener('click', () => originalIconClickHandler(iconId));
});

document.querySelectorAll('.window-close').forEach((closeBtn) => {
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const windowId = closeBtn.getAttribute('data-close');
    const windowEl = document.getElementById(windowId);
    windowEl.classList.remove('open');
    windowState[windowId] = false;

    // Update icon image
    const iconId = Object.keys(iconWindows).find((key) => iconWindows[key] === windowId);
    const img = document.getElementById(iconId).querySelector('.icon-image');
    img.src = 'locked.png';
    if (windowId === 'window-0') img.src = 'recycle.png';
    if (windowId === 'window-3') img.src = 'text.png';

    updateTaskbarButtons();
  });
});

startButton.addEventListener('click', (e) => {
  e.stopPropagation();
  startMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
  if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
    startMenu.classList.remove('show');
  }
});

const volumeTray = document.getElementById('volume-tray');
if (volumeTray) {
  volumeTray.addEventListener('click', () => {
    const currentVolume = Math.round(audioPlayer.volume * 100);
    alert(`Volume: ${currentVolume}%\n\nUse the music bar controls to adjust volume.`);
  });
}