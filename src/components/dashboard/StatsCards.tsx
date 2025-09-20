import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Home,
  Users,
  DollarSign,
  AlertCircle,
} from "lucide-react";

const TOTAL_HOUSES = 8; // change to dynamic if you want to derive from tenants

const StatsCards = () => {
  const [occupiedHouses, setOccupiedHouses] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [unpaidUnits, setUnpaidUnits] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1) Occupied Houses: count tenants
        const { count: tenantCount, error: tenantError } = await supabase
          .from("tenants")
          .select("id", { count: "exact", head: true });
        if (tenantError) throw tenantError;
        setOccupiedHouses(tenantCount || 0);

        // Build current-month date bounds (YYYY-MM-DD)
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const firstDayStr = firstDay.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const lastDayStr = lastDay.toISOString().slice(0, 10);

        // 2) Monthly Earnings: sum of amount_paid for payments in current month
        const { data: paymentsThisMonth, error: paymentsError } = await supabase
          .from("payments")
          .select("amount_paid")
          .gte("month", firstDayStr)
          .lte("month", lastDayStr);

        if (paymentsError) throw paymentsError;

        // Postgres numeric is usually returned as string; parseFloat safely
        const totalEarnings =
          paymentsThisMonth?.reduce(
            (sum: number, p: any) =>
              sum + (p?.amount_paid ? parseFloat(p.amount_paid) : 0),
            0
          ) || 0;
        setMonthlyEarnings(totalEarnings);

        // 3) Unpaid Rent: count of payments for current month where balance > 0
        const { count: unpaidCount, error: unpaidError } = await supabase
          .from("payments")
          .select("id", { count: "exact", head: true })
          .gte("month", firstDayStr)
          .lte("month", lastDayStr)
          .gt("balance", 0);

        if (unpaidError) throw unpaidError;
        setUnpaidUnits(unpaidCount || 0);
      } catch (err: any) {
        console.error("Error fetching stats:", err.message ?? err);
      }
    };

    fetchStats();
  }, []);

  const vacantHouses = TOTAL_HOUSES - occupiedHouses;
  const occupancyRate =
    TOTAL_HOUSES > 0 ? Math.round((occupiedHouses / TOTAL_HOUSES) * 100) : 0;

  const statsData = [
    {
      title: "Total Houses",
      value: TOTAL_HOUSES,
      icon: Home,
      description: `${occupiedHouses} occupied, ${vacantHouses} vacant`,
      gradient: "bg-gradient-primary",
      textColor: "text-primary-foreground",
      trend: null,
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      icon: Users,
      description: `${occupiedHouses} of ${TOTAL_HOUSES} units`,
      gradient: "bg-gradient-to-br from-success to-success/80",
      textColor: "text-success-foreground",
      trend: occupancyRate > 75 ? "up" : "down",
    },
    {
      title: "Monthly Earnings",
      value: `KSh ${monthlyEarnings.toLocaleString()}`,
      icon: DollarSign,
      description: "Total amount paid this month",
      gradient: "bg-gradient-to-br from-chart-2 to-warning",
      textColor: "text-warning-foreground",
      trend: monthlyEarnings > 0 ? "up" : null,
    },
    {
      title: "Unpaid Rent",
      value: unpaidUnits,
      icon: AlertCircle,
      description: "Clients with outstanding balance (current month)",
      gradient:
        unpaidUnits > 0
          ? "bg-gradient-to-br from-destructive to-destructive/80"
          : "bg-gradient-to-br from-muted to-muted/80",
      textColor:
        unpaidUnits > 0
          ? "text-destructive-foreground"
          : "text-muted-foreground",
      trend: unpaidUnits > 0 ? "down" : null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {statsData.map((stat, index) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-card animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground/70">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.gradient} shadow-glow`}>
              <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </div>
              {stat.trend && (
                <Badge
                  variant={stat.trend === "up" ? "default" : "destructive"}
                  className="px-1"
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
