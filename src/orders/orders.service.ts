      const order = manager.create(Order, {
        userId: user.id,
        user: user,
        user_name: (checkoutDto as any).user_name, // Fixed mapping from user_name
        shippingAddress: checkoutDto.shippingAddress,
        city: checkoutDto.city,
        postalCode: checkoutDto.postalCode,
        country: checkoutDto.country,
        paymentMethod: checkoutDto.paymentMethod,
        totalAmount: totalAmount.toString(),
        status: 'pending',
      });