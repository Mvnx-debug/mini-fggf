import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/dashboard/Dashboard';  
import ReportDetails from './pages/report-details/ReportDetails.tsx';

// Componente para rotas privadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  return (user || token) ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route
            path='/relatorio/:id'
            element={
              <PrivateRoute>
                <ReportDetails />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;