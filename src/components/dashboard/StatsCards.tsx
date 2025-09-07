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

interface StatsCardsProps {
  totalHouses: number;
  occupiedHouses: number;
  totalEarnings: number;
  unpaidUnits: number;
}

const StatsCards = ({
  totalHouses,
  occupiedHouses,
  totalEarnings,
  unpaidUnits,
}: StatsCardsProps) => {
  const vacantHouses = totalHouses - occupiedHouses;
  const occupancyRate =
    totalHouses > 0 ? Math.round((occupiedHouses / totalHouses) * 100) : 0;

  const statsData = [
    {
      title: "Total Houses",
      value: totalHouses,
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
      description: `${occupiedHouses} of ${totalHouses} units`,
      gradient: "bg-gradient-to-br from-success to-success/80",
      textColor: "text-success-foreground",
      trend: occupancyRate > 75 ? "up" : "down",
    },
    {
      title: "Monthly Earnings",
      value: `KSh ${totalEarnings.toLocaleString()}`,
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
