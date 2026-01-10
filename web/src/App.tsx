import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminTrucks } from "./pages/admin/Trucks";
import { AdminTrips } from "./pages/admin/Trips";
import { AdminReports } from "./pages/admin/Reports";
import { AdminMaintenance } from "./pages/admin/Maintenance";
import { AdminSettings } from "./pages/admin/Settings";
import { DriverTrips } from "./pages/driver/Trips";
import { TripDetail } from "./pages/driver/TripDetail";
import { DriverProfile } from "./pages/driver/Profile";
import { UserRole } from "./types";

const AdminLayout = () => (
  <ProtectedRoute requiredRole={UserRole.ADMIN}>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
);

const DriverLayout = () => (
  <ProtectedRoute requiredRole={UserRole.DRIVER}>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
);

const AppRoutes = () => {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/trucks" element={<AdminTrucks />} />
        <Route path="/admin/trips" element={<AdminTrips />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/maintenance" element={<AdminMaintenance />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Protected Driver routes */}
      <Route element={<DriverLayout />}>
        <Route path="/driver/trips" element={<DriverTrips />} />
        <Route path="/driver/trips/:id" element={<TripDetail />} />
        <Route path="/driver/profile" element={<DriverProfile />} />
      </Route>

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate
              to={isAdmin ? "/admin/dashboard" : "/driver/trips"}
              replace
            />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
