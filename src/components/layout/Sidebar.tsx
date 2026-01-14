import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
} from 'lucide-react';

const navItems = [
  { path: ROUTES.STAFF, label: 'Staff', icon: Users },
  { path: ROUTES.DASHBOARD, label: 'History', icon: LayoutDashboard },
  { path: ROUTES.PROFILE, label: 'Profile', icon: User },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { staff, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex-col hidden xl:flex">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to={ROUTES.STAFF}>
          <Logo size="md" showText={true} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-foreground rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {staff && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-foreground">
                {getInitials(staff.firstName, staff.lastName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {staff.firstName} {staff.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {staff.department}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
