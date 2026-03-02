import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ReportDetails from './pages/report-details/ReportDetails';
import { AppSidebar } from './components/AppSidebar';
import Reports from './pages/reports/Reports';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  return (user || token) ? <>{children}</> : <Navigate to="/login" />;
}

function PrivateLayout() {
  return (
    <PrivateRoute>
      <div className="app-shell">
        <AppSidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </PrivateRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/relatorio/:id" element={<ReportDetails />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
