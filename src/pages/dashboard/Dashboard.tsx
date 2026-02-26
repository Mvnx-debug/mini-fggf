import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RelatorioCard } from '../../components/RelatorioCard';
import { Loading } from '../../components/Loading';
import api from '../../services/api';
import type { Relatorio } from '../../types';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  console.log('🔥 COMPONENTE RENDERIZOU');
  
  const { user, logout } = useAuth();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // LOG DO USUÁRIO
  console.log('👤 User:', user);

  useEffect(() => {
    console.log('🎯 useEffect RODOU!');
    console.log('📦 User dentro do useEffect:', user);

    let ativo = true; // Flag para evitar atualizar se desmontar

    async function buscarRelatorios() {
      console.log('🔍 FUNÇÃO buscarRelatorios EXECUTOU');
      
      if (!user) {
        console.log('❌ user é null, não vou buscar');
        setCarregando(false);
        return;
      }

      try {
        console.log('⏳ setCarregando(true)');
        setCarregando(true);
        
        let url = '/relatorios';
        console.log('📌 user.tipo:', user.tipo);
        
        if (user.tipo === 'cliente' && user.empresaId) {
          url = `/relatorios?empresaId=${user.empresaId}`;
          console.log('🔗 URL cliente:', url);
        } else if (user.tipo === 'admin') {
          console.log('🔗 URL admin:', url);
        }
        
        console.log('🚀 Fazendo requisição para:', url);
        const response = await api.get(url);
        console.log('✅ Resposta recebida:', response.data);
        
        if (ativo) {
          console.log('📊 Setando relatórios com:', response.data.length, 'itens');
          setRelatorios(response.data);
          setErro('');
        }
      } catch (error) {
        console.error('❌ Erro na requisição:', error);
        if (ativo) {
          setErro('Não foi possível carregar os relatórios');
        }
      } finally {
        if (ativo) {
          console.log('🏁 setCarregando(false)');
          setCarregando(false);
        }
      }
    }

    buscarRelatorios();

    return () => {
      console.log('🧹 LIMPEZA: desmontando componente');
      ativo = false;
    };
  }, [user]); // ← Dependência

  console.log('📋 Estado atual - carregando:', carregando, 'relatorios:', relatorios.length, 'erro:', erro);

  if (carregando) {
    console.log('⏳ Renderizando LOADING');
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  if (erro) {
    console.log('❌ Renderizando ERRO:', erro);
    return (
      <div className={styles.container}>
        <div className={styles.erro}>{erro}</div>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  console.log('✅ Renderizando DASHBOARD com', relatorios.length, 'relatórios');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Olá, {user?.nome}!</h1>
          <p className={styles.subtitle}>
            {user?.tipo === 'admin' 
              ? 'Gerencie todos os relatórios' 
              : 'Seus relatórios financeiros'}
          </p>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Sair
        </button>
      </header>

      {relatorios.length === 0 ? (
        <div className={styles.vazio}>
          <p>Nenhum relatório encontrado</p>
          <p>Usuário: {user?.email} | Tipo: {user?.tipo} | EmpresaId: {user?.empresaId}</p>
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
              <span className={styles.statValue}>
                {relatorios.filter(r => r.tipo === 'dre').length}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>DFC</span>
              <span className={styles.statValue}>
                {relatorios.filter(r => r.tipo === 'dfc').length}
              </span>
            </div>
          </div>

          <div className={styles.grid}>
            {relatorios.map(relatorio => (
              <RelatorioCard key={relatorio.id} relatorio={relatorio} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}