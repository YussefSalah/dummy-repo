async processPayment(amount: number) {
  const maxRetries = 3;
  let attempt = 0;
  const retryDelay = 1000; // milliseconds

  while (attempt < maxRetries) {
    try {
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Payment gateway timeout'));
        }, 100);
      });
    } catch (error) {
      attempt++;
      if (attempt < maxRetries) {
        console.log(`Retrying payment processing... Attempt ${attempt}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay)); // Exponential backoff logic can be implemented here
      } else {
        throw error; // Final attempt, rethrow error if unsuccessful
      }
    }
  }
}