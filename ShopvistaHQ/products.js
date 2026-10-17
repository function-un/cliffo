// Native Core Frontend Application Script Controller
document.addEventListener("DOMContentLoaded", () => {
  


  let globalCart = document.getElementById('cartCounter');
  let cnumb = JSON.parse(localStorage.getItem('CartCount'));

  globalCart.textContent = cnumb || 0;
  // Select Nav Core Targets
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavigationBar = document.getElementById('mobileNavigationBar');
  const searchForm = document.getElementById('marketplaceSearch');
  const searchInputField = document.getElementById('searchInput');

  // Interactive Hamburger Click Toggle Event Handler
  if (mobileNavToggle && mobileNavigationBar) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Toggle visibility class modifier
      mobileNavigationBar.classList.toggle('open');
      
      // Simple icon rotation animation visual cue
      mobileNavToggle.classList.toggle('active');
      
      console.log("Mobile responsive link menu dropdown state toggled.");
    });
  }

  // Safe Form Search Engine interceptor logic
  if (searchForm && searchInputField) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userSearchKeyword = searchInputField.value.trim();
      alert(`Executing local test lookups across category arrays for parameter: "${userSearchKeyword}"`);
    });
  }

});




  // ==========================================================================
  // PRODUCTS CATALOGUE LIVE SEARCH AND DOM VIEW LAYOUT ENGINE
  // ==========================================================================
  
  const masterCatalogGrid = document.getElementById('masterCatalogGrid');
  const catalogKeywordFilter = document.getElementById('catalogKeywordFilter');
  const catalogSorterSelect = document.getElementById('catalogSorterSelect');
  const productsCounterLabel = document.getElementById('productsCounterLabel');
  const catalogEmptyFallback = document.getElementById('catalogEmptyFallback');

  // View toggler triggers selectors
  const setViewGrid = document.getElementById('setViewGrid');
  const setViewList = document.getElementById('setViewList');

  // 1. Grid/List Layout View Toggle Switches
  if (setViewGrid && setViewList && masterCatalogGrid) {
    setViewGrid.addEventListener('click', function() {
      setViewList.classList.remove('active');
      this.classList.add('active');
      masterCatalogGrid.classList.remove('layout-list-mode');
      masterCatalogGrid.classList.add('layout-grid-mode');
    });

    setViewList.addEventListener('click', function() {
      setViewGrid.classList.remove('active');
      this.classList.add('active');
      masterCatalogGrid.classList.remove('layout-grid-mode');
      masterCatalogGrid.classList.add('layout-list-mode');
    });
  }

  // 2. Real-time Live Sub-Filter Search Filter Matrix
  function filterAndEvaluateCatalogView() {
    if (!masterCatalogGrid) return;
    
    const queryPhrase = catalogKeywordFilter ? catalogKeywordFilter.value.toLowerCase().trim() : "";
    const activeCardsList = masterCatalogGrid.querySelectorAll('.product-card');
    let visibleCardsCounter = 0;

    activeCardsList.forEach(card => {
      const productTitleText = card.getAttribute('data-title').toLowerCase();
      
      if (productTitleText.includes(queryPhrase)) {
        card.style.display = ""; // Reset inline exclusion parameters
        visibleCardsCounter++;
      } else {
        card.style.display = "none"; // Hide non-matching items
      }
    });

    // Update totals and fallback views
    if (productsCounterLabel) {
      productsCounterLabel.textContent = `Showing ${visibleCardsCounter} item(s) matching criteria`;
    }

    if (catalogEmptyFallback) {
      if (visibleCardsCounter === 0) {
        catalogEmptyFallback.classList.remove('hidden');
      } else {
        catalogEmptyFallback.classList.add('hidden');
      }
    }
  }

  if (catalogKeywordFilter) {
    catalogKeywordFilter.addEventListener('input', filterAndEvaluateCatalogView);
  }

  // 3. Array Sorter Core Pipeline Engine
  if (catalogSorterSelect && masterCatalogGrid) {
    catalogSorterSelect.addEventListener('change', function() {
      const selectedValueType = this.value;
      if (selectedValueType === "default") return;

      const productCardsArray = Array.from(masterCatalogGrid.querySelectorAll('.product-card'));

      productCardsArray.sort((cardA, cardB) => {
        const priceValueA = parseInt(cardA.getAttribute('data-price')) || 0;
        const priceValueB = parseInt(cardB.getAttribute('data-price')) || 0;

        if (selectedValueType === "price-asc") {
          return priceValueA - priceValueB; // Sort Low to High
        } else if (selectedValueType === "price-desc") {
          return priceValueB - priceValueA; // Sort High to Low
        }
        return 0;
      });

      // Clear the container and re-append sorted DOM nodes safely
      productCardsArray.forEach(sortedCard => {
        masterCatalogGrid.appendChild(sortedCard);
      });
      
      // Maintain search parameters visibility constraints if applicable
      filterAndEvaluateCatalogView();
    });
  }




document.getElementById('categoryToggle').addEventListener('click', function(e) {
  e.preventDefault(); // Prevents the page from jumping or reloading
  
  var submenu = document.getElementById('mobileSubmenu');
  submenu.classList.toggle('show-submenu');
});
