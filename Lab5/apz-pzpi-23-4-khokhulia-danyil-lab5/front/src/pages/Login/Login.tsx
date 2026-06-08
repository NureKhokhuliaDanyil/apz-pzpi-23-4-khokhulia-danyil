import { Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import { useLogin } from './useLogin';
import styles from './Login.module.css';

export default function Login() {
  const {
    t,
    email, setEmail,
    password, setPassword,
    errorMsg, setErrorMsg,
    isPending,
    handleSubmit
  } = useLogin();

  return (
    <div className={`${styles.authContainer} animate-fade-in`}>
      <div className={styles.authCard}>
        <h1>{t('auth.login_title')}</h1>
        
        {errorMsg && (
          <Toast type="error" message={errorMsg} onClose={() => setErrorMsg('')} />
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

          <div className="input-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? t('common.loading') : t('auth.login_btn')}
          </button>
        </form>

        <div className={styles.authFooter}>
          <Link to="/forgot-password">{t('auth.forgot_password')}</Link>
          <div className="mt-4">
            {t('auth.no_account')} <Link to="/register">{t('auth.register_btn')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
