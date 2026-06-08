/* ───────────────────────────────────────────
 *  App — root component with routing
 * ─────────────────────────────────────────── */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

/* ── Lazy-loaded pages ─────────────────────── */
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const Laundries = lazy(() => import('./pages/Laundries/Laundries'));
const LaundryDetail = lazy(() => import('./pages/LaundryDetail/LaundryDetail'));
const ActiveSession = lazy(() => import('./pages/ActiveSession/ActiveSession'));
const Wallet = lazy(() => import('./pages/Wallet/Wallet'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

/* Admin */
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers/AdminUsers'));
const AdminLaundries = lazy(() => import('./pages/admin/AdminLaundries/AdminLaundries'));
const AdminMachines = lazy(() => import('./pages/admin/AdminMachines/AdminMachines'));
const AdminWashModes = lazy(() => import('./pages/admin/AdminWashModes/AdminWashModes'));
const AdminDataMgmt = lazy(() => import('./pages/admin/AdminDataMgmt/AdminDataMgmt'));

/* ── Query client ──────────────────────────── */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/* ── Loading fallback ──────────────────────── */
function Spinner() {
  return <div className="spinner" />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<Spinner />}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/laundries" element={<Laundries />} />
                <Route path="/laundries/:id" element={<LaundryDetail />} />

                {/* Protected */}
                <Route
                  path="/session/:id"
                  element={
                    <ProtectedRoute>
                      <ActiveSession />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="laundries" element={<AdminLaundries />} />
                  <Route path="machines" element={<AdminMachines />} />
                  <Route path="wash-modes" element={<AdminWashModes />} />
                  <Route path="data" element={<AdminDataMgmt />} />
                </Route>
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
