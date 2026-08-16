const order = manager.create(Order, {
  userId: user.id,
  user: user,
  userName: checkoutDto.user_name, // Fixes the property mapping
  shippingAddress: checkoutDto.shippingAddress,
  city: checkoutDto.city,
  postalCode: checkoutDto.postalCode,
  country: checkoutDto.country,
  paymentMethod: checkoutDto.paymentMethod,
  totalAmount: totalAmount.toString(),
  status: 'pending',
});
