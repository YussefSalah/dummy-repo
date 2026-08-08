// State
let currentUser = null;

// Helper to extract clean error string from API response data
function getErrorMessage(data, fallback = 'Operation failed') {
    if (!data) return fallback;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.message === 'object' && data.message !== null) {
        if (typeof data.message.message === 'string') return data.message.message;
        if (Array.isArray(data.message.message)) return data.message.message.join(', ');
        return JSON.stringify(data.message);
    }
    if (typeof data.error === 'string') return data.error;
    return fallback;
}

// Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'error' ? '❌' : '✅'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Log Terminal Output
const responseOutput = document.getElementById('response-output');
function logResponse(method, url, status, data) {
    const timestamp = new Date().toLocaleTimeString();
    const statusText = status >= 200 && status < 300 ? `[${status} OK]` : `[${status} ERROR]`;
    const formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    
    const entry = `>>> [${timestamp}] ${method} ${url} ${statusText}\n${formattedData}\n\n`;
    if (responseOutput.textContent === 'Awaiting user interaction...') {
        responseOutput.textContent = entry;
    } else {
        responseOutput.textContent = entry + responseOutput.textContent;
    }
}
document.getElementById('clear-log-btn').addEventListener('click', () => {
    responseOutput.textContent = 'Awaiting user interaction...';
});

// Navigation & Page Switcher
function showPage(pageId) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Highlight nav link if applicable
    document.querySelectorAll('.page-link').forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Global click handler for page switching
document.addEventListener('click', (e) => {
    const link = e.target.closest('.switch-page') || e.target.closest('.page-link');
    if (link) {
        const target = link.getAttribute('data-target') || link.getAttribute('data-page');
        if (target) {
            e.preventDefault();
            // Protect dashboard & orders page if not logged in
            if ((target === 'page-dashboard' || target === 'page-orders') && !currentUser) {
                showToast('Please sign in to access your dashboard.', 'error');
                showPage('page-login');
                return;
            }
            showPage(target);
        }
    }
});

// Update Session UI
function setSession(user) {
    currentUser = user;
    const sessionControls = document.getElementById('session-controls');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navSignupBtn = document.getElementById('nav-signup-btn');

    if (user) {
        sessionControls.classList.remove('hidden');
        navLoginBtn.classList.add('hidden');
        navSignupBtn.classList.add('hidden');

        document.getElementById('user-display-name').textContent = user.name || user.email;
        document.getElementById('dash-user-name').textContent = user.name || 'User';
        document.getElementById('dash-user-email').textContent = user.email;
        
        showPage('page-dashboard');
    } else {
        sessionControls.classList.add('hidden');
        navLoginBtn.classList.remove('hidden');
        navSignupBtn.classList.remove('hidden');
        
        showPage('page-login');
    }
}

// 1. LOGIN SUBMIT
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    if (!email) return;

    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        logResponse('POST', '/api/users/login', res.status, data);

        if (res.ok && data.user) {
            showToast(`Welcome back, ${data.user.name || data.user.email}!`, 'success');
            setSession(data.user);
        } else {
            showToast(getErrorMessage(data, 'Login failed'), 'error');
        }
    } catch (e) {
        logResponse('POST', '/api/users/login', 500, { error: e.message });
        showToast('Network error during login', 'error');
    }
});

// 2. SIGNUP SUBMIT
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();

    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        const data = await res.json();
        logResponse('POST', '/api/users', res.status, data);

        if (res.ok && data.user) {
            showToast('Account created successfully!', 'success');
            setSession(data.user);
        } else {
            showToast(getErrorMessage(data, 'Registration failed'), 'error');
        }
    } catch (e) {
        logResponse('POST', '/api/users', 500, { error: e.message });
        showToast('Network error during registration', 'error');
    }
});

// 3. DUPLICATE EMAIL TEST
document.getElementById('trigger-duplicate-btn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Alice Smith Duplicate', email: 'alice@example.com' })
        });
        const data = await res.json();
        logResponse('POST', '/api/users', res.status, data);
        showToast(`Duplicate Email Error: ${getErrorMessage(data, 'Email already exists')}`, 'error');
    } catch (e) {
        logResponse('POST', '/api/users', 500, { error: e.message });
        showToast('Error triggering duplicate test', 'error');
    }
});

