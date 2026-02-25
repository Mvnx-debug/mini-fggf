import { useNavigate } from 'react-router-dom';
import type { Relatorio } from '../types/index';
import styles from './RelatorioCard.module.css';

interface RelatorioCardProps {
    relatorio: Relatorio;
}

export function RelatorioCard({
    relatorio,
}: RelatorioCardProps) {
    const navigate = useNavigate();

    function formatarData(data: string) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    function formatarValor(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    }

    //pega o primeiro valor para mostrar no resumo

    const primeiroValor = Object.values(relatorio.valores)[0] || 0;

    return (
        <div className={styles.card}
            onClick={() => navigate (`/relatorio/${relatorio.id}`)}
        >
            <h3 className={styles.titulo}>{relatorio.titulo}</h3>
            <p className={styles.data}>{formatarData(relatorio.data)}</p>
            <div className={styles.footer}>
                <span className={styles.tipo}>
                    {relatorio.tipo.toUpperCase()}
                </span>
                <span className={styles.valor}>
                    {formatarValor(primeiroValor)}
                </span>
            </div>          
        </div>
    )
}