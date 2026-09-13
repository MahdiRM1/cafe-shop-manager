import api from "./api";

export async function getOrders() {
    const response = await api.get("/api/orders");
    return response.data;
}

export async function openOrder(payload) {
    const response = await api.post("/api/orders", payload);
    return response.data;
}

export async function getOrderItems(id) {
    const response = await api.get(`/api/orders/${id}/items`);
    return response.data;
}   

export async function addItem(id, payload) {
  const response = await api.post(`/api/orders/${id}/items`, payload);
  return response.data;
}

export async function updateItem(id, itemId, payload) {
    const response = await api.patch(`/api/orders/${id}/items/${itemId}`, payload);
    return response.data;
}

export async function deleteOrderItem(id, itemId) {
  const response = await api.delete(`/api/orders/${id}/items/${itemId}`);
  return response.data;
}

export async function checkoutOrder(id) {
    const response = await api.post(`/api/orders/${id}/checkout`);
    return response.data;
}

export async function cancelOrder(id) {
    const response = await api.patch(`/api/orders/${id}/cancel`);
    return response.data;
}

export async function createPayment(id, payload) {
    const response = await api.post(`/api/orders/${id}/payments`, payload);
    return response.data;
}

export async function orderPayments(id) {
    const response = await api.get(`/api/orders/${id}/payments`);
    return response.data;
}