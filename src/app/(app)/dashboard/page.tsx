import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with actual data fetching
  const summaryData = [
    { title: "Total Saldo", value: "Rp10.250.750", icon: Wallet, color: "text-primary" }, // Assuming IDR currency
    { title: "Pendapatan Bulanan", value: "Rp3.500.000", icon: TrendingUp, color: "text-green-500" },
    { title: "Pengeluaran Bulanan", value: "Rp1.800.500", icon: TrendingDown, color: "text-red-500" },
    { title: "Tingkat Tabungan", value: "48,5%", icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dasbor</h1>
          <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan keuangan Anda.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item) => (
          <Card key={item.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Transaksi Terkini</CardTitle>
            <CardDescription>Aktivitas pendapatan dan pengeluaran terbaru Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">Daftar transaksi akan segera hadir...</p>
            {/* Placeholder for recent transactions list */}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ringkasan Pengeluaran</CardTitle>
            <CardDescription>Rincian visual pengeluaran Anda.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground italic">Grafik pengeluaran akan segera hadir...</p>
            {/* Placeholder for spending chart */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
