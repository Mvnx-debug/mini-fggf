import { BarChart3, FileText, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import styles from './AppSidebar.module.css';

export function AppSidebar() {
  const { user, logout } = useAuth();


  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandBadge}>FG</span>
        <div>
          <strong>Mini FGGF</strong>
          <p>Painel Financeiro</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <BarChart3 size={16} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/relatorios"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <FileText size={16} />
          <span>Relatorios</span>
        </NavLink>
      </nav>


      <div className={styles.footer}>
        <div className={styles.userCard}>
          <small>{user?.tipo === 'admin' ? 'Administrador' : 'Cliente'}</small>
          <strong>{user?.nome}</strong>
          <span>{user?.email}</span>
        </div>
        <div className={styles.actions}>
          <ThemeToggle />
          <button className={styles.logoutButton} onClick={logout}>
            <LogOut size={15} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
