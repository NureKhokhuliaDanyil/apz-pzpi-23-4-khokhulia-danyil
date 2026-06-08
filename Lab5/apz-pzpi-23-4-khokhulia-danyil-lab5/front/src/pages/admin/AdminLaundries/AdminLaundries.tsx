import { Plus, Edit, Trash2, X } from 'lucide-react';
import Toast from '../../../components/Toast';
import { useAdminLaundries } from './useAdminLaundries';
import styles from './AdminLaundries.module.css';

export default function AdminLaundries() {
  const {
    t,
    msg, setMsg,
    isModalOpen, editingId,
    formData, setFormData,
    laundries, isLoading,
    saveMutation, deleteMutation,
    openModal, closeModal, handleSubmit
  } = useAdminLaundries();

  if (isLoading) return <div className="spinner" />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('admin.laundry_mgmt.title')}</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> {t('admin.laundry_mgmt.add')}
        </button>
      </div>

      {msg && <Toast type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('common.id')}</th>
              <th>{t('admin.laundry_mgmt.name')}</th>
              <th>{t('admin.laundry_mgmt.address')}</th>
              <th>{t('admin.laundry_mgmt.owner')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {laundries?.map(laundry => (
              <tr key={laundry.id}>
                <td>{laundry.id}</td>
                <td className={styles.nameCell}>{laundry.name}</td>
                <td>{laundry.address}</td>
                <td>ID: {laundry.ownerId}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className="btn btn-sm btn-ghost" onClick={() => openModal(laundry)}>
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-sm btn-ghost text-danger"
                      onClick={() => {
                        if (window.confirm(t('common.confirm'))) deleteMutation.mutate(laundry.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!laundries?.length && (
              <tr><td colSpan={5} className="text-center py-4">{t('common.no_data')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? t('admin.laundry_mgmt.edit') : t('admin.laundry_mgmt.add')}</h2>
              <button onClick={closeModal} className="btn btn-ghost"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              <div className="input-group">
                <label>{t('admin.laundry_mgmt.name')}</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label>{t('admin.laundry_mgmt.address')}</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Робочі години (Working Hours)</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.workingHours}
                  placeholder="08:00 - 22:00"
                  onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                  required 
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? t('common.loading') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
