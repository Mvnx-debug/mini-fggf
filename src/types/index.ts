export interface Relatorio {
    id: number;
    empresaId: number;
    titulo: string;
    tipo: 'dre' | 'dfc';
    data: string;
    valores: Record<string, number>;
}

export interface Empresa {
    id: number;
    nome: string;
    ativo: boolean;
}