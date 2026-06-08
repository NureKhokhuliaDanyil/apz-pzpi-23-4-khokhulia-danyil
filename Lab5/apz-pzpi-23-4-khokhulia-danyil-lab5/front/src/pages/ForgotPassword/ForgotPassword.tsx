import { Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import { useForgotPassword } from './useForgotPassword';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const {
    t,
    email, setEmail,
    msg, setMsg,
    errorMsg, setErrorMsg,
    isPending,
    handleSubmit
  } = useForgotPassword();

  return (
    <div className={`${styles.authContainer} animate-fade-in`}>
      <div className={styles.authCard}>
        <h1>{t('auth.forgot_title')}</h1>

        {errorMsg && (
          <Toast type="error" message={errorMsg} onClose={() => setErrorMsg('')} />
        )}
        {msg && (
          <Toast type="success" message={msg} onClose={() => setMsg('')} />
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="input-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? t('common.loading') : t('auth.send_reset')}
          </button>
        </form>

        <div className={styles.authFooter}>
          <Link to="/login">{t('auth.back_to_login')}</Link>
        </div>
      </div>
    </div>
  );
}
