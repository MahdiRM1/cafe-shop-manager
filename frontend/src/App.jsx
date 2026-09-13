import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UpdatePassword from './pages/UpdatePassword';
import MenuPage from './pages/MenuPage';
import InventoryPage from './pages/InventoryPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectRoute';
import PurchasePage from './pages/PurchasePage';
import ShiftPage from './pages/ShiftPage';
import TablesPage from './pages/TablesPage';
import UserManagementPage from './pages/UserManagementPage';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import ReportPage from './pages/ReportPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path='' element={<HomePage/>}/>
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/tables" element={<TablesPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['CASHIER']} />}>
          <Route element={<Layout />}>
            <Route path="/shift" element={<ShiftPage />} />
            <Route path="/order" element={<OrderPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
          <Route element={<Layout />}>
            <Route path="/menu-management" element={<MenuPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/user-management" element={<UserManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
