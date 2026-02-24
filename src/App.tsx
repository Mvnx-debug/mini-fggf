import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';

// Componente para rotas privadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  return (user || token) ? <>{children}</> : <Navigate to="/login" />;
}

// Componente Dashboard temporário (vamos criar depois)
function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user?.nome}!</p>
      <button 
        onClick={logout}
        style={{
          padding: '10px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sair
      </button>
    </div>
  );
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;