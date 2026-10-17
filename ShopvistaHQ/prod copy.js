// Native Core Frontend Application Script Controller
document.addEventListener("DOMContentLoaded", () => {
  // 1. GLOBAL LAYOUT ELEMENTS
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavigationBar = document.getElementById('mobileNavigationBar');
  const categoryToggle = document.getElementById('categoryToggle');
  const mobileSubmenu = document.getElementById('mobileSubmenu');
  const searchForm = document.getElementById('marketplaceSearch');
  const searchInputField = document.getElementById('searchInput');

  // Sync cart badge UI with localStorage data immediately on page boot
  syncGlobalBadgesOnLoad();
});

// Sync cart counter badge globally from persistence layer
function syncGlobalBadgesOnLoad() {
  const globalCartCounterBadge = document.getElementById('cartCounter');
  if (globalCartCounterBadge) {
    const savedCount = localStorage.getItem("CartCount");
    if (savedCount) {
      globalCartCounterBadge.textContent = JSON.parse(savedCount);
    }
  }
}

// ==========================================================================
// 2. DYNAMIC CONTENT GENERATOR & PRODUCT COMPONENT LISTENERS
// ==========================================================================
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const page = String(params.get("page"));

async function loadPh() {
  if (page === 'otherp') {
    try {
      const res = await fetch(`/shopvistaHQ/otherp/${id}`);
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      
      const proa = await res.json();
      
      // 1. DYNAMIC PREMIUM BREADCRUMB INJECTION
      // Updates the HTML banner container with localized, premium categories
      const breadcrumbContainer = document.querySelector(".breadcrumbs");
      if (breadcrumbContainer) {
        // Formats the category name dynamically to look clean (e.g., "audio" -> "Audio")
        const formattedCategory = proa.pCategory 
          ? proa.pCategory.charAt(0).toUpperCase() + proa.pCategory.slice(1) 
          : 'Audio';

        breadcrumbContainer.innerHTML = `
          <a href="index.html">Home</a> &gt; 
          <a href="ourshop.html?category=${proa.pCategory || 'audio'}">${formattedCategory}</a> &gt; 
          ${proa.pBrand} ${proa.pModel}
        `;
      }

      // 2. DYNAMIC MAIN LAYOUT CONTENT INJECTION
      const prodContainer = document.getElementById("detail-layout");
      if (!prodContainer) return;

      prodContainer.innerHTML = `
        <!-- Left Column: Interactive Picture Gallery Display Panel -->
        <div class="detail-gallery-panel">
          <div class="main-display-image">
            <div class="detail-tag-discount">-30%</div>
            <img src="../shopvistaHQ/${proa.imageUrl}" id="productMainStageImg" alt="${proa.pModel} Primary View">
          </div>
          <div class="thumbnail-gallery-row">
            <div class="thumb-item active">
              <img id="productMain" src="${proa.imageUrl0}" data-src="${proa.imageUrl0}" alt="View 1">
            </div>
            <div class="thumb-item">
              <img id="productMaini" src="${proa.imageUrl1}" data-src="${proa.imageUrl1}" alt="View 2">
            </div>
            <div class="thumb-item">
              <img id="productMainii" src="${proa.imageUrl2}" data-src="${proa.imageUrl2}" alt="View 3">
            </div>
            <div class="thumb-item">
              <img id="productMainiii" src="${proa.imageUrl3}" data-src="${proa.imageUrl3}" alt="View 4">
            </div>
          </div>
        </div>  

        <!-- Right Column: Context Information Ordering Action Block -->
        <div class="detail-info-panel">
          <span class="info-brand-tag">${proa.pBrand}</span>
          <h1 class="info-product-title">${proa.pModel}</h1>
          
          <div class="product-rating-row">
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-regular fa-star-half-stroke"></i>
            </div>
            <span class="rating-text">(4.8 out of 5 Stars from 1,240 buyers)</span>
          </div>

          <div class="info-price-box">
            <span class="info-current-price">$${proa.prize}</span>
            <span class="info-old-price">$150</span>
          </div>

          <p class="info-description-text">
            Experience industry-leading active noise cancellation powered by Dual Noise Sensor technology. Featuring up to 30 hours of continuous battery life, touch sensor control configurations, clear smart voice speaking capabilities, and an ergonomic plush build optimized for absolute comfort during prolonged sessions.
          </p>

          <div class="purchase-actions-row">
            <div class="quantity-picker-box">
              <button type="button" id="qtyDecrementBtn" aria-label="Decrease quantity">-</button>
              <input type="number" id="qtyDisplayInput" value="1" min="1" max="10" readonly>
              <button type="button" id="qtyIncrementBtn" aria-label="Increase quantity">+</button>
            </div>
            
            <button type="button" class="action-add-to-cart-btn" id="mainAddToCartSubmitTrigger" data-id="${proa.id}" data-price="${proa.prize}" data-image="${proa.imageUrl}" data-name="${proa.pName}">
              <i class="fa fa-shopping-cart"></i> Add To Cart
            </button>

            <button type="button" class="action-wishlist-toggle-btn" id="mainWishlistToggleTrigger" aria-label="Add to Wishlist">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>

          <!-- PREMIUM NORTH AMERICAN LOGISTICS BLOCK -->
          <div class="trust-guarantees-list">
            <div class="guarantee-item">
              <i class="fa-solid fa-truck-fast"></i>
              <span>Express 2-3 Day Delivery across the United States & Canada.</span>
            </div>
            <div class="guarantee-item">
              <i class="fa-solid fa-warehouse"></i>
              <span>In Stock & Shipped directly from our North American distribution hubs.</span>
            </div>
            <div class="guarantee-item">
              <i class="fa-solid fa-shield-halved"></i>
              <span>1 Year Official Manufacturer Warranty + Hassle-Free Local Returns.</span>
            </div>
          </div> 
        </div>
      `;

      // Initialization of dynamic component behaviors after innerHTML rendering
      initializeDynamicProductFeatures();

    } catch (error) {
      console.error("Async inventory layout resolution pipeline broke:", error);
    }
  }
}


