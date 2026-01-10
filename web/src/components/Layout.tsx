import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Route,
  Settings,
  LogOut,
  Home,
  Wrench,
  BarChart3,
  User,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Tableau de bord", icon: Home },
    { path: "/admin/trucks", label: "Camions", icon: Truck },
    { path: "/admin/trips", label: "Trajets", icon: Route },
    { path: "/admin/reports", label: "Rapports", icon: BarChart3 },
    { path: "/admin/maintenance", label: "Maintenance", icon: Wrench },
    { path: "/admin/settings", label: "Paramètres", icon: Settings },
  ];

  const driverNavItems = [
    { path: "/driver/trips", label: "Mes Trajets", icon: Route },
    { path: "/driver/profile", label: "Profil", icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : driverNavItems;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">FDC</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestion de Flotte
            </p>
          </div>
          <nav className="px-4 space-y-2 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3 px-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

