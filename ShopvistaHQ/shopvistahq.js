// shopvistaHQ.js - Universal Page Handler Engine
document.addEventListener("DOMContentLoaded", () => {
  const dynamicShopGrid = document.getElementById("filterableShopGrid");
  const homepageGrid = document.getElementById("marketProductGrid");

  // Check which page context we are executing under
  if (dynamicShopGrid) {
    loadShopCatalog(dynamicShopGrid);
    initActivePageSearch(dynamicShopGrid);
    initSidebarCategoryFilters(dynamicShopGrid);
  } else if (homepageGrid) {
    loadShopCatalog(homepageGrid);
    initActivePageSearch(homepageGrid);
  }
});

let localProductsCache = [];

// Array containing all category endpoints in your project
const shopCategories = [
  "Phone", 
  "Accessories", 
  "Appliance", 
  "Computer", 
  "Buildingmat", 
  "Chandelier", 
  "electrical", 
  "electronics", 
  "otherp", 
  "otherpi"
];

async function loadShopCatalog(targetGridContainer) {
  try {
    // Fetch all collections simultaneously using Promise.all
    const fetchPromises = shopCategories.map(async (category) => {
      const res = await fetch(`/shopvistaHQ/${category}`);
      if (!res.ok) {
        console.warn(`Category file stream "${category}" could not be reached.`);
        return []; // Fallback safely to an empty list if an individual endpoint fails
      }
      const data = await res.json();
      
      // Inject the current category name into each item so links direct safely to the right page later
      return data.map(item => ({ ...item, originFile: category }));
    });

    const nestedResults = await Promise.all(fetchPromises);
    
    // Flatten all separate array responses into a single main collection database
    localProductsCache = nestedResults.flat();

    // Dynamically update counter sidebar pills on ourshop.html if they exist
    updateCategoryPillCounters();

    // 1. EVALUATE QUERY: Prioritize checking for a pending global search query
    const savedSearch = sessionStorage.getItem('pendingSearchQuery');
    const searchInputField = document.getElementById('searchInput');
    if (savedSearch) {
      if (searchInputField) searchInputField.value = savedSearch;
      sessionStorage.removeItem('pendingSearchQuery');
      const userSearchKeyword = savedSearch.toLowerCase();
      const filtered = localProductsCache.filter(item => {
        return (item.pModel || '').toLowerCase().includes(userSearchKeyword) || 
               (item.pBrand || '').toLowerCase().includes(userSearchKeyword);
      });
      updateSearchUI(savedSearch);
      renderCatalogCards(filtered, targetGridContainer);
      return;
    }

    // 2. EVALUATE QUERY: Check for a pending global category routing memory state
    const savedCategory = sessionStorage.getItem('pendingCategoryQuery');
    if (savedCategory && savedCategory.toLowerCase() !== 'all') {
      sessionStorage.removeItem('pendingCategoryQuery');
      
      // Sync active state classes across sidebar listing arrays
      const filterItems = document.querySelectorAll('#shopCategoryFilterGroup li');
      filterItems.forEach(li => {
        li.classList.remove('active');
        const itemCategory = li.getAttribute('data-category');
        if (itemCategory && itemCategory.toLowerCase() === savedCategory.toLowerCase()) {
          li.classList.add('active');
          updateHeaderTitle(li.textContent.replace(/\d+/g, '').replace(/[()]/g, '').trim());
        }
      });

      const filtered = localProductsCache.filter(item => {
        return (item.pBrand || '').toLowerCase().includes(savedCategory.toLowerCase()) || 
               (item.pModel || '').toLowerCase().includes(savedCategory.toLowerCase()) || 
               (item.cate || '').toLowerCase().includes(savedCategory.toLowerCase()) ||
               (item.originFile || '').toLowerCase().includes(savedCategory.toLowerCase());
      });
      renderCatalogCards(filtered, targetGridContainer);
    } else {
      // Default fallback state: load everything cleanly
      sessionStorage.removeItem('pendingCategoryQuery');
      renderCatalogCards(localProductsCache, targetGridContainer);
    }
  } catch (error) {
    console.error("Catalog engine load failure:", error);
    targetGridContainer.innerHTML = '<div style="padding: 20px; text-align: center; width: 100%; color: red;">Failed to load catalog inventory items.</div>';
  }
}

function initActivePageSearch(targetGridContainer) {
  const searchForm = document.getElementById('marketplaceSearch');
  const searchInputField = document.getElementById('searchInput');
  if (searchForm && searchInputField) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userSearchKeyword = searchInputField.value.trim();
      if (!userSearchKeyword) return;
      const filtered = localProductsCache.filter(item => {
        return (item.pModel || '').toLowerCase().includes(userSearchKeyword.toLowerCase()) || 
               (item.pBrand || '').toLowerCase().includes(userSearchKeyword.toLowerCase());
      });
      updateSearchUI(userSearchKeyword);
      renderCatalogCards(filtered, targetGridContainer);
    });
  }
}

