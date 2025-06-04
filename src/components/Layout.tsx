
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  MessageSquare, 
  ChartBar,
  Home,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Home, label: "Resources", path: "/resources" },
    { icon: ChartBar, label: "Analytics", path: "/analytics" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 healthcare-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CM</span>
                </div>
                <span className="font-semibold text-slate-900">ClinicManager</span>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">AI</Badge>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 h-8 w-8"
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${!isSidebarOpen && 'px-2'} ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSidebarOpen && 'mr-2'}`} />
                  {isSidebarOpen && item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          {isSidebarOpen ? (
            <Card className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-700 font-medium text-sm">DR</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">Dr. Sarah Chen</p>
                  <p className="text-xs text-slate-500">Chief Medical Officer</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2 text-slate-500 hover:text-slate-700">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Card>
          ) : (
            <Button variant="ghost" size="sm" className="w-full p-2">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
