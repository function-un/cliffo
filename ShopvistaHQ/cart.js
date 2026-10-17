// Native Core Frontend Application Script Controller
document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // 1. GLOBAL LAYOUT CORE MODULES (Shared Navbar, Navigation & Badges)
  // ==========================================================================
  const globalCartBadge = document.getElementById('cartCounter');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavigationBar = document.getElementById('mobileNavigationBar');
  const categoryToggle = document.getElementById('categoryToggle');
  const mobileSubmenu = document.getElementById('mobileSubmenu');
  const searchForm = document.getElementById('marketplaceSearch');
  const searchInputField = document.getElementById('searchInput');


  // Initialize Shopping Cart Processing Engines
  initializeCartWorkflow();
});

// ==========================================================================
// 2. SHOPPING CART DYNAMIC LOGIC PIPELINES
// ==========================================================================
function initializeCartWorkflow() {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const activeCartLayout = document.getElementById('activeCartLayout');
  const emptyCartLayout = document.getElementById('emptyCartLayout');
  const cartItemsCountLabel = document.getElementById('cartItemsCountLabel');
  const cartSubtotalValue = document.getElementById('cartSubtotalValue');
  const cartEstimatedTotalValue = document.getElementById('cartEstimatedTotalValue');
  const globalCartBadge = document.getElementById('cartCounter');

  if (!cartItemsContainer) return;

  // Read local inventory states array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Clear out static designer boilerplate elements safely
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    toggleEmptyCartDisplay();
    return;
  }

  // Render all active components using addition mutation loops
  cart.forEach(item => {
    const rawPrice = parseFloat(item.price) || 0;

    // FIXED: Changed '=' to '+=' to accumulate and display ALL items instead of overwriting them
    cartItemsContainer.innerHTML += `
      <div class="cart-item-row" data-item-id="${item.id}" data-price="${rawPrice}">
        <div class="cart-product-cell">
          <div class="cart-item-thumb">
            <img src="../shopvistaHQ/${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p class="cart-item-meta">Variant: Default Edition</p>
            <button type="button" class="cart-item-remove-btn">
              <i class="fa-regular fa-trash-can"></i> Remove
            </button>
          </div>
        </div>
        
        <div class="cart-price-cell" data-label="Price">
          <span>#${rawPrice.toFixed(2)}</span>
        </div>
        
        <div class="cart-quantity-cell" data-label="Quantity">
          <div class="cart-qty-picker">
            <button type="button" class="cart-qty-minus">-</button>
            <input type="number" class="cart-qty-input" value="${parseInt(item.quantity) || 1}" min="1" max="10" readonly>
            <button type="button" class="cart-qty-plus">+</button>
          </div>
        </div>
        
        <div class="cart-subtotal-cell" data-label="Subtotal">
          <strong class="item-computed-subtotal">#0.00</strong>
        </div>
      </div>
    `;
  });

  // Master total recalculation engine localized for USD markets
  function recalculateCartTotals() {
    const activeRows = cartItemsContainer.querySelectorAll('.cart-item-row');
    
    if (activeRows.length === 0) {
      localStorage.setItem('cart', JSON.stringify([]));
      localStorage.setItem('CartCount', JSON.stringify(0));
      toggleEmptyCartDisplay();
      return;
    }

    let runningTotalSum = 0;
    let combinedItemsCount = 0;
    let updatedCartStateArray = [];

    activeRows.forEach(row => {
      const itemId = row.getAttribute('data-item-id');
      const standardPrice = parseFloat(row.getAttribute('data-price')) || 0;
      const quantityInputField = row.querySelector('.cart-qty-input');
      const itemQty = parseInt(quantityInputField.value) || 1;
      
      let currentItemSubtotal = standardPrice * itemQty;
      runningTotalSum += currentItemSubtotal;
      combinedItemsCount += itemQty;

      // Update UI row text element natively
      const rowSubtotalText = row.querySelector('.item-computed-subtotal');
      if (rowSubtotalText) {
        rowSubtotalText.textContent = `#${currentItemSubtotal.toFixed(2)}`;
      }

      // Re-map active DOM values back to local storage models to match quantities
      const originalItemObject = cart.find(i => String(i.id) === String(itemId));
      if (originalItemObject) {
        originalItemObject.quantity = itemQty;
        updatedCartStateArray.push(originalItemObject);
      }
    });

    // Synchronize arrays back to database states
    localStorage.setItem('cart', JSON.stringify(updatedCartStateArray));
    localStorage.setItem('CartCount', JSON.stringify(combinedItemsCount));

    // Render Western pricing configurations ($ USD )
    if (cartSubtotalValue) cartSubtotalValue.textContent = `#${runningTotalSum.toFixed(2)}`;
    if (cartEstimatedTotalValue) cartEstimatedTotalValue.textContent = `#${runningTotalSum.toFixed(2)}`;
    if (globalCartBadge) globalCartBadge.textContent = combinedItemsCount;
    
    if (cartItemsCountLabel) {
      cartItemsCountLabel.textContent = `You have ${activeRows.length} item(s) in your cart`;
    }
  }

  // Display configuration toggle engine
  function toggleEmptyCartDisplay() {
    if (activeCartLayout) activeCartLayout.classList.add('hidden');
    if (emptyCartLayout) emptyCartLayout.classList.remove('hidden');
    if (cartItemsCountLabel) cartItemsCountLabel.textContent = "You have 0 items in your cart";
    if (globalCartBadge) globalCartBadge.textContent = "0";
  }

  // Bubble Event Listener Routing Matrix
  cartItemsContainer.addEventListener('click', (event) => {
    const targetNode = event.target;
    
    // Check if Plus or Minus buttons were clicked
    if (targetNode.classList.contains('cart-qty-plus') || targetNode.classList.contains('cart-qty-minus')) {
      const rowBlock = targetNode.closest('.cart-item-row');
      const inputField = rowBlock.querySelector('.cart-qty-input');
      let currentQty = parseInt(inputField.value) || 1;

      if (targetNode.classList.contains('cart-qty-plus')) {
        let maxAllowed = parseInt(inputField.getAttribute('max')) || 10;
        if (currentQty < maxAllowed) inputField.value = currentQty + 1;
      } else if (targetNode.classList.contains('cart-qty-minus')) {
        if (currentQty > 1) inputField.value = currentQty - 1;
      }
      
      recalculateCartTotals();
    }

    // Check if Remove button was clicked
    if (targetNode.classList.contains('cart-item-remove-btn') || targetNode.closest('.cart-item-remove-btn')) {
      const structuralRow = targetNode.closest('.cart-item-row');
      
      structuralRow.style.transition = "all 0.25s ease";
      structuralRow.style.opacity = "0";
      structuralRow.style.transform = "translateY(10px)";
      
      setTimeout(() => {
        structuralRow.remove();
        recalculateCartTotals();
      }, 250);
    }
  });

  // Calculate totals automatically upon initial data stream injection
  recalculateCartTotals();
}
