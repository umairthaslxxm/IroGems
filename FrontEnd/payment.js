import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ payment.js loaded");

  // Pre-fill email if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const emailField = document.getElementById("contactEmail");
      if (emailField) {
        emailField.value = user.email;
        // Optional: Make it read-only if you want to force consistency, 
        // but usually editable is better in case they want updates sent elsewhere.
        // However, for "Order History" tracking, it MUST match.
        // Let's just prefill.
      }
    }
  });

  // Display cart summary
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderSummary = document.querySelector(".order-summary .summary-content");

  if (cart.length > 0) {
    let subtotal = 0;
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemElement = document.createElement("div");
      itemElement.classList.add("summary-item");
      itemElement.innerHTML = `
        <p>${item.name} (Size: ${item.size || "-"}, Color: ${item.color || "-"})</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: LKR ${itemTotal.toFixed(2)}</p>
      `;
      orderSummary.appendChild(itemElement);
    });

    const subtotalElement = document.createElement("div");
    subtotalElement.classList.add("summary-subtotal");
    subtotalElement.innerHTML = `<h3>Subtotal: LKR ${subtotal.toFixed(2)}</h3>`;
    orderSummary.appendChild(subtotalElement);
  } else {
    orderSummary.innerHTML = "<p>Your cart is empty.</p>";
  }

  // ✅ Attach form event
  const form = document.getElementById("checkoutForm");
  if (form) {
    form.addEventListener("submit", sendOrderEmail);
    console.log("🟢 Form listener attached");
  }
});

// ✅ Send EmailJS order confirmation
function sendOrderEmail(event) {
  event.preventDefault();
  console.log("🟢 sendOrderEmail triggered");

  if (!window.emailjs) {
    alert("❌ EmailJS library not loaded properly!");
    return;
  }

  const name =
    document.getElementById("firstName").value +
    " " +
    document.getElementById("surname").value;
  const email = document.getElementById("contactEmail").value;
  const orderId = Math.floor(Math.random() * 1000000);

  console.log("Sending email to:", email);

  // Create a clean summary of items for the email
  const cartForEmail = JSON.parse(localStorage.getItem("cart")) || [];
  const orderDetails = cartForEmail
    .map(item => `[ID: ${item.product_id}] ${item.name} (x${item.quantity}) - LKR ${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const totalAmountForEmail = cartForEmail.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

  emailjs
    .send("service_jf60ixd", "template_zv5yi2d", {
      user_name: name,
      email: email,
      order_id: orderId,
      order_details: orderDetails,
      total_amount: totalAmountForEmail,
      // Adding individual fields if the template supports them
      product: cartForEmail.map(item => item.name).join(', '),
      quantity: cartForEmail.reduce((acc, item) => acc + item.quantity, 0)
    })
    .then(async () => {
      // Save order to DB
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const orderItems = cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          product: item.product_id
        }));

        const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const orderData = {
          customerDetails: {
            name: name,
            email: email,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            postalCode: document.getElementById("zipCode").value,
            country: document.getElementById("state").value // Form uses 'state' but placeholder is 'United Kingdom'
          },
          orderItems,
          totalAmount,
          publicId: orderId.toString() // Send the public ID to the backend
        };

        // Fetch API
        await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        console.log("✅ Order saved to DB");
      } catch (dbError) {
        console.error("❌ Failed to save order to DB:", dbError);
      }

      alert("✅ Order confirmed! Confirmation email sent.");
      console.log("✅ Email successfully sent");
      window.location.href = "confirmation.html";
    })
    .catch((error) => {
      console.error("❌ Email sending failed:", error);
      alert("❌ Something went wrong — check console for details.");
    });
}
