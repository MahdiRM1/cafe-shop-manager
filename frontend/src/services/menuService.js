import api from "./api";

export async function getMenuItems() {
  const response = await api.get("/api/menu-items");
  return response.data;
}

export async function getCategories() {
  const response = await api.get("/api/categories");
  return response.data;
}

export async function createMenuItem(payload) {
  const response = await api.post("/api/menu-items", payload);
  return response.data;
}

export async function updateCategory(id, payload) {
  const response = await api.put(`/api/categories/${id}`, payload);
  return response.data;
}

export async function createCategory(payload) {
  const response = await api.post("/api/categories", payload);
  return response.data;
}

export async function updateMenuItem(id, payload) {
  const response = await api.put(`/api/menu-items/${id}`, payload);
  return response.data;
}

export async function deleteMenuItem(id) {
  const response = await api.delete(`/api/menu-items/${id}`);
  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
}

export async function getRecipe(menuItemId) {
  const response = await api.get(`/api/menu-items/${menuItemId}/recipe`);
  return response.data;
}

export async function updateRecipe(menuItemId, payload) {
  const response = await api.put(`/api/menu-items/${menuItemId}/recipe`, payload);
  return response.data;
}