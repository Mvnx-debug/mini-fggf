import {
  Bar,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ComparativoPeriodo } from '@/utils/dashboard';

type TrendComparisonChartProps = {
  data: ComparativoPeriodo[];
  metricLabel?: string;
};

const chartConfig = {
  total: { label: 'Total', color: 'hsl(var(--chart-1))' },
  crescimento: { label: 'Crescimento (%)', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valor);
}

function formatarPercentual(valor: number) {
  return `${valor.toFixed(1)}%`;
}

export function TrendComparisonChart({ data, metricLabel = 'Total (R$)' }: TrendComparisonChartProps) {
  if (data.length === 0) return null;

  return (
    <ChartContainer config={chartConfig} className="h-[340px] w-full">
      <ComposedChart data={data} margin={{ top: 12, right: 14, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="4 4" />
        <ReferenceLine yAxisId="percentual" y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />

        <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={10} minTickGap={20} />
        <YAxis
          yAxisId="valor"
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatarMoeda(Number(v))}
          width={84}
        />
        <YAxis
          yAxisId="percentual"
          orientation="right"
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${Number(v)}%`}
          width={48}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(valor, nome) => {
                if (String(nome).includes('(%)')) return formatarPercentual(Number(valor));
                return formatarMoeda(Number(valor));
              }}
            />
          }
        />

        <Bar
          yAxisId="valor"
          dataKey="total"
          name={metricLabel}
          radius={6}
        >
          {data.map((item) => (
            <Cell
              key={item.referencia}
              fill={item.total < 0 ? 'hsl(var(--destructive))' : 'var(--color-total)'}
            />
          ))}
        </Bar>

        <Line
          yAxisId="percentual"
          type="monotone"
          dataKey="crescimento"
          name="Crescimento (%)"
          stroke="var(--color-crescimento)"
          strokeWidth={2.5}
          dot={{ r: 2.5 }}
          activeDot={{ r: 5 }}
          connectNulls
        />
        <ChartLegend content={<ChartLegendContent />} />
      </ComposedChart>
    </ChartContainer>
  );
}
