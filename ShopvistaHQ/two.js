// Native Core Frontend Application Script Controller
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================
  // MARKETPLACE OUR SHOP CATALOG CATEGORY VIEW FILTER PIPELINE
  // ==========================================================================
  const categoryFilters = document.querySelectorAll('#shopCategoryFilterGroup li');
  const filterableProducts = document.querySelectorAll('#filterableShopGrid .product-card');
  const catalogResultsCounter = document.getElementById('catalogResultsCounter');

  // Safety Boundary Guard: Only executes if these catalogue targets are found in active markup views
  if (categoryFilters.length > 0 && filterableProducts.length > 0) {
    categoryFilters.forEach(filterPill => {
      filterPill.addEventListener('click', function() {
        categoryFilters.forEach(li => li.classList.remove('active'));
        this.classList.add('active');

        const selectedTargetCategory = this.getAttribute('data-category');
        let totalVisibleMatchCount = 0;

        filterableProducts.forEach(productCard => {
          const productCategoryAttr = productCard.getAttribute('data-category');

          if (selectedTargetCategory === 'all' || productCategoryAttr === selectedTargetCategory) {
            productCard.classList.remove('hidden-catalog-item');
            totalVisibleMatchCount++;
          } else {
            productCard.classList.add('hidden-catalog-item');
          }
        });

        if (catalogResultsCounter) {
          catalogResultsCounter.textContent = `Showing ${totalVisibleMatchCount} product(s) matching criteria`;
        }
      });
    });
  }

  // ==========================================================================
  // CUSTOMER ASSISTANCE CONTACT FORM REAL-TIME VALIDATION PIPELINE
  // ==========================================================================
  const interactiveContactForm = document.getElementById('interactiveContactForm');

  if (interactiveContactForm) {
    interactiveContactForm.addEventListener('submit', function(event) {
      event.preventDefault(); 

      const inputName = document.getElementById('contactFullName');
      const inputEmail = document.getElementById('contactEmailAddress');
      const inputSubject = document.getElementById('contactSubject');
      const inputMessage = document.getElementById('contactTextAreaMessage');

      const errName = document.getElementById('errContactFullName');
      const errEmail = document.getElementById('errContactEmailAddress');
      const errSubject = document.getElementById('errContactSubject');
      const errMessage = document.getElementById('errContactTextAreaMessage');

      let isFormExecutionValid = true;

      // Wipe styling attributes values and error notification elements
      const formGroups = interactiveContactForm.querySelectorAll('.contact-form-group');
      formGroups.forEach(g => g.classList.remove('has-error'));
      [errName, errEmail, errSubject, errMessage].forEach(span => {
        if (span) span.textContent = "";
      });

      // 1. Full name validation checks
      if (inputName && inputName.value.trim() === "") {
        const group = inputName.closest('.contact-form-group');
        if (group) group.classList.add('has-error');
        if (errName) errName.textContent = "Please enter your full name path profile.";
        isFormExecutionValid = false;
      }

      // 2. Structural Email layout address check
      if (inputEmail) {
        const emailValueText = inputEmail.value.trim();
        const emailRegexStructurePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailValueText === "") {
          const group = inputEmail.closest('.contact-form-group');
          if (group) group.classList.add('has-error');
          if (errEmail) errEmail.textContent = "Email field cannot remain left blank empty.";
          isFormExecutionValid = false;
        } else if (!emailRegexStructurePattern.test(emailValueText)) {
          const group = inputEmail.closest('.contact-form-group');
          if (group) group.classList.add('has-error');
          if (errEmail) errEmail.textContent = "Invalid format structure patterns detected.";
          isFormExecutionValid = false;
        }
      }

      // 3. Ticket Subject parameters tracking verification
      if (inputSubject && inputSubject.value.trim() === "") {
        const group = inputSubject.closest('.contact-form-group');
        if (group) group.classList.add('has-error');
        if (errSubject) errSubject.textContent = "A message ticket subject title parameters is required.";
        isFormExecutionValid = false;
      }

      // 4. Content length message restrictions limit constraints parameters verification
      if (inputMessage && inputMessage.value.trim().length < 10) {
        const group = inputMessage.closest('.contact-form-group');
        if (group) group.classList.add('has-error');
        if (errMessage) errMessage.textContent = "Your support message must describe details exceeding 10 characters minimum.";
        isFormExecutionValid = false;
      }

      // Handle successful validation states animations layout cues
      if (isFormExecutionValid) {
        const contactFormSubmitButton = document.getElementById('contactFormSubmitButton');
        const emailValueText = inputEmail ? inputEmail.value.trim() : "";
        
        if (contactFormSubmitButton) {
          const originalBtnContent = contactFormSubmitButton.innerHTML;
          
          contactFormSubmitButton.style.backgroundColor = '#16a34a';
          contactFormSubmitButton.innerHTML = `<i class="fa-solid fa-check"></i> Ticket Submitted!`;
          contactFormSubmitButton.disabled = true;

          alert(`Success!\n\nYour support dispatch ticket has been indexed securely. Our team will contact you back at: ${emailValueText}`);
          
          setTimeout(() => {
            interactiveContactForm.reset();
            contactFormSubmitButton.style.backgroundColor = '';
            contactFormSubmitButton.innerHTML = originalBtnContent;
            contactFormSubmitButton.disabled = false;
          }, 1500);
        }
      }
    });
  }
});
