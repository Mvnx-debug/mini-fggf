import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // ← Importa o CSS

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    
    const result = await login(email, senha);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErro(result.error || 'Erro ao fazer login');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>FGGF - Relatórios</h1>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="admin@fggf.com"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className={styles.input}
              placeholder="123456"
            />
          </div>
          
          {erro && <p className={styles.erro}>{erro}</p>}
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p className={styles.dica}>Use: admin@fggf.com / 123456</p>
      </div>
    </div>
  );
}