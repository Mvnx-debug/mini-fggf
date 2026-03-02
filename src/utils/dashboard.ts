import type { Relatorio } from '../types';

export type PeriodoFiltro = 30 | 60 | 90;
export type ComparativoPeriodo = {
    label: string;
    referencia: string;
    total: number;
    quantidade: number;
    crescimento: number | null;
};


export function filtrarRelatorioPeriodo(relatorio: Relatorio[], dias: PeriodoFiltro){
    const agora = new Date();
    const inicio = new Date(agora);
    inicio.setDate(agora.getDate() - dias);

    return relatorio.filter((r) => {
        const data = new Date(r.data);
        return data >= inicio && data <= agora;
    });
}

function obterValorComparativo(relatorio: Relatorio) {
    if (relatorio.tipo === 'dre') {
        return relatorio.valores.lucroLiquido ?? 0;
    }

    if (relatorio.tipo === 'dfc') {
        return relatorio.valores.variacaoCaixa ?? 0;
    }

    const primeiroValor = Object.values(relatorio.valores)[0];
    return typeof primeiroValor === 'number' ? primeiroValor : 0;
}

function formatarMesAno(chaveMes: string) {
    const [ano, mes] = chaveMes.split('-').map(Number);
    const dataMes = new Date(Date.UTC(ano, mes - 1, 1));
    const mesAno = new Intl.DateTimeFormat('pt-BR', {
        month: 'short',
        year: '2-digit',
        timeZone: 'UTC',
    }).format(dataMes);

    return mesAno.replace('.', '').toUpperCase();
}

function formatarDiaMes(chaveDia: string) {
    const [ano, mes, dia] = chaveDia.split('-').map(Number);
    const dataDia = new Date(Date.UTC(ano, mes - 1, dia));
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        timeZone: 'UTC',
    })
        .format(dataDia)
        .replace('.', '')
        .toUpperCase();
}

export function construirComparativoMensal(
    relatorios: Relatorio[],
    limiteMeses = 6
): ComparativoPeriodo[] {
    const acumuladoPorMes: Record<string, { total: number; quantidade: number }> = {};

    relatorios.forEach((relatorio) => {
        const data = new Date(relatorio.data);
        const ano = data.getUTCFullYear();
        const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
        const chaveMes = `${ano}-${mes}`;

        if (!acumuladoPorMes[chaveMes]) {
            acumuladoPorMes[chaveMes] = { total: 0, quantidade: 0 };
        }

        acumuladoPorMes[chaveMes].total += obterValorComparativo(relatorio);
        acumuladoPorMes[chaveMes].quantidade += 1;
    });

    const mesesOrdenados = Object.keys(acumuladoPorMes).sort((a, b) => (a > b ? 1 : -1));
    const ultimosMeses = mesesOrdenados.slice(-limiteMeses);

    return ultimosMeses.map((mesReferencia, indice) => {
        const atual = acumuladoPorMes[mesReferencia];
        const anteriorReferencia = ultimosMeses[indice - 1];
        const anterior = anteriorReferencia ? acumuladoPorMes[anteriorReferencia] : null;

        let crescimento: number | null = null;
        if (anterior && anterior.total !== 0) {
            crescimento = ((atual.total - anterior.total) / Math.abs(anterior.total)) * 100;
        }

        return {
            label: formatarMesAno(mesReferencia),
            referencia: mesReferencia,
            total: atual.total,
            quantidade: atual.quantidade,
            crescimento,
        };
    });
}

export function construirComparativoDiario(
    relatorios: Relatorio[],
    dias = 30
): ComparativoPeriodo[] {
    const agora = new Date();
    const inicio = new Date(agora);
    inicio.setUTCDate(agora.getUTCDate() - (dias - 1));

    const acumuladoPorDia: Record<string, { total: number; quantidade: number }> = {};

    relatorios.forEach((relatorio) => {
        const chaveDia = new Date(relatorio.data).toISOString().slice(0, 10);
        if (!acumuladoPorDia[chaveDia]) {
            acumuladoPorDia[chaveDia] = { total: 0, quantidade: 0 };
        }

        acumuladoPorDia[chaveDia].total += obterValorComparativo(relatorio);
        acumuladoPorDia[chaveDia].quantidade += 1;
    });

    const resultado: ComparativoPeriodo[] = [];
    const cursor = new Date(Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth(), inicio.getUTCDate()));

    while (cursor <= agora) {
        const referencia = cursor.toISOString().slice(0, 10);
        const atual = acumuladoPorDia[referencia] ?? { total: 0, quantidade: 0 };
        const anterior = resultado[resultado.length - 1];

        let crescimento: number | null = null;
        if (anterior && anterior.total !== 0) {
            crescimento = ((atual.total - anterior.total) / Math.abs(anterior.total)) * 100;
        }

        resultado.push({
            label: formatarDiaMes(referencia),
            referencia,
            total: atual.total,
            quantidade: atual.quantidade,
            crescimento,
        });

        cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return resultado;
}

export function ordenarRelatoriosMaisRecentes(relatorios: Relatorio[]) {
    return [...relatorios].sort((a, b) => (a.data < b.data ? 1 : -1));
}

export function paginarRelatorios(relatorios: Relatorio[], paginaAtual: number, itensPorPagina: number) {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return relatorios.slice(inicio, fim);
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
