import { Outlet, Link } from 'react-router-dom';
import { useAdminLayout } from './useAdminLayout';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { t, navItems, isActive } = useAdminLayout();

  return (
    <div className={`${styles.adminLayout} animate-fade-in`}>
      <aside className={styles.adminSidebar}>
        <h3 className={`px-6 mb-4 text-muted ${styles.adminSidebarTitle}`}>
          {t('admin.title')}
        </h3>
        <nav className="flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.adminSidebarLink} ${isActive(item.path, item.exact) ? styles.active : ''}`}
              >
                <Icon size={18} />
                <span>{t(item.label)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      
      <main className={styles.adminContent}>
        <Outlet />
      </main>
    </div>
  );
}
