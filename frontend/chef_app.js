const API_URL = "https://rqmq8bv5yg.execute-api.ap-south-1.amazonaws.com/placeOrder";

const grid = document.getElementById("orders-grid");

let currentFilter = "All";

// =======================
// FETCH ORDERS
// =======================
async function fetchOrders() {
    try {
        const res = await fetch(API_URL);
        let orders = await res.json();

        if (!Array.isArray(orders)) {
            orders = orders.Items || [];
        }

        applyFilters(orders);

    } catch (err) {
        console.error("Error fetching orders:", err);
    }
}

// =======================
// APPLY FILTER LOGIC
// =======================
function applyFilters(orders) {

    // 🔥 ADD THIS LINE (IMPORTANT)
    // Chef should ONLY see Pending + Ready
    orders = orders.filter(o =>
        o.status === "Pending" || o.status === "Ready"
    );

    // ================= EXISTING FILTERS =================

    if (currentFilter === "All") {
        // already filtered above
    }

    else if (currentFilter === "Online") {
        orders = orders.filter(o =>
            o.type === "Online"
        );
    }

    else if (currentFilter === "Offline") {
        orders = orders.filter(o =>
            o.type === "Offline"
        );
    }

    // 🔥 ADD THIS (NEW FILTER BUTTON SUPPORT)
    else if (currentFilter === "Ready") {
        orders = orders.filter(o =>
            o.status === "Ready"
        );
    }

    renderOrders(orders);
}

// =======================
// SET FILTER
// =======================
function setFilter(type) {
    currentFilter = type;
    fetchOrders();
}

// =======================
// RENDER ORDERS
// =======================
function renderOrders(orders) {
    grid.innerHTML = "";

    if (orders.length === 0) {
        grid.innerHTML = "<p>No orders found</p>";
        return;
    }

    orders.reverse().forEach(order => {

        const items = Array.isArray(order.items)
            ? order.items.map(i => `${i.name} x${i.quantity}`).join(", ")
            : order.items;

        let statusClass = "status-pending";

        // 🔥 ADD THIS
        if (order.status === "Ready") {
            statusClass = "status-completed"; // green
        }

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

            <p>
                <b>Status:</b> 
                <span class="status ${statusClass}">
                    ${order.status}
                </span>
            </p>

            ${order.status === "Pending"
                ? `<button class="btn btn-success" style="width: 100%; margin-top: 1rem;" onclick="markCompleted('${order.id}')">Mark Ready</button>`
                : `<button class="btn" style="width: 100%; background: rgba(5, 150, 105, 0.1); color: var(--success); border: 1px dashed var(--success); cursor: default; margin-top: 1rem;" disabled>Ready ✓</button>`
            }
        `;

        grid.appendChild(div);
    });
}

// =======================
// UPDATE STATUS
// =======================
window.markCompleted = async function (id) {
    try {
        await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                status: "Ready"
            })
        });

        fetchOrders();

    } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to update status");
    }
};

// =======================
// AUTO REFRESH
// =======================
setInterval(fetchOrders, 30000);
fetchOrders();