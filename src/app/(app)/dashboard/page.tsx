import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with actual data fetching
  const summaryData = [
    { title: "Total Balance", value: "$10,250.75", icon: Wallet, color: "text-primary" },
    { title: "Monthly Income", value: "$3,500.00", icon: TrendingUp, color: "text-green-500" },
    { title: "Monthly Expenses", value: "$1,800.50", icon: TrendingDown, color: "text-red-500" },
    { title: "Savings Rate", value: "48.5%", icon: DollarSign, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
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
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest income and expense activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">Transaction list coming soon...</p>
            {/* Placeholder for recent transactions list */}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>Visual breakdown of your expenses.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground italic">Spending chart coming soon...</p>
            {/* Placeholder for spending chart */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
