import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, Building, Cpu, Settings, Database } from 'lucide-react';

export function useAdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'admin.dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'admin.users' },
    { path: '/admin/laundries', icon: Building, label: 'admin.laundries' },
    { path: '/admin/machines', icon: Cpu, label: 'admin.machines' },
    { path: '/admin/wash-modes', icon: Settings, label: 'admin.wash_modes' },
    { path: '/admin/data', icon: Database, label: 'admin.data_mgmt' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return {
    t,
    navItems,
    isActive
  };
}
