// Functional script for e-commerce with order placement
document.addEventListener('DOMContentLoaded', function() {
    let cartCount = 0;
    let cartItems = [];
    const cartButton = document.querySelector('.cart');
    const productsGrid = document.querySelector('.products-grid');
    const categoryButtons = document.querySelectorAll('.categories button');
    const searchButton = document.querySelector('.search-bar button');
    const searchInput = document.querySelector('.search-bar input');
    const allProducts = Array.from(document.querySelectorAll('.product-card'));

    // Login/logout elements
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    const loginOverlay = document.getElementById('login-overlay');
    const initialLoginBtn = document.getElementById('initial-login-btn');
    const header = document.querySelector('header');
    const profilePhoto = document.getElementById('profile-photo');

    // Check login state on load
    function checkLogin() {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            loginBtn.style.display = 'none';
            userProfile.style.display = 'inline-flex';
            userEmailSpan.textContent = userEmail;
            loginOverlay.style.display = 'none';
            header.style.display = 'flex';

            // Load profile photo if saved
            const savedPhoto = localStorage.getItem('profilePhoto');
            if (savedPhoto) {
                profilePhoto.src = savedPhoto;
            }

            // Pre-fill order form
            document.getElementById('customer-name').value = localStorage.getItem('userFullName') || '';
            document.getElementById('customer-phone').value = localStorage.getItem('userPhoneNumber') || '';
            document.getElementById('customer-address').value = localStorage.getItem('userAddress') || '';

            // Render user orders
            renderUserOrders();
        } else {
            loginBtn.style.display = 'inline-block';
            userProfile.style.display = 'none';
            userEmailSpan.textContent = '';
            loginOverlay.style.display = 'flex';
            header.style.display = 'none';
        }
    }

    // Simulate login prompt with form
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('full-name').value.trim();
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const address = document.getElementById('address').value.trim();
        const email = document.getElementById('email-address').value.trim();

        if (!fullName) {
            alert('Please enter your full name.');
            return;
        }
        if (!phoneNumber) {
            alert('Please enter your phone number.');
            return;
        }
        if (!address) {
            alert('Please enter your current address.');
            return;
        }
        if (!email || !email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        localStorage.setItem('userEmail', email);
        localStorage.setItem('userFullName', fullName);
        localStorage.setItem('userPhoneNumber', phoneNumber);
        localStorage.setItem('userAddress', address);
        checkLogin();
        alert('Logged in as ' + email);
    });

    // Remove old initialLoginBtn listener as replaced by form
    if (initialLoginBtn) {
        initialLoginBtn.removeEventListener('click', () => {});
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        checkLogin();
        alert('Logged out successfully.');
    });

    checkLogin();

    // Update cart count
    function updateCartCount() {
        cartButton.textContent = `Cart 🛒 (${cartCount})`;
    }

    // Change profile photo button functionality
    const changePhotoBtn = document.getElementById('change-photo-btn');
    changePhotoBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                profilePhoto.src = e.target.result;
                localStorage.setItem('profilePhoto', e.target.result);
            };
            reader.readAsDataURL(file);
        });
    });

    // Filter products by category
    function filterProducts(category) {
        const productsGrid = document.getElementById('products-grid');
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productsGrid.innerHTML = '';

        const filteredProducts = category === 'All' ? products : products.filter(product => product.category === category);

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p>No products found.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category || '';

            const discountDiv = document.createElement('div');
            discountDiv.className = 'discount';
            discountDiv.textContent = product.discount || '';
            productCard.appendChild(discountDiv);

            const img = document.createElement('img');
            img.src = product.image && product.image.trim() !== '' ? product.image : 'https://via.placeholder.com/200x200?text=No+Image';
            img.alt = product.name || 'Product Image';
            productCard.appendChild(img);

            const h3 = document.createElement('h3');
            h3.textContent = product.name || '';
            productCard.appendChild(h3);

            const brandP = document.createElement('p');
            brandP.className = 'brand';
            brandP.textContent = product.brand || '';
            productCard.appendChild(brandP);

            const deliveryP = document.createElement('p');
            deliveryP.className = 'delivery';
            deliveryP.textContent = product.delivery || '';
            productCard.appendChild(deliveryP);

            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart';
            addToCartBtn.textContent = 'Add to Cart';
            productCard.appendChild(addToCartBtn);

            productsGrid.appendChild(productCard);
        });
    }

    // Save orders to localStorage
    function saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Load orders from localStorage
    function loadOrders() {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    }

    // Add to cart
    productsGrid.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productBrand = productCard.querySelector('.brand').textContent;
            const productDelivery = productCard.querySelector('.delivery').textContent;
            const productDiscount = productCard.querySelector('.discount').textContent;

            // No login required for adding to cart

            cartItems.push({
                name: productName,
                brand: productBrand,
                delivery: productDelivery,
                discount: productDiscount,
                date: new Date().toLocaleString()
            });

            cartCount++;
            updateCartCount();
            alert('Added to cart!');
        }
    });

    // Place order button and functionality
    const placeOrderBtn = document.createElement('button');
    placeOrderBtn.textContent = 'Place Order';
    placeOrderBtn.style.marginTop = '20px';
    placeOrderBtn.style.padding = '10px 20px';
    placeOrderBtn.style.backgroundColor = '#4CAF50';
    placeOrderBtn.style.color = 'white';
    placeOrderBtn.style.border = 'none';
    placeOrderBtn.style.borderRadius = '20px';
    placeOrderBtn.style.cursor = 'pointer';

    productsGrid.parentNode.appendChild(placeOrderBtn);

    // Handle order form submission
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const customerName = document.getElementById('customer-name').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();

        if (!customerName || !customerAddress || !customerPhone) {
            alert('Please fill in all order details.');
            return;
        }

        let orders = loadOrders();

        // Add customer details to each cart item with initial status 'pending'
        const orderWithCustomerDetails = cartItems.map(item => ({
            ...item,
            customerName,
            customerAddress,
            customerPhone,
            status: 'pending' // 'pending' or 'successful'
        }));

        orders = orders.concat(orderWithCustomerDetails);
        saveOrders(orders);

        cartItems = [];
        cartCount = 0;
        updateCartCount();

        orderForm.reset();

        alert('Order placed successfully!');

        // Refresh order display
        renderUserOrders();
    });

    // Render user orders with status dot and details
    function renderUserOrders() {
        const container = document.getElementById('orders-container');
        if (!container) return;

        // Filter orders for current user
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            container.innerHTML = '<p>Please login to see your orders.</p>';
            return;
        }

        const orders = loadOrders();
        const userOrders = orders.filter(order => order.customerName === localStorage.getItem('userFullName'));

        if (userOrders.length === 0) {
            container.innerHTML = '<p>No orders placed yet.</p>';
            return;
        }

        container.innerHTML = '<h2>Your Orders</h2>';
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';

        userOrders.forEach((order, index) => {
            const item = document.createElement('li');
            item.style.border = '1px solid #ddd';
            item.style.padding = '10px';
            item.style.marginBottom = '10px';
            item.style.borderRadius = '5px';
            item.style.display = 'flex';
            item.style.alignItems = 'center';

            // Status dot
            const statusDot = document.createElement('span');
            statusDot.style.display = 'inline-block';
            statusDot.style.width = '12px';
            statusDot.style.height = '12px';
            statusDot.style.borderRadius = '50%';
            statusDot.style.marginRight = '10px';
            statusDot.style.backgroundColor = order.status === 'pending' ? 'green' : 'red';
            item.appendChild(statusDot);

            // Order details text
            const details = document.createElement('div');
            details.innerHTML = `<strong>${index + 1}. ${order.name} (${order.brand})</strong><br/>
                Discount: ${order.discount}, Delivery: ${order.delivery}<br/>
                Ordered at: ${order.date}<br/>
                Customer: ${order.customerName}, Address: ${order.customerAddress}, Phone: ${order.customerPhone}`;
            item.appendChild(details);

            list.appendChild(item);
        });

        container.appendChild(list);
    }

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.textContent;
            filterProducts(category);
        });
    });

    // Search functionality
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        searchProducts(query);
    });

    // Search products function
    function searchProducts(query) {
        const productsGrid = document.getElementById('products-grid');
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productsGrid.innerHTML = '';

        const filteredProducts = query === '' ? products : products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p>No products found matching your search.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category || '';

            const discountDiv = document.createElement('div');
            discountDiv.className = 'discount';
            discountDiv.textContent = product.discount || '';
            productCard.appendChild(discountDiv);

            const img = document.createElement('img');
            img.src = product.image && product.image.trim() !== '' ? product.image : 'https://via.placeholder.com/200x200?text=No+Image';
            img.alt = product.name || 'Product Image';
            productCard.appendChild(img);

            const h3 = document.createElement('h3');
            h3.textContent = product.name || '';
            productCard.appendChild(h3);

            const brandP = document.createElement('p');
            brandP.className = 'brand';
            brandP.textContent = product.brand || '';
            productCard.appendChild(brandP);

            const deliveryP = document.createElement('p');
            deliveryP.className = 'delivery';
            deliveryP.textContent = product.delivery || '';
            productCard.appendChild(deliveryP);

            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart';
            addToCartBtn.textContent = 'Add to Cart';
            productCard.appendChild(addToCartBtn);

            productsGrid.appendChild(productCard);
        });
    }

    // Initial cart count
    updateCartCount();

    // Load products from localStorage and render on index page
    function renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = '';
        const products = JSON.parse(localStorage.getItem('products')) || [];

        if (products.length === 0) {
            productsGrid.innerHTML = '<p>No products available.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category || '';

            const discountDiv = document.createElement('div');
            discountDiv.className = 'discount';
            discountDiv.textContent = product.discount || '';
            productCard.appendChild(discountDiv);

            const img = document.createElement('img');
            // Fix: Ensure image URL is valid and not empty string
            img.src = product.image && product.image.trim() !== '' ? product.image : 'https://via.placeholder.com/200x200?text=No+Image';
            img.alt = product.name || 'Product Image';
            productCard.appendChild(img);

            const h3 = document.createElement('h3');
            h3.textContent = product.name || '';
            productCard.appendChild(h3);

            const brandP = document.createElement('p');
            brandP.className = 'brand';
            brandP.textContent = product.brand || '';
            productCard.appendChild(brandP);

            const deliveryP = document.createElement('p');
            deliveryP.className = 'delivery';
            deliveryP.textContent = product.delivery || '';
            productCard.appendChild(deliveryP);

            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart';
            addToCartBtn.textContent = 'Add to Cart';
            productCard.appendChild(addToCartBtn);

            productsGrid.appendChild(productCard);
        });
    }

    renderProducts();

});
