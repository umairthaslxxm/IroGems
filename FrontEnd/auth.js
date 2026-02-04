import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", () => {

    // LOGIN FORM
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            let emailOrMobile = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            try {
                // Check if input is a Mobile Number (simple digits check)
                const isMobile = /^\d+$/.test(emailOrMobile);

                if (isMobile) {
                    // It's a mobile number, look up the email
                    const lookupResponse = await fetch('http://localhost:5000/api/users/lookup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mobile: emailOrMobile })
                    });

                    if (!lookupResponse.ok) {
                        throw new Error('Mobile number not found. Please sign up or check digits.');
                    }

                    const data = await lookupResponse.json();
                    emailOrMobile = data.email; // Switch to using the looked-up email
                    console.log("Mobile lookup success. Using email:", emailOrMobile);
                }

                const userCredential = await signInWithEmailAndPassword(auth, emailOrMobile, password);
                console.log("Logged in:", userCredential.user);

                // ✅ Sync User Data on Login (Links UID to Email if needed)
                try {
                    await fetch('http://localhost:5000/api/users/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            firebaseUid: userCredential.user.uid,
                            email: userCredential.user.email,
                            // Send empty strings for others; backend only updates if provided OR keeps existing.
                            // However, we want to LINK the UID.
                        })
                    });
                } catch (syncError) {
                    console.error("Sync on login failed:", syncError);
                }

                alert("Login Successful!");
                window.location.href = "index.html"; // Redirect to Home
            } catch (error) {
                console.error("Login Error:", error);
                alert("Login Failed: " + error.message);
            }
        });
    }

    // SIGNUP FORM
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const accountName = document.getElementById("accountName").value;
            const mobile = document.getElementById("mobile").value;

            try {
                // 1. Create User in Firebase
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUid = userCredential.user.uid;

                // 2. Sync User to MongoDB Backend
                const response = await fetch('http://localhost:5000/api/users/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firebaseUid,
                        email,
                        firstName,
                        lastName,
                        accountName,
                        mobile
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to sync user data');
                }

                alert("Account Created Successfully!");
                window.location.href = "index.html"; // Redirect to Home
            } catch (error) {
                console.error("Signup Error:", error);
                alert("Signup Failed: " + error.message);
            }
        });
    }
});
