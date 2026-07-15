const API_URL = "https://rqmq8bv5yg.execute-api.ap-south-1.amazonaws.com/placeOrder";
const grid = document.getElementById("waiter-grid");
const emptyState = document.getElementById("waiter-empty");

// =======================
// FETCH ORDERS
// =======================
async function fetchOrders() {
    try {
        let res = await fetch(API_URL);
        let orders = await res.json();

        if (!Array.isArray(orders)) {
            orders = orders.Items || [];
        }

        // ✅ Show only OFFLINE orders that are Ready or Serving
        orders = orders.filter(o =>
            o.type === "Offline" &&
            (o.status === "Ready" || o.status === "Serving")
        );

        renderOrders(orders);

    } catch (err) {
        console.error("Error fetching orders:", err);
    }
}

// =======================
// RENDER ORDERS
// =======================
function renderOrders(orders) {
    grid.innerHTML = "";

    if (orders.length === 0) {
        emptyState.style.display = "block";
        return;
    } else {
        emptyState.style.display = "none";
    }

    orders.forEach(order => {

        const items = order.items.map(i => `${i.name} x${i.quantity}`).join(", ");

        let buttonHTML = "";

        // 🔥 STEP 1 → Ready → Serving
        if (order.status === "Ready") {
            buttonHTML = `
                <button class="btn btn-success" style="width: 100%; margin-top: 1rem;" onclick="startServing('${order.id}')">
                    Start Serving
                </button>
            `;
        }

        // 🔥 STEP 2 → Serving → Billing
        else if (order.status === "Serving") {
            buttonHTML = `
                <button class="btn btn-success" style="width: 100%; margin-top: 1rem; filter: hue-rotate(180deg);" onclick="completeServing('${order.id}')">
                    Serving Completed
                </button>
            `;
        }

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>Table ${order.tableNumber}</h3>

            <p><b>Items:</b> ${items}</p>

            <p><b>Status:</b> ${order.status}</p>

            ${buttonHTML}
        `;

        grid.appendChild(div);
    });
}

// =======================
// STATUS UPDATES
// =======================

// Step 1 → Serving
window.startServing = async function (id) {
    await updateStatus(id, "Serving");
};

// Step 2 → Billing (after serving complete)
window.completeServing = async function (id) {
    await updateStatus(id, "Billing");
};

// =======================
// COMMON UPDATE FUNCTION
// =======================
async function updateStatus(id, status) {
    try {
        await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status })
        });

        fetchOrders();

    } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to update status");
    }
}

// =======================
// AUTO REFRESH
// =======================
setInterval(fetchOrders, 3000);

// Initial load
fetchOrders();