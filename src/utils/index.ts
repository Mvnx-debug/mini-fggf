export function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
}

export function formatarValor(valor: number) {
    return new Intl.NumberFormat('pt-BR',
        { style: 'currency', currency: 'BRL',
    }).format(valor); 
}
