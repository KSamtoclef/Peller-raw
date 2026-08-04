window.WHITE_WEDDING_GIFTS = {
  cow: {
    title: 'Cow Gift',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cow_standing_on_a_field.jpg',
    imageAlt: 'A real cow standing in a field',
    description: 'Continue for cow-gift information and location updates.',
    action: 'VIEW COW GIFT UPDATE'
  },
  data: {
    title: 'Data Up to 100GB',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mobile_phone_signal.png',
    imageAlt: 'Mobile data network signal',
    description: 'Choose your preferred mobile network and continue.',
    action: 'CONTINUE WITH DATA GIFT'
  },
  cash: {
    title: 'Cash Gift Up to ₦50,000',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Nigerian_currency.jpg',
    imageAlt: 'Nigerian naira notes',
    description: 'Continue with the available cash-gift process.',
    action: 'CONTINUE WITH CASH GIFT'
  },
  surprise: {
    title: 'Surprise Gift',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Gift_box.jpg',
    imageAlt: 'Wrapped surprise gift box',
    description: 'View other available white-wedding gift options.',
    action: 'VIEW SURPRISE GIFTS'
  }
};

window.renderGiftSelector = function renderGiftSelector(onSelect) {
  const list = document.getElementById('giftOptionList');
  const gifts = window.WHITE_WEDDING_GIFTS;

  list.innerHTML = Object.entries(gifts).map(([id, gift]) => `
    <button class="gift-option" data-gift-id="${id}">
      <span class="gift-option-icon">
        <img src="${gift.image}" alt="${gift.imageAlt}" loading="lazy">
      </span>
      <span class="gift-option-copy">
        <strong>${gift.title}</strong>
        <span>${gift.description}</span>
      </span>
      <span class="gift-chevron" aria-hidden="true">›</span>
    </button>
  `).join('');

  list.querySelectorAll('[data-gift-id]').forEach(button => {
    button.addEventListener('click', () => onSelect(button.dataset.giftId));
  });
};
