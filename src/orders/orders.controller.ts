async checkout(@Request() req: any, @Body() checkoutDto: CheckoutDto) {
  try {
    // Validate user_name
    if (!checkoutDto.user_name) {
      this.logger.error(`[Checkout] Missing required field: user_name`);
      throw new Error('User name is required');
    }
    return await this.ordersService.checkout(req.user.id, checkoutDto);
  } catch (error) {
    if (error.response && error.response.message && Array.isArray(error.response.message)) {
      this.logger.error(`[Checkout] Checkout validation failed`);
      this.logger.error(`[Checkout] Expected required field: user_name`);
      this.logger.error(`[Checkout] Frontend supplied: userName`);
    }
    throw error;
  }
}