window.WHITE_WEDDING_GIFTS = {
  cow: {
    title: 'Cow Gift',
    icon: '🐄',
    description: 'Continue for cow-gift information and location updates.',
    action: 'VIEW COW GIFT UPDATE'
  },
  data: {
    title: 'Data Up to 100GB',
    icon: '📶',
    description: 'Choose your preferred mobile network and continue.',
    action: 'CONTINUE WITH DATA GIFT'
  },
  cash: {
    title: 'Cash Gift Up to ₦50,000',
    icon: '💵',
    description: 'Continue with the available cash-gift process.',
    action: 'CONTINUE WITH CASH GIFT'
  },
  surprise: {
    title: 'Surprise Gift',
    icon: '🎁',
    description: 'View other available white-wedding gift options.',
    action: 'VIEW SURPRISE GIFTS'
  }
};

window.renderGiftSelector = function renderGiftSelector(onSelect) {
  const list = document.getElementById('giftOptionList');
  const gifts = window.WHITE_WEDDING_GIFTS;

  list.innerHTML = Object.entries(gifts).map(([id, gift]) => `
    <button class="gift-option" data-gift-id="${id}">
      <span class="gift-option-icon">${gift.icon}</span>
      <span>
        <strong>${gift.title}</strong>
        <span>${gift.description}</span>
      </span>
    </button>
  `).join('');

  list.querySelectorAll('[data-gift-id]').forEach(button => {
    button.addEventListener('click', () => onSelect(button.dataset.giftId));
  });
};
