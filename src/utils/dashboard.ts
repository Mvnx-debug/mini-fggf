import type { Relatorio } from '../types';

export type PeriodoFiltro = 30 | 60 | 90;


export function filtrarRelatorioPeriodo(relatorio: Relatorio[], dias: PeriodoFiltro){
    const agora = new Date();
    const inicio = new Date(agora);
    inicio.setDate(agora.getDate() - dias);

    return relatorio.filter((r) => {
        const data = new Date(r.data);
        return data >= inicio && data <= agora;
    });
}

export function agruparPorDia(relatorio: Relatorio[]) {
    const grupos: Record<string, Relatorio[]> = {};

    relatorio.forEach((r) => {
        const chave = new Date(r.data).toISOString().slice(0, 10); // Formato YYYY-MM-DD
        if (!grupos[chave]) grupos[chave] = [];
        grupos[chave].push(r);
    });
    return Object.entries(grupos)
        .sort((a, b) => (a[0] > b[0] ? 1 : -1)) // Ordena por data
        .map(([dia, itens ]) => ({
            dia,
            itens: itens.sort((a, b) => (a.data < b.data ? 1 : -1 )),
        }));
}
