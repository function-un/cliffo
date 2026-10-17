document.addEventListener("DOMContentLoaded", () => {
  // Global Navbar Badge Sync Engine
  const globalCartBadge = document.getElementById('cartCounter');
  let combinedItemsCount = JSON.parse(localStorage.getItem('CartCount')) || 0;
  if (globalCartBadge) {
    globalCartBadge.textContent = combinedItemsCount;
  }

  // Load and Render Cart Data onto Checkout Layout Elements
  renderCheckoutSummary();

  // Handle Main Form Verification and Order Actions
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
      }

      // Gather input nodes safely
      const customerEmail = document.getElementById("email").value.trim();
      const customerFirstName = document.getElementById("name").value.trim();
      const customerLastName = document.getElementById("checkoutLastName").value.trim();
      const customerPhone = document.getElementById("phone").value.trim();
      const customerAddress = document.getElementById("address").value.trim();

      // Paystack expects transaction amounts completely scaled in kobo subunits (₦1 = 100 kobo)
      const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const fee = 0;
      const totalAmount = subtotal + fee;
      const amountInKobo = totalAmount * 100;

      const oId = "ORD-" + Math.floor(1000000000000 + Math.random() * 9000000000000);
      const submitButton = document.getElementById('placeOrderSubmitBtn');

      // Update submit buttons immediately to restrict duplicate multi-clicks
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Contacting Payment Gateway...`;
      }

      // Safe check validation to secure Paystack initialization availability
      if (typeof PaystackPop === 'undefined') {
        alert("Paystack SDK failed to resolve inside window stack. Turn off ad-blockers or shields and reload.");
        resetSubmitButton(submitButton, totalAmount);
        return;
      }

      // Initializing via Paystack InlineJS V2 constructor engine blueprint
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        // ⚠️ FIXED: Make sure to replace this placeholder with your exact test or live public key from the Paystack Dashboard settings panel
        key: 'pk_live_16f40f8a20301d874ec46e5b5fbd88a27feb8b09', 
        email: customerEmail,
        amount: amountInKobo,
        currency: "NGN",
        ref: oId,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${customerFirstName} ${customerLastName}`
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: customerPhone
            }
          ]
        },
        onSuccess: async function (transaction) {
          if (submitButton) {
            submitButton.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Saving Order Records...`;
          }

          const orderData = {
            name: `${customerFirstName} ${customerLastName}`,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress,
            cartText: cart.map(i => `${i.name} × ${i.quantity} — ₦${i.price * i.quantity}`).join("\n"),
            total: subtotal,
            delVal: fee.toString(),
            totalS: totalAmount,
            orderId: oId,
            paystackRef: transaction.reference,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            timestamp: new Date().toLocaleString()
          };

          try {
            const res = await fetch("/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData)
            });
            
            if (res.ok) {
              localStorage.removeItem("cart");
              localStorage.setItem("CartCount", "0");
              if (globalCartBadge) globalCartBadge.textContent = "0";
              window.location.href = `invoice.html?orderId=${oId}`;
            } else {
              alert("Payment captured, but local order registration mismatched. Reference: " + transaction.reference);
              resetSubmitButton(submitButton, totalAmount);
            }
          } catch (err) {
            console.error("Order payload storage pipeline failure:", err);
            alert("Database synchronization communication link broken!");
            resetSubmitButton(submitButton, totalAmount);
          }
        },
        onCancel: function () {
          alert("Transaction window exit triggered by customer.");
          resetSubmitButton(submitButton, totalAmount);
        }
      });
    });
  }
});

function resetSubmitButton(buttonEl, amount) {
  if (buttonEl) {
    buttonEl.disabled = false;
    buttonEl.innerHTML = `<i class="fa-solid fa-lock"></i> Place Order Securely (₦${amount.toLocaleString()})`;
  }
}

function renderCheckoutSummary() {
  const summaryContainer = document.getElementById('checkoutSummaryItems');
  const subtotalLabel = document.getElementById('checkoutSubtotalValue');
  const totalLabel = document.getElementById('checkoutEstimatedTotalValue');
  const submitButton = document.getElementById('placeOrderSubmitBtn');

  if (!summaryContainer) return;
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    summaryContainer.innerHTML = `<p style="color: #64748b; padding: 15px 0;">Your shopping cart is empty.</p>`;
    if (submitButton) submitButton.disabled = true;
    return;
  }

  summaryContainer.innerHTML = "";
  let runningTotalSum = 0;

  cart.forEach(item => {
    const rawPrice = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    const itemSubtotal = rawPrice * qty;
    runningTotalSum += itemSubtotal;

    summaryContainer.innerHTML += `
      <div class="summary-product-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px dashed #f1f5f9; padding-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div class="summary-product-thumb" style="position: relative; width: 45px; height: 45px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
            <img src="../shopvistaHQ/${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div>
            <h4 style="font-size: 13px; margin: 0; color: #1e293b; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h4>
            <small style="color: #64748b;">Qty: ${qty} x ₦${rawPrice.toLocaleString()}</small>
          </div>
        </div>
        <strong style="color: #0f172a; font-size: 13px;">₦${itemSubtotal.toLocaleString()}</strong>
      </div>
    `;
  });

  if (subtotalLabel) subtotalLabel.textContent = `₦${runningTotalSum.toLocaleString()}`;
  if (totalLabel) totalLabel.textContent = `₦${runningTotalSum.toLocaleString()}`;
  if (submitButton) {
    submitButton.innerHTML = `<i class="fa-solid fa-lock"></i> Place Order Securely (₦${runningTotalSum.toLocaleString()})`;
  }
}
