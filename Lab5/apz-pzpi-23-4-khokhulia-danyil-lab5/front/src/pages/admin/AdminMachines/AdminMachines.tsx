import { Plus, Edit, Trash2, X } from 'lucide-react';
import { MachineStatus } from '../../../types';
import Toast from '../../../components/Toast';
import { useAdminMachines } from './useAdminMachines';
import styles from './AdminMachines.module.css';

export default function AdminMachines() {
  const {
    t,
    msg, setMsg,
    isModalOpen, editingId,
    formData, setFormData,
    laundries, machines, isLoading,
    saveMutation, deleteMutation,
    openModal, closeModal, handleSubmit
  } = useAdminMachines();

  if (isLoading) return <div className="spinner" />;

  const getStatusBadge = (status: MachineStatus) => {
    if (status === MachineStatus.Idle) return <span className="badge badge-success">{t('laundry_detail.status_available')}</span>;
    if (status === MachineStatus.Busy) return <span className="badge badge-warning">{t('laundry_detail.status_busy')}</span>;
    return <span className="badge badge-danger">{t('laundry_detail.status_maintenance')}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('admin.machine_mgmt.title')}</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> {t('admin.machine_mgmt.add')}
        </button>
      </div>

      {msg && <Toast type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('common.id')}</th>
              <th>{t('admin.machine_mgmt.model')}</th>
              <th>Serial Number</th>
              <th>{t('admin.machine_mgmt.laundry')}</th>
              <th>{t('admin.machine_mgmt.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {machines?.map(machine => {
              const laundryName = laundries?.find(l => l.id === machine.laundryId)?.name || `ID: ${machine.laundryId}`;
              return (
                <tr key={machine.id}>
                  <td>{machine.id}</td>
                  <td className={styles.modelCell}>{machine.model}</td>
                  <td className="text-muted">{machine.serialNumber}</td>
                  <td>{laundryName}</td>
                  <td>{getStatusBadge(machine.status)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className="btn btn-sm btn-ghost" onClick={() => openModal(machine)}><Edit size={16} /></button>
                      <button 
                        className="btn btn-sm btn-ghost text-danger"
                        onClick={() => { if(window.confirm(t('common.confirm'))) deleteMutation.mutate(machine.id); }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!machines?.length && <tr><td colSpan={6} className="text-center py-4">{t('common.no_data')}</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? t('common.edit') : t('admin.machine_mgmt.add')}</h2>
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
                <label>{t('admin.machine_mgmt.model')}</label>
                <input 
                  type="text" className="input" 
                  value={formData.model} 
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Serial Number</label>
                <input 
                  type="text" className="input" 
                  value={formData.serialNumber} 
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label>{t('admin.machine_mgmt.status')}</label>
                <select 
                  className="input" 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: Number(e.target.value)})}
                >
                  <option value={MachineStatus.Idle}>{t('laundry_detail.status_available')} (Idle)</option>
                  <option value={MachineStatus.Busy}>{t('laundry_detail.status_busy')} (Busy)</option>
                  <option value={MachineStatus.Maintenance}>{t('laundry_detail.status_maintenance')} (Maintenance)</option>
                </select>
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
