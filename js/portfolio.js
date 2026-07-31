/* ==============================================
   ZenLyft - Portfolio Filter
   Category filtering with smooth transitions
   ============================================== */

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const category = card.dataset.category;
        const matches = filter === 'all' || category === filter;

        if (!matches) {
          card.classList.add('filtering-out');
          setTimeout(() => {
            card.style.display = 'none';
            card.classList.remove('filtering-out');
          }, 300);
        } else {
          card.style.display = '';
          card.classList.add('filtering-in');
          setTimeout(() => card.classList.remove('filtering-in'), 400);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initPortfolioFilter);
