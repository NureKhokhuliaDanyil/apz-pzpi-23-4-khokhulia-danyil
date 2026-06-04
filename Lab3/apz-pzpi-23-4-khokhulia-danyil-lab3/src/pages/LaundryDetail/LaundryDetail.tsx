import { WashingMachine as WashingMachineIcon, X } from 'lucide-react';
import { MachineStatus } from '../../types';
import { useLaundryDetail } from './useLaundryDetail';
import styles from './LaundryDetail.module.css';

export default function LaundryDetail() {
  const {
    t, navigate, isAuthenticated,
    laundry, isLoadingL,
    machines, isLoadingM,
    modes, isLoadingModes,
    filterStatus, setFilterStatus,
    bookingTime, setBookingTime,
    pricePreview, isPricingLoading,
    selectedMachine, setSelectedMachine,
    selectedMode, setSelectedMode,
    promoCode, setPromoCode,
    promoSuccess, errorMsg,
    promoMutation, startMutation,
    handleApplyPromo, handleStart, closeDialog
  } = useLaundryDetail();

  if (isLoadingL || isLoadingM) return <div className="spinner" />;
  if (!laundry) return <div className="alert alert-error">{t('common.error')}</div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{laundry.name}</h1>
        <div className="text-muted">{laundry.address}</div>
      </div>

      <h2 className="mb-4">{t('laundry_detail.machines')}</h2>
      
      {!machines?.length ? (
        <div className="text-center text-muted">{t('laundry_detail.no_machines')}</div>
      ) : (
        <div className="grid-4">
          {machines.map((machine: any) => {
            const isIdle = machine.status === MachineStatus.Idle;
            const badgeClass = isIdle ? 'badge-success' : machine.status === MachineStatus.Busy ? 'badge-warning' : 'badge-danger';
            const statusKey = isIdle ? 'status_available' : machine.status === MachineStatus.Busy ? 'status_busy' : 'status_maintenance';

            return (
              <div 
                key={machine.id} 
                className={`card ${styles.machineCard}`}
                style={{ opacity: isIdle ? 1 : 0.6, cursor: isIdle ? 'pointer' : 'not-allowed' }}
                onClick={() => isIdle && setSelectedMachine(machine)}
              >
                <div className={styles.machineIcon}>
                  <WashingMachineIcon size={32} />
                </div>
                <h3 className="mb-2">{machine.model}</h3>
                <div className="text-sm text-muted mb-3">{machine.serialNumber}</div>
                <span className={`badge ${badgeClass}`}>{t(`laundry_detail.${statusKey}`)}</span>
              </div>
            );
          })}
        </div>
      )}

      {selectedMachine && (
        <div className="modal-overlay">
          <div className="modal" style={{ width: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{t('laundry_detail.select_mode')}</h2>
              <button onClick={closeDialog} className="btn btn-ghost"><X /></button>
            </div>

            {!selectedMode ? (
              <div className={styles.modeList}>
                {isLoadingModes ? <div className="spinner" /> : modes?.map((mode: any) => (
                  <div 
                    key={mode.id} 
                    className={styles.modeItem}
                    onClick={() => setSelectedMode(mode)}
                  >
                    <div>
                      <div className={styles.modeName}>{mode.name}</div>
                      <div className={styles.modeMeta}>
                        {mode.durationMinutes} {t('laundry_detail.duration_unit')} • {mode.temperature}°C
                      </div>
                    </div>
                    <div className={styles.modePrice}>{mode.price} ₴</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-col gap-4">
                <div className="card" style={{ padding: 'var(--sp-4)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <strong>{selectedMode.name}</strong>
                    <button onClick={() => setSelectedMode(null)} className="btn btn-sm btn-ghost">{t('common.edit')}</button>
                  </div>
                  <div className="text-sm text-muted">
                    {selectedMode.durationMinutes} {t('laundry_detail.duration_unit')} • {selectedMode.temperature}°C
                  </div>
                </div>

                <div className="card" style={{ padding: 'var(--sp-4)' }}>
                  <h4 className="mb-3">{t('laundry_detail.price_preview')}</h4>
                  {isPricingLoading ? <div className="spinner" /> : (
                    <div className="flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t('laundry_detail.base_price')}</span>
                        <span>{pricePreview?.basePrice.toFixed(2)} ₴</span>
                      </div>
                      <hr style={{ margin: 'var(--sp-2) 0', border: '1px solid var(--c-border)' }} />
                      <div className="flex justify-between" style={{ fontSize: 'var(--fs-lg)', fontWeight: 'bold' }}>
                        <span>{t('laundry_detail.final_price')}</span>
                        <span className="text-primary">{pricePreview?.finalPrice.toFixed(2)} ₴</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="input w-full" 
                    placeholder={t('laundry_detail.promo_code')} 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleApplyPromo}
                    disabled={promoMutation.isPending || !promoCode}
                  >
                    {t('laundry_detail.apply_promo')}
                  </button>
                </div>

                {promoSuccess && <div className="alert alert-success mb-4">{t('laundry_detail.promo_applied')}</div>}

                <div className="modal-actions">
                  {!isAuthenticated ? (
                    <button className="btn btn-primary w-full" onClick={() => navigate('/login')}>
                      {t('laundry_detail.login_required')}
                    </button>
                  ) : (
                    <>
                      {pricePreview && (
                        <div className={styles.bookingSection}>
                          <label className="text-sm font-medium mb-2 block">{t('laundry_detail.select_booking_time')}</label>
                          <input 
                            type="datetime-local" 
                            className="input mb-4" 
                            value={bookingTime}
                            onChange={e => setBookingTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </div>
                      )}

                      {errorMsg && <div className="badge-danger mb-4 text-center p-2 rounded">{errorMsg}</div>}

                      <button 
                        className="btn btn-primary w-full"
                        disabled={!selectedMachine || !selectedMode || startMutation.isPending}
                        onClick={handleStart}
                      >
                        {startMutation.isPending ? <div className="spinner" /> : t('laundry_detail.book_session')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
