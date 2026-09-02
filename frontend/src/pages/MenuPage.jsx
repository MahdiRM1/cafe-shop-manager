import { useState, useEffect } from "react";
import SelectField from "../components/ui/SelectField";
import MenuItemModal from "../components/menu/MenuItemModal";
import ThemeToggle from "../components/ui/ThemeToggle";
import {
  getMenuItems,
  getCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menuService";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsData, categoriesData] = await Promise.all([
        getMenuItems(),
        getCategories(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (err) {
      console.log(err);
      setError("خطا در دریافت اطلاعات منو");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = categoryFilter
    ? items.filter((item) => item.categoryId?.toString() === categoryFilter)
    : items;

  const handleAddClick = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleModalSubmit = async (payload) => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, payload);
    } else {
      await createMenuItem(payload);
    }
    await loadData();
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`آیتم "${item.name}" حذف بشه؟`)) return;
    try {
      await deleteMenuItem(item.id);
      await loadData();
    } catch (err) {
      console.log(err);
      setError("خطا در حذف آیتم");
    }
  };

  const categoryName = (id) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">مدیریت منو</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">افزودن، ویرایش و مدیریت آیتم‌های منو</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleAddClick}
              className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-blue-800 transition-all duration-300"
            >
              + افزودن آیتم جدید
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4 transition-colors duration-300">
          <div className="max-w-xs">
            <SelectField
              label="فیلتر بر اساس دسته‌بندی"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-10">در حال بارگذاری...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-10">آیتمی یافت نشد</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    <th className="py-3 px-2 font-medium">نام آیتم</th>
                    <th className="py-3 px-2 font-medium">دسته‌بندی</th>
                    <th className="py-3 px-2 font-medium">قیمت (تومان)</th>
                    <th className="py-3 px-2 font-medium">وضعیت</th>
                    <th className="py-3 px-2 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-2 text-gray-800 dark:text-gray-100">{item.name}</td>
                      <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{categoryName(item.categoryId)}</td>
                      <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{item.price?.toLocaleString("fa-IR")}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-xs rounded-full px-3 py-1 font-medium ${
                            item.inStock
                              ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/30 text-red-400 dark:text-red-400"
                          }`}
                        >
                          {item.inStock ? "موجود" : "ناموجود"}
                        </span>
                      </td>
                      <td className="py-3 px-2 space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium mr-3"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <MenuItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        categories={categories}
        initialData={editingItem}
      />
    </div>
  );
}