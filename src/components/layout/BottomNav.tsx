import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/utils/constants';
import {
    Users,
    LayoutDashboard,
    User,
} from 'lucide-react';

const navItems = [
    { path: ROUTES.STAFF, icon: Users, label: 'Staff' },
    { path: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'History' },
    { path: ROUTES.PROFILE, icon: User, label: 'Profile' },
];

export function BottomNav() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border xl:hidden">
            <ul className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <li key={item.path} className="flex-1">
                            <Link
                                to={item.path}
                                className={`relative flex flex-col items-center justify-center gap-1 py-3 px-4 transition-colors duration-200 ${isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeBottomNav"
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-foreground rounded-b-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
