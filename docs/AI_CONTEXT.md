# AI CONTEXT - MINI FGGF

## Projeto
Mini FGGF - Sistema de Relatorios Gerenciais Automatizados

## Objetivo
Criar uma plataforma web para geracao e visualizacao de relatorios financeiros (DRE, DFC e futuros relatorios), com autenticacao, controle de perfil e exportacao PDF.

## Regras de colaboracao
- Atuar como mentor durante o desenvolvimento
- Explicar conceitos e o motivo das decisoes tecnicas de forma simples
- Priorizar aprendizado junto com entrega

---

## Stack tecnologica

### Frontend (atual)
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Recharts
- Context API (AuthContext e ThemeContext)
- Componentes UI com base em shadcn (chart/card)
- JSON Server (db.json) como backend mock

### Backend (planejado)
- Node.js + NestJS
- MongoDB (Atlas)
- JWT para autenticacao
- Arquitetura modular

### Infraestrutura (planejada)
- AWS Serverless
- S3 para PDFs
- SES para e-mails
- API Gateway + Lambda

---

## Perfis do sistema

### ADMIN
- Gerencia clientes
- Gerencia usuarios
- Pode inserir insights
- Pode gerar relatorios

### CLIENT
- Visualiza relatorios da propria empresa
- Baixa/exporta PDFs
- Visualiza dashboards

---

## Conceito de relatorio (modelo atual)
Cada relatorio contem, no minimo:
- id
- titulo
- tipo (DRE | DFC)
- data
- empresaId
- valores (chave/valor numerico para visualizacao)

---

## Status atual do projeto (frontend)
- Login funcionando
- AuthContext implementado
- Rotas privadas funcionando
- Dashboard listando relatorios
- Estatisticas (total, DRE, DFC)
- Loading implementado
- Pagina de detalhes `/relatorio/:id` protegida
- Busca de relatorio por ID via API
- Validacao de permissao por `empresaId` no detalhe
- Grafico de barras renderizado com dados de `valores`
- Botao de exportacao PDF (via `window.print()`)
- Tema claro/escuro com `ThemeToggle`
- Estrutura de componentes reorganizada e reaproveitavel

---

## Em desenvolvimento
- Melhorar experiencia visual dos graficos por tipo de relatorio (DRE/DFC)
- Evoluir exportacao de PDF para arquivo gerado (nao apenas print)
- Adicionar testes automatizados (unitarios/integracao)
- Consolidar padroes de componentes reutilizaveis

---

## Proximo objetivo
Fortalecer a tela de detalhes e qualidade de entrega:
- Refinar visualizacao de dados financeiros (cards + grafico)
- Preparar suporte a insights textuais por relatorio
- Definir estrategia de exportacao PDF real
- Cobrir fluxos criticos com testes

---

## Plano definido para amanha (Dashboard v2 com shadcn)

### Objetivo da tela
- Transformar o dashboard em visao executiva:
- Topo com comparativo de periodo e tendencia
- Base com lista de relatorios agrupada por dia

### Decisoes de produto
- Usar filtro de periodo com presets: `30d`, `60d`, `90d`
- Usar granularidade de visualizacao:
- `Diario` para periodos curtos
- `Mensal` para visao mais agregada
- Comparar periodo atual vs periodo anterior (delta percentual)
- Manter filtro por empresa para usuario cliente (via `empresaId`)

### Estrutura visual acordada
- Bloco 1: Header com titulo + controles de filtro
- Bloco 2: Cards KPI (Total, DRE, DFC, variacao vs periodo anterior)
- Bloco 3: Grafico principal no topo do dashboard
- Bloco 4: Lista/timeline de relatorios agrupados por dia

### Componentes shadcn planejados
- `Tabs` para preset de periodo
- `Select` (ou Tabs) para granularidade
- `Card` para KPIs e container do grafico
- `Badge` para status/variacao
- `Accordion` ou `Table` para lista por dia
- `Skeleton` para loading states

### Base tecnica ja iniciada
- `src/utils/dashboard.ts` com:
- filtro por periodo (30/60/90 dias)
- agrupamento de relatorios por dia
- `src/pages/dashboard/Dashboard.tsx` ja usando estado de periodo e dados derivados
- `db.json` enriquecido com dados realistas para suportar visoes por periodo e comparativos

### Ordem de implementacao (amanha)
1. Consolidar KPIs usando `relatoriosFiltrados`
2. Construir dataset do grafico (periodo/granularidade)
3. Renderizar grafico principal no topo
4. Renderizar lista agrupada por dia na parte inferior
5. Refinar estados (vazio, loading, erro) e acabamento visual

---

## Estrutura atual do frontend
```text
src/
  components/
    ui/
  context/
  pages/
    Login/
    dashboard/
    report-details/
  services/
  types/
  utils/
  App.tsx
  main.tsx
```

---

## Regras arquiteturais
1. Nunca usar `any`
2. Nunca chamar axios direto no componente
3. Sempre tipar resposta da API
4. Separar UI de logica de dados
5. Componentes devem ser reutilizaveis
6. Sempre pensar em escalabilidade (25-30 relatorios no futuro)

---

## Visao de produto
Este projeto nao e apenas academico.  
E um MVP comercial de sistema financeiro real.

Deve seguir:
- Organizacao profissional
- Codigo limpo
- Tipagem forte
- Componentizacao
- Estrutura escalavel
