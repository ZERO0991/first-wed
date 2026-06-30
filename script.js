const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.site-nav a');

navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPath) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

const worksPage = document.querySelector('[data-works-page]');
if (worksPage) {
  const cards = Array.from(document.querySelectorAll('.portfolio-item'));
  const chips = Array.from(document.querySelectorAll('.filter-chip'));
  const searchInput = document.querySelector('.search-input');
  const pageButtonsContainer = document.querySelector('.pagination');
  const pageSize = 4;
  let activeTag = 'all';
  let currentPage = 1;

  function getFilteredCards() {
    const keyword = (searchInput?.value || '').trim().toLowerCase();
    return cards.filter((card) => {
      const tags = card.dataset.tags || '';
      const text = card.textContent.toLowerCase();
      const matchesTag = activeTag === 'all' || tags.includes(activeTag);
      const matchesKeyword = !keyword || text.includes(keyword);
      return matchesTag && matchesKeyword;
    });
  }

  function renderCards() {
    const filtered = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    cards.forEach((card) => {
      card.style.display = 'none';
    });

    filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach((card) => {
      card.style.display = 'block';
    });

    if (pageButtonsContainer) {
      pageButtonsContainer.innerHTML = '';
      for (let i = 1; i <= totalPages; i += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `page-btn${i === currentPage ? ' active' : ''}`;
        button.textContent = String(i);
        button.addEventListener('click', () => {
          currentPage = i;
          renderCards();
        });
        pageButtonsContainer.appendChild(button);
      }
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.remove('active'));
      chip.classList.add('active');
      activeTag = chip.dataset.tag || 'all';
      currentPage = 1;
      renderCards();
    });
  });

  searchInput?.addEventListener('input', () => {
    currentPage = 1;
    renderCards();
  });

  renderCards();
}

const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const values = Object.fromEntries(formData.entries());
    const history = JSON.parse(localStorage.getItem('site-messages') || '[]');
    history.unshift({
      ...values,
      createdAt: new Date().toLocaleString('zh-CN')
    });
    localStorage.setItem('site-messages', JSON.stringify(history.slice(0, 20)));
    if (formStatus) {
      formStatus.textContent = '留言已收到，我会尽快与您联系。';
    }
    contactForm.reset();
  });
}