// Helper function to cleanly bind listeners only after content is completely drawn
// FIXED: Removed unneeded color selectors and bundle element arrays to optimize execution speed
function initializeDynamicProductFeatures() {
  const qtyDecrementBtn = document.getElementById('qtyDecrementBtn');
  const qtyIncrementBtn = document.getElementById('qtyIncrementBtn');
  const qtyDisplayInput = document.getElementById('qtyDisplayInput');
  const mainAddToCartSubmitTrigger = document.getElementById('mainAddToCartSubmitTrigger');
  const globalCartCounterBadge = document.getElementById('cartCounter');
  const mainWishlistToggleTrigger = document.getElementById('mainWishlistToggleTrigger');
  const wishlistCounterBadge = document.getElementById('wishlistCounter');

  // Quantity Controllers
  if (qtyDecrementBtn && qtyIncrementBtn && qtyDisplayInput) {
    qtyDecrementBtn.addEventListener('click', () => {
      let currentVal = parseInt(qtyDisplayInput.value) || 1;
      if (currentVal > 1) qtyDisplayInput.value = currentVal - 1;
    });

    qtyIncrementBtn.addEventListener('click', () => {
      let currentVal = parseInt(qtyDisplayInput.value) || 1;
      let maxVal = parseInt(qtyDisplayInput.getAttribute('max')) || 10;
      if (currentVal < maxVal) qtyDisplayInput.value = currentVal + 1;
    });
  }

  // Add to Cart Controller
  if (mainAddToCartSubmitTrigger && globalCartCounterBadge && qtyDisplayInput) {
    mainAddToCartSubmitTrigger.addEventListener('click', function() {
      let addedQuantity = parseInt(qtyDisplayInput.value) || 1;
      let baseCartCount = parseInt(globalCartCounterBadge.textContent) || 0;
      
      const originalButtonContent = this.innerHTML;
      this.style.backgroundColor = '#22c55e';
      this.innerHTML = `<i class="fa-solid fa-check"></i> Added Success!`;
      this.disabled = true;

      // 1. Create the product object from data attributes
      const productToAdd = {
        id: mainAddToCartSubmitTrigger.getAttribute("data-id"),
        name: mainAddToCartSubmitTrigger.getAttribute("data-name"),
        price: mainAddToCartSubmitTrigger.getAttribute("data-price"),
        image: mainAddToCartSubmitTrigger.getAttribute("data-image"),
        quantity: addedQuantity
      };

      // 2. Get existing cart from localStorage or initialize empty array
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // 3. Check if item already exists to avoid duplicates
      const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += addedQuantity;
      } else {
        cart.push(productToAdd);
      }

      // 4. Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      const updatedCartCount = baseCartCount + addedQuantity;
      localStorage.setItem("CartCount", JSON.stringify(updatedCartCount));
      globalCartCounterBadge.textContent = updatedCartCount;

      // 5. User Feedback Alert
      alert(`${productToAdd.name} has been added to your cart!`);

      setTimeout(() => {
        this.style.backgroundColor = '';
        this.innerHTML = originalButtonContent;
        this.disabled = false;
      }, 1500);
    });
  }

   // ==========================================================================
  // Wishlist Toggler Fixed Code Block
  // ==========================================================================
  if (mainWishlistToggleTrigger && wishlistCounterBadge) {
    mainWishlistToggleTrigger.addEventListener('click', function() {
      this.classList.toggle('favorited');
      let currentWishCount = parseInt(wishlistCounterBadge.textContent) || 0;
      const heartIcon = this.querySelector('i');
      
      if (heartIcon) {
        if (this.classList.contains('favorited')) {
          heartIcon.className = 'fa-solid fa-heart';
          wishlistCounterBadge.textContent = currentWishCount + 1;
        } else {
          heartIcon.className = 'fa-regular fa-heart';
          wishlistCounterBadge.textContent = Math.max(0, currentWishCount - 1);
        }
      }
    });
  }
} // Closes initializeDynamicProductFeatures

// ==========================================================================
// Efficient UI Picture Gallery Switching without Database Fetch Loops
// ==========================================================================
document.addEventListener('click', function (event) {
  const thumb = event.target.closest('.thumb-item');
  if (thumb) {
    const mainStageImage = document.getElementById('productMainStageImg');
    if (!mainStageImage) return;
    
    const allThumbs = document.querySelectorAll('.thumb-item');
    allThumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    
    const innerImg = thumb.querySelector('img');
    if (innerImg) {
      const newSrc = innerImg.getAttribute('src');
      mainStageImage.setAttribute('src', newSrc);
    }
  }
});

// Run script controller on startup execution loop
loadPh();
