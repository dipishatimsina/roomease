import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TenantHome from './pages/tenant/TenantHome';
import RoomDetails from './pages/tenant/RoomDetails';
import SavedRooms from './pages/tenant/SavedRooms';
import Applications from './pages/tenant/Applications';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProperties from './pages/owner/OwnerProperties';
import OwnerRooms from './pages/owner/OwnerRooms';
import OwnerInquiries from './pages/owner/OwnerInquiries';
import OwnerVisits from './pages/owner/OwnerVisits';
import OwnerApplications from './pages/owner/OwnerApplications';

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

          <Route path="/owner" element={<ProtectedRoute allowedRole="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/properties" element={<ProtectedRoute allowedRole="owner"><OwnerProperties /></ProtectedRoute>} />
          <Route path="/owner/rooms" element={<ProtectedRoute allowedRole="owner"><OwnerRooms /></ProtectedRoute>} />
          <Route path="/owner/inquiries" element={<ProtectedRoute allowedRole="owner"><OwnerInquiries /></ProtectedRoute>} />
          <Route path="/owner/visits" element={<ProtectedRoute allowedRole="owner"><OwnerVisits /></ProtectedRoute>} />
          <Route path="/owner/applications" element={<ProtectedRoute allowedRole="owner"><OwnerApplications /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;