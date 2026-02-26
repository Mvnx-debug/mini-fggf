import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';
import api from '../../services/api';
import type { Relatorio } from '../../types';
import styles from './ReportDetails.module.css';

interface ChartDatum {
  categoria: string;
  valor: number;
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarValor(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
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
        setErro('ID do relatório não fornecido');
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
          setErro('Você não tem permissão para acessar este relatório');
          setRelatorio(null);
          return;
        }

        setRelatorio(response.data);
        setErro('');
      } catch {
        if (ativo) {
          setErro('Erro ao buscar relatório');
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

  const dadosGrafico = useMemo<ChartDatum[]>(() => {
    if (!relatorio) return [];
    return Object.entries(relatorio.valores).map(([categoria, valor]) => ({
      categoria,
      valor,
    }));
  }, [relatorio]);

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
        <div className={styles.erro}>Relatório não encontrado</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.secondaryButton} onClick={() => navigate('/dashboard')}>
          Voltar
        </button>
        <button className={styles.primaryButton} onClick={() => window.print()}>
          Exportar PDF
        </button>
      </div>

      <section className={styles.card}>
        <h1 className={styles.title}>{relatorio.titulo}</h1>
        <p className={styles.subtitle}>
          Tipo: {relatorio.tipo.toUpperCase()} | Data: {formatarData(relatorio.data)}
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Gráfico dos valores</h2>
        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip formatter={(value) => formatarValor(value as number)} />
              <Legend />
              <Bar dataKey="valor" fill="#1976d2" name="Valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
