import {
  Building2,
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  Wifi,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "finance", label: "Rent", icon: DollarSign },
  { id: "balance", label: "Balance", icon: CreditCard },
  { id: "wifi", label: "WiFi", icon: Wifi },
];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logout",
      description:
        "Logout functionality will be implemented with Supabase authentication.",
    });
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-4">
          <Building2 className="h-8 w-8 text-sidebar-primary" />
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                Jodama
              </h1>
              <p className="text-sm text-sidebar-foreground/70">
                Management System
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    isActive={currentView === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
