import api from "./api";

export async function getPurchases() {
    const response = await api.get("/api/purchases");
    return response.data;
}

export async function openPurchase() {
    const response = await api.post("/api/purchases");
    return response.data;
}

export async function getPurchaseItems(id) {
    const response = await api.get(`/api/purchases/${id}/items`);
    return response.data;
}   

export async function addItem(id, payload) {
  const response = await api.post(`/api/purchases/${id}/items`, payload);
  return response.data;
}

export async function updateItem(id, itemId, payload) {
    const response = await api.patch(`/api/purchases/${id}/items/${itemId}`, payload);
    return response.data;
}

export async function deletePurchaseItem(id, itemId) {
  const response = await api.delete(`/api/purchases/${id}/items/${itemId}`);
  return response.data;
}

export async function checkoutPurchase(id) {
    const response = await api.post(`/api/purchases/${id}/checkout`);
    return response.data;
}

export async function cancelPurchase(id) {
    const response = await api.patch(`/api/purchases/${id}/cancel`);
    return response.data;
}

export async function createPayment(id, payload) {
    const response = await api.post(`/api/purchases/${id}/payments`, payload);
    return response.data;
}

export async function purchasePayments(id) {
    const response = await api.get(`/api/purchases/${id}/payments`);
    return response.data;
}