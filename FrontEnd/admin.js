const API_URL = 'http://localhost:5000/api/products';
const ORDERS_URL = 'http://localhost:5000/api/orders';

// 1. Auth Check
if (!sessionStorage.getItem('adminLoggedIn')) {
    window.location.href = 'admin-login.html';
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & Tabs ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    });

    // --- Initial Loads ---
    fetchProducts();
    fetchOrders();

    // --- Product Form Handling ---
    const form = document.getElementById('product-form');
    const cancelBtn = document.getElementById('cancel-edit');
    const formTitle = document.getElementById('form-title');
    const pIdField = document.getElementById('p-id');

    // Cancel Edit Mode
    cancelBtn.addEventListener('click', resetForm);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = pIdField.value;
        const name = document.getElementById('p-name').value;
        const price = document.getElementById('p-price').value;
        const cts = document.getElementById('p-cts').value;
        const treatment = document.getElementById('p-treatment').value;
        const jewelryType = document.getElementById('p-jewelry').value;
        const description = document.getElementById('p-desc').value;
        const imageFile = document.getElementById('p-image').files[0];

        // Prepare Data Object
        const productData = {
            name,
            price: Number(price),
            description,
            cts: cts ? Number(cts) : null,
            treatment,
            jewelryType
        };

        // Handle Image to Base64
        if (imageFile) {
            const base64 = await toBase64(imageFile);
            productData.images = [base64]; // Backend expects array
        }

        try {
            let response;
            if (id) {
                // Update
                response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                // Create
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }

            if (!response.ok) throw new Error('Failed to save product');

            alert(id ? 'Product Updated!' : 'Product Created!');
            resetForm();
            fetchProducts();

        } catch (error) {
            console.error(error);
            alert('Error saving product: ' + error.message);
        }
    });

    // --- Fetch & Render Products ---
    async function fetchProducts() {
        const container = document.getElementById('product-list-container');
        try {
            const res = await fetch(API_URL);
            const products = await res.json();

            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Cts</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            products.forEach(p => {
                const img = (p.images && p.images.length > 0) ? p.images[0] : 'Assets/placeholder.png';
                html += `
                    <tr>
                        <td><img src="${img}" class="product-img-thumb" alt="product"></td>
                        <td>${p.name}</td>
                        <td>${p.price}</td>
                        <td>${p.cts || '-'}</td>
                        <td>${p.jewelryType || '-'}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editProduct('${p._id}')">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteProduct('${p._id}')">Delete</button>
                        </td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = 'Failed to load products.';
        }
    }

    // --- Fetch & Render Orders ---
    let allOrders = [];

    async function fetchOrders() {
        const container = document.getElementById('orders-list-container');
        try {
            const res = await fetch(ORDERS_URL);
            if (!res.ok) throw new Error('Failed to load orders');
            allOrders = await res.json();

            if (allOrders.length === 0) {
                container.innerHTML = 'No orders found.';
                return;
            }

            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            [...allOrders].reverse().forEach(o => {
                html += `
                    <tr>
                        <td>
                             <a href="#" onclick="viewOrder('${o._id}'); return false;" style="color: #00ff00; text-decoration: underline; font-weight: bold;">
                                ${o.publicId || o._id.substring(0, 8)}
                            </a>
                        </td>
                        <td>${o.customerDetails.name}</td>
                        <td>${o.customerDetails.email}</td>
                        <td>${o.totalAmount.toFixed(2)}</td>
                        <td><span class="status ${o.status}">${o.status}</span></td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            container.innerHTML = html;

        } catch (error) {
            console.error(error);
            container.innerHTML = 'Failed to fetch orders.';
        }
    }

    window.viewOrder = (id) => {
        const order = allOrders.find(o => o._id === id);
        if (!order) return;

        const modal = document.getElementById('order-modal');
        const content = document.getElementById('modal-content');

        const addr = order.customerDetails.address || 'Not provided';
        const city = order.customerDetails.city || '';
        const postal = order.customerDetails.postalCode || '';
        const country = order.customerDetails.country || '';

        const date = new Date(order.createdAt).toLocaleString();

        // Green Tick Logic
        let tickHtml = '';
        if (order.status === 'Finished') {
            tickHtml = '<span style="color:#00ff00; font-size:24px; margin-left:10px;">✅</span>';
        }

        const itemsHtml = order.orderItems.map(item => `
            <div style="border-bottom:1px solid #333; padding:10px 0;">
                <div style="display:flex; justify-content:space-between;">
                    <strong>${item.name}</strong>
                    <span>LKR ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div style="font-size:0.9em; color:#aaa;">
                    Qty: ${item.quantity} | Unit: LKR ${item.price} | ID: ${item.product}
                </div>
            </div>
        `).join('');

        content.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <div>
                    <h3 style="color:#ccc; border-bottom:1px solid #444; padding-bottom:5px;">Customer Info</h3>
                    <p><strong>Name:</strong> ${order.customerDetails.name}</p>
                    <p><strong>Email:</strong> ${order.customerDetails.email}</p>
                    <p><strong>Mobile:</strong> ${order.customerDetails.mobile || 'N/A'}</p>
                </div>
                <div>
                    <h3 style="color:#ccc; border-bottom:1px solid #444; padding-bottom:5px;">Shipping Address</h3>
                    <p>${addr}</p>
                    <p>${city} ${postal}</p>
                    <p>${country}</p>
                </div>
            </div>

            <h3 style="color:#ccc; border-bottom:1px solid #444; padding-bottom:5px; margin-top:20px;">Order Items</h3>
            ${itemsHtml}

            <div style="margin-top:20px; text-align:right; border-top:1px solid #444; padding-top:10px;">
                <h2 style="color:var(--primary); margin:0;">
                    Total: LKR ${order.totalAmount.toFixed(2)}
                    ${tickHtml}
                </h2>
                
                <div style="margin-top:15px; display:flex; justify-content:flex-end; gap:10px; align-items:center;">
                    <span style="margin-right:10px; color:#aaa;">Status: <strong>${order.status}</strong></span>
                    
                    ${order.status !== 'Finished' ? `
                        <button onclick="updateStatus('${order._id}', 'Preparing')" class="action-btn" style="background:#ffcc00; color:black;">Preparing</button>
                        <button onclick="updateStatus('${order._id}', 'Shipped')" class="action-btn" style="background:#1e90ff; color:white;">Shipped</button>
                        <button onclick="updateStatus('${order._id}', 'Finished')" class="action-btn" style="background:#00cc00; color:white;">Finish</button>
                    ` : '<span style="color:#00ff00; font-weight:bold;">Order Completed</span>'}
                </div>

                <p style="margin-top:10px; color:#666; font-size:0.8em;">
                    Order ID: ${order.publicId || order._id} <br>
                    Placed: ${date}
                </p>
            </div>
        `;

        modal.style.display = 'flex';
    };

    window.updateStatus = async (id, newStatus) => {
        if (!confirm(`Change order status to "${newStatus}"?`)) return;

        try {
            const res = await fetch(`${ORDERS_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            alert('Status Updated!');
            document.getElementById('order-modal').style.display = 'none';
            fetchOrders(); // Refresh table
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    document.getElementById('refresh-orders').addEventListener('click', fetchOrders);

    // --- Helper Functions ---

    window.editProduct = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            const p = await res.json();

            pIdField.value = p._id;
            document.getElementById('p-name').value = p.name;
            document.getElementById('p-price').value = p.price;
            document.getElementById('p-cts').value = p.cts || '';
            document.getElementById('p-treatment').value = p.treatment || 'Unspecified';
            document.getElementById('p-jewelry').value = p.jewelryType || '';
            document.getElementById('p-desc').value = p.description || '';

            formTitle.textContent = 'Edit Product';
            cancelBtn.style.display = 'inline-block';
            window.scrollTo(0, 0);

        } catch (error) {
            alert('Error loading product details');
        }
    };

    window.deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (error) {
            alert('Error deleting product');
        }
    };

    function resetForm() {
        form.reset();
        pIdField.value = '';
        formTitle.textContent = 'Add New Product';
        cancelBtn.style.display = 'none';
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
});
