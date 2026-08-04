const http = require('http');

const endpoints = [
  { path: '/api/users/1/orders', method: 'GET' }, // N+1 
  { path: '/api/products/featured', method: 'GET' }, // TypeError
  { path: '/api/checkout', method: 'POST', body: '{"amount": 100}' }, // Promise rejection
];

function makeRequest(endpoint) {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: endpoint.path,
    method: endpoint.method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = http.request(options, (res) => {
    // Consume response data to free up memory
    res.on('data', () => {});
    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] ${endpoint.method} ${endpoint.path} -> ${res.statusCode}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
  });

  if (endpoint.body) {
    req.write(endpoint.body);
  }
  req.end();
}

console.log('🚀 Starting traffic generator... Press Ctrl+C to stop.');

// Blast the server with 10 requests every second!
setInterval(() => {
  for (let i = 0; i < 10; i++) {
    const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    makeRequest(randomEndpoint);
  }
}, 1000);
