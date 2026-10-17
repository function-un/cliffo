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
  
  // Kick off product detail lookup process automatically
  loadPh();
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
  
  const wishlistCounterBadge = document.getElementById('wishlistCounter');
  if (wishlistCounterBadge) {
    const savedWish = localStorage.getItem("WishlistCount");
    if (savedWish) {
      wishlistCounterBadge.textContent = JSON.parse(savedWish);
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
  // Ensure any valid category requested in the URL 'page' parameter fetches dynamically
  if (page && page !== "null" && page !== "undefined" && id) {
    try {
      // Dynamically routes to /shopvistaHQ/phone/1, /shopvistaHQ/buildingmaterials/3, etc.
      const res = await fetch(`/shopvistaHQ/${page}/${id}`);
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      
      const proa = await res.json();
      
      // 1. DYNAMIC PREMIUM BREADCRUMB INJECTION
      const breadcrumbContainer = document.querySelector(".breadcrumbs");
      if (breadcrumbContainer) {
        const formattedCategory = page.charAt(0).toUpperCase() + page.slice(1);

        breadcrumbContainer.innerHTML = `
          <a href="index.html">Home</a> &gt; 
          <a href="ourshop.html?category=${page}">${formattedCategory}</a> &gt; 
          ${proa.pBrand || ''} ${proa.pModel || ''}
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
            <img src="../shopvistaHQ/${proa.imageUrl}" id="productMainStageImg" alt="${proa.pModel || 'Product'} Primary View">
          </div>
          
        </div>  

        <!-- Right Column: Context Information Ordering Action Block -->
        <div class="detail-info-panel">
          <span class="info-brand-tag">${proa.pBrand || ''}</span>
          <h1 class="info-product-title">${proa.pModel || ''}</h1>
          
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
            <span class="info-current-price">#${proa.prize || proa.price || '0'}</span>
            <span class="info-old-price">#150</span>
          </div>

          <p class="info-description-text">
            Experience premium manufacturing engineering and durability design. Featuring long-lasting production quality, certified reliability frameworks, clear dynamic utility implementations, and an ergonomic optimization build crafted for absolute long-term durability.
          </p>

          <div class="purchase-actions-row">
            <div class="quantity-picker-box">
              <button type="button" id="qtyDecrementBtn" aria-label="Decrease quantity">-</button>
              <input type="number" id="qtyDisplayInput" value="1" min="1" max="10" readonly>
              <button type="button" id="qtyIncrementBtn" aria-label="Increase quantity">+</button>
            </div>
            
            <button type="button" class="action-add-to-cart-btn" id="mainAddToCartSubmitTrigger" data-id="${proa.id}" data-price="${proa.prize || proa.price || '0'}" data-image="${proa.imageUrl}" data-name="${proa.pModel || proa.pName || 'Product'}">
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
              <span>Fast Delivery within Lagos & across Nigeria.</span>
            </div>
            <div class="guarantee-item">
              <i class="fa-solid fa-warehouse"></i>
              <span>In Stock & Shipped directly from our Lagos retail stores.</span>
            </div>
            <div class="guarantee-item">
              <i class="fa-solid fa-shield-halved"></i>
              <span>1 Year Official Warranty + Easy Returns to our stores.</span>
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
function initializeDynamicProductFeatures() {
  const qtyDecrementBtn = document.getElementById('qtyDecrementBtn');
  const qtyIncrementBtn = document.getElementById('qtyIncrementBtn');
  const qtyDisplayInput = document.getElementById('qtyDisplayInput');
  const mainAddToCartSubmitTrigger = document.getElementById('mainAddToCartSubmitTrigger');
  const globalCartCounterBadge = document.getElementById('cartCounter');
  const mainWishlistToggleTrigger = document.getElementById('mainWishlistToggleTrigger');
  const wishlistCounterBadge = document.getElementById('wishlistCounter');

  // Interactive Photo Gallery Switching Logic
  const mainStageImg = document.getElementById('productMainStageImg');
  const thumbnails = document.querySelectorAll('.thumb-item img');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('active'));
      if (mainStageImg && this.getAttribute('src')) {
        mainStageImg.setAttribute('src', this.getAttribute('src'));
        this.parentElement.classList.add('active');
      }
    });
  });

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

  // Add to Cart Controller with Interactive Visual State Response
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
        category: page,
        quantity: addedQuantity
      };

      // 2. Get existing cart from localStorage or initialize empty array
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // 3. Check if item already exists to update quantity
      const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id && item.category === productToAdd.category);

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

      // 5. User Feedback Alert (Fixed Template Literal String Syntax)
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
        if (heartIcon.classList.contains('fa-regular')) {
          // Add to wishlist view state
          heartIcon.classList.remove('fa-regular');
          heartIcon.classList.add('fa-solid', 'active-heart');
          heartIcon.style.color = "#e44d26";
          
          currentWishCount += 1;
        } else {
          // Remove from wishlist view state
          heartIcon.classList.remove('fa-solid', 'active-heart');
          heartIcon.classList.add('fa-regular');
          heartIcon.style.color = "";
          
          currentWishCount = Math.max(0, currentWishCount - 1);
        }
        
        wishlistCounterBadge.textContent = currentWishCount;
        localStorage.setItem("WishlistCount", JSON.stringify(currentWishCount));
      }
    });
  }
}

