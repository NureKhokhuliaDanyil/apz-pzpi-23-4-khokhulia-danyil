import { Search, MapPin } from 'lucide-react';
import { useLaundries } from './useLaundries';
import styles from './Laundries.module.css';

export default function Laundries() {
  const {
    t,
    navigate,
    search, setSearch,
    filtered,
    isLoading, isError
  } = useLaundries();

  if (isLoading) return <div className="spinner" />;
  if (isError) return <div className="alert alert-error">{t('common.error')}</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('laundries.title')}</h1>
        <div className="input-group" style={{ minWidth: '300px' }}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={`input w-full ${styles.searchInput}`}
              placeholder={t('laundries.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={18}
              className={`text-muted ${styles.searchIcon}`}
            />
          </div>
        </div>
      </div>

      {!filtered?.length ? (
        <div className="text-center text-muted mt-6">{t('laundries.no_results')}</div>
      ) : (
        <div className="grid-3 mt-6">
          {filtered?.map((laundry: any) => (
            <div key={laundry.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{laundry.name}</h3>
                <span className="badge badge-success">{t('laundries.status_active')}</span>
              </div>
              
              <div className={styles.infoRow}>
                <MapPin size={16} />
                <span>{laundry.address}</span>
              </div>
              
              <div className={styles.hoursRow}>
                <strong>🕒</strong> {laundry.workingHours}
              </div>

              <button
                className="btn btn-primary w-full"
                onClick={() => navigate(`/laundries/${laundry.id}`)}
              >
                {t('laundries.view_details')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
