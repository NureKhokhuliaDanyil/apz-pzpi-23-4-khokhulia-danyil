/* ───────────────────────────────────────────
 *  ProtectedRoute — redirects to /login
 *  if user is not authenticated.
 *  Optionally checks for admin role.
 * ─────────────────────────────────────────── */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { UserRole } from '../types';

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== UserRole.Admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
