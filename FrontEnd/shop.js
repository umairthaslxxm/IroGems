document.addEventListener('DOMContentLoaded', () => {
    let products = [];
    const API_URL = 'http://localhost:5000/api/products';

    // Fetch products from backend
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            products = await response.json();
            addDataToHTML();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    fetchProducts();

    let listProductHTML = document.querySelector('.listProduct');
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let iconCartSpan = document.querySelector('.icon-cart span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let checkOutBtn = document.querySelector('.checkOut');
    let cart = [];

    if (iconCart) {
        iconCart.addEventListener('click', () => {
            body.classList.toggle('showCart');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            body.classList.toggle('showCart');
        });
    }

    // Event Delegation for both "Add to Cart" and "Product Details Popup"
    if (listProductHTML) {
        listProductHTML.addEventListener('click', (event) => {
            let positionClick = event.target;

            // Add to Cart
            if (positionClick.classList.contains('addCart')) {
                let productElement = positionClick.closest('.item');
                let id_product = productElement.dataset.id;
                let size = productElement.querySelector('.size') ? productElement.querySelector('.size').value : '';
                let color = productElement.querySelector('.color') ? productElement.querySelector('.color').value : '';
                addToCart(id_product, size, color);
            }
            // Open Popup (Click on item but NOT on addCart)
            else {
                let item = positionClick.closest('.item');
                if (item) {
                    const id = item.dataset.id;
                    const product = products.find(p => p._id === id);
                    if (product) {
                        const popup = document.getElementById('productPopup');
                        const popupImg = document.getElementById('popupImage');
                        const popupTitle = document.getElementById('popupTitle');
                        const popupPrice = document.getElementById('popupPrice');
                        const popupDesc = document.getElementById('popupDescription');

                        if (popup && product) {
                            popupImg.src = (product.images && product.images.length > 0) ? product.images[0] : 'Assets/placeholder.png';
                            popupTitle.textContent = product.name;
                            popupPrice.textContent = 'LKR ' + product.price.toFixed(2);
                            popupDesc.innerHTML = product.description;
                            popup.style.display = 'flex';
                        }
                    }
                }
            }
        });
    }

    const addDataToHTML = () => {
        if (listProductHTML) {
            listProductHTML.innerHTML = '';
            if (products.length > 0) {
                products.forEach(product => {
                    let newProduct = document.createElement('div');
                    newProduct.dataset.id = product._id;
                    newProduct.classList.add('item');
                    let image = (product.images && product.images.length > 0) ? product.images[0] : 'Assets/placeholder.png';
                    newProduct.innerHTML = `
                        <img src="${image}" alt="${product.name}">
                        <h2>${product.name}</h2>
                        <div class="price">LKR ${product.price.toFixed(2)}</div>
                        <button class="addCart button">Add To Cart</button>
                    `;
                    listProductHTML.appendChild(newProduct);
                });
            } else {
                listProductHTML.innerHTML = '<p>No products available.</p>';
            }
        }
    }

    const addToCart = (product_id, size, color) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size && value.color == color);
        if (positionThisProductInCart < 0) {
            let product = products.find(p => p._id === product_id);
            if (product) {
                cart.push({
                    product_id: product_id,
                    size: size,
                    color: color,
                    quantity: 1,
                    name: product.name,
                    price: product.price,
                    image: (product.images && product.images.length > 0) ? product.images[0] : 'Assets/placeholder.png'
                });
            }
        } else {
            cart[positionThisProductInCart].quantity += 1;
        }
        addCartToHTML();
        addCartToMemory();
    };

    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let subtotal = 0;
        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
                newItem.dataset.size = item.size;
                newItem.dataset.color = item.color;

                subtotal += item.price * item.quantity;
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                    <div class="image">
                        <img src="${item.image || 'Assets/placeholder.png'}">
                    </div>
                    <div class="name">
                        ${item.name} <br>
                        <small>${item.size ? item.size : ''} ${item.color ? item.color : ''}</small>
                    </div>
                    <div class="totalPrice">LKR ${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus">></span>
                    </div>
                `;
            });
        }
        let subtotalElement = document.createElement('div');
        subtotalElement.classList.add('subtotal');
        subtotalElement.innerHTML = `<strong>Subtotal: LKR ${subtotal.toFixed(2)}</strong>`;
        listCartHTML.appendChild(subtotalElement);
        iconCartSpan.innerText = totalQuantity;
    };

    if (listCartHTML) {
        listCartHTML.addEventListener('click', (event) => {
            let positionClick = event.target;
            if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
                let productElement = positionClick.closest('.item');
                let product_id = productElement.dataset.id;
                let size = productElement.dataset.size;
                let color = productElement.dataset.color;
                let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
                changeQuantityCart(product_id, size, color, type);
            }
        });
    }

    const changeQuantityCart = (product_id, size, color, type) => {
        let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size && value.color == color);
        if (positionItemInCart >= 0) {
            let info = cart[positionItemInCart];
            if (type === 'plus') {
                info.quantity += 1;
            } else {
                info.quantity -= 1;
                if (info.quantity <= 0) {
                    cart.splice(positionItemInCart, 1);
                }
            }
        }
        addCartToHTML();
        addCartToMemory();
    };

    const initApp = () => {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    };

    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Please add at least one product to the cart before proceeding to checkout.');
            } else {
                // Proceed to checkout logic (usually handled by link to payment.html)
                window.location.href = 'payment.html';
            }
        });
    }

    /* ---------------- PRODUCT DETAILS POPUP ---------------- */
    const popup = document.getElementById('productPopup');
    const closePopup = document.querySelector('.close-popup');

    if (closePopup && popup) {
        // Close popup
        closePopup.addEventListener('click', () => popup.style.display = 'none');
        window.addEventListener('click', e => {
            if (e.target === popup) popup.style.display = 'none';
        });
    }

    initApp();
});
