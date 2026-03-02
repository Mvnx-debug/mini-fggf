import { Bar, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartDatum = { categoria: string; valor: number }
type ChartBarDefaultProps = { data: ChartDatum[] }

const chartConfig = {
  valor: { label: "Valor (R$)", color: "hsl(var(--chart-1))" },
  participacao: { label: "Participacao (%)", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

function formatarCategoria(valor: string) {
  return valor
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (texto) => texto.toUpperCase())
}

export default function ChartBarDefault({ data }: ChartBarDefaultProps) {
  const somaAbsoluta = data.reduce((acc, item) => acc + Math.abs(item.valor), 0)
  const dataComParticipacao = data.map((item) => ({
    ...item,
    participacao: somaAbsoluta === 0 ? 0 : (Math.abs(item.valor) / somaAbsoluta) * 100,
  }))

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <ComposedChart data={dataComParticipacao} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="barPositive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.95} />
            <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <ReferenceLine yAxisId="valor" y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
        <XAxis
          dataKey="categoria"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tickFormatter={(v) => formatarCategoria(String(v))}
        />
        <YAxis
          yAxisId="valor"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={78}
          tickFormatter={(v) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(Number(v))
          }
        />
        <YAxis
          yAxisId="percentual"
          orientation="right"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={48}
          tickFormatter={(v) => `${Number(v)}%`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(v, nome) => {
                if (String(nome).includes("%") || String(nome).toLowerCase().includes("participacao")) {
                  return `${Number(v).toFixed(1)}%`
                }
                return new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(v))
              }}
            />
          }
        />
        <Bar
          yAxisId="valor"
          dataKey="valor"
          name="Valor (R$)"
          radius={6}
        >
          {dataComParticipacao.map((item) => (
            <Cell
              key={item.categoria}
              fill={item.valor < 0 ? 'hsl(var(--destructive))' : 'url(#barPositive)'}
            />
          ))}
        </Bar>
        <Line
          yAxisId="percentual"
          dataKey="participacao"
          name="Participacao (%)"
          stroke="var(--color-participacao)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </ComposedChart>
    </ChartContainer>
  )
}
