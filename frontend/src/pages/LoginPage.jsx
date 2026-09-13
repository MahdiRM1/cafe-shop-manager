import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormField from "../components/ui/FormField";
import ThemeToggle from '../components/ui/ThemeToggle';
import PasswordField from "../components/ui/PasswordField";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await login(username, password);
        if (!response.success) {
            setError(response.message);
            return
        }
        navigate('/');
    } catch (error) {console.log(error);setError("خطا در ورود کاربر");
    } finally {setLoading(false);}
  }

  return (
    <div dir='rtl' className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 flex items-center justify-center duration-300">
      <div className="fixed top-4 left-4">
        <ThemeToggle />
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ورود به سیستم</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">سیستم مدیریت کافه</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
              {error}
            </div>
          )}

          <FormField label="نام کاربری" type="text" value={username} onChange={setUsername} required/>
          <PasswordField label="رمزعبور" value={password} onChange={setPassword} required/>

          <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
      </form>
    </div>
  );

}