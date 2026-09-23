const root = document.documentElement;
const KEY = 'theme';
const startTheme = 'light';
const themeButtons = document.querySelectorAll('.theme-button');

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

themeButtons.forEach((themeButton) =>
  themeButton.addEventListener('click', applyTheme),
);

initTheme();
