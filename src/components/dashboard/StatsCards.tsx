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

const TOTAL_HOUSES = 8;

const StatsCards = () => {
  const [occupiedHouses, setOccupiedHouses] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [unpaidUnits, setUnpaidUnits] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Occupied Houses (tenants count)
        const { count: tenantCount, error: tenantError } = await supabase
          .from("tenants")
          .select("id", { count: "exact", head: true });
        if (tenantError) throw tenantError;
        setOccupiedHouses(tenantCount || 0);

        // 2. Monthly Earnings (sum of payments in current month)
        const firstDay = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const lastDay = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );

        const { data: payments, error: paymentError } = await supabase
          .from("payments")
          .select("amount, created_at")
          .gte("created_at", firstDay.toISOString())
          .lte("created_at", lastDay.toISOString());
        if (paymentError) throw paymentError;

        const totalEarnings =
          payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        setMonthlyEarnings(totalEarnings);

        // 3. Unpaid Rent (balance > 0 from balance table)
        const { count: unpaidCount, error: balanceError } = await supabase
          .from("balance")
          .select("id", { count: "exact", head: true })
          .gt("balance", 0);
        if (balanceError) throw balanceError;
        setUnpaidUnits(unpaidCount || 0);
      } catch (err) {
        console.error("Error fetching stats:", err);
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
      description: "Current month revenue",
      gradient: "bg-gradient-to-br from-chart-2 to-warning",
      textColor: "text-warning-foreground",
      trend: "up",
    },
    {
      title: "Unpaid Rent",
      value: unpaidUnits,
      icon: AlertCircle,
      description: "Units with arrears",
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
