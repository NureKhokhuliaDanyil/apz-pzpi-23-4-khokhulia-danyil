import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CalendarCheck, Percent, Timer } from 'lucide-react';
import { useHome } from './useHome';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useTranslation();
  useHome(); // Initialize logic

  return (
    <div className="animate-fade-in">
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{t('home.hero_title')}</h1>
          <p>{t('home.hero_subtitle')}</p>
          <Link to="/laundries" className="btn btn-primary btn-lg">
            {t('home.get_started')}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-center">{t('home.features_title')}</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.primary}`}>
              <CalendarCheck />
            </div>
            <h3>{t('home.feature_1_title')}</h3>
            <p>{t('home.feature_1_desc')}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.accent}`}>
              <Percent />
            </div>
            <h3>{t('home.feature_2_title')}</h3>
            <p>{t('home.feature_2_desc')}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.success}`}>
              <Timer />
            </div>
            <h3>{t('home.feature_3_title')}</h3>
            <p>{t('home.feature_3_desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
