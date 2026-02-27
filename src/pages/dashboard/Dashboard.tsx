import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { RelatorioCard } from '../../components/RelatorioCard';
import { Loading } from '../../components/Loading';
import api from '../../services/api';
import type { Relatorio } from '../../types';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function buscarRelatorios() {
      if (!user) {
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);

        let url = '/relatorios';
        if (user.tipo === 'cliente' && user.empresaId) {
          url = `/relatorios?empresaId=${user.empresaId}`;
        }

        const response = await api.get(url);
        if (ativo) {
          setRelatorios(response.data);
          setErro('');
        }
      } catch {
        if (ativo) {
          setErro('Nao foi possivel carregar os relatorios');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    buscarRelatorios();

    return () => {
      ativo = false;
    };
  }, [user]);

  if (carregando) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  if (erro) {
    return (
      <div className={styles.container}>
        <div className={styles.erro}>{erro}</div>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Ola, {user?.nome}!</h1>
          <p className={styles.subtitle}>
            {user?.tipo === 'admin' ? 'Gerencie todos os relatorios' : 'Seus relatorios financeiros'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <button onClick={logout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      {relatorios.length === 0 ? (
        <div className={styles.vazio}>
          <p>Nenhum relatorio encontrado</p>
          <p>Usuario: {user?.email} | Tipo: {user?.tipo} | EmpresaId: {user?.empresaId}</p>
        </div>
      ) : (
        <>
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total</span>
              <span className={styles.statValue}>{relatorios.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>DRE</span>
              <span className={styles.statValue}>{relatorios.filter((r) => r.tipo === 'dre').length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>DFC</span>
              <span className={styles.statValue}>{relatorios.filter((r) => r.tipo === 'dfc').length}</span>
            </div>
          </div>

          <div className={styles.grid}>
            {relatorios.map((relatorio) => (
              <RelatorioCard key={relatorio.id} relatorio={relatorio} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
