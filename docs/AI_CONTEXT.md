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
- Componentes UI com base em shadcn (chart/card/tabs)
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
- campos opcionais ja suportados no tipo: periodoReferencia, status, versao, insights

---

## Status atual do projeto (frontend)
- Login funcionando
- AuthContext implementado
- Rotas privadas funcionando
- Layout autenticado com sidebar fixa a esquerda (`AppSidebar`)
- Rotas privadas atuais:
- `/dashboard`
- `/relatorios`
- `/relatorio/:id`
- Dashboard com filtros de periodo (30/60/90 dias)
- Granularidade automatica:
- `30 dias` = comparativo diario
- `60/90 dias` = comparativo mensal
- Comparativo separado por tipo:
- Grafico DRE (lucro liquido)
- Grafico DFC (variacao de caixa)
- KPI renomeado para `Tendencia Financeira` (DRE e DFC)
- Paginacao de relatorios do mais novo para o mais antigo
- Pagina `/relatorios` dedicada com listagem e paginacao
- Pagina de detalhe `/relatorio/:id` protegida e validada por `empresaId`
- Graficos modernizados com legenda e tooltip consistente
- Valores negativos destacados em vermelho nos graficos
- Exportacao PDF via `window.print()`
- Tema claro/escuro com `ThemeToggle`

---

## Em desenvolvimento
- Refinar responsividade do sidebar em mobile (modo recolhido)
- Evoluir exportacao de PDF para arquivo real
- Adicionar busca/filtro por tipo na pagina `/relatorios`
- Adicionar testes automatizados (unitarios/integracao)

---

## Proximos objetivos
1. Sidebar v2 com colapso e navegacao secundaria
2. Filtros avancados na pagina de relatorios (tipo, periodo, busca por titulo)
3. Melhorias de acessibilidade (contraste, labels, navegacao por teclado)
4. Estrategia de testes para fluxos criticos

---

## Estrutura atual do frontend
```text
src/
  components/
    ui/
    AppSidebar.tsx
  context/
  pages/
    Login/
    dashboard/
    report-details/
    reports/
  services/
  types/
  utils/
  App.tsx
  App.css
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
