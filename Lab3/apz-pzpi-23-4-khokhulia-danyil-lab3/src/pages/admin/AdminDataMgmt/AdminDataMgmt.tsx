import { Download, Upload, Archive } from 'lucide-react';
import Toast from '../../../components/Toast';
import { useAdminDataMgmt } from './useAdminDataMgmt';
import styles from './AdminDataMgmt.module.css';

export default function AdminDataMgmt() {
  const {
    t, msg, setMsg,
    isExporting,
    handleExport, handleImport
  } = useAdminDataMgmt();

  return (
    <div className="animate-fade-in">
      <h1 className="page-title mb-6">{t('admin.data.title')}</h1>

      {msg && <Toast type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="grid-3">
        <div className={`card ${styles.dataCard}`}>
          <div className={`feature-icon primary ${styles.iconWrapper}`}><Download size={32} /></div>
          <h3>{t('admin.data.export_title')}</h3>
          <p className="text-sm text-muted">{t('admin.data.export_desc')}</p>
          <button 
            className="btn btn-primary mt-2" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? t('common.loading') : t('admin.data.export_btn')}
          </button>
        </div>

        <div className={`card ${styles.dataCard}`}>
          <div className={`feature-icon accent ${styles.iconWrapper}`}><Upload size={32} /></div>
          <h3>{t('admin.data.import_title')}</h3>
          <p className="text-sm text-muted">{t('admin.data.import_desc')}</p>
          <label className="btn btn-secondary mt-2 cursor-pointer">
            {t('admin.data.import_btn')}
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
        </div>

        <div className={`card ${styles.dataCard}`}>
          <div className={`feature-icon success ${styles.iconWrapper}`}><Archive size={32} /></div>
          <h3>{t('admin.data.backup_title')}</h3>
          <p className="text-sm text-muted">{t('admin.data.backup_desc')}</p>
          <button 
            className="btn btn-primary mt-2" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {t('admin.data.backup_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
