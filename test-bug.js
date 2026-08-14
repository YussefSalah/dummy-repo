async function testBug() {
  try {
    console.log("Registering user...");
    const res = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'Password123'
      })
    });
    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    
    const token = data.accessToken;
    console.log("User registered, token received.");

    console.log("Checking out with intentional backend mapping bug...");
    
    const checkoutPayload = {
      user_name: "Test User",
      shippingAddress: "123 Main Street",
      city: "Port Said",
      postalCode: "12345",
      country: "Egypt",
      paymentMethod: "card"
    };

    const checkoutRes = await fetch('http://localhost:3001/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(checkoutPayload)
    });
    
    const checkoutData = await checkoutRes.json();
    if (!checkoutRes.ok) throw { status: checkoutRes.status, data: checkoutData };

    console.log("SUCCESS? This should NOT happen.", checkoutData);
  } catch (error) {
    console.log("--- ERROR CAUGHT ---");
    console.log("Status:", error.status);
    console.log("Message:", error.data?.message);
    
    const message = error.data?.message;
    const isArray = Array.isArray(message);
    const hasUserNameError = isArray ? message.some(m => m.includes('user_name')) : message?.includes('user_name');
    
    if (hasUserNameError) {
      console.log("✅ BUG VERIFIED: The backend correctly rejected the request because 'user_name' is missing.");
    } else {
      console.log("❌ BUG NOT VERIFIED: The error did not mention 'user_name'.");
    }
  }
}

testBug();
