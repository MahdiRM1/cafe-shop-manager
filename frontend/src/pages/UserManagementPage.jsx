import { useState, useEffect } from "react";
import UserModal from "../components/users/UserModal";
import EditPasswordModal from "../components/users/EditPasswordModal";
import {
  getUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  toggleUserStatus,
} from "../services/userServices";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [updatePasswordOpen, setUpdatePasswordOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const roles = {
    MANAGER: "مدیر",
    CASHIER: "صندوقدار",
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.log(err);
      setError("خطا در دریافت لیست کاربران");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddClick = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleEditPasswordClick = (user) => {
    setEditingUser(user);
    setUpdatePasswordOpen(true);
  };

  const handleUserSubmit = async (payload) => {
    if (editingUser) await updateUser(editingUser.id, payload);
    else await createUser(payload);
    await loadUsers();
  };

  const handlePasswordSubmit = async (payload) => {
    await updateUserPassword(editingUser.id, payload);
  };

  const handleToggleStatus = async (user) => {
    if (
      !window.confirm(
        `میخواهید کاربر ${user.fullName} را ${
          user.active ? "غیرفعال" : "فعال"
        } کنید؟`
      )
    )
      return;
    await toggleUserStatus(user.id, { active: !user.active });
    await loadUsers();
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`میخواهید کاربر ${user.fullName} را حذف کنید؟`)) return;
    await deleteUser(user.id);
    await loadUsers();
  };

  const renderUserRow = (user) => (
    <tr
      key={user.id}
      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <td className="py-3 px-8 text-gray-800 dark:text-gray-100 text-center min-w-max">
        {user.fullName}
      </td>
      <td className="py-3 px-8 text-gray-600 dark:text-gray-300 text-center">
        {roles[user.role]}
      </td>
      <td className={`py-3 px-8 ${user.active ? 'text-green-600' : 'text-red-600'} text-center`}>
        {user.active ? "فعال" : "غیرفعال"}
      </td>
      <td className="py-3 text-center max-w-max">
        {user.role !== "MANAGER" && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleDelete(user)}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-all duration-300"
            >
              حذف
            </button>

            <button
              onClick={() => handleEditClick(user)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-all duration-300"
            >
              ویرایش
            </button>

            <button
              onClick={() => handleEditPasswordClick(user)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-all duration-300"
            >
              تغییر رمز عبور
            </button>

            <button
              onClick={() => handleToggleStatus(user)}
              className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-all duration-300"
            >
              {user.active ? "غیرفعال کردن" : "فعال کردن"}
            </button>
          </div>
        )}
      </td>
    </tr>
  );

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              مدیریت کاربران
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              افزودن، ویرایش و مدیریت دسترسی کارکنان
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-medium hover:bg-blue-800 transition-all duration-300"
          >
            + افزودن کاربر جدید
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 animate-fade-in-up">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                <th className="py-3 px-2 font-medium text-center">نام کامل</th>
                <th className="py-3 px-2 font-medium text-center">نقش</th>
                <th className="py-3 px-2 font-medium text-center">وضعیت</th>
                <th className="py-3 px-2 font-medium text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>{users.map(renderUserRow)}</tbody>
          </table>
        </div>
      </div>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUserSubmit}
        initialData={editingUser}
      />
      <EditPasswordModal
        open={updatePasswordOpen}
        onSubmit={handlePasswordSubmit}
        onClose={() => setUpdatePasswordOpen(false)}
        initialData={editingUser}
      />
    </div>
  );
}