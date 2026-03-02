export interface Relatorio {
    id: number;
    empresaId: number;
    titulo: string;
    tipo: 'dre' | 'dfc';
    data: string;
    periodoReferencia?: string;
    status?: string;
    versao?: number;
    insights?: string;
    valores: Record<string, number>;
}

export interface Empresa {
    id: number;
    nome: string;
    ativo: boolean;
}
