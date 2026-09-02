import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UpdatePassword from './pages/UpdatePassword';
import MenuPage from './pages/MenuPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        
        <Route element={<Layout />}>
          <Route path="/auth/update-password" element={<UpdatePassword />} />
          <Route path="/dashboard" element={<MenuPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
