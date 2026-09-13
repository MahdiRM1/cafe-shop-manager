import api from "./api";

export async function getRawMaterials() {
    const response = await api.get("/api/raw-materials");
    return response.data;
}

export async function getLowStockMaterials() {
    const response = await api.get("/api/raw-materials/low-stock");
    return response.data;
}   

export async function createRawMaterial(payload) {
    const response = await api.post("/api/raw-materials", payload);
    return response.data;
}

export async function updateRawMaterial(id, payload) {
  const response = await api.put(`/api/raw-materials/${id}`, payload);
  return response.data;
}

export async function deleteRawMaterial(id) {
  const response = await api.delete(`/api/raw-materials/${id}`);
  return response.data;
}

