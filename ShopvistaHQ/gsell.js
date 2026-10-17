/**
 * shopvistaHQ.js - Universal Page Handler & Dynamic Catalog Engine
 * Core Execution: Parallel Stream Loading, Live Real-Time Filtering, Synchronized Data Keys
 * Cliff O Global Limited - Production Standards
 */
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

// FIXED, OPTIMIZED & REMAPPED: Pro-Tier Grid Card Dynamic Interface Template Loop
function renderCatalogCards(productsArray, targetContainer) {
  if (!targetContainer) return;

  const counterNode = document.getElementById('catalogResultsCounter');
  if (counterNode) {
    counterNode.textContent = `Showing ${productsArray.length} product(s) total`;
  }

  // Graceful empty matching database record response feedback handler
  if (productsArray.length === 0) {
    targetContainer.innerHTML = `
      <div style="padding: 60px 20px; text-align: center; width: 100%; font-weight: 500; grid-column: 1 / -1; font-family: 'Inter', sans-serif;">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 32px; color: #cbd5e1; margin-bottom: 12px; display: block;"></i>
        <span style="color: #64748b; font-size: 15px;">No matching marketplace inventory items found.</span>
      </div>
    `;
    return;
  }

  // Injects dynamic cards mapping backend inventory object streams
  targetContainer.innerHTML = productsArray.map(item => {
    // Structural synchronization tracking safe file endpoints paths
    const cleanImageSrc = item.pImage1 || item.imageUrl || 'assets/default-prod.png';
    
    // Auto resolution selector parsing numeric pricing with fallback format options
    const baseRawPrice = item.pPrice || item.prize || item.price;
    const cleanPriceDisplay = baseRawPrice ? `₦${Number(baseRawPrice).toLocaleString()}` : 'Contact Store';
    
    // Computes relative dynamic clearance markdown values tags elements
        // Computes relative dynamic clearance markup values tags elements
    const discountBadgeHTML = item.pDiscount 
      ? `<div class="tag-discount" style="position: absolute; top: 12px; left: 12px; background: #ef4444; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; z-index: 2;">-${item.pDiscount}%</div>` 
      : '';

    return `
      <div class="product-card" data-product-id="${item.id || item._id}" style="position: relative; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column;">
        ${discountBadgeHTML}
        <a href="prod.html?page=${item.originFile}&id=${item.id || item._id}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
          
          <div class="card-thumb" style="width: 100%; background: #fafafa; display: flex; align-items: center; justify-content: center; padding: 20px; aspect-ratio: 1/1;">
            <img src="${cleanImageSrc}" alt="${item.pModel || 'Marketplace Item'}" style="max-height: 170px; max-width: 100%; object-fit: contain; width: auto; height: auto;">
          </div>

          <div class="card-details" style="padding: 16px; display: flex; flex-direction: column; flex-grow: 1;">
            <span class="card-brand" style="display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 4px;">${item.pBrand || 'Generic'}</span>
            <div class="card-title" style="font-weight: 600; font-size: 14px; color: #1e293b; margin: 0 0 12px 0; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4;">${item.pModel || 'Elite Selected Item'}</div>
            
            <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px;">
              <div class="price-box">
                <span class="current-price" style="font-weight: 700; font-size: 16px; color: #15a85c;">${cleanPriceDisplay}</span>
              </div>
              <div class="add-to-cart-btn" style="background: #1e293b; color: #ffffff; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: background 0.2s ease; cursor: pointer;">
                <i class="fa fa-shopping-cart" style="font-size: 12px;"></i>
              </div>
            </div>
          </div>

        </a>
      </div>
    `;
  }).join("");

  // WIRE CART ENGINE ACTION HANDLERS AFTER CARDS INTERFACE MOUNTING
  const cartButtons = targetContainer.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const cardParent = btn.closest('.product-card');
      if (!cardParent) return;
      
      const productId = cardParent.getAttribute('data-product-id');
      const productObject = localProductsCache.find(p => String(p.id || p._id) === String(productId));
      if (!productObject) return;

      let currentCartCollection = [];
      try {
        currentCartCollection = JSON.parse(localStorage.getItem('cliffoGlobalCart')) || [];
      } catch (err) {
        currentCartCollection = [];
      }

      const duplicateIndex = currentCartCollection.findIndex(item => String(item.id) === String(productId));

      if (duplicateIndex > -1) {
        currentCartCollection[duplicateIndex].quantity = (currentCartCollection[duplicateIndex].quantity || 1) + 1;
      } else {
        currentCartCollection.push({
          id: productObject.id || productObject._id,
          brand: productObject.pBrand || 'Generic',
          model: productObject.pModel || 'Elite Selected Item',
          price: productObject.pPrice || productObject.prize || productObject.price || 0,
          image: productObject.pImage1 || productObject.imageUrl || 'assets/default-prod.png',
          origin: productObject.originFile || 'otherp',
          quantity: 1
        });
      }

      localStorage.setItem('cliffoGlobalCart', JSON.stringify(currentCartCollection));

      // Visual Success Interaction Animation Flash (FIXED QUOTES)
      const initialIcon = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check" style="color: #ffffff;"></i>`;
      btn.style.background = "#15a85c";
      
      setTimeout(() => {
        btn.innerHTML = initialIcon;
        btn.style.background = "#1e293b";
      }, 1200);

      synchronizeGlobalCartCounterPills();
    });
  });
}

// Synchronize navigation header indicators cleanly across layout templates matrices
function synchronizeGlobalCartCounterPills() {
  const badgeCounterNodes = [
    document.getElementById('cartCounter'),
    document.querySelector('.nav-actions .action-item:last-of-type .badge'),
    document.querySelector('a[href="cart.html"] .badge')
  ];

  let currentItemsCount = 0;
  try {
    const rawCartData = localStorage.getItem('cliffoGlobalCart');
    const parsedDataItems = rawCartData ? JSON.parse(rawCartData) : [];
    currentItemsCount = parsedDataItems.reduce((accumulator, item) => accumulator + (item.quantity || 1), 0);
  } catch (e) {
    currentItemsCount = 0;
  }

  badgeCounterNodes.forEach(badge => {
    if (badge) {
      badge.textContent = currentItemsCount;
      badge.style.transform = "scale(1.15)";
      setTimeout(() => badge.style.transform = "scale(1)", 200);
    }
  });
}

// Synchronize global states on boot checking cycles
document.addEventListener('DOMContentLoaded', synchronizeGlobalCartCounterPills);
