import { Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import { useRegister } from './useRegister';
import styles from './Register.module.css';

export default function Register() {
  const {
    t,
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    errorMsg, setErrorMsg,
    successMsg, setSuccessMsg,
    isPending,
    handleSubmit
  } = useRegister();

  return (
    <div className={`${styles.authContainer} animate-fade-in`}>
      <div className={styles.authCard}>
        <h1>{t('auth.register_title')}</h1>

        {errorMsg && (
          <Toast type="error" message={errorMsg} onClose={() => setErrorMsg('')} />
        )}
        {successMsg && (
          <Toast type="success" message={successMsg} onClose={() => setSuccessMsg('')} />
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="input-group">
            <label htmlFor="fullName">{t('auth.full_name')}</label>
            <input
              id="fullName"
              type="text"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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

          <div className="input-group">
            <label htmlFor="confirmPassword">{t('auth.confirm_password')}</label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? t('common.loading') : t('auth.register_btn')}
          </button>
        </form>

        <div className={styles.authFooter}>
          {t('auth.has_account')} <Link to="/login">{t('auth.login_btn')}</Link>
        </div>
      </div>
    </div>
  );
}
