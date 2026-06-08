import { Search, Ban, Trash2 } from 'lucide-react';
import { UserRole } from '../../../types';
import Toast from '../../../components/Toast';
import { useAdminUsers } from './useAdminUsers';
import styles from './AdminUsers.module.css';

export default function AdminUsers() {
  const {
    t,
    search, setSearch,
    roleFilter, setRoleFilter,
    msg, setMsg,
    isLoading, filtered,
    blockMutation, deleteMutation
  } = useAdminUsers();

  if (isLoading) return <div className="spinner" />;

  return (
    <div className="animate-fade-in">
      <h1 className="page-title mb-6">{t('admin.user_mgmt.title')}</h1>

      {msg && <Toast type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="card mb-6 flex items-center justify-between gap-4">
        <div className="input-group flex-1">
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              className={`input w-full ${styles.searchInput}`}
              placeholder={t('admin.user_mgmt.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} className={`text-muted ${styles.searchIcon}`} />
          </div>
        </div>
        
        <div className={`input-group ${styles.filterSelect}`}>
          <select className="input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">{t('admin.user_mgmt.all_roles')}</option>
            <option value={UserRole.Client.toString()}>{t('roles.Client')}</option>
            <option value={UserRole.Admin.toString()}>{t('roles.Admin')}</option>
            <option value={UserRole.Technician.toString()}>{t('roles.Technician')}</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('common.id')}</th>
              <th>{t('profile.name')}</th>
              <th>{t('profile.email')}</th>
              <th>{t('profile.role')}</th>
              <th>{t('profile.balance')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === UserRole.Admin ? 'badge-primary' : user.role === UserRole.Technician ? 'badge-warning' : 'badge-success'}`}>
                    {t(`roles.${user.role}`)}
                  </span>
                </td>
                <td>{user.balance.toFixed(2)} ₴</td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-ghost" 
                      title={t('admin.user_mgmt.block')}
                      onClick={() => blockMutation.mutate(user.id)}
                    >
                      <Ban size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost text-danger" 
                      title={t('common.delete')}
                      onClick={() => {
                        if (window.confirm(t('admin.user_mgmt.confirm_delete'))) {
                          deleteMutation.mutate(user.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered?.length && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">{t('common.no_data')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
