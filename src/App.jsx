import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Features from './pages/Features';
import Commands from './pages/Commands';
import Support from './pages/Support';
import TicketDetail from './pages/TicketDetail';
import Dashboard from './pages/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContent from './pages/admin/AdminContent';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/commands" element={<Commands />} />
        <Route path="/support" element={<Support />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="documentation" element={<AdminContent contentKey="documentation" label="📘 Documentation page" />} />
          <Route path="terms-of-service" element={<AdminContent contentKey="terms-of-service" label="📜 Terms of Service" />} />
          <Route path="privacy-policy" element={<AdminContent contentKey="privacy-policy" label="🔒 Privacy Policy" />} />
        </Route>

        <Route path="/terms-of-service" element={<Legal contentKey="terms-of-service" />} />
        <Route path="/privacy-policy" element={<Legal contentKey="privacy-policy" />} />
        <Route path="/docs" element={<Legal contentKey="documentation" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
