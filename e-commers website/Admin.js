const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const ordersContainer = document.createElement('div');
    ordersContainer.id = 'orders-container';
    ordersContainer.style.marginTop = '20px';
    adminPanel.appendChild(ordersContainer);

    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const showAddProductBtn = document.getElementById('show-add-product-btn');

    showAddProductBtn.addEventListener('click', () => {
        productForm.style.display = 'block';
        document.getElementById('save-product-btn').textContent = 'Add Product';
        cancelEditBtn.style.display = 'none';
        productForm.reset();
        editingProductId = null;
    });

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let editingProductId = null;

    function showAdminPanel() {
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
        loadAndDisplayOrders();
        renderProductList();
    }

    function showLogin() {
        loginContainer.style.display = 'block';
        adminPanel.style.display = 'none';
    }

    function loadAndDisplayOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        ordersContainer.innerHTML = '<h2>Orders</h2>';
        if (orders.length === 0) {
            ordersContainer.innerHTML += '<p>No orders placed yet.</p>';
            return;
        }
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        orders.forEach((order, index) => {
            const item = document.createElement('li');
            item.style.border = '1px solid #ddd';
            item.style.padding = '10px';
            item.style.marginBottom = '10px';
            item.style.borderRadius = '5px';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';

            const details = document.createElement('div');
            details.innerHTML = `<strong>${index + 1}. ${order.name} (${order.brand})</strong><br/>
                Discount: ${order.discount}, Delivery: ${order.delivery}<br/>
                Ordered at: ${order.date}<br/>
                Customer: ${order.customerName}, Address: ${order.customerAddress}, Phone: ${order.customerPhone}<br/>
                Status: ${order.status || 'pending'}`;

            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Order Complete';
            completeBtn.className = 'btn-unique';
            completeBtn.addEventListener('click', () => {
                order.status = 'successful';
                localStorage.setItem('orders', JSON.stringify(orders));
                loadAndDisplayOrders();
            });

            item.appendChild(details);
            item.appendChild(completeBtn);
            list.appendChild(item);
        });
        ordersContainer.appendChild(list);
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            loginError.textContent = '';
            showAdminPanel();
        } else {
            loginError.textContent = 'Invalid email or password.';
        }
    });

    logoutBtn.addEventListener('click', () => {
        showLogin();
        loginForm.reset();
    });

    // Product management functions

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    function renderProductList() {
        productList.innerHTML = '';
        if (products.length === 0) {
            productList.innerHTML = '<p>No products added yet.</p>';
            return;
        }
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Name', 'Brand', 'Category', 'Discount', 'Rupees', 'Delivery', 'Image', 'Actions'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        products.forEach((product, index) => {
            const row = document.createElement('tr');

            Object.keys(product).forEach(key => {
                if (key === 'id') return;
                const td = document.createElement('td');
                if (key === 'image') {
                    const img = document.createElement('img');
                    img.src = product[key];
                    img.alt = product.name;
                    img.style.width = '50px';
                    td.appendChild(img);
                } else {
                    td.textContent = product[key];
                }
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                row.appendChild(td);
            });

            const actionsTd = document.createElement('td');
            actionsTd.style.border = '1px solid #ddd';
            actionsTd.style.padding = '8px';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.style.marginRight = '5px';
            editBtn.addEventListener('click', () => {
                startEditProduct(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                deleteProduct(index);
            });

            actionsTd.appendChild(editBtn);
            actionsTd.appendChild(deleteBtn);
            row.appendChild(actionsTd);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        productList.appendChild(table);
    }

    function startEditProduct(index) {
        const product = products[index];
        editingProductId = index;
        document.getElementById('product-id').value = index;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-brand').value = product.brand;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-discount').value = product.discount;
        document.getElementById('product-Rupees').value = product.rupees;
        document.getElementById('product-delivery').value = product.delivery;
        // Note: File input cannot be pre-filled for security reasons. User must re-upload image if editing.
        document.getElementById('save-product-btn').textContent = 'Update Product';
        cancelEditBtn.style.display = 'inline-block';
    }

    function deleteProduct(index) {
        if (confirm('Are you sure you want to delete this product?')) {
            products.splice(index, 1);
            saveProducts();
            renderProductList();
        }
    }

    cancelEditBtn.addEventListener('click', () => {
        editingProductId = null;
        productForm.reset();
        document.getElementById('save-product-btn').textContent = 'Add Product';
        cancelEditBtn.style.display = 'none';
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value.trim();
        const brand = document.getElementById('product-brand').value.trim();
        const category = document.getElementById('product-category').value.trim();
        const discount = document.getElementById('product-discount').value.trim();
        const rupees = document.getElementById('product-Rupees').value.trim();
        const delivery = document.getElementById('product-delivery').value.trim();
        const imageFile = document.getElementById('product-image').files[0];

        if (!name || !brand || !discount || !rupees) {
            alert('Please fill in all required fields: Name, Brand, Discount, and Rupees.');
            return;
        }

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const image = event.target.result;
                if (editingProductId !== null) {
                    products[editingProductId] = { name, brand, category, discount, rupees, delivery, image };
                    editingProductId = null;
                } else {
                    products.push({ name, brand, category, discount, rupees, delivery, image });
                }
                saveProducts();
                renderProductList();
                productForm.reset();
                productForm.style.display = 'none';
                document.getElementById('save-product-btn').textContent = 'Add Product';
                cancelEditBtn.style.display = 'none';
            };
            reader.readAsDataURL(imageFile);
        } else {
            const image = '';
            if (editingProductId !== null) {
                products[editingProductId] = { name, brand, category, discount, rupees, delivery, image };
                editingProductId = null;
            } else {
                products.push({ name, brand, category, discount, rupees, delivery, image });
            }
            saveProducts();
            renderProductList();
            productForm.reset();
            productForm.style.display = 'none';
            document.getElementById('save-product-btn').textContent = 'Add Product';
            cancelEditBtn.style.display = 'none';
        }
    });
});
