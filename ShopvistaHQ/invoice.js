// app.js - Dynamic Invoice Renderer Engine
document.addEventListener("DOMContentLoaded", () => {
  // Initialize native toolbar action triggers
  initInvoiceToolbarActions();

  // Extract variables out of the address URL route path context
  const urlParameters = new URLSearchParams(window.location.search);
  const TargetOrderId = urlParameters.get("orderId");

  if (!TargetOrderId) {
    console.error("Invoice execution halted: Missing valid parameter context 'orderId'.");
    displayInvoiceFallbackError("Invalid Order URL Context. No order identifier detected.");
    return;
  }

  // Load backend data mapping from database pipeline
  resolveInvoiceRemotePayload(TargetOrderId);
});

/**
 * 1. Fetches specific order structure from backend schema 
 * using the parameters routed via checkout checkout submission.
 */
async function resolveInvoiceRemotePayload(orderId) {
  try {
    // Queries database target collection mapping (e.g. your dynamic express backend endpoint route)
    const res = await fetch(`/cart/${orderId}`);
    if (!res.ok) throw new Error(`Database could not match specific item footprint. Status: ${res.status}`);

    const serverOrder = await res.json();
    
    // Inject dataset directly into page structures safely
    populateInvoiceDataDOM(serverOrder);

  } catch (error) {
    console.error("Invoice data pipeline resolution broken:", error);
    displayInvoiceFallbackError("Unable to locate receipt transaction profile inside active cloud records.");
  }
}

/**
 * 2. Parses payload parameters and draws markup nodes into matching table containers
 */
function populateInvoiceDataDOM(order) {
  // Sync Meta Text Node Identifiers
  const orderNumNodes = document.querySelectorAll(".invoice-meta-block p, .invoice-document-sheet h1");
  
  // Re-render header meta block variables cleanly
  const metaContainer = document.querySelector(".invoice-meta-block");
  if (metaContainer) {
    metaContainer.innerHTML = `
      <h1>INVOICE</h1>
      <p><strong>Order Reference:</strong> ${order.orderId || 'N/A'}</p>
      <p><strong>Order Date:</strong> ${order.date || new Date().toLocaleDateString()} at ${order.time || ''}</p>
      <p><strong>Payment Status:</strong> <span class="invoice-badge status-paid">PAID via Secure Gateway</span></p>
    `;
  }

  // Update Customer Profile Container Blocks
  const billingContainer = document.querySelector(".invoice-address-grid .address-col:nth-child(1)");
  if (billingContainer) {
    billingContainer.innerHTML = `
      <h3>Billed To:</h3>
      <strong>${order.name || 'Valued Customer'}</strong>
      <p>${order.address || 'Delivery Address Provided'}</p>
      <p>${order.email || ''}</p>
      <p>${order.phone || ''}</p>
    `;
  }

  // Dynamically Parse item arrays out of text lines or lookups
  const ledgerTableBody = document.querySelector(".invoice-ledger-table tbody");
  if (ledgerTableBody && order.cartText) {
    ledgerTableBody.innerHTML = ""; // Clear static HTML placeholders
    
    // Splitting lines matching your map layout structure: `${i.name} × ${i.quantity} — ₦${i.price * i.quantity}`
    const productsList = order.cartText.split("\n");
    
    productsList.forEach(lineStr => {
      if (!lineStr.trim()) return;

      // Extract parts out of the structural characters
      const partsSplit = lineStr.split("—");
      const identityMeta = partsSplit[0] ? partsSplit[0].split("×") : ["Product", "1"];
      const pName = identityMeta[0] ? identityMeta[0].trim() : "Premium Item";
      const pQty = identityMeta[1] ? identityMeta[1].trim() : "1";
      const pSubtotal = partsSplit[1] ? partsSplit[1].trim() : "₦0.00";

      ledgerTableBody.innerHTML += `
        <tr>
          <td>
            <strong>${pName}</strong>
            <span class="item-subtext">Verified Authentic Gadget Product</span>
          </td>
          <td class="txt-center">${pSubtotal}</td>
          <td class="txt-center">${pQty}</td>
          <td class="txt-right">${pSubtotal}</td>
        </tr>
      `;
    });
  }

  // Balance Receipt Calculations Block Rendering
  const totalsContainer = document.querySelector(".invoice-totals-wrapper");
  if (totalsContainer) {
    const rawSubtotal = parseFloat(order.total) || 0;
    const rawDelivery = parseFloat(order.delVal) || 0;
    const rawGrandTotal = parseFloat(order.totalS) || (rawSubtotal + rawDelivery);

    totalsContainer.innerHTML = `
      <div class="totals-inner-box">
        <div class="total-receipt-line">
          <span>Subtotal:</span>
          <span>₦${rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="total-receipt-line">
          <span>Logistics Shipping:</span>
          <span>${rawDelivery === 0 ? '<span style="color: #22c55e; font-weight: 600;">FREE</span>' : '₦' + rawDelivery.toLocaleString()}</span>
        </div>
        <div class="total-receipt-line grand-total-line">
          <span>Grand Total:</span>
          <strong>₦${rawGrandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      </div>
    `;
  }
}

/**
 * 3. Binds print commands and operational view elements
 */
function initInvoiceToolbarActions() {
  const printTriggerButton = document.getElementById("invoicePrintTrigger");
  if (printTriggerButton) {
    printTriggerButton.addEventListener("click", () => {
      // Fires native operational system driver framework printing menu panels
      window.print();
    });
  }
}

/**
 * 4. Error interface view feedback state builder
 */
function displayInvoiceFallbackError(messageText) {
  const sheetContainer = document.querySelector(".invoice-document-sheet");
  if (sheetContainer) {
    sheetContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #ef4444;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; margin-bottom: 20px;"></i>
        <h2>Invoice Generation Error</h2>
        <p style="color: #64748b; margin-top: 10px;">${messageText}</p>
        <a href="index.html" style="display: inline-block; margin-top: 25px; background: #1e293b; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">Return to Marketplace</a>
      </div>
    `;
  }
}