// 4. DASHBOARD - SEE MY ALL ORDERS
document.getElementById('btn-dash-orders').addEventListener('click', async () => {
    if (!currentUser) return;

    const startTime = performance.now();
    showToast('Loading 1,000 orders... Processing database queries', 'success');

    try {
        const res = await fetch(`/api/users/${currentUser.id}/orders`);
        const duration = Math.round(performance.now() - startTime);
        const data = await res.json();
        logResponse('GET', `/api/users/${currentUser.id}/orders`, res.status, data);

        if (res.ok) {
            renderOrdersPage(data.orders || [], duration);
            showPage('page-orders');
            showToast(`Loaded ${data.count || 0} orders in ${duration}ms!`, 'success');
        } else {
            showToast(getErrorMessage(data, 'Failed to fetch orders'), 'error');
        }
    } catch (e) {
        logResponse('GET', `/api/users/${currentUser?.id}/orders`, 500, { error: e.message });
        showToast('Error loading orders: ' + e.message, 'error');
    }
});

// RENDER ORDERS PAGE
function renderOrdersPage(orders, durationMs) {
    document.getElementById('orders-count-title').textContent = orders.length;
    document.getElementById('orders-timing-badge').textContent = `Query execution duration: ${durationMs} ms (Traced in Ravyn Telemetry)`;
    
    const container = document.getElementById('orders-list-container');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p class="no-orders">No orders found for this account.</p>';
        return;
    }

    // Render first 30 orders
    const displayList = orders.slice(0, 30);
    displayList.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-row-card';
        
        const totalDollar = (order.total / 100).toFixed(2);
        const itemsCount = order.items ? order.items.length : 0;
        const productName = (order.items && order.items[0] && order.items[0].product) 
            ? order.items[0].product.name 
            : 'Nexus Electronics Item';
        const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString();

        card.innerHTML = `
            <div class="order-col-main">
                <span class="order-badge">Order #${order.id}</span>
                <span class="order-date">${orderDate}</span>
                <h4 class="order-title">${productName}</h4>
            </div>
            <div class="order-col-meta">
                <span class="order-qty">${itemsCount} item(s)</span>
                <span class="order-price">$${totalDollar}</span>
            </div>
        `;
        container.appendChild(card);
    });

    if (orders.length > 30) {
        const moreNote = document.createElement('div');
        moreNote.className = 'orders-more-note';
        moreNote.textContent = `+ ${orders.length - 30} additional order records loaded into memory and traced in SQL span duration metrics.`;
        container.appendChild(moreNote);
    }
}

// 5. DASHBOARD - MAKE CHECKOUT
document.getElementById('btn-dash-checkout').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 99900 })
        });
        const data = await res.json();
        logResponse('POST', '/api/checkout', res.status, data);
        showToast('Checkout payment completed successfully! ($999.00)', 'success');
    } catch (e) {
        logResponse('POST', '/api/checkout', 500, { error: e.message });
        showToast('Checkout payment error', 'error');
    }
});

// 6. DASHBOARD - TRIGGER TELEMETRY ERROR
document.getElementById('btn-dash-error').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/users/trigger-error');
        const data = await res.json();
        logResponse('GET', '/api/users/trigger-error', res.status, data);
        showToast(getErrorMessage(data, '500 Internal Server Error Captured by Ravyn SDK'), 'error');
    } catch (e) {
        logResponse('GET', '/api/users/trigger-error', 500, { error: e.message });
        showToast('Unhandled Exception Triggered', 'error');
    }
});

// 7. LOGOUT
document.getElementById('logout-btn').addEventListener('click', () => {
    setSession(null);
    showToast('Signed out successfully.');
});

// Auto sign-in with default Alice account on start
setSession({ id: 1, name: 'Alice Smith', email: 'alice@example.com' });
