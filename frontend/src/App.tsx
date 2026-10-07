import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { ToastContainer } from '@/components/ui/Toast';

import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TouristPage } from '@/pages/TouristPage';
import { SosPage } from '@/pages/SosPage';
import { SafetyZonePage } from '@/pages/SafetyZonePage';
import { RescuePage } from '@/pages/RescuePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { AccountsPage } from '@/pages/AccountsPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { BudgetPage } from '@/pages/BudgetPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ProfilePage } from '@/pages/ProfilePage';

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* LOGIN - NO LAYOUT */}
        <Route path="/login" element={<LoginPage />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <DashboardPage />
            </Layout>
          }
        />

        <Route
          path="/tourists"
          element={
            <Layout>
              <TouristPage />
            </Layout>
          }
        />

        <Route
          path="/sos"
          element={
            <Layout>
              <SosPage />
            </Layout>
          }
        />

        <Route
          path="/safety-zones"
          element={
            <Layout>
              <SafetyZonePage />
            </Layout>
          }
        />

        <Route
          path="/rescue"
          element={
            <Layout>
              <RescuePage />
            </Layout>
          }
        />

        <Route
          path="/products"
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          }
        />

        <Route
          path="/accounts"
          element={
            <Layout>
              <AccountsPage />
            </Layout>
          }
        />

        <Route
          path="/transactions"
          element={
            <Layout>
              <TransactionsPage />
            </Layout>
          }
        />

        <Route
          path="/budget"
          element={
            <Layout>
              <BudgetPage />
            </Layout>
          }
        />

        <Route
          path="/reports"
          element={
            <Layout>
              <ReportsPage />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />

        {/* DEFAULT */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

      <ToastContainer />
    </HashRouter>
  );
}

export default App;