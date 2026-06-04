import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../api';
import type { SystemExportData } from '../../../types';

export function useAdminDataMgmt() {
  const { t } = useTranslation();
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const [users, laundries, machines, modes] = await Promise.all([
        api.get('/users'),
        api.get('/laundries'),
        api.get('/machines'),
        api.get('/tariffs')
      ]);

      const data: SystemExportData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        users: users.data,
        laundries: laundries.data,
        machines: machines.data,
        washModes: modes.data
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `washconnect_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMsg({ type: 'success', text: t('admin.data.export_success') });
    } catch (err) {
      setMsg({ type: 'error', text: t('common.error') });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.version) {
          setMsg({ type: 'success', text: t('admin.data.import_success') });
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        setMsg({ type: 'error', text: t('admin.data.import_error') });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return {
    t,
    msg, setMsg,
    isExporting,
    handleExport, handleImport
  };
}
