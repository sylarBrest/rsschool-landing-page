const root = document.documentElement;
const KEY = 'theme';
const startTheme = 'light';
const themeButtons = document.querySelectorAll('.theme-button');
const body = document.querySelector('body');
const headerMenu = document.querySelector('.header-menu');
const headerMenuWrapper = document.querySelector('.header-menu_wrapper');
const headerHamburger = document.querySelector('.header_hamburger');
const slides = document.querySelectorAll('.slider-slide');
const flatButtons = document.querySelectorAll('.flat-button');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

let currentSlide = 0;
const totalSlides = slides.length;

const showSlide = (index) => {
  currentSlide = (index + totalSlides) % totalSlides;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
    slide.setAttribute('aria-hidden', i !== currentSlide);
  });
  flatButtons.forEach((flatButton, i) =>
    flatButton.classList.toggle('active', i === currentSlide),
  );
};

const setTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  themeButtons.forEach((themeButton) =>
    themeButton.classList.toggle(
      'active',
      themeButton.classList.contains(theme),
    ),
  );
};

const initTheme = () => {
  const savedTheme = localStorage.getItem(KEY) ?? startTheme;
  setTheme(savedTheme);
};

const applyTheme = (event) => {
  if (event.target.classList.contains('active')) return;

  const theme = event.target.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem(KEY, theme);
  setTheme(theme);
};

const toggleMenu = () => {
  headerHamburger.classList.toggle('is-open');
  headerMenuWrapper.classList.toggle('is-open');
  body.classList.toggle('is-open');
};

const closeMenu = () => {
  headerHamburger.classList.remove('is-open');
  headerMenuWrapper.classList.remove('is-open');
  body.classList.remove('is-open');
};

themeButtons.forEach((themeButton) =>
  themeButton.addEventListener('click', applyTheme),
);

headerHamburger.addEventListener('click', toggleMenu);
headerMenu.addEventListener('click', closeMenu);
document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    headerMenuWrapper.classList.contains('is-open')
  ) {
    closeMenu();
  }
  if (event.key === 'ArrowLeft') {
    showSlide(currentSlide - 1);
  }
  if (event.key === 'ArrowRight') {
    showSlide(currentSlide + 1);
  }
});

window.matchMedia('(min-width: 769px').addEventListener('change', (event) => {
  if (event.matches) {
    closeMenu();
  }
});

prevButton.addEventListener('click', () => showSlide(currentSlide - 1));
nextButton.addEventListener('click', () => showSlide(currentSlide + 1));
flatButtons.forEach((flatButton, i) =>
  flatButton.addEventListener('click', () => showSlide(i)),
);

initTheme();
