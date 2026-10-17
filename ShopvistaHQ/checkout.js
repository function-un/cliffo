
document.addEventListener("DOMContentLoaded", () => {
    const globalCartBadge = document.getElementById("cartCounter");
    const checkoutForm = document.getElementById("checkoutForm");
    const submitButton = document.getElementById("placeOrderSubmitBtn");

    const PAYSTACK_PUBLIC_KEY = "pk_live_16f40f8a20301d874ec46e5b5fbd88a27feb8b09";

    let cart = getCart();
    let isProcessing = false;

    // Update the global cart badge
    updateCartBadge();

    // Render checkout items
    renderCheckoutSummary();

    // Submit checkout form
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (isProcessing) return;

            cart = getCart();

            if (!cart.length) {
                alert("Your shopping cart is empty!");
                return;
            }

            // Validate cart items before calculating payment
            const validCart = cart.every(item =>
                item &&
                typeof item.name === "string" &&
                Number.isFinite(Number(item.price)) &&
                Number(item.price) > 0 &&
                Number.isInteger(Number(item.quantity)) &&
                Number(item.quantity) > 0
            );

            if (!validCart) {
                alert("Your cart contains invalid items. Please refresh your cart and try again.");
                return;
            }

            // Collect customer information
            const customer = {
                firstName: getValue("name"),
                lastName: getValue("checkoutLastName"),
                email: getValue("email"),
                phone: getValue("phone"),
                address: getValue("address"),
                city: getValue("checkoutCity"),
                state: getValue("checkoutState"),
                zip: getValue("checkoutZip")
            };

            if (
                !customer.firstName ||
                !customer.lastName ||
                !customer.email ||
                !customer.phone ||
                !customer.address ||
                !customer.city ||
                !customer.state
            ) {
                alert("Please complete all required customer and delivery fields.");
                return;
            }

            // Calculate total in naira, then convert to kobo
            const subtotal = cart.reduce(
                (total, item) =>
                    total + Number(item.price) * Number(item.quantity),
                0
            );

            const totalAmount = Math.round(subtotal * 100) / 100;
            const amountInKobo = Math.round(totalAmount * 100);

            if (!Number.isSafeInteger(amountInKobo) || amountInKobo <= 0) {
                alert("Invalid payment amount.");
                return;
            }

            if (
                PAYSTACK_PUBLIC_KEY === "pk_test_YOUR_PUBLIC_KEY" ||
                !/^(pk_test_|pk_live_)/.test(PAYSTACK_PUBLIC_KEY)
            ) {
                alert("Please configure your Paystack public key in checkout.js.");
                return;
            }

            if (typeof PaystackPop === "undefined") {
                alert("Paystack could not load. Check your internet connection and reload the page.");
                return;
            }

            // Generate a checkout reference
            const orderId = "ORD-" + Date.now() + "-" +
                Math.random().toString(36).slice(2, 8).toUpperCase();

            isProcessing = true;
            setButtonState(true, "Connecting to Paystack...");

            try {
                const paystack = new PaystackPop();

                paystack.newTransaction({
                    key: PAYSTACK_PUBLIC_KEY,
                    email: customer.email,
                    amount: amountInKobo,
                    currency: "NGN",
                    ref: orderId,

                    metadata: {
                        order_id: orderId,
                        custom_fields: [
                            {
                                display_name: "Customer Name",
                                variable_name: "customer_name",
                                value: `${customer.firstName} ${customer.lastName}`
                            },
                            {
                                display_name: "Phone Number",
                                variable_name: "phone_number",
                                value: customer.phone
                            }
                        ]
                    },

                    onSuccess: async (transaction) => {
                        setButtonState(true, "Verifying payment and saving order...");

                        try {
                            /*
                             * IMPORTANT:
                             * The /cart backend must verify transaction.reference
                             * directly with Paystack before marking the order paid.
                             * It must calculate prices from trusted server-side
                             * product data, not trust totals sent by the browser.
                             */
                            const orderData = {
                                name: `${customer.firstName} ${customer.lastName}`,
                                email: customer.email,
                                phone: customer.phone,
                                address: customer.address,
                                city: customer.city,
                                state: customer.state,
                                zip: customer.zip,

                                items: cart.map(item => ({
                                    name: item.name,
                                    quantity: Number(item.quantity)
                                })),

                                cartText: cart.map(item =>
                                    `${item.name} × ${item.quantity} — ₦${
                                        (
                                            Number(item.price) *
                                            Number(item.quantity)
                                        ).toLocaleString("en-NG")
                                    }`
                                ).join("\n"),

                                total: totalAmount,
                                delVal: "0",
                                totalS: totalAmount,
                                orderId: orderId,
                                paystackRef: transaction.reference,
                                date: new Date().toLocaleDateString("en-NG"),
                                time: new Date().toLocaleTimeString("en-NG", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }),
                                timestamp: new Date().toISOString()
                            };

                            const response = await fetch("/cart", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(orderData)
                            });

                            const result = await response.json().catch(() => ({}));

                            if (!response.ok) {
                                throw new Error(
                                    result.message ||
                                    "The server could not verify or save your order."
                                );
                            }

                            // Clear cart only after server confirms success
                            localStorage.removeItem("cart");
                            localStorage.setItem("CartCount", "0");
                            cart = [];

                            updateCartBadge();
                            renderCheckoutSummary();

                            window.location.href =
                                `invoice.html?orderId=${encodeURIComponent(orderId)}`;

                        } catch (error) {
                            console.error("Order processing failed:", error);

                            alert(
                                "Payment may have succeeded, but your order could not be confirmed. " +
                                "Do not pay again yet. Contact support and provide reference: " +
                                transaction.reference
                            );

                            isProcessing = false;
                            setButtonState(false);
                        }
                    },

                    onCancel: () => {
                        isProcessing = false;
                        setButtonState(false);
                    },

                    onError: (error) => {
                        console.error("Paystack error:", error);

                        alert("Paystack could not complete the transaction. Please try again.");

                        isProcessing = false;
                        setButtonState(false);
                    }
                });
            } catch (error) {
                console.error("Paystack initialization failed:", error);

                alert("Unable to start payment. Please reload the page and try again.");

                isProcessing = false;
                setButtonState(false);
            }
        });
    }

    function getCart() {
        try {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            return Array.isArray(storedCart) ? storedCart : [];
        } catch (error) {
            console.error("Unable to read cart:", error);
            return [];
        }
    }

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function updateCartBadge() {
        const count = getCart().reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0
        );

        localStorage.setItem("CartCount", String(count));

        if (globalCartBadge) {
            globalCartBadge.textContent = String(count);
        }
    }

    function setButtonState(disabled, text) {
        if (!submitButton) return;

        submitButton.disabled = disabled;

        if (text) {
            submitButton.textContent = text;
        } else {
            const total = getCart().reduce(
                (sum, item) =>
                    sum +
                    (Number(item.price) || 0) *
                    (Number(item.quantity) || 0),
                0
            );

            submitButton.innerHTML =
                `<i class="fa-solid fa-lock"></i> Place Order Securely (₦${total.toLocaleString("en-NG")})`;
        }
    }

    function renderCheckoutSummary() {
        const summaryContainer =
            document.getElementById("checkoutSummaryItems");

        const subtotalLabel =
            document.getElementById("checkoutSubtotalValue");

        const totalLabel =
            document.getElementById("checkoutEstimatedTotalValue");

        if (!summaryContainer) return;

        const currentCart = getCart();

        if (currentCart.length === 0) {
            summaryContainer.textContent = "";

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Your shopping cart is empty.";
            emptyMessage.style.cssText =
                "color:#64748b;padding:15px 0;";

            summaryContainer.appendChild(emptyMessage);

            if (subtotalLabel) subtotalLabel.textContent = "₦0.00";
            if (totalLabel) totalLabel.textContent = "₦0.00";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML =
                    '<i class="fa-solid fa-lock"></i> Place Order Securely (₦0.00)';
            }

            return;
        }

        summaryContainer.textContent = "";

        let subtotal = 0;

        currentCart.forEach(item => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const itemTotal = price * quantity;

            subtotal += itemTotal;

            const row = document.createElement("div");
            row.className = "summary-product-row";
            row.style.cssText =
                "display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;border-bottom:1px dashed #f1f5f9;padding-bottom:10px;gap:12px;";

            const details = document.createElement("div");
            details.style.cssText =
                "display:flex;align-items:center;gap:15px;min-width:0;";

            const imageWrap = document.createElement("div");
            imageWrap.style.cssText =
                "width:45px;height:45px;flex-shrink:0;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;";

            if (item.image) {
                const image = document.createElement("img");

                // Use a relative image path from the current checkout page.
                image.src = item.image;
                image.alt = String(item.name || "Product");
                image.style.cssText =
                    "width:100%;height:100%;object-fit:cover;";

                imageWrap.appendChild(image);
            }

            const textWrap = document.createElement("div");
            textWrap.style.minWidth = "0";

            const name = document.createElement("h4");
            name.textContent = String(item.name || "Product");
            name.style.cssText =
                "font-size:13px;margin:0;color:#1e293b;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";

            const quantityText = document.createElement("small");
            quantityText.textContent =
                `Qty: ${quantity} × ₦${price.toLocaleString("en-NG")}`;
            quantityText.style.color = "#64748b";

            textWrap.append(name, quantityText);
            details.append(imageWrap, textWrap);

            const total = document.createElement("strong");
            total.textContent = `₦${itemTotal.toLocaleString("en-NG")}`;
            total.style.cssText =
                "color:#0f172a;font-size:13px;white-space:nowrap;";

            row.append(details, total);
            summaryContainer.appendChild(row);
        });

        if (subtotalLabel) {
            subtotalLabel.textContent = `₦${subtotal.toLocaleString("en-NG")}`;
        }

        if (totalLabel) {
            totalLabel.textContent = `₦${subtotal.toLocaleString("en-NG")}`;
        }

        if (submitButton && !isProcessing) {
            submitButton.disabled = false;
            submitButton.innerHTML =
                `<i class="fa-solid fa-lock"></i> Place Order Securely (₦${subtotal.toLocaleString("en-NG")})`;
        }
    }
});
