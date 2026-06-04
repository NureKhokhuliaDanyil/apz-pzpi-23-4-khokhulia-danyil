import { Plus, Edit, Trash2, X } from 'lucide-react';
import Toast from '../../../components/Toast';
import { useAdminWashModes } from './useAdminWashModes';
import styles from './AdminWashModes.module.css';

export default function AdminWashModes() {
  const {
    t,
    msg, setMsg,
    isModalOpen, editingId,
    formData, setFormData,
    laundries, modes, isLoading,
    saveMutation, deleteMutation,
    openModal, closeModal, handleSubmit
  } = useAdminWashModes();

  if (isLoading) return <div className="spinner" />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('admin.mode_mgmt.title')}</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> {t('admin.mode_mgmt.add')}
        </button>
      </div>

      {msg && <Toast type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('common.id')}</th>
              <th>{t('admin.mode_mgmt.name')}</th>
              <th>{t('laundry_detail.duration')}</th>
              <th>{t('laundry_detail.temperature')}</th>
              <th>{t('admin.mode_mgmt.price')}</th>
              <th>{t('admin.machine_mgmt.laundry')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {modes?.map(mode => {
              const laundryName = laundries?.find(l => l.id === mode.laundryId)?.name || `ID: ${mode.laundryId}`;
              return (
                <tr key={mode.id}>
                  <td>{mode.id}</td>
                  <td className={styles.modeName}>{mode.name}</td>
                  <td>{mode.durationMinutes} {t('laundry_detail.duration_unit')}</td>
                  <td>{mode.temperature} °C</td>
                  <td className={styles.modePrice}>{mode.price.toFixed(2)} ₴</td>
                  <td className="text-muted">{laundryName}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className="btn btn-sm btn-ghost" onClick={() => openModal(mode)}><Edit size={16} /></button>
                      <button 
                        className="btn btn-sm btn-ghost text-danger"
                        onClick={() => { if(window.confirm(t('common.confirm'))) deleteMutation.mutate(mode.id); }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!modes?.length && <tr><td colSpan={7} className="text-center py-4">{t('common.no_data')}</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? t('common.edit') : t('admin.mode_mgmt.add')}</h2>
              <button onClick={closeModal} className="btn btn-ghost"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              <div className="input-group">
                <label>{t('admin.machine_mgmt.laundry')}</label>
                <select 
                  className="input" 
                  value={formData.laundryId} 
                  onChange={(e) => setFormData({...formData, laundryId: Number(e.target.value)})}
                  required
                >
                  <option value={0} disabled>Select Laundry...</option>
                  {laundries?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>{t('admin.mode_mgmt.name')}</label>
                <input 
                  type="text" className="input" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <label>{t('admin.mode_mgmt.duration')}</label>
                  <input 
                    type="number" className="input" 
                    value={formData.durationMinutes} 
                    onChange={(e) => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>{t('admin.mode_mgmt.temperature')}</label>
                  <input 
                    type="number" className="input" 
                    value={formData.temperature} 
                    onChange={(e) => setFormData({...formData, temperature: Number(e.target.value)})}
                    required 
                  />
                </div>
              </div>
              <div className="input-group">
                <label>{t('admin.mode_mgmt.price')}</label>
                <input 
                  type="number" step="0.01" className="input" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required 
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={saveMutation.isPending}>{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
