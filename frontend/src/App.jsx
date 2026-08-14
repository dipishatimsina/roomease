import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TenantHome from './pages/tenant/TenantHome';
import RoomDetails from './pages/tenant/RoomDetails';
import SavedRooms from './pages/tenant/SavedRooms';
import Applications from './pages/tenant/Applications';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/tenant" element={<ProtectedRoute allowedRole="tenant"><TenantHome /></ProtectedRoute>} />
          <Route path="/tenant/rooms/:id" element={<ProtectedRoute allowedRole="tenant"><RoomDetails /></ProtectedRoute>} />
          <Route path="/tenant/saved" element={<ProtectedRoute allowedRole="tenant"><SavedRooms /></ProtectedRoute>} />
          <Route path="/tenant/applications" element={<ProtectedRoute allowedRole="tenant"><Applications /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;