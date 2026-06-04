import { Users, Activity, DollarSign, Cpu } from 'lucide-react';
import { useAdminDashboard } from './useAdminDashboard';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const {
    t,
    stats, isLoadingStats,
    revenue, isLoadingRev
  } = useAdminDashboard();

  if (isLoadingStats || isLoadingRev) return <div className="spinner" />;

  return (
    <div className="animate-fade-in">
      <h1 className="page-title mb-6">{t('admin.dashboard')}</h1>

      <h2 className="mb-4">{t('admin.stats.total_users')} & {t('admin.stats.active_sessions')}</h2>
      <div className="grid-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon primary"><Users /></div>
          <div>
            <div className="stat-label">{t('admin.stats.total_users')}</div>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon accent"><Activity /></div>
          <div>
            <div className="stat-label">{t('admin.stats.active_sessions')}</div>
            <div className="stat-value">{stats?.activeSessions || 0}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success"><DollarSign /></div>
          <div>
            <div className="stat-label">{t('admin.stats.revenue_total')}</div>
            <div className="stat-value">{stats?.totalRevenue?.toFixed(2) || '0.00'} ₴</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning"><Cpu /></div>
          <div>
            <div className="stat-label">{t('admin.stats.total_machines')}</div>
            <div className="stat-value">
              {((stats?.idleMachines||0) + (stats?.busyMachines||0) + (stats?.maintenanceMachines||0))}
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4">Фінансова Статистика</h2>
      <div className="grid-3">
        <div className={`card ${styles.revenueCard}`}>
          <div className={styles.revenueLabel}>{t('admin.stats.revenue_daily')}</div>
          <div className={`${styles.revenueValue} ${styles.textSuccess}`}>{revenue?.todayRevenue?.toFixed(2) || '0.00'} ₴</div>
        </div>
        <div className={`card ${styles.revenueCard}`}>
          <div className={styles.revenueLabel}>{t('admin.stats.revenue_monthly')}</div>
          <div className={`${styles.revenueValue} ${styles.textPrimary}`}>{revenue?.monthRevenue?.toFixed(2) || '0.00'} ₴</div>
        </div>
        <div className={`card ${styles.revenueCard}`}>
          <div className={styles.revenueLabel}>{t('admin.stats.revenue_total')}</div>
          <div className={styles.revenueValue}>{revenue?.totalRevenue?.toFixed(2) || '0.00'} ₴</div>
        </div>
      </div>
    </div>
  );
}
