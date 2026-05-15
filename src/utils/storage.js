const ORDERS_KEY = 'fenster24_orders'
const PRICES_KEY = 'fenster24_custom_prices'

export function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') }
  catch { return [] }
}

export function saveOrder(order) {
  const orders = getOrders()
  const id = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, '0')}`
  const newOrder = { ...order, id, date: new Date().toISOString(), status: 'neu' }
  orders.unshift(newOrder)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return newOrder
}

export function updateOrder(id, updates) {
  const orders = getOrders().map(o => o.id === id ? { ...o, ...updates } : o)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return orders
}

export function deleteOrder(id) {
  const orders = getOrders().filter(o => o.id !== id)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getCustomPrices() {
  try { return JSON.parse(localStorage.getItem(PRICES_KEY) || 'null') }
  catch { return null }
}

export function saveCustomPrices(prices) {
  localStorage.setItem(PRICES_KEY, JSON.stringify(prices))
}

export function resetPrices() {
  localStorage.removeItem(PRICES_KEY)
}
