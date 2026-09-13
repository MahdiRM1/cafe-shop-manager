import { useState, useEffect } from "react";
import InventoryModal from "../components/inventory/InventoryModal";
import {
    getRawMaterials,
    getLowStockMaterials,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
} from "../services/inventoryService";

export default function InventoryPage() {
  const [materials, setMaterials] = useState([]);
  const [lowStock, setLowStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const materialsData = lowStock ? await getLowStockMaterials() : await getRawMaterials();
      setMaterials(materialsData);
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در دریافت مواد اولیه");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [lowStock]);

  const handleAddClick = () => {
    setEditingMaterial(null);
    setModalOpen(true);
  };

  const handleEditClick = (material) => {
    setEditingMaterial(material);
    setModalOpen(true);
  };

  const handleDelete = async (material) => {
    if (material.currentStock > 0){
      window.alert("از این محصول در انبار وجود دارد و امکان حذف آن نیست.");
      return;
    }
    if (!window.confirm(`محصول "${material.name}" حذف بشه؟`)) return;
    try {
      await deleteRawMaterial(material.id);
      await loadData();
    } catch (err) {
      console.log(err.response ?? err);
      setError(error.response?.data?.message || "خطا در حذف ماده اولیه");
    }
  }

  const handleMaterialSubmit = async (payload) => {
    if (editingMaterial) {
      await updateRawMaterial(editingMaterial.id, payload);
    } else {
      await createRawMaterial(payload);
    }
    await loadData();
  };

  const renderMaterial = (material) => (
    <div
      key={material.id}
      className="w-full shrink-0 bg-gray-50 dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 flex flex-col animate-fade-in-up"
    >
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm leading-snug line-clamp-2">
            {material.name}
          </h3>
          <span
            className={`shrink-0 text-[10px] rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${
              material.currentStock > material.minStockAlert
                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/30 text-red-400 dark:text-red-400"
            }`}
          >
            {material.currentStock}{material.unit}
          </span>
        </div>

        <div className="flex gap-2 pt-1 border-t border-gray-200 dark:border-gray-700 mt-1">
          <button
            onClick={() => handleEditClick(material)}
            className="flex-1 text-blue-600 hover:text-blue-800 text-xs font-medium py-1.5"
          >
            ویرایش
          </button>
          <button
            onClick={() => handleDelete(material)}
            className="flex-1 text-red-500 hover:text-red-700 text-xs font-medium py-1.5 border-r border-gray-200 dark:border-gray-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              مدیریت انبار
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              افزودن، ویرایش و مدیریت انبار
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-blue-800 transition-all duration-300"
          >
            + افزودن ماده اولیه جدید
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => setLowStock(e.target.checked)}
              className="peer hidden"
            />
            <span
              className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600
              flex items-center justify-center transition-all duration-200
              peer-checked:bg-blue-600 peer-checked:border-blue-600
              peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40"
            >
              <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 peer-checked:opacity-100 scale-75 peer-checked:scale-100 transition-all duration-150"
              style={{ opacity: lowStock ? 1 : 0, transform: lowStock ? "scale(1)" : "scale(0.75)" }}
              >
              <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              فقط نمایش موجودی‌های کم
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
            در حال بارگذاری...
          </p>
        ) : materials.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-10">
            ماده اولیه ای یافت نشد
          </p>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-4xl animate-fade-in-up">
            <div
            className="p-6 transition-colors duration-300"
            >
            <div className="flex items-center justify-between">
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500 mr-2">
                  ({materials.length} ماده اولیه)
              </span>
            </div>
              <div className="grid grid-cols-4 gap-4 px-1 py-5">
                  {materials.map(renderMaterial)}
              </div>
            </div>
          </div>
        )}
      </div>

      <InventoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleMaterialSubmit}
        initialData={editingMaterial}
      />
    </div>
  );
}