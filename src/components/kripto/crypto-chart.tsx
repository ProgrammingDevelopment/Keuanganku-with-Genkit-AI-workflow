
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { ChartConfig } from "@/components/ui/chart" // Menggunakan tipe ChartConfig yang sudah ada
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormattedArkhamChartDataPoint } from '@/services/arkham-service'; // Impor tipe yang diformat

interface CryptoChartProps {
  data: FormattedArkhamChartDataPoint[];
  cryptoName: string;
}

const chartConfig = {
  price: {
    label: "Harga (Rp)", // Label harga dalam Rupiah
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function CryptoChart({ data, cryptoName }: CryptoChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle>Grafik Harga untuk {cryptoName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Data grafik tidak tersedia.</p>
        </CardContent>
      </Card>
    )
  }

  // Fungsi untuk memformat angka ke format mata uang Rupiah
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };


  return (
    <Card className="mt-6 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-card-foreground/5">
        <CardTitle>Grafik Harga Historis untuk {cryptoName}</CardTitle>
        <CardDescription>Menampilkan tren harga selama periode terakhir (data tiruan/API).</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)} // Format tick Y-axis
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [formatCurrency(value), "Harga"]} // Format tooltip
            />
            <Legend 
              formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
              wrapperStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={chartConfig.price.color}
              strokeWidth={2}
              dot={{ r: 3, fill: chartConfig.price.color, strokeWidth: 1, stroke: "hsl(var(--background))" }}
              activeDot={{ r: 6, fill: chartConfig.price.color, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
