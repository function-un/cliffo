  // Native Core Frontend Application Script Controller
document.addEventListener("DOMContentLoaded", () => {


  let globalCart = document.getElementById('cartCounter');
  let cnumb = JSON.parse(localStorage.getItem('CartCount'));

  globalCart.textContent = cnumb || 0;})
  
  // ==========================================================================
  // 14. DYNAMIC INTERSECTION OBSERVER SCROLLSPY PIPELINE (terms.html)
  // ==========================================================================
  const termsIndexContainer = document.getElementById('termsScrollspyIndex');
  const policyCardSheetsList = document.querySelectorAll('.policy-text-viewport .policy-card-sheet');

  if (termsIndexContainer && policyCardSheetsList.length > 0) {
    const termsIndexTabs = termsIndexContainer.querySelectorAll('li');

    // Part A: Click to Smoothly Scroll to Section
    termsIndexTabs.forEach(tabLink => {
      tabLink.addEventListener('click', function() {
        const targetIdKey = this.getAttribute('data-scroll-target');
        const targetSectionBlock = document.getElementById(targetIdKey);

        if (targetSectionBlock) {
          termsIndexTabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');

          targetSectionBlock.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Part B: Watch Viewport Scroll to Auto-Highlight Menu
    const observerConfigurationOptions = {
      root: null, // Watch the global browser window viewport
      rootMargin: '-180px 0px -60px 0px', // Offset area to account for top blue navbar
      threshold: 0.2 // Trigger when 20% of section enters viewport area
    };

    const viewportTrackingObserver = new IntersectionObserver((observedEntries) => {
      observedEntries.forEach(entry => {
        // Run only if section is active inside target zone boundaries
        if (entry.isIntersecting) {
          const matchingElementId = entry.target.getAttribute('id');
          
          termsIndexTabs.forEach(tabPill => {
            if (tabPill.getAttribute('data-scroll-target') === matchingElementId) {
              tabPill.classList.add('active');
            } else {
              tabPill.classList.remove('active');
            }
          });
        }
      });
    }, observerConfigurationOptions);

    // Register sheets tracking targets list loops
    policyCardSheetsList.forEach(sheetNode => {
      viewportTrackingObserver.observe(sheetNode);
    });
  }
