export default function ActionGlobal() {
  // Clear order pending
  const orderPending = localStorage.getItem('order_pending');
  if (orderPending) localStorage.removeItem('order_pending');
}
