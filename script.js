const cart = {};

function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' €';
}

function updateCartUI() {
    const cartItems = document.querySelector('#cart-items');
    const cartTotal = document.querySelector('#cart-total');
    const emptyMessage = document.querySelector('#cart-empty');
    const checkoutButton = document.querySelector('#checkout-button');

    if (!cartItems || !cartTotal || !emptyMessage) return;

    const products = Object.values(cart);
    if (products.length === 0) {
        cartItems.innerHTML = '';
        emptyMessage.style.display = 'block';
        cartTotal.textContent = '0,00 €';
        checkoutButton.disabled = true;
        return;
    }

    emptyMessage.style.display = 'none';
    cartItems.innerHTML = products.map(item => `
        <div class="cart-row">
            <div>
                <strong>${item.name}</strong>
                <p>${item.quantity} x ${formatPrice(item.price)}</p>
            </div>
            <div>
                <button class="cart-action" data-action="decrease" data-product="${item.id}">−</button>
                <button class="cart-action" data-action="increase" data-product="${item.id}">+</button>
            </div>
        </div>
    `).join('');

    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatPrice(total);
    checkoutButton.disabled = false;
}

function addToCart(event) {
    const button = event.currentTarget;
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productPrice = parseFloat(button.dataset.productPrice);

    if (!cart[productId]) {
        cart[productId] = {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 0,
        };
    }
    cart[productId].quantity += 1;
    updateCartUI();
}

function updateCartItem(event) {
    const button = event.target.closest('.cart-action');
    if (!button) return;

    const action = button.dataset.action;
    const productId = button.dataset.product;
    const item = cart[productId];
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            delete cart[productId];
        }
    }
    updateCartUI();
}

function initCart() {
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    const cartPanel = document.querySelector('#cart-items');
    if (cartPanel) {
        cartPanel.addEventListener('click', updateCartItem);
    }

    const checkoutButton = document.querySelector('#checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            alert('Ačiū! Jūsų užsakymas gautas.');
            Object.keys(cart).forEach(key => delete cart[key]);
            updateCartUI();
        });
    }
}

window.addEventListener('DOMContentLoaded', initCart);
