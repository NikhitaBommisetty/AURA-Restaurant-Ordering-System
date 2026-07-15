const API_URL = "https://rqmq8bv5yg.execute-api.ap-south-1.amazonaws.com/placeOrder";
const MENU_API = "https://rqmq8bv5yg.execute-api.ap-south-1.amazonaws.com/menu";

const grid = document.getElementById("admin-grid");
const emptyState = document.getElementById("admin-empty");

let currentFilter = "All";

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

        updateStats(orders);
        applyFilter(orders);

    } catch (err) {
        console.error(err);
    }
}

// =======================
// STATS
// =======================
function updateStats(orders) {
    document.getElementById("total-orders").textContent = orders.length;

    let revenue = 0;
    let pending = 0;
    let completed = 0;

    orders.forEach(o => {
        if (o.status === "Completed") {
            completed++;

            const total = (o.items || []).reduce(
                (sum, i) => sum + (i.price * i.quantity),
                0
            );

            revenue += total;
        }

        if (o.status === "Pending") pending++;
    });

    document.getElementById("total-revenue").textContent = "₹" + revenue;
    document.getElementById("pending-count").textContent = pending;
    document.getElementById("completed-count").textContent = completed;
}

// =======================
// FILTER
// =======================
function setFilter(type) {
    currentFilter = type;
    fetchOrders();
}

function applyFilter(orders) {
    if (currentFilter !== "All") {
        orders = orders.filter(o => o.status === currentFilter);
    }

    renderOrders(orders);
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

        const items = (order.items || []).map(i => `${i.name} x${i.quantity}`).join(", ");

        const total = (order.items || []).reduce(
            (sum, i) => sum + (i.price * i.quantity),
            0
        );

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>#${order.id}</h3>

            <p><b>Status:</b> ${order.status}</p>
            <p><b>Type:</b> ${order.type}</p>
            <p><b>Items:</b> ${items}</p>

            ${order.type === "Offline"
                ? `<p><b>Table:</b> ${order.tableNumber || "-"}</p>`
                : `<p><b>Address:</b> ${order.address || "-"}</p>`
            }

            <p style="font-size:1.2rem; font-weight:700; color: var(--primary-color);"><b>Total:</b> ₹${total}</p>
        `;

        grid.appendChild(div);
    });
}

// =======================
// MENU FUNCTIONS
// =======================

// LOAD MENU
async function loadMenu() {
    try {
        let res = await fetch(MENU_API);
        let items = await res.json();

        if (!Array.isArray(items)) {
            items = items.Items || [];
        }

        const menuGrid = document.getElementById("menu-grid");
        menuGrid.innerHTML = "";

        items.forEach(item => {

            const div = document.createElement("div");
            div.className = "card";

            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>

                <button class="btn btn-danger" style="width: 100%; margin-top: 1rem;" onclick="deleteMenuItem(${item.id})">
                    Delete
                </button>
            `;

            menuGrid.appendChild(div);
        });

    } catch (err) {
        console.error("Menu load error:", err);
    }
}

// ADD MENU
async function addMenuItem() {
    const name = document.getElementById("menu-name").value.trim();
    const price = document.getElementById("menu-price").value;

    if (!name || !price) {
        alert("Enter name and price");
        return;
    }

    try {
        await fetch(MENU_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, price })
        });

        document.getElementById("menu-name").value = "";
        document.getElementById("menu-price").value = "";

        loadMenu();

    } catch (err) {
        console.error("Add error:", err);
    }
}

// DELETE MENU (FIXED)
async function deleteMenuItem(id) {

    console.log("Deleting ID:", id); // 👈 debug

    if (!confirm("Delete this item?")) return;

    try {
        const res = await fetch(`${MENU_API}?id=${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        console.log("Response:", data);

        loadMenu();

    } catch (err) {
        console.error("Delete error:", err);
    }
}

// =======================
// AUTO LOAD
// =======================
setInterval(fetchOrders, 50000);
fetchOrders();
loadMenu();