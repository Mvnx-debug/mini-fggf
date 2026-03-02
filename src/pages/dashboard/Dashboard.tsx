import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendComparisonChart } from '@/components/TrendComparisonChart';
import {
  construirComparativoDiario,
  construirComparativoMensal,
  filtrarRelatorioPeriodo,
  ordenarRelatoriosMaisRecentes,
  paginarRelatorios,
  type ComparativoPeriodo,
  type PeriodoFiltro,
} from '@/utils/dashboard';
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
  const [periodo, setPeriodo] = useState<PeriodoFiltro>(30);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;

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

        const response = await api.get<Relatorio[]>(url);
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

  const relatoriosFiltrados = useMemo(
    () => filtrarRelatorioPeriodo(relatorios, periodo),
    [relatorios, periodo]
  );
  const relatoriosDreFiltrados = useMemo(
    () => relatoriosFiltrados.filter((r) => r.tipo === 'dre'),
    [relatoriosFiltrados]
  );
  const relatoriosDfcFiltrados = useMemo(
    () => relatoriosFiltrados.filter((r) => r.tipo === 'dfc'),
    [relatoriosFiltrados]
  );

  const granularidade = periodo === 30 ? 'diaria' : 'mensal';

  const comparativoDre = useMemo<ComparativoPeriodo[]>(
    () => (granularidade === 'diaria'
      ? construirComparativoDiario(relatoriosDreFiltrados, periodo)
      : construirComparativoMensal(relatoriosDreFiltrados)),
    [granularidade, relatoriosDreFiltrados, periodo]
  );

  const comparativoDfc = useMemo<ComparativoPeriodo[]>(
    () => (granularidade === 'diaria'
      ? construirComparativoDiario(relatoriosDfcFiltrados, periodo)
      : construirComparativoMensal(relatoriosDfcFiltrados)),
    [granularidade, relatoriosDfcFiltrados, periodo]
  );

  const relatoriosOrdenados = useMemo(
    () => ordenarRelatoriosMaisRecentes(relatoriosFiltrados),
    [relatoriosFiltrados]
  );

  const totalPaginas = Math.max(1, Math.ceil(relatoriosOrdenados.length / itensPorPagina));

  const relatoriosPaginados = useMemo(
    () => paginarRelatorios(relatoriosOrdenados, paginaAtual, itensPorPagina),
    [relatoriosOrdenados, paginaAtual]
  );

  const tendenciaDre = comparativoDre[comparativoDre.length - 1]?.crescimento ?? null;
  const tendenciaDfc = comparativoDfc[comparativoDfc.length - 1]?.crescimento ?? null;

  useEffect(() => {
    setPaginaAtual(1);
  }, [periodo, relatorios.length]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  function formatarCrescimento(valor: number | null) {
    if (valor === null) return 'N/A';
    const sinal = valor > 0 ? '+' : '';
    return `${sinal}${valor.toFixed(1)}%`;
  }

  function formatarTendenciaFinanceira() {
    const dre = `DRE ${formatarCrescimento(tendenciaDre)}`;
    const dfc = `DFC ${formatarCrescimento(tendenciaDfc)}`;
    return `${dre} | ${dfc}`;
  }

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
          <Tabs value={String(periodo)} onValueChange={(v) => setPeriodo(Number(v) as PeriodoFiltro)}>
            <TabsList>
              <TabsTrigger value="30">30 dias</TabsTrigger>
              <TabsTrigger value="60">60 dias</TabsTrigger>
              <TabsTrigger value="90">90 dias</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total</span>
              <span className={styles.statValue}>{relatoriosFiltrados.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>DRE</span>
              <span className={styles.statValue}>{relatoriosDreFiltrados.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>DFC</span>
              <span className={styles.statValue}>{relatoriosDfcFiltrados.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Tendencia Financeira</span>
              <span className={styles.statValueSmall}>{formatarTendenciaFinanceira()}</span>
            </div>
          </div>

          {(comparativoDre.length > 0 || comparativoDfc.length > 0) && (
            <section className={styles.chartSection}>
              <h2 className={styles.sectionTitle}>
                Comparativo {granularidade === 'diaria' ? 'diario' : 'mensal'} por tipo
              </h2>
              <p className={styles.sectionSubtitle}>
                {granularidade === 'diaria'
                  ? `Nos ultimos ${periodo} dias, cada ponto representa 1 dia. Azul indica valor positivo e vermelho, negativo.`
                  : 'Cada ponto representa 1 mes. Azul indica valor positivo e vermelho, negativo.'}
              </p>
              <div className={styles.chartGrid}>
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>DRE</h3>
                  <TrendComparisonChart data={comparativoDre} metricLabel="Lucro Liquido (R$)" />
                </div>
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>DFC</h3>
                  <TrendComparisonChart data={comparativoDfc} metricLabel="Variacao de Caixa (R$)" />
                </div>
              </div>
            </section>
          )}

          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Relatorios mais recentes</h2>
            <span className={styles.paginationInfo}>
              Pagina {paginaAtual} de {totalPaginas}
            </span>
          </div>

          <div className={styles.grid}>
            {relatoriosPaginados.map((relatorio) => (
              <RelatorioCard key={relatorio.id} relatorio={relatorio} />
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setPaginaAtual((anterior) => Math.max(1, anterior - 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>
            <button
              className={styles.pageButton}
              onClick={() => setPaginaAtual((anterior) => Math.min(totalPaginas, anterior + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              Proxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
