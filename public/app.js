const output = document.getElementById('response-output');

// Helper to show toasts
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${type === 'error' ? 'Error' : 'Success'}:</strong> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Helper to update terminal block
function logResponse(reqType, url, status, data) {
    const color = status >= 400 ? 'color: #ef4444' : 'color: #10b981';
    const timestamp = new Date().toLocaleTimeString();
    
    const formattedData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    
    output.innerHTML = `<span style="color: #9ca3af">[${timestamp}] ${reqType} ${url}</span>\n<span style="${color}">Status: ${status}</span>\n\n${formattedData}`;
}

// 1. N+1 Query Issue
document.getElementById('view-orders-btn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/users/1/orders');
        const data = await res.json();
        logResponse('GET', '/api/users/1/orders', res.status, data);
        if (res.ok) showToast('Orders fetched successfully!');
        else showToast('Failed to fetch orders', 'error');
    } catch (e) {
        showToast('Network error', 'error');
    }
});

// 2. TypeError (Null Reference)
document.getElementById('featured-btn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/products/featured');
        const data = await res.json();
        logResponse('GET', '/api/products/featured', res.status, data);
        if (res.ok) showToast('Loaded featured product', 'success');
        else showToast(data.message || 'Server crashed', 'error');
    } catch (e) {
        showToast('Network error', 'error');
    }
});

// 3. Unique Constraint Violation
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    
    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        const data = await res.json();
        logResponse('POST', '/api/users', res.status, data);
        
        if (res.ok) showToast('Account created successfully');
        else showToast(data.message || 'Failed to create account', 'error');
    } catch (e) {
        showToast('Network error', 'error');
    }
});

// 4. Unhandled Promise Rejection
document.getElementById('checkout-btn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 99900 })
        });
        const data = await res.json();
        logResponse('POST', '/api/checkout', res.status, data);
        showToast('Checkout initiated in background. Check backend logs!', 'success');
    } catch (e) {
        showToast('Network error', 'error');
    }
});

// 5. JSON Parse / Logic Error
document.getElementById('cart-total-btn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/cart/total');
        const data = await res.json();
        logResponse('GET', '/api/cart/total', res.status, data);
        showToast('Cart calculated. See terminal for results.', res.ok ? 'success' : 'error');
    } catch (e) {
        showToast('Network error', 'error');
    }
});
