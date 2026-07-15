const API_URL = "https://rqmq8bv5yg.execute-api.ap-south-1.amazonaws.com/placeOrder";

const grid = document.getElementById("billing-grid");
const emptyState = document.getElementById("billing-empty");

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

        // ✅ FILTER FOR BILLING
        orders = orders.filter(o =>
            (o.type === "Online" && o.status === "Ready") ||
            (o.type === "Offline" && o.status === "Billing")
        );

        renderOrders(orders);

    } catch (err) {
        console.error("Error fetching orders:", err);
    }
}

// =======================
// RENDER
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

        const total = order.items.reduce(
            (sum, i) => sum + (i.price * i.quantity),
            0
        );

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>#${order.id}</h3>

            <p><b>Items:</b> ${items}</p>

            <p><b>Type:</b> ${order.type}</p>

            ${order.type === "Offline"
                ? `<p><b>Table:</b> ${order.tableNumber || "-"}</p>`
                : `<p><b>Address:</b> ${order.address || "-"}</p>`
            }

            <p style="font-size:1.2rem; font-weight:700; color: var(--primary-color);">
                Total: ₹${total}
            </p>

            <button class="btn btn-success" style="width: 100%; margin-top: 1rem;" onclick="completeBilling('${order.id}')">
                Billing Completed
            </button>
        `;

        grid.appendChild(div);
    });
}

// =======================
// COMPLETE BILLING
// =======================
window.completeBilling = async function (id) {
    try {
        await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                status: "Completed"
            })
        });

        fetchOrders();

    } catch (err) {
        console.error("Billing failed:", err);
        alert("Failed to complete billing");
    }
};

// =======================
// AUTO REFRESH
// =======================
setInterval(fetchOrders, 3000);

// Initial load
fetchOrders();