import Link from 'next/link';

export default function Navbar({
  children
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navItems = [
    { href: '/admin/reports', label: 'صندوق' },
    { href: '/admin/orders', label: 'میزها' },
    { href: '/admin/work-types', label: 'سفارش‌ها' },
    { href: '/admin/products', label: 'شیفت' },
    { href: '/admin/financial', label: 'موجودی' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="font-bold text-slate-800">پنل مدیریت</h1>
            <nav className="flex items-center gap-1 mr-2 flex-wrap">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                    pathname === item.href
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              مدیر سیستم
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
            >
              خروج
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
