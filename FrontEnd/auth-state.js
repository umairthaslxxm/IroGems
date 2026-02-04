import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

// Function to update Navigation Bar based on Auth State
const updateNav = (user) => {
    const navList = document.querySelector('nav ul');
    if (!navList) return;

    // Remove existing Auth links to prevent duplicates
    const existingAuthLink = document.getElementById('auth-link');
    if (existingAuthLink) existingAuthLink.remove();

    // Remove existing Profile link if it exists
    const existingProfileLink = document.getElementById('profile-link');
    if (existingProfileLink) existingProfileLink.remove();

    if (user) {
        // User is logged in

        // Create Profile Icon Container
        const profileLi = document.createElement('li');
        profileLi.id = 'profile-link';
        profileLi.style.display = 'flex';
        profileLi.style.alignItems = 'center';
        profileLi.style.gap = '8px'; // Space between icon and text if any

        // Profile Anchor with Icon
        const profileLink = document.createElement('a');
        profileLink.className = 'nav-item';
        profileLink.href = 'profile.html';
        profileLink.style.display = 'flex';
        profileLink.style.alignItems = 'center';
        profileLink.style.textDecoration = 'none';

        // Green Tick Icon (using SVG or Emoji for simplicity, user asked for "Green Tick")
        // And a "Profile Icon". Let's use a simple SVG for User + Green check.
        profileLink.innerHTML = `
            <div style="position: relative; font-size: 24px;">
                👤 
                <span style="
                    position: absolute;
                    bottom: 0;
                    right: -5px;
                    color: #00ff00;
                    font-size: 14px;
                    background: black;
                    border-radius: 50%;
                ">✅</span>
            </div>
        `;

        profileLi.appendChild(profileLink);
        navList.appendChild(profileLi);

        if (user.email === 'umairthaslxxm@gmail.com') {
            const adminLi = document.createElement('li');
            const adminLink = document.createElement('a');
            adminLink.className = 'nav-item';
            adminLink.href = 'admin-login.html'; // Or direct to dashboard if we trust client-side (better to login page)
            adminLink.textContent = 'Admin Panel';
            adminLink.style.color = '#ff4444'; // Distinct color
            adminLi.appendChild(adminLink);
            navList.appendChild(adminLi);
        }

        // 2. Create Logout Link (Keep it separate or put in dropdown? User asked for icon next to login/signup "bar")
        // We will keep Logout as a separate item for easier access, effectively replacing "Login"
        const logoutLi = document.createElement('li');
        logoutLi.id = 'auth-link';
        const logoutLink = document.createElement('a');
        logoutLink.className = 'nav-item';
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
        logoutLi.appendChild(logoutLink);
        navList.appendChild(logoutLi);

    } else {
        // User is logged out
        const li = document.createElement('li');
        li.id = 'auth-link';

        const a = document.createElement('a');
        a.className = 'nav-item';
        a.href = 'login.html';
        a.textContent = 'Login';

        li.appendChild(a);
        navList.appendChild(li);
    }
};

const logoutUser = async () => {
    try {
        await signOut(auth);
        alert('Logged out successfully');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out');
    }
};

// Listen for Auth State Changes
onAuthStateChanged(auth, (user) => {
    updateNav(user);
    console.log("Current User:", user);
});
