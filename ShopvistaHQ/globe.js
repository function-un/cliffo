// global.js - Loaded on EVERY page
document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initMarketplaceSearch();
});

// Initialize cart badges on initial structural compilation
const globalCartBadge = document.getElementById('cartCounter');

let cnumb = JSON.parse(localStorage.getItem('CartCount'));
if (globalCartBadge) {
  globalCartBadge.textContent = cnumb || 0;
}

function initMobileNavigation() {
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavigationBar = document.getElementById('mobileNavigationBar');
  const categoryToggle = document.getElementById('categoryToggle');
  const submenu = document.getElementById('mobileSubmenu');

  if (mobileNavToggle && mobileNavigationBar) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileNavigationBar.classList.toggle('open');
      mobileNavToggle.classList.toggle('active');
    });
  }

  if (categoryToggle && submenu) {
    categoryToggle.addEventListener('click', (e) => {
      e.preventDefault();
      submenu.classList.toggle('show-submenu');
    });
  }
}

function initMarketplaceSearch() {
  const searchForm = document.getElementById('marketplaceSearch');
  
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      // Form default action is prevented or handled dynamically 
      // within page-specific scripts like shopvista.js to prevent conflicts.
      const gridContainer = document.getElementById("marketProductGrid");
      if (!gridContainer) {
        // Fallback message if search form is used on layout-less utility pages
        e.preventDefault();
        const searchInputField = document.getElementById('searchInput');
        const userSearchKeyword = searchInputField ? searchInputField.value.trim() : '';
        alert(`Searching for: "${userSearchKeyword}". (Search display is only active on shopping grid templates)`);
      }
    });
  }
}
