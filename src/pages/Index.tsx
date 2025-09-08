import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import StatsCards from "@/components/dashboard/StatsCards";
import TenantsTable from "@/components/tenants/TenantsTable.tsx";
import { FinanceTable } from "@/components/finance/FinanceTable";
import { BalanceTable } from "@/components/balance/BalanceTable";
import { WifiTable } from "@/components/wifi/WifiTable";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const { toast } = useToast();

  const handleAddTenant = () => {
    toast({
      title: "Add Tenant",
      description:
        "This feature will be implemented with Supabase integration.",
    });
  };

  const handleEditTenant = (tenant: any) => {
    toast({
      title: "Edit Tenant",
      description: `Editing ${tenant.name} - Feature coming with Supabase integration.`,
    });
  };

  const handleDeleteTenant = (tenant: any) => {
    toast({
      title: "Delete Tenant",
      description: `This will remove ${tenant.name} from the system.`,
      variant: "destructive",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generate Report",
      description:
        "PDF report generation will be implemented with Supabase backend.",
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent">
                  Dashboard Overview
                </h2>
                <p className="text-muted-foreground mt-2">
                  Welcome to Jodama Management System
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="px-3 py-1 bg-accent/50 rounded-full">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            <StatsCards />
          </div>
        );

      case "tenants":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Tenant Management
            </h2>
            <TenantsTable />
          </div>
        );

      case "finance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Finance & Rent Management
            </h2>
            <FinanceTable />
          </div>
        );

      case "balance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Balance & Arrears
            </h2>
            <BalanceTable />
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              WiFi Management
            </h2>
            <WifiTable />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />

        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger */}
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center px-6 shadow-card">
            <SidebarTrigger className="mr-4 hover:bg-accent/50 transition-colors" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground bg-gradient-primary bg-clip-text text-transparent">
                {currentView === "dashboard" && "Dashboard Overview"}
                {currentView === "tenants" && "Tenant Management"}
                {currentView === "finance" && "Finance & Rent Management"}
                {currentView === "balance" && "Balance & Arrears"}
              </h1>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 animate-fade-in">
            <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
