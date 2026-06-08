/* ───────────────────────────────────────────
 *  Navbar — top navigation bar
 * ─────────────────────────────────────────── */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  WashingMachine,
  LogIn,
  UserPlus,
  Home,
  Building,
  Wallet,
  User,
  Shield,
  LogOut,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { UserRole } from '../types';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, lang, toggleTheme, setLang } = useSettingsStore();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cycleLang = () => setLang(lang === 'uk' ? 'en' : 'uk');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <WashingMachine />
        {t('app_name')}
      </Link>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
        >
          <Home /> {t('nav.home')}
        </Link>

        <Link
          to="/laundries"
          className={`nav-link ${isActive('/laundries') ? 'active' : ''}`}
        >
          <Building /> {t('nav.laundries')}
        </Link>

        {isAuthenticated && (
          <>
            <Link
              to="/wallet"
              className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}
            >
              <Wallet /> {t('nav.wallet')}
            </Link>

            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              <User /> {t('nav.profile')}
            </Link>

            {user?.role === UserRole.Admin && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
              >
                <Shield /> {t('nav.admin')}
              </Link>
            )}
          </>
        )}

        {/* Theme toggle */}
        <button className="nav-link" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>

        {/* Language toggle */}
        <button className="nav-link" onClick={cycleLang} aria-label="Toggle language">
          <Globe />
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
            {lang}
          </span>
        </button>

        {/* Auth links */}
        {isAuthenticated ? (
          <button className="nav-link" onClick={handleLogout}>
            <LogOut /> {t('nav.logout')}
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              <LogIn /> {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className={`nav-link ${isActive('/register') ? 'active' : ''}`}
            >
              <UserPlus /> {t('nav.register')}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
