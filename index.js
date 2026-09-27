const root = document.documentElement;
const KEY = 'theme';
const startTheme = 'light';
const themeButtons = document.querySelectorAll('.theme-button');
const body = document.querySelector('body');
const headerMenu = document.querySelector('.header-menu');
const headerMenuWrapper = document.querySelector('.header-menu_wrapper');
const headerHamburger = document.querySelector('.header_hamburger');

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
});

window.matchMedia('(min-width: 769px').addEventListener('change', (event) => {
  if (event.matches) {
    closeMenu();
  }
});

initTheme();
