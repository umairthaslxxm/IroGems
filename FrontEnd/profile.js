import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

const ORDERS_API_URL = 'http://localhost:5000/api/orders/user/';
const USERS_API_URL = 'http://localhost:5000/api/users/';

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Auth State Listener
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            console.log("Profile: User Name", user.displayName);
            console.log("Profile: User Email", user.email);

            // Fetch Data
            fetchPersonalData(user);
            fetchOrders(user.email);
            setupPasswordChange(user);

        } else {
            // User is signed out. Redirect to login.
            window.location.href = 'login.html';
        }
    });
});

// Fetch Personal Data from Backend
const fetchPersonalData = async (user) => {
    const loadingDiv = document.getElementById('personal-data-loading');
    const displayDiv = document.getElementById('personal-data-display');

    try {
        const response = await fetch(USERS_API_URL + user.uid);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();

        // Populate Fields
        document.getElementById('disp-firstName').textContent = userData.firstName || '-';
        document.getElementById('disp-lastName').textContent = userData.lastName || '-';
        document.getElementById('disp-accountName').textContent = userData.accountName || '-';
        document.getElementById('disp-mobile').textContent = userData.mobile || '-';
        document.getElementById('disp-email').textContent = userData.email || user.email;

        loadingDiv.style.display = 'none';
        displayDiv.style.display = 'block';

    } catch (error) {
        console.error('Error fetching personal data:', error);
        loadingDiv.textContent = 'Failed to load personal data.';
    }
};

// Fetch Orders
const fetchOrders = async (email) => {
    const container = document.getElementById('orders-container');
    try {
        const response = await fetch(ORDERS_API_URL + email);
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        const orders = await response.json();

        if (orders.length === 0) {
            container.innerHTML = '<p>No orders found.</p>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total (LKR)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            const items = order.orderItems.map(item => `${item.name} (x${item.quantity})`).join(', ');

            html += `
                <tr>
                    <td>${order.publicId || order._id.substring(0, 8)}</td>
                    <td>${date}</td>
                    <td>${items}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td><span class="status ${order.status}">${order.status}</span></td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;

    } catch (error) {
        console.error('Error fetching orders:', error);
        container.innerHTML = '<p style="color: red;">Failed to load orders.</p>';
    }
};

// Password Change Logic
const setupPasswordChange = (user) => {
    const form = document.getElementById('change-password-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            await updatePassword(user, newPassword);
            alert("Password updated successfully!");
            form.reset();
        } catch (error) {
            console.error("Error updating password:", error);
            if (error.code === 'auth/requires-recent-login') {
                alert("For security, please logout and login again before changing your password.");
            } else {
                alert("Failed to update password: " + error.message);
            }
        }
    });
};
