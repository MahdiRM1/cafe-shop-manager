import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getCurrentUser } from "../services/authService";
import PasswordField from "../components/ui/PasswordField";

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const kir = async () => setUser(await getCurrentUser());
  useEffect(() => {
    kir();
  }, []);

  useEffect(() => {
    if (!user)
      setError("کاربر وارد نشده است");
    else setError('');
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.put('/api/users/update-password', {currentPassword, newPassword});
      if (!response.success)
          setError(response.error);
      
      localStorage.removeItem("token");
      navigate('/auth/login');
    } catch (error) {setError("خطا در تغییر رمز کاربر");
    } finally {setLoading(false);}
  }

  return (
    <div dir='rtl' className="min-h-screen bg-gray-200 px-4 flex items-center justify-center rounded-4xl shadow-2xl">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">تغییر رمزعبور</h1>
            {user && (<p className="text-sm text-gray-500 mt-1">{user.fullName}</p>)}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
              {error}
            </div>
          )}

          <PasswordField label="رمزعبور پیشین" value={currentPassword} onChange={setCurrentPassword} required/>
          <PasswordField label="رمزعبور جدید" value={newPassword} onChange={setNewPassword} required/>
          
          <p className="text-center text-sm text-slate-500 mt-6">
            <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              بازگشت به ورود 
            </a>
          </p>
          <button type="submit" disabled={loading || !user}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'در حال تغییر رمز...' : 'تغییر رمز'}
            </button>
      </form>
    </div>
  );

}