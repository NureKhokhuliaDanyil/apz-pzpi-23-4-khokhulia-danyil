import { useProfile } from './useProfile';
import styles from './Profile.module.css';

export default function Profile() {
  const {
    t,
    theme, lang, setTheme, setLang,
    userData, isUserLoading
  } = useProfile();

  return (
    <div className="animate-fade-in">
      <h1 className="page-title mb-6">{t('profile.title')}</h1>

      <div className="grid-2">
        <div className={styles.profileCard}>
          <h3 className="card-title mb-4">{t('profile.title')}</h3>
          {isUserLoading ? <div className="spinner" /> : (
            <div className="flex-col gap-3">
              <div><strong>{t('profile.name')}:</strong> {userData?.fullName}</div>
              <div><strong>{t('profile.email')}:</strong> {userData?.email}</div>
              <div><strong>{t('profile.role')}:</strong> <span className="badge badge-primary">{t(`roles.${userData?.role}`)}</span></div>
              <div><strong>{t('profile.balance')}:</strong> {userData?.balance.toFixed(2)} {t('wallet.currency')}</div>
            </div>
          )}
        </div>

        <div className={styles.profileCard}>
          <h3 className="card-title mb-4">{t('settings.title')}</h3>
          <div className="flex-col gap-4">
            <div className="input-group">
              <label>{t('settings.language')}</label>
              <select className="input" value={lang} onChange={(e) => setLang(e.target.value as any)}>
                <option value="uk">Українська</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>{t('settings.theme')}</label>
              <select className="input" value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                <option value="dark">{t('settings.theme_dark')}</option>
                <option value="light">{t('settings.theme_light')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
