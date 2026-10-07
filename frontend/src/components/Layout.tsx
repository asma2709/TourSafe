import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Siren,
  ShieldCheck,
  LifeBuoy,
  Package,
  BookOpen,
  ArrowLeftRight,
  Wallet,
  FileBarChart,
  Menu,
  X,
  Globe,
  UserCircle,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tourists', label: 'Tourists', icon: Users },
  { to: '/sos', label: 'SOS Alerts', icon: Siren },
  { to: '/safety-zones', label: 'Safety Zones', icon: ShieldCheck },
  { to: '/rescue', label: 'Rescue', icon: LifeBuoy },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/accounts', label: 'Accounts', icon: BookOpen },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
];

export function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex">

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64
        bg-gradient-to-b from-zinc-950 to-black
        border-r border-purple-900/40 flex flex-col
        transition-transform duration-300 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-purple-900/40">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-900/40">
            <Globe size={22} />
          </div>

          <div>
            <h1 className="text-sm font-bold leading-tight text-white">
              TourSafe
            </h1>
            <p className="text-xs text-purple-300/70">
              Safety & Finance
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-900/30'
                      : 'text-zinc-400 hover:bg-purple-950/50 hover:text-purple-200'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile + Logout */}
        <div className="border-t border-purple-900/40 p-3">

          <NavLink
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-purple-900/50 text-white'
                  : 'text-zinc-300 hover:bg-purple-950/50 hover:text-white'
              }`
            }
          >
            <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center">
              <UserCircle size={21} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                Administrator
              </p>

              <p className="text-xs text-zinc-500 truncate">
                admin@toursafe.com
              </p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-sm font-medium text-red-400
            hover:bg-red-950/40 hover:text-red-300 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>

          <p className="text-xs text-zinc-600 mt-3 px-1">
            College Project Demo
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">

        <header className="lg:hidden sticky top-0 z-20 bg-zinc-950 border-b border-purple-900/40 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-purple-950/50 transition-colors text-purple-200"
          >
            <Menu size={20} />
          </button>

          <span className="font-semibold text-white">
            TourSafe Dashboard
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Close */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 lg:hidden p-2
          bg-zinc-900 rounded-lg shadow-md
          border border-purple-900/40 text-purple-200"
        >
          <X size={20} />
        </button>
      )}

    </div>
  );
}