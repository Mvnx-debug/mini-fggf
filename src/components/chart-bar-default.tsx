import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type ChartDatum = { categoria: string; valor: number }
type ChartBarDefaultProps = { data: ChartDatum[] }

const chartConfig = {
  valor: { label: "Valor", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export default function ChartBarDefault({ data }: ChartBarDefaultProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="categoria"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={48}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(v) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(v))
              }
            />
          }
        />
        <Bar dataKey="valor" fill="var(--color-valor)" radius={6} />
      </BarChart>
    </ChartContainer>
  )
}
