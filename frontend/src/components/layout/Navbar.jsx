import { href, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from '../ui/ThemeToggle';

const roleLabels = {
  MANAGER: 'مدیر',
  CASHIER: 'صندوقدار',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navItems = (user.role === "MANAGER") 
  ? [
    { href: '/menu-management', label: 'صندوق' },
    { href: '/inventory', label:'انبار' },
    { href: '/purchase', label:'خریدها' },
    { href: '/tables', label: 'میزها' },
    { href: '/user-management', label: 'کاربران' },
    { href: '/report', label: 'گزارش' },
  ] : [
    { href: '/order', label: 'سفارش' },
    { href: '/tables', label: 'میزها' },
    { href: '/shift', label: 'شیفت' },
  ]

  return (
    <div className="bg-slate-50 dark:bg-gray-950">
      {/* Top Navigation */}
      <nav className="bg-white border-slate-200 dark:bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-50 duration-300">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="font-bold text-slate-800 dark:text-gray-100">پنل {roleLabels[user?.role]}</h1>
            <nav className="flex items-center gap-1 mr-2 flex-wrap">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                    location.pathname === item.href
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle/>

            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800 px-3 py-1 rounded-full">
              {user?.fullName}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white hover:bg-red-800 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer"
            >
              خروج
            </button>
          </div>
        </div>
      </nav>

      <div className="h-15" />
    </div>
  );
}