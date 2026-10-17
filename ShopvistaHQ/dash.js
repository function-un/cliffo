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



  // Safe Form Search Engine interceptor logic
  if (searchForm && searchInputField) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userSearchKeyword = searchInputField.value.trim();
      alert(`Executing local test lookups across category arrays for parameter: "${userSearchKeyword}"`);
    });
  }

});


// Native Core Frontend Application Script Controller
document.addEventListener("DOMContentLoaded", () => {
  
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

// Native Core Frontend Application Script Controller
document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // GLOBAL LAYOUT CORE MODULES (Shared across Homepage & Details)
  // ==========================================================================
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavigationBar = document.getElementById('mobileNavigationBar');
  const searchForm = document.getElementById('marketplaceSearch');
  const searchInputField = document.getElementById('searchInput');

  // Interactive Hamburger Click Toggle Event Handler
  if (mobileNavToggle && mobileNavigationBar) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileNavigationBar.classList.toggle('open');
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


  // ==========================================================================
  // DYNAMIC PRODUCT DETAIL VIEW CONTROLLER SCHEMES
  // ==========================================================================
  
  // 1. Gallery Image Switching Logic
  const mainStageImage = document.getElementById('productMainStageImg');
  const thumbnailItems = document.querySelectorAll('.thumb-item');

  if (mainStageImage && thumbnailItems.length > 0) {
    thumbnailItems.forEach(thumb => {
      thumb.addEventListener('click', function() {
        // Deactivate previous item selection states
        thumbnailItems.forEach(t => t.classList.remove('active'));
        
        // Highlight active clicked item block context
        this.classList.add('active');
        
        // Mutate asset path references dynamically
        const targetImgSrc = this.querySelector('img').getAttribute('src');
        mainStageImage.setAttribute('src', targetImgSrc);
      });
    });
  }

  // 2. Attribute Pill Value Selectors (Color & Bundle variations)
  const colorPills = document.querySelectorAll('.color-pill');
  const colorPreviewText = document.getElementById('colorPreviewText');
  const bundleCards = document.querySelectorAll('.bundle-card');

  if (colorPills.length > 0 && colorPreviewText) {
    colorPills.forEach(pill => {
      pill.addEventListener('click', function() {
        colorPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        
        const selectedColorName = this.getAttribute('data-color');
        colorPreviewText.innerHTML = `Selected: <strong>${selectedColorName}</strong>`;
      });
    });
  }

  if (bundleCards.length > 0) {
    bundleCards.forEach(card => {
      card.addEventListener('click', function() {
        bundleCards.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // 3. Increment / Decrement Quantity Input Box Controllers
  const qtyDecrementBtn = document.getElementById('qtyDecrementBtn');
  const qtyIncrementBtn = document.getElementById('qtyIncrementBtn');
  const qtyDisplayInput = document.getElementById('qtyDisplayInput');

  if (qtyDecrementBtn && qtyIncrementBtn && qtyDisplayInput) {
    qtyDecrementBtn.addEventListener('click', () => {
      let currentVal = parseInt(qtyDisplayInput.value) || 1;
      if (currentVal > 1) {
        qtyDisplayInput.value = currentVal - 1;
      }
    });

    qtyIncrementBtn.addEventListener('click', () => {
      let currentVal = parseInt(qtyDisplayInput.value) || 1;
      let maxVal = parseInt(qtyDisplayInput.getAttribute('max')) || 10;
      if (currentVal < maxVal) {
        qtyDisplayInput.value = currentVal + 1;
      }
    });
  }

  // 4. Cart Storage Counter Allocation Pipeline Animation layout Simulation
  const mainAddToCartSubmitTrigger = document.getElementById('mainAddToCartSubmitTrigger');
  const globalCartCounterBadge = document.getElementById('cartCounter');

  if (mainAddToCartSubmitTrigger && globalCartCounterBadge) {
    mainAddToCartSubmitTrigger.addEventListener('click', function() {
      const addedQuantity = parseInt(qtyDisplayInput.value) || 1;
      let baseCartCount = parseInt(globalCartCounterBadge.textContent) || 0;
      
      // Update global display counts
      let updatedTotalCount = baseCartCount + addedQuantity;
      globalCartCounterBadge.textContent = updatedTotalCount;
      
      // Button animation feedback cue layout logic sequence
      const originalButtonContent = this.innerHTML;
      this.style.backgroundColor = '#22c55e'; // Shift button color to green temporarily
      this.innerHTML = `<i class="fa-solid fa-check"></i> Added Success!`;
      this.disabled = true;

      setTimeout(() => {
        this.style.backgroundColor = '';
        this.innerHTML = originalButtonContent;
        this.disabled = false;
      }, 1500);
    });
  }

  // 5. Wishlist Heart Selection Toggler Node Pipeline
  const mainWishlistToggleTrigger = document.getElementById('mainWishlistToggleTrigger');
  const wishlistCounterBadge = document.getElementById('wishlistCounter');

  if (mainWishlistToggleTrigger && wishlistCounterBadge) {
    mainWishlistToggleTrigger.addEventListener('click', function() {
      this.classList.toggle('favorited');
      let currentWishCount = parseInt(wishlistCounterBadge.textContent) || 0;
      
      const heartIcon = this.querySelector('i');
      if (this.classList.contains('favorited')) {
        heartIcon.className = 'fa-solid fa-heart';
        wishlistCounterBadge.textContent = currentWishCount + 1;
      } else {
        heartIcon.className = 'fa-regular fa-heart';
        wishlistCounterBadge.textContent = Math.max(0, currentWishCount - 1);
      }
    });
  }

});







  // ==========================================================================
  // REAL-TIME ORDER LOGISTICS MANIFEST ROUTING TRACKER PIPELINE
  // ==========================================================================
  
  const trackingForm = document.getElementById('orderTrackingLookupForm');
  const trackProcessingSpinner = document.getElementById('trackProcessingSpinner');
  const trackResultsDisplayPanel = document.getElementById('trackResultsDisplayPanel');

  if (trackingForm && trackProcessingSpinner && trackResultsDisplayPanel) {
    trackingForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Halt document node browser refresh

      const orderIdInput = document.getElementById('trackOrderIdInput');
      const emailInput = document.getElementById('trackEmailInput');

      const errOrderId = document.getElementById('errTrackOrderId');
      const errEmail = document.getElementById('errTrackEmail');

      let isTrackerQueryValid = true;

      // Reset prior errors
      errOrderId.textContent = "";
      errEmail.textContent = "";
      trackResultsDisplayPanel.classList.add('hidden');

      // 1. Order Identification Format Check
      const orderIdText = orderIdInput.value.trim().toUpperCase();
      if (orderIdText === "") {
        errOrderId.textContent = "Please input a valid Order Reference Number.";
        isTrackerQueryValid = false;
      } else if (!orderIdText.startsWith("SV-")) {
        errOrderId.textContent = "Order ID codes must initiate with 'SV-' prefix headers.";
        isTrackerQueryValid = false;
      }

      // 2. Email Empty Constraints Evaluation
      const emailValueText = emailInput.value.trim();
      const emailRegexStructurePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailValueText === "") {
        errEmail.textContent = "Billing email info profile cannot stand left blank.";
        isTrackerQueryValid = false;
      } else if (!emailRegexStructurePattern.test(emailValueText)) {
        errEmail.textContent = "Malformed destination contact path pattern structure.";
        isTrackerQueryValid = false;
      }

      // If valid, trigger micro-loading delay animation layout sequence 
      if (isTrackerQueryValid) {
        trackProcessingSpinner.classList.remove('hidden');
        
        // Emulate background manifest lookups delay window execution pipeline
        setTimeout(() => {
          trackProcessingSpinner.classList.add('hidden');
          
          // Inject code targets nodes adjustments dynamically
          const resTrackingCodeText = document.getElementById('resTrackingCodeText');
          if (resTrackingCodeText) resTrackingCodeText.textContent = orderIdText;
          
          // Reveal result visual panels framework layouts
          trackResultsDisplayPanel.classList.remove('hidden');
        }, 1200);
      }
    });
  }






  // ==========================================================================
  // REAL-TIME ORDER LOGISTICS MANIFEST ROUTING TRACKER PIPELINE
  // ==========================================================================
  
  const trackingForm = document.getElementById('orderTrackingLookupForm');
  const trackProcessingSpinner = document.getElementById('trackProcessingSpinner');
  const trackResultsDisplayPanel = document.getElementById('trackResultsDisplayPanel');
  
  // New panel hooks
  const trackEmptyStatePanel = document.getElementById('trackEmptyStatePanel');
  const trackNotFoundPanel = document.getElementById('trackNotFoundPanel');

  if (trackingForm && trackProcessingSpinner) {
    trackingForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Halt browser reload

      const orderIdInput = document.getElementById('trackOrderIdInput');
      const emailInput = document.getElementById('trackEmailInput');

      const errOrderId = document.getElementById('errTrackOrderId');
      const errEmail = document.getElementById('errTrackEmail');

      let isTrackerQueryValid = true;

      // Clean up previous error notifications and hide screens
      errOrderId.textContent = "";
      errEmail.textContent = "";
      if (trackResultsDisplayPanel) trackResultsDisplayPanel.classList.add('hidden');
      if (trackEmptyStatePanel) trackEmptyStatePanel.classList.add('hidden');
      if (trackNotFoundPanel) trackNotFoundPanel.classList.add('hidden');

      // 1. Order ID Format Check
      const orderIdText = orderIdInput.value.trim().toUpperCase();
      if (orderIdText === "") {
        errOrderId.textContent = "Please input a valid Order Reference Number.";
        isTrackerQueryValid = false;
      } else if (!orderIdText.startsWith("SV-")) {
        errOrderId.textContent = "Order ID codes must initiate with 'SV-' prefix headers.";
        isTrackerQueryValid = false;
      }

      // 2. Email Address Empty Validation
      const emailValueText = emailInput.value.trim();
      const emailRegexStructurePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailValueText === "") {
        errEmail.textContent = "Billing email info profile cannot stand left blank.";
        isTrackerQueryValid = false;
      } else if (!emailRegexStructurePattern.test(emailValueText)) {
        errEmail.textContent = "Malformed destination contact path pattern structure.";
        isTrackerQueryValid = false;
      }

      // If the fields pass validation, launch lookup simulation
      if (isTrackerQueryValid) {
        trackProcessingSpinner.classList.remove('hidden');
        
        setTimeout(() => {
          trackProcessingSpinner.classList.add('hidden');
          
          // Simulation Rule: Let's assume only "SV-12345" exists in our test system
          if (orderIdText === "SV-12345") {
            const resTrackingCodeText = document.getElementById('resTrackingCodeText');
            if (resTrackingCodeText) resTrackingCodeText.textContent = orderIdText;
            
            // Show the dynamic timeline results panel
            if (trackResultsDisplayPanel) trackResultsDisplayPanel.classList.remove('hidden');
          } else {
            // Show the "Order Not Found" fallback panel instead
            if (trackNotFoundPanel) trackNotFoundPanel.classList.remove('hidden');
          }
          
        }, 1200);
      } else {
        // If form validation completely failed before sending, restore default empty screen state
        if (trackEmptyStatePanel) trackEmptyStatePanel.classList.remove('hidden');
      }
    });
  }












  // ==========================================================================
  // USER ACCOUNT DASHBOARD VIEW WINDOW INTERACTIVE PIPELINES
  // ==========================================================================
  const dashNavigationTabs = document.querySelectorAll('#dashboardTabsGroup li:not(#dashboardLogoutTrigger)');
  const dashPanelWindows = document.querySelectorAll('.dash-panel-window');
  const dashboardLogoutTrigger = document.getElementById('dashboardLogoutTrigger');

  // 1. Panel Tab Swapping Router Switch Logic
  if (dashNavigationTabs.length > 0 && dashPanelWindows.length > 0) {
    dashNavigationTabs.forEach(tabPill => {
      tabPill.addEventListener('click', function() {
        dashNavigationTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const targetedWindowKey = this.getAttribute('data-dash-target');

        dashPanelWindows.forEach(windowBlock => {
          const panelBlockId = windowBlock.getAttribute('id');
          if (panelBlockId === `dashPanel-${targetedWindowKey}`) {
            windowBlock.classList.remove('hidden-dash-panel');
          } else {
            windowBlock.classList.add('hidden-dash-panel');
          }
        });
      });
    });
  }

  // 2. Profile Editor Information Synchronization Pipeline
  const dashProfileUpdateForm = document.getElementById('dashProfileUpdateForm');
  const overviewAddressSnapshot = document.getElementById('overviewAddressSnapshot');
  const dashGreetingName = document.getElementById('dashGreetingName');

  // Trigger an initial mock profile sync check on screen load
  function syncDashboardOverviewAddress() {
    if (!overviewAddressSnapshot) return;
    
    const street = document.getElementById('dashEditStreet').value.trim();
    const city = document.getElementById('dashEditCity').value.trim();
    const state = document.getElementById('dashEditState').value.trim();
    
    overviewAddressSnapshot.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> ${street}, ${city}, ${state} State, Nigeria.`;
  }
  syncDashboardOverviewAddress();

  if (dashProfileUpdateForm) {
    dashProfileUpdateForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Halt document reload

      const firstName = document.getElementById('dashEditFirstName').value.trim();
      const lastName = document.getElementById('dashEditLastName').value.trim();
      const dashProfileSaveBtn = document.getElementById('dashProfileSaveBtn');

      // Update text nodes on overview snapshot headers instantly
      if (dashGreetingName) dashGreetingName.textContent = `${firstName} ${lastName}`;
      syncDashboardOverviewAddress();

      // UI submission animation layout feedback loop
      const originalBtnContent = dashProfileSaveBtn.innerHTML;
      dashProfileSaveBtn.style.backgroundColor = '#16a34a';
      dashProfileSaveBtn.innerHTML = `<i class="fa-solid fa-check"></i> Changes Applied!`;
      dashProfileSaveBtn.disabled = true;

      alert(`Success!\n\nYour profile billing addresses details records have been rewritten securely.`);

      setTimeout(() => {
        dashProfileSaveBtn.style.backgroundColor = '';
        dashProfileSaveBtn.innerHTML = originalBtnContent;
        dashProfileSaveBtn.disabled = false;
        
        // Navigate the user back to overview panel window cleanly
        const overviewTabTrigger = document.querySelector('[data-dash-target="overview"]');
        if (overviewTabTrigger) overviewTabTrigger.click();
      }, 1200);
    });
  }

  // 3. Simple User Logout Hook Interceptor Action
  if (dashboardLogoutTrigger) {
    dashboardLogoutTrigger.addEventListener('click', () => {
      if (confirm("Are you sure you want to sign out from ShopvistaHQ session?")) {
        alert("Session terminated cleanly. Returning to Home Route Index.");
        window.location.href = "index.html";
      }
    });
  }




document.getElementById('categoryToggle').addEventListener('click', function(e) {
  e.preventDefault(); // Prevents the page from jumping or reloading
  
  var submenu = document.getElementById('mobileSubmenu');
  submenu.classList.toggle('show-submenu');
});
