import productsData from './assets/js/products.js';

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

const catalogueCards = document.querySelector('.catalogue-cards');
const moreButton = document.querySelector('.more-button');
const categoryButtons = document.querySelectorAll('.catalogue-section_button');
const categoryStep = 4;
let startVisibleCategoryCount = 0;
let endVisibleCategoryCount = 0;
let currentCategory = 'coffee';

const modal = document.getElementById('product-modal');
const modalContainer = modal?.querySelector('.modal-container');
const modalImage = modal?.querySelector('.modal-image');
const modalTitle = modal?.querySelector('.modal-title');
const modalDescription = modal?.querySelector('.modal-description');
const sizeTextSpanS = modal?.querySelector('.size-text-s');
const sizeTextSpanM = modal?.querySelector('.size-text-m');
const sizeTextSpanL = modal?.querySelector('.size-text-l');
const additivesTextSpans = modal?.querySelectorAll('.additives-text');
const modalPrice = modal?.querySelector('.price-total_price');
const modalCloseButton = modal?.querySelector('.modal-info_close-button');

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

const getMaxVisibleCount = () => {
  return window.matchMedia('(min-width: 769px)').matches ? 8 : 4;
};

const fillCardTemplateHTML = (card) => {
  return `
      <article class="catalogue-card" data-id="${card.id}">
        <img class="catalogue-card_image" src="${card.image}" alt="${card.name}" loading="lazy">
        <div class="catalogue-card_info">
          <h3 class="catalogue-card_title title">${card.name}</h3>
          <p class="catalogue-card_description">${card.description}</p>
          <p class="catalogue-card_price title">$${card.price}</p>
        </div>
      </article>
    `;
};

const renderCards = () => {
  const allCategoryCards = productsData.filter(
    (product) => product.category === currentCategory,
  );
  const countShownCards = Math.min(
    endVisibleCategoryCount,
    allCategoryCards.length,
  );
  const currentCategoryCards = allCategoryCards.slice(
    startVisibleCategoryCount,
    countShownCards,
  );

  for (let index = 0; index < currentCategoryCards.length; index += 1) {
    const card = currentCategoryCards[index];
    catalogueCards.insertAdjacentHTML('beforeend', fillCardTemplateHTML(card));
  }

  startVisibleCategoryCount = countShownCards;
  moreButton.style.display =
    countShownCards >= allCategoryCards.length ? 'none' : 'block';
};

const resetCatalogueCards = (category) => {
  catalogueCards.innerHTML = '';
  startVisibleCategoryCount = 0;
  endVisibleCategoryCount = getMaxVisibleCount();
  currentCategory = category;
  renderCards();
};

const setActiveCategoryButton = (activeButton) => {
  categoryButtons.forEach((categoryButton) =>
    categoryButton.classList.toggle('active', categoryButton === activeButton),
  );
};

const findCardById = (id) => {
  return productsData.find((product) => product.id === Number(id));
};

const openModal = (card) => {
  console.log(card);
  modalImage.src = card.image;
  modalImage.alt = card.name;
  modalTitle.textContent = card.name;
  modalDescription.textContent = card.description;
  modalPrice.textContent = `$${card.price}`;
  sizeTextSpanS.textContent = card.sizes.s.size;
  sizeTextSpanM.textContent = card.sizes.m.size;
  sizeTextSpanL.textContent = card.sizes.l.size;
  additivesTextSpans.forEach(
    (additivesTextSpan, i) =>
      (additivesTextSpan.textContent = card.additives[i].name),
  );
  modal.showModal();
};

const getCard = (event) => {
  const card = event.target.closest('.catalogue-card');
  openModal(findCardById(card.dataset.id));
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

prevButton?.addEventListener('click', () => showSlide(currentSlide - 1));
nextButton?.addEventListener('click', () => showSlide(currentSlide + 1));
flatButtons?.forEach((flatButton, i) =>
  flatButton.addEventListener('click', () => showSlide(i)),
);

categoryButtons?.forEach((categoryButton) =>
  categoryButton.addEventListener('click', () => {
    setActiveCategoryButton(categoryButton);
    resetCatalogueCards(categoryButton.dataset.category);
  }),
);
moreButton?.addEventListener('click', () => {
  endVisibleCategoryCount += categoryStep;
  renderCards();
});

catalogueCards?.addEventListener('click', getCard);
modalCloseButton?.addEventListener('click', () => {
  modal.close();
});
modal?.addEventListener('click', (event) => {
  if (!modalContainer.contains(event.target)) {
    modal.close();
  }
});

if (catalogueCards) resetCatalogueCards(currentCategory);
initTheme();