function initSidebarCategoryFilters(targetGridContainer) {
  const filterItems = document.querySelectorAll('#shopCategoryFilterGroup li');
  const searchInputField = document.getElementById('searchInput');
  if (!filterItems.length) return;

  filterItems.forEach(item => {
    item.addEventListener('click', () => {
      filterItems.forEach(li => li.classList.remove('active'));
      item.classList.add('active');
      if (searchInputField) searchInputField.value = "";
      
      const cleanTitle = item.textContent.replace(/\d+/g, '').replace(/[()]/g, '').trim();
      updateHeaderTitle(cleanTitle);

      const selectedCategory = item.getAttribute('data-category');
      if (!selectedCategory || selectedCategory.toLowerCase() === 'all') {
        renderCatalogCards(localProductsCache, targetGridContainer);
      } else {
        const filtered = localProductsCache.filter(item => {
          return (item.pBrand || '').toLowerCase().includes(selectedCategory.toLowerCase()) || 
                 (item.pModel || '').toLowerCase().includes(selectedCategory.toLowerCase()) || 
                 (item.cate || '').toLowerCase().includes(selectedCategory.toLowerCase()) ||
                 (item.originFile || '').toLowerCase().includes(selectedCategory.toLowerCase());
        });
        renderCatalogCards(filtered, targetGridContainer);
      }
    });
  });
}

function updateCategoryPillCounters() {
  const filterItems = document.querySelectorAll('#shopCategoryFilterGroup li');
  filterItems.forEach(item => {
    const cat = item.getAttribute('data-category');
    const pill = item.querySelector('.count-pill');
    if (!pill) return;

    if (!cat || cat.toLowerCase() === 'all') {
      pill.textContent = `(${localProductsCache.length})`;
    } else {
      const matchCount = localProductsCache.filter(item => {
        return (item.pBrand || '').toLowerCase().includes(cat.toLowerCase()) || 
               (item.pModel || '').toLowerCase().includes(cat.toLowerCase()) || 
               (item.cate || '').toLowerCase().includes(cat.toLowerCase()) ||
               (item.originFile || '').toLowerCase().includes(cat.toLowerCase());
      }).length;
      pill.textContent = `(${matchCount})`;
    }
  });
}

function updateSearchUI(searchQueryText) {
  const gridTitle = document.querySelector('.shop-header-block h1');
  const gridSub = document.querySelector('.shop-header-block p');
  if (gridTitle) gridTitle.innerHTML = `Search Results`;
  if (gridSub) gridSub.innerHTML = `Showing results matching: "${searchQueryText}"`;
}

function updateHeaderTitle(categoryTitleName) {
  const gridTitle = document.querySelector('.shop-header-block h1');
  const gridSub = document.querySelector('.shop-header-block p');
  if (gridTitle) gridTitle.innerHTML = `Explore Marketplace Catalog`;
  if (gridSub) {
    gridSub.innerHTML = categoryTitleName === 'All Products' ? 'Filter through our premium selected items instantly.' : `Viewing specialized items in ${categoryTitleName}.`;
  }
}

function renderCatalogCards(productsArray, targetContainer) {
  const counterNode = document.getElementById('catalogResultsCounter');
  if (counterNode) {
    counterNode.textContent = `Showing ${productsArray.length} product(s) total`;
  }

  if (productsArray.length === 0) {
    targetContainer.innerHTML = '<div style="padding: 40px 20px; text-align: center; width: 100%; font-weight: 500; grid-column: 1 / -1;">No matching products found.</div>';
    return;
  }

  targetContainer.innerHTML = productsArray.map(item => `
    <div class="product-card" data-product-id="${item.id}">
      <a href="prod.html?page=${item.originFile}&id=${item.id}" style="text-decoration: none; color: inherit;">
        <div class="tag-discount">-30%</div>
        <div class="card-thumb">
          
          <img src="/shopvistaHQ/${item.imageUrl}" alt="${item.pModel || 'Product'}" style="height:170px; object-fit: contain; width: 100%;">
        </div>
        <div class="card-details" style="padding: 15px;">
          <span class="card-brand" style="display: block; font-size: 0.85rem; color: #777; text-transform: uppercase;">${item.pBrand || ''}</span>
          <div class="card-title" style="font-weight: 600; margin: 5px 0; height: 40px; overflow: hidden;">${item.pModel || ''}</div>
          <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div class="price-box">
              <span class="current-price" style="font-weight: bold; color: #e44d26;">#${item.prize || item.price || '0'}</span>
            </div>
            <div class="add-to-cart-btn" style="background: #333; color: #fff; padding: 5px 10px; border-radius: 4px;"><i class="fa fa-shopping-cart"></i></div>
          </div>
        </div>
      </a>
    </div>
  `).join("");
}
