import { Lock, Unlock } from 'lucide-react';
import Toast from '../../components/Toast';
import { useActiveSession } from './useActiveSession';
import styles from './ActiveSession.module.css';

export default function ActiveSession() {
  const {
    t, id, navigate,
    timeLeft, status,
    errorMsg, setErrorMsg,
    isPending,
    handleCancel,
    handleBegin,
    handlePause,
    handleResume,
    formatTime
  } = useActiveSession();

  return (
    <div className={`animate-fade-in ${styles.sessionContainer}`}>
      <div className={styles.sessionCard}>
        <h2 className="mb-2">{t('session.active_title')}</h2>
        <div className="text-muted mb-6">Session #{id}</div>

        {errorMsg && <Toast type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}
        
        {status === 'completed' && <div className="alert alert-success mb-6">{t('session.session_completed')}</div>}
        {status === 'cancelled' && <div className="alert alert-error mb-6">{t('session.session_cancelled')}</div>}

        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex-col gap-1 text-left">
            <span className="text-muted">{t('session.door_status')}</span>
            <span className="flex items-center gap-1 font-semibold" style={{ color: (status === 'active' || status === 'paused') ? 'var(--c-danger)' : 'var(--c-success)' }}>
              {(status === 'active' || status === 'paused') ? <Lock size={16} /> : <Unlock size={16} />} 
              {(status === 'active' || status === 'paused') ? t('session.door_locked') : t('session.door_unlocked')}
            </span>
          </div>
          <div className="flex-col gap-1 text-right">
            <span className="text-muted">{t('session.status')}</span>
            <span className="font-semibold text-primary">{t(`session.status_${status}`)}</span>
          </div>
        </div>

        {status !== 'booked' && (
          <div className={styles.timerRing} style={{ animationPlayState: status === 'active' ? 'running' : 'paused' }}>
            <div className="flex-col gap-1">
              <div className={styles.timerValue}>{formatTime(timeLeft)}</div>
              <div className={styles.timerLabel}>{t('session.time_remaining')}</div>
            </div>
          </div>
        )}

        {status === 'booked' && (
          <div className="flex-col gap-2 mt-6">
            <button className="btn btn-success w-full" onClick={handleBegin} disabled={isPending}>
              {isPending ? <div className="spinner" /> : t('session.begin_washing')}
            </button>
            <button className="btn btn-ghost w-full" onClick={handleCancel} disabled={isPending}>
              {t('session.cancel_session')}
            </button>
          </div>
        )}

        {status === 'active' && (
          <div className="flex-col gap-2 mt-6">
            <button className="btn btn-warning w-full" onClick={handlePause} disabled={isPending}>
              {isPending ? <div className="spinner" /> : t('session.pause')}
            </button>
            <button className="btn btn-danger w-full" onClick={handleCancel} disabled={isPending}>
              {t('session.cancel_session')}
            </button>
          </div>
        )}

        {status === 'paused' && (
          <div className="flex-col gap-2 mt-6">
            <button className="btn btn-success w-full" onClick={handleResume} disabled={isPending}>
              {isPending ? <div className="spinner" /> : t('session.resume')}
            </button>
            <button className="btn btn-danger w-full" onClick={handleCancel} disabled={isPending}>
              {t('session.cancel_session')}
            </button>
          </div>
        )}

        {(status === 'completed' || status === 'cancelled') && (
          <button className="btn btn-primary w-full mt-6" onClick={() => navigate('/laundries')}>
            {t('common.back')}
          </button>
        )}
      </div>
    </div>
  );
}
