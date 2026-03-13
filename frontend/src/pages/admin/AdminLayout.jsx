import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Mail, 
  Rocket,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' },
  { path: '/admin/team', icon: Users, label: 'Team' },
  { path: '/admin/insights', icon: FileText, label: 'Insights' },
  { path: '/admin/contacts', icon: Mail, label: 'Contacts' },
  { path: '/admin/pitches', icon: Rocket, label: 'Pitches' },
  { path: '/admin/newsletter', icon: Newspaper, label: 'Newsletter' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { isAuthenticated, loading, logout, adminEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex" data-testid="admin-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-zinc-900/50 border-r border-zinc-800
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800">
            <Link to="/admin" className="flex items-center gap-3">
              <span className="font-['Manrope'] text-xl font-bold text-white">IKTHEES</span>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path, item.exact) 
                    ? 'bg-white text-black' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}
                `}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {adminEmail?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{adminEmail}</p>
                <p className="text-xs text-zinc-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
              data-testid="logout-btn"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-zinc-900/30 border-b border-zinc-800 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <a 
            href="/" 
            target="_blank" 
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            View Website →
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
