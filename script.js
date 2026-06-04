document.addEventListener('DOMContentLoaded', () => {
  initTeacherMode();
  initPresentationMode();
});

/**
 * Initializes and manages Teacher Mode state across all pages.
 */
function initTeacherMode() {
  const toggleCheckbox = document.getElementById('teacherModeToggle');
  const toggleContainer = document.querySelector('.teacher-toggle-container');
  
  if (!toggleCheckbox) return;

  // Retrieve previous state from localStorage
  const isTeacherModeActive = localStorage.getItem('teacherModeActive') === 'true';
  
  // Set initial state
  toggleCheckbox.checked = isTeacherModeActive;
  updateTeacherModeUI(isTeacherModeActive, toggleContainer);

  // Listen to toggle events
  toggleCheckbox.addEventListener('change', (e) => {
    const isActive = e.target.checked;
    localStorage.setItem('teacherModeActive', isActive);
    updateTeacherModeUI(isActive, toggleContainer);
  });
}

/**
 * Updates CSS classes and styling based on Teacher Mode activation.
 * @param {boolean} isActive - Whether Teacher Mode is active.
 * @param {HTMLElement} container - The container element of the toggle switch.
 */
function updateTeacherModeUI(isActive, container) {
  if (isActive) {
    document.body.classList.add('teacher-mode-active');
    if (container) container.classList.add('active');
  } else {
    document.body.classList.remove('teacher-mode-active');
    if (container) container.classList.remove('active');
  }
}

/**
 * Presentation Mode (PPT Slide Deck) Controller
 */
let currentSlideIndex = 0;
let slides = [];
let isPresentationActive = false;

function initPresentationMode() {
  slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  // 1. Inject "Presentar Clase" button in Navbar dynamically if not present
  const navLinks = document.querySelector('.nav-links');
  if (navLinks && !document.getElementById('btnStartPresentation')) {
    const presBtn = document.createElement('button');
    presBtn.id = 'btnStartPresentation';
    presBtn.className = 'btn btn-secondary';
    presBtn.style.padding = '0.4rem 1rem';
    presBtn.style.fontSize = '0.85rem';
    presBtn.style.borderRadius = '50px';
    presBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>Presentar
    `;
    
    // Insert before the Teacher switch
    const teacherToggle = document.querySelector('.teacher-toggle-container');
    if (teacherToggle) {
      navLinks.insertBefore(presBtn, teacherToggle);
    } else {
      navLinks.appendChild(presBtn);
    }

    presBtn.addEventListener('click', startPresentation);
  }

  // 2. Inject Presentation Floating Controls in Body
  if (!document.getElementById('presentationControls')) {
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'presentationControls';
    controlsDiv.className = 'presentation-controls';
    controlsDiv.innerHTML = `
      <button class="presentation-btn" id="prevSlideBtn" title="Slide Anterior (Flecha Izquierda)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </button>
      <span class="slide-counter" id="slideCounter">1 / ${slides.length}</span>
      <button class="presentation-btn" id="nextSlideBtn" title="Siguiente Slide (Flecha Derecha / Espacio)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
      <button class="presentation-btn exit-btn" id="exitPresentationBtn" title="Salir (Escape)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    document.body.appendChild(controlsDiv);

    // Event listeners for floating controls
    document.getElementById('prevSlideBtn').addEventListener('click', prevSlide);
    document.getElementById('nextSlideBtn').addEventListener('click', nextSlide);
    document.getElementById('exitPresentationBtn').addEventListener('click', exitPresentation);
  }
}

function startPresentation() {
  isPresentationActive = true;
  document.body.classList.add('presentation-mode');
  
  // Set current slide index based on viewport scroll position to resume from where the user was looking
  let scrollPos = window.scrollY;
  let activeIndex = 0;
  let minDiff = Infinity;
  
  slides.forEach((slide, idx) => {
    let diff = Math.abs(slide.offsetTop - scrollPos);
    if (diff < minDiff) {
      minDiff = diff;
      activeIndex = idx;
    }
  });

  currentSlideIndex = activeIndex;
  showSlide(currentSlideIndex);

  // Bind keyboard navigation
  window.addEventListener('keydown', handleKeyNavigation);
}

function exitPresentation() {
  isPresentationActive = false;
  document.body.classList.remove('presentation-mode');
  
  // Clean classes
  slides.forEach(slide => slide.classList.remove('active'));
  
  // Unbind key nav
  window.removeEventListener('keydown', handleKeyNavigation);

  // Scroll back to the slide we were looking at
  if (slides[currentSlideIndex]) {
    slides[currentSlideIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showSlide(index) {
  if (index < 0 || index >= slides.length) return;
  
  slides.forEach((slide, idx) => {
    if (idx === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  currentSlideIndex = index;
  
  // Update counter
  const counter = document.getElementById('slideCounter');
  if (counter) {
    counter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
  }

  // Focus active slide (so spacebar doesn't scroll outer container)
  slides[currentSlideIndex].focus();
}

function nextSlide() {
  if (currentSlideIndex < slides.length - 1) {
    showSlide(currentSlideIndex + 1);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    showSlide(currentSlideIndex - 1);
  }
}

function handleKeyNavigation(e) {
  if (!isPresentationActive) return;

  // Avoid triggering slide changes when typing in inputs/textareas
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
    return;
  }

  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    exitPresentation();
  }
}
