export function redirectToWhatsApp(productName: string, orderId: string) {
  const message = `Hi, I've completed my order for ${productName} - Order ID #${orderId}. Please confirm my access.`;
  const whatsappUrl = `https://wa.me/917496067495?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}
