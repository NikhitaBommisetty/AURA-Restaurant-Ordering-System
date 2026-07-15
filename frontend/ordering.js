const API_URL = "https://rqmq8bv5yg.execute-api.ap-south-1.amazonaws.com/placeOrder";
const MENU_API = "https://rqmq8bv5yg.execute-api.ap-south-1.amazonaws.com/menu";

// =======================
// CART STATE
// =======================
let cart = [];

// =======================
// DOM
// =======================
const cartContainer = document.getElementById("cart-container");
const cartTotalEl = document.getElementById("cart-total");
const placeOrderBtn = document.getElementById("place-order-btn");
const btnText = document.getElementById("btn-text");
const btnLoader = document.getElementById("btn-loader");
const msgBox = document.getElementById("msg-box");

const addressInput = document.getElementById("address");
const pincodeInput = document.getElementById("pincode");
const tableInput = document.getElementById("tableNumber");

const orderType = document.body.getAttribute("data-order-type");

// =======================
// MESSAGE UTILS
// =======================
function showMessage(text, type) {
    if (!msgBox) return;
    msgBox.textContent = text;
    msgBox.className = `message-box ${type}`;
    msgBox.style.display = "block";
    msgBox.style.marginTop = "1rem";
    
    setTimeout(() => {
        msgBox.style.display = "none";
        msgBox.className = "message-box";
    }, 4000);
}

// =======================
// LOAD MENU (NEW)
// =======================
async function loadMenu() {
    try {
        const res = await fetch(MENU_API);
        let items = await res.json();

        if (!Array.isArray(items)) {
            items = items.Items || [];
        }

        const container = document.getElementById("menu-container");
        if (!container) return;

        container.innerHTML = "";

        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "menu-card";

            div.innerHTML = `
                <h3>${item.name}</h3>
                <div class="menu-price">₹${item.price}</div>
                <button class="btn" style="width: 100%; margin-top: 0.5rem; padding: 0.6rem;" onclick="addToCart('${item.name}', ${item.price})">
                    Add to Cart
                </button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error("Menu load error:", err);
    }
}

// =======================
// ADD TO CART
// =======================
window.addToCart = function (name, price) {
    const existing = cart.find(i => i.name === name);

    if (existing) existing.quantity++;
    else cart.push({ name, price, quantity: 1 });

    renderCart();
};

// =======================
// REMOVE FROM CART
// =======================
window.removeFromCart = function (name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
};

// =======================
// RENDER CART
// =======================
function renderCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="empty-cart-msg">Cart is empty...</div>`;
        placeOrderBtn.disabled = true;
        cartTotalEl.textContent = "0";
        return;
    }

    placeOrderBtn.disabled = false;

    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div style="flex-grow: 1;">
                <div style="font-weight: 600;">${item.name}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">₹${item.price} x ${item.quantity}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-weight: 700;">₹${subtotal}</div>
                <div style="cursor: pointer; color: var(--danger); font-weight: 800; font-size: 1.4rem; line-height: 1;" onclick="removeFromCart('${item.name}')" title="Remove Item">×</div>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    cartTotalEl.textContent = total;
}

// =======================
// PLACE ORDER
// =======================
if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", async () => {
        
        if (cart.length === 0) {
            showMessage("Cart is empty! Please add items.", "error");
            return;
        }

        let payload = {
            items: cart,
            type: orderType
        };

        if (orderType === "Online") {
            const addr = addressInput ? addressInput.value.trim() : "";
            const pin = pincodeInput ? pincodeInput.value.trim() : "";
            
            if (!addr || !pin) {
                showMessage("Both Address and Pincode are required for Online delivery!", "error");
                return;
            }
            
            payload.address = addr;
            payload.pincode = pin;
        }

        if (orderType === "Offline") {
            const table = tableInput ? tableInput.value.trim() : "";
            
            if (!table) {
                showMessage("Table Number is absolutely required for Offline dining!", "error");
                return;
            }
            
            payload.tableNumber = Number(table);
        }

        // Loading UI Element Swap
        placeOrderBtn.disabled = true;
        if(btnText) btnText.textContent = "Placing...";
        if(btnLoader) btnLoader.style.display = "block";
        msgBox.style.display = "none";
        
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error("API Request Failed");

            showMessage("Order Placed Successfully! Sending to Chef...", "success");
            cart = [];
            renderCart();
            if(addressInput) addressInput.value = "";
            if(pincodeInput) pincodeInput.value = "";
            if(tableInput) tableInput.value = "";
        } catch (err) {
            console.error(err);
            showMessage("Network Error! Failed to place order.", "error");
        } finally {
            if(cart.length > 0) placeOrderBtn.disabled = false;
            if(btnText) btnText.textContent = "Place Order";
            if(btnLoader) btnLoader.style.display = "none";
        }
    });
}

// =======================
// INIT
// =======================
loadMenu();