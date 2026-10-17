document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================================================
  // INPUT SELECTORS
  // ==========================================================================
  const orderTrackingForm = document.getElementById('orderTrackingForm');
  const trackOrderIdInput = document.getElementById('trackOrderIdInput');
  const trackEmailInput = document.getElementById('trackEmailInput');

  // ==========================================================================
  // VIEW CARD PANELS SELECTORS
  // ==========================================================================
  const trackEmptyStatePanel = document.getElementById('trackEmptyStatePanel');
  const trackNotFoundPanel = document.getElementById('trackNotFoundPanel');
  const orderTrackingLookup = document.getElementById('orderTrackingLookup');
  const trackProcessingSpinner = document.getElementById('trackProcessingSpinner');
  const trackResultsDisplayPanel = document.getElementById('trackResultsDisplayPanel');

  // Boot Setup: Ensure secondary informational states are hidden on boot load
  if (orderTrackingLookup.classList.contains("hidden")) orderTrackingLookup.style.display = "none";
  if (trackEmptyStatePanel.classList.contains("hidden")) trackEmptyStatePanel.style.display = "none";
  if (trackNotFoundPanel.classList.contains("hidden")) trackNotFoundPanel.style.display = "none";
  if (trackProcessingSpinner.classList.contains("hidden")) trackProcessingSpinner.style.display = "none";
  if (trackResultsDisplayPanel.classList.contains("hidden")) trackResultsDisplayPanel.style.display = "none";

  // ==========================================================================
  // TRACKING EVENT CAPTURE PIPELINE
  // ==========================================================================
  if (orderTrackingForm) {
    orderTrackingForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const orderIdValue = trackOrderIdInput ? trackOrderIdInput.value.trim() : "";
      const emailValue = trackEmailInput ? trackEmailInput.value.trim() : "";

      if (orderIdValue === "" || emailValue === "") return;

      // 1. Enter Loading Loop state
      if (trackEmptyStatePanel) trackEmptyStatePanel.style.display = "none";
      if (trackNotFoundPanel) trackNotFoundPanel.style.display = "none";
      if (trackResultsDisplayPanel) trackResultsDisplayPanel.style.display = "none";
      if (trackProcessingSpinner) trackProcessingSpinner.style.display = "block";

      // Simulate localized logistics query delay loop
      setTimeout(() => {
        if (trackProcessingSpinner) trackProcessingSpinner.style.display = "none";

        // MOCK DATABASE LOGIC: Checks for a valid sequence format (e.g., SV-1004)
        if (orderIdValue.toUpperCase().startsWith("SV-")) {
          
          if (trackResultsDisplayPanel) {
            trackResultsDisplayPanel.style.display = "block";
            
            // Premium layout details injection referencing local USA hubs
            trackResultsDisplayPanel.innerHTML = `
              <div class="premium-tracking-card" style="padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 16px;">
                  <div>
                    <h4 style="margin: 0; font-size: 16px; color: #0f172a;">Order #${orderIdValue.toUpperCase()}</h4>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Associated with: ${emailValue}</p>
                  </div>
                  <span style="background-color: #dbeafe; color: #2563eb; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; height: fit-content;">In Transit</span>
                </div>
                
                <!-- Domestic Delivery Timeline Visualizer -->
                <div class="tracking-timeline-flow" style="display: flex; flex-direction: column; gap: 16px;">
                  <div style="display: flex; gap: 12px;">
                    <i class="fa-solid fa-circle-check" style="color: #16a34a; margin-top: 3px;"></i>
                    <div>
                      <strong style="font-size: 14px; color: #0f172a;">Departed US Distribution Center</strong>
                      <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">North American Logistics Hub — Sorted & dispatched.</p>
                    </div>
                  </div>
                  <div style="display: flex; gap: 12px;">
                    <i class="fa-solid fa-circle-dot" style="color: #2563eb; margin-top: 3px;"></i>
                    <div>
                      <strong style="font-size: 14px; color: #0f172a;">Arrived at sorting facility</strong>
                      <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Regional Hub Transit Facility — Estimated local delivery in 2 days.</p>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
        } else {
          // Fallback state if id signature patterns misalign
          if (trackNotFoundPanel) trackNotFoundPanel.style.display = "block";
        }
      }, 1200);
    });
  }
});

 
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











  // ==========================================================================
  // REAL-TIME ORDER LOGISTICS MANIFEST ROUTING TRACKER PIPELINE



document.getElementById('categoryToggle').addEventListener('click', function(e) {
  e.preventDefault(); // Prevents the page from jumping or reloading
  
  var submenu = document.getElementById('mobileSubmenu');
  submenu.classList.toggle('show-submenu');
});
