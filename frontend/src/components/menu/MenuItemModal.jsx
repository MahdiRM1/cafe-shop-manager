import { useState, useEffect } from "react";
import FormField from "../ui/FormField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";
import RecipeModal from "./RecipeModal";
import { updateRecipe } from "../../services/menuService";

export default function MenuItemModal({
  open,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [desctiption, setDesctiption] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [recipeItemModal, setRecipeItemModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!open) return;
    setName(initialData?.name ?? "");
    setPrice(initialData?.price?.toString() ?? "");
    setCategoryId(initialData?.categoryId?.toString() ?? "");
    setDesctiption(initialData?.desctiption ?? "");
    setImagePath(initialData?.imagePath ?? "");
    setError("");
  }, [open, initialData]);

  if (!open) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("فایل انتخاب‌شده باید تصویر باشد");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("حجم تصویر نباید بیشتر از ۲ مگابایت باشد");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setImagePath(reader.result);
    };
    reader.onerror = () => {
      setError("خطا در خواندن فایل تصویر");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !price || !categoryId) {
      setError("همه‌ی فیلدها الزامی هستن");
      return;
    }
    if (Number(price) < 0) {
      setError("قیمت محصول نمی‌تواند منفی باشد");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        price: Number(price),
        categoryId: Number(categoryId),
        desctiption: desctiption || null,
        imagePath: imagePath || null,
      });
      onClose();
    } catch (err) {
      setError("خطا در ذخیره‌سازی آیتم");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeUpdate = async (payload) => {
    await updateRecipe(initialData.id, payload);
  }

  return (
    <>
      <div
        dir="rtl"
        className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50"
        onClick={onClose}
      >
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-5 transition-colors duration-300 max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {isEdit ? "ویرایش آیتم منو" : "افزودن آیتم جدید"}
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-500 dark:text-gray-400 block">تصویر آیتم</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
                {imagePath ? (
                  <img src={imagePath} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 dark:text-gray-500"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="menu-item-image-input"
                />
                <label
                  htmlFor="menu-item-image-input"
                  className="cursor-pointer text-center text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  {imagePath ? "تغییر تصویر" : "انتخاب تصویر"}
                </label>

                {imagePath && (
                  <button
                    type="button"
                    onClick={() => setImagePath("")}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    حذف تصویر
                  </button>
                )}
              </div>
            </div>
          </div>

          <FormField label="نام آیتم" type="text" value={name} onChange={setName} required />
          <FormField label="قیمت (تومان)" type="number" value={price} onChange={setPrice} required />
          <SelectField
            label="دسته‌بندی"
            value={categoryId}
            onChange={setCategoryId}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          { initialData && (
            <button
              type="button"
              onClick={() => setRecipeItemModal(true)}
              className="flex-1 border disabled:opacity-50 border-blue-600 text-blue-600 rounded-lg py-2.5 font-medium hover:bg-blue-600 hover:text-white w-full transition-all duration-300"
            >
            {isEdit ? "مشاهده/ویرایش رسپی" : "افزودن رسپی"}
            </button>
        )}
          <TextAreaField label="توضیحات" value={desctiption} onChange={setDesctiption} rtl />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن"}
            </button>
          </div>

        </form>
      </div>

      { initialData && (
        <RecipeModal
          open={recipeItemModal}
          onClose={() => setRecipeItemModal(false)}
          onSubmit={handleRecipeUpdate}
          menuItem={initialData}
        />
      )}
    </>
  );
}