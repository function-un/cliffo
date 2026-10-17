// global.js - Loaded on EVERY page

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSecureComponents);
} else {
  initSecureComponents();
}

function initSecureComponents() {
  // 1. Process category URL query strings safely before anything else
  try {
    handleCrossPageCategoryRedirect();
  } catch (err) {
    console.error("Global routing pipeline broken:", err);
  }

  // 2. Responsive mobile navigation toggle
  try {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileNavigationBar = document.getElementById('mobileNavigationBar');

    if (mobileNavToggle && mobileNavigationBar) {
      mobileNavToggle.onclick = (e) => {
        e.preventDefault();
        mobileNavigationBar.classList.toggle('open');
        mobileNavToggle.classList.toggle('active');
      };
    }
  } catch (err) {
    console.error("Mobile Navigation Panel broken:", err);
  }

  // 3. Mobile category submenu accordion
  try {
    const categoryToggle = document.getElementById('categoryToggle');
    const submenu = document.getElementById('mobileSubmenu');

    if (categoryToggle && submenu) {
      categoryToggle.onclick = (e) => {
        e.preventDefault();
        submenu.classList.toggle('show-submenu');
      };
    }
  } catch (err) {
    console.error("Mobile dropdown menu crash:", err);
  }

  // 4. Cart badge synchronizer
  try {
    const globalCartBadge = document.getElementById('cartCounter');
    let cnumb = JSON.parse(localStorage.getItem('CartCount'));
    if (globalCartBadge) {
      globalCartBadge.textContent = cnumb || 0;
    }
  } catch (err) {
    console.error("Cart badge update operation rejected:", err);
  }

  // 5. Cross-page search routing pipeline
  try {
    initMarketplaceSearch();
  } catch (err) {
    console.error("Global search framework entry failure:", err);
  }
}

function handleCrossPageCategoryRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');

  if (urlCategory) {
    // Save the category parameter to session memory
    sessionStorage.setItem('pendingCategoryQuery', urlCategory);

    // If the user isn't on the shop page, send them there instantly
    if (!window.location.pathname.includes('ourshop.html')) {
      window.location.href = "shop.html";
    } else {
      // Clean up the URL query parameters bar silently to prevent infinite redirection loops
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
}

function initMarketplaceSearch() {
  const searchForm = document.getElementById('marketplaceSearch');
  const searchInputField = document.getElementById('searchInput');
  const dynamicShopGrid = document.getElementById("filterableShopGrid");

  if (searchForm && searchInputField) {
    searchForm.addEventListener('submit', (e) => {
      const userSearchKeyword = searchInputField.value.trim();
      if (!userSearchKeyword) return;

      // If the shop catalog grid doesn't exist on this current page, save text parameters and redirect
      if (!dynamicShopGrid) {
        e.preventDefault(); 
        sessionStorage.setItem('pendingSearchQuery', userSearchKeyword);
        window.location.href = "ourshop.html"; 
      }
    });
  }
}



var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/690afb07e10d0719502ad6e4/1j99e95vq';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
