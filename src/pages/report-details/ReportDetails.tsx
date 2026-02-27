import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChartBarDefault from '@/components/chart-bar-default';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import api from '../../services/api';
import type { Relatorio } from '../../types';
import styles from './ReportDetails.module.css';
import { ThemeToggle } from '@/components/ThemeToggle'

type ChartDatum = {
  categoria: string;
  valor: number;
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR');
}




export default function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');


  useEffect(() => {
    let ativo = true;

    async function buscarRelatorioPorId() {
      if (!id) {
        setErro('ID do relatorio nao fornecido');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        const response = await api.get<Relatorio>(`/relatorios/${id}`);
        if (!ativo) return;

        if (
          user?.tipo === 'cliente' &&
          user.empresaId &&
          response.data.empresaId !== user.empresaId
        ) {
          setErro('Voce nao tem permissao para acessar este relatorio');
          setRelatorio(null);
          return;
        }

        setRelatorio(response.data);
        setErro('');
      } catch {
        if (ativo) {
          setErro('Erro ao buscar relatorio');
          setRelatorio(null);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    buscarRelatorioPorId();
    return () => {
      ativo = false;
    };
  }, [id, user]);

  const dadosGrafico: ChartDatum[] = useMemo(() => {
    if (!relatorio) return [];

    return Object.entries(relatorio.valores).map(([categoria, valor]) => ({
      categoria,
      valor: Number(valor),
    }))
  }, [relatorio])


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
        <button className={styles.secondaryButton} onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
        <div className={styles.erro}>{erro}</div>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div className={styles.container}>
        <button className={styles.secondaryButton} onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
        <div className={styles.erro}>Relatorio nao encontrado</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.secondaryButton} onClick={() => navigate('/dashboard')}>
          Voltar
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <ThemeToggle />
          <button className={styles.primaryButton} onClick={() => window.print()}>
            Exportar PDF
          </button>
        </div>
      </div>

      <section className={styles.card}>
        <h1 className={styles.title}>{relatorio.titulo}</h1>
        <p className={styles.subtitle}>
          Tipo: {relatorio.tipo.toUpperCase()} | Data: {formatarData(relatorio.data)}
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Grafico dos valores</h2>
        <div className={styles.chartArea}>
          <ChartBarDefault data={dadosGrafico} />
        </div>
      </section>
    </div>
  );
}
