import { api } from './http';

export async function fetchOrderCount(orderStatus) {
  const response = await api.get('/admin/orders/count', { params: { orderStatus } });
  return response.data;
}

export async function fetchDeliveredTodayCount() {
  const response = await api.get('/admin/orders/delivered/count');
  return response.data;
}

export async function fetchQueueStats() {
  const response = await api.get('/admin/orders/queue/stats');
  return response.data;
}

export async function fetchOrderWaitTime(orderId) {
  const response = await api.get(`/admin/orders/${orderId}/wait-time`);
  return response.data;
}

export async function fetchOrdersByStatus(orderStatus, pageNo = 0) {
  const response = await api.get('/admin/orders', { params: { orderStatus, pageNo } });
  return response.data;
}

export async function acceptOrder(orderId) {
  const response = await api.post(`/admin/orders/${orderId}/accept`);
  return response.data;
}

export async function markOrderReady(orderId) {
  const response = await api.post(`/admin/orders/${orderId}/ready`);
  return response.data;
}

export async function rejectOrder(orderId) {
  const response = await api.post(`/admin/orders/${orderId}/reject`);
  return response.data;
}

export async function deliverOrder(orderToken) {
  const response = await api.post('/admin/orders/deliver', { orderToken });
  return response.data;
}

export async function getItems(pageNo = 0) {
  const response = await api.get('/item', { params: { pageNo } });
  return response.data;
}

export async function getItemsByCategory(categoryName, pageNo = 0) {
  const response = await api.get('/item/category', { params: { categoryName, pageNo } });
  return response.data;
}

export async function getItemsByPriceRange(minPrice, highPrice) {
  const response = await api.get('/item/price-range', { params: { minPrice, highPrice } });
  return response.data;
}

export async function getInstantReadyItems() {
  const response = await api.get('/item/instant-ready');
  return response.data;
}

export async function fetchTotalWaitTime() {
  const response = await api.get('/order/wait-time');
  return response.data;
}

export async function createItem(formData) {
  const response = await api.post('/admin/item/save', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function deleteItem(itemId) {
  const response = await api.delete(`/admin/item/${itemId}/delete`);
  return response.data;
}

export async function toggleItemAvailability(itemId) {
  const response = await api.patch(`/admin/item/${itemId}/toggleAvailability`);
  return response.data;
}

export async function deleteItemsBulk(itemIds) {
  const response = await api.post('/admin/item/delete-all', itemIds);
  return response.data;
}
