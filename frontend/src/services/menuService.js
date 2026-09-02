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

export async function updateMenuItem(id, payload) {
  const response = await api.put(`/api/menu-items/${id}`, payload);
  return response.data;
}

export async function deleteMenuItem(id) {
  const response = await api.delete(`/api/menu-items/${id}`);
  return response.data;
}

export async function toggleMenuItemStatus(id, isActive) {
  const response = await api.patch(`/menu/items/${id}/status`, { isActive });
  return response.data;
}