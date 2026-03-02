import { useEffect, useMemo, useState } from 'react';
import { Loading } from '@/components/Loading';
import { RelatorioCard } from '@/components/RelatorioCard';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import type { Relatorio } from '@/types';
import { ordenarRelatoriosMaisRecentes, paginarRelatorios } from '@/utils/dashboard';
import styles from './Reports.module.css';

export default function Reports() {
  const { user } = useAuth();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      if (!user) return;

      try {
        setCarregando(true);
        let url = '/relatorios';
        if (user.tipo === 'cliente' && user.empresaId) {
          url = `/relatorios?empresaId=${user.empresaId}`;
        }

        const response = await api.get<Relatorio[]>(url);
        if (ativo) {
          setRelatorios(response.data);
          setErro('');
        }
      } catch {
        if (ativo) setErro('Nao foi possivel carregar os relatorios');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscar();
    return () => {
      ativo = false;
    };
  }, [user]);

  const ordenados = useMemo(() => ordenarRelatoriosMaisRecentes(relatorios), [relatorios]);
  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / itensPorPagina));
  const paginados = useMemo(
    () => paginarRelatorios(ordenados, paginaAtual, itensPorPagina),
    [ordenados, paginaAtual]
  );

  useEffect(() => {
    if (paginaAtual > totalPaginas) setPaginaAtual(totalPaginas);
  }, [paginaAtual, totalPaginas]);

  if (carregando) return <div className={styles.container}><Loading /></div>;
  if (erro) return <div className={styles.container}><p className={styles.erro}>{erro}</p></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Relatorios</h1>
        <span>Pagina {paginaAtual} de {totalPaginas}</span>
      </header>

      <div className={styles.grid}>
        {paginados.map((relatorio) => (
          <RelatorioCard key={relatorio.id} relatorio={relatorio} />
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          disabled={paginaAtual === 1}
        >
          Anterior
        </button>
        <button
          onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
        >
          Proxima
        </button>
      </div>
    </div>
  );
}
