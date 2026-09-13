import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (user.role === 'MANAGER') {
      navigate('/menu-management');
      return;
    }

    navigate('/order');
  }, [user, loading, navigate]);

  return (
    <p className="text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 py-10">
      در حال انتقال...
    </p>
  );
}