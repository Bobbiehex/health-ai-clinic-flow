
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/chat/NotificationBell';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageCircle, 
  BarChart3, 
  Settings,
  LogOut,
  Wrench,
  Shield
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  
  // Enable real-time notifications and session management
  useRealtimeNotifications();
  useSessionManagement();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Messages', href: '/chat', icon: MessageCircle },
    { name: 'Resources', href: '/resources', icon: Wrench },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  // Add security dashboard for admin and doctor roles
  if (profile?.role === 'admin' || profile?.role === 'doctor') {
    navigation.push({ name: 'Security', href: '/security', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionTimeoutWarning />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">MedFlow</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {profile?.role}
                </span>
                <button
                  onClick={signOut}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
