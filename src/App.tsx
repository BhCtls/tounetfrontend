import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppsPage } from './pages/AppsPage';
import { AboutMePage } from './pages/AboutMePage';
import { SongPicQueryPage } from './pages/SongPicQueryPage';
import { DownloadOrderPage } from './pages/DownloadOrderPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { LicensePage } from './pages/LicensePage';
import { SponsorPage } from './pages/SponsorPage';
import FreedomConstPage from './pages/FreedomConstPage';
import { AppLauncherPage } from './pages/AppLauncherPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AboutMePage />} />
              <Route path="/desktop" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutMePage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/apps" 
                element={
                  <ProtectedRoute>
                    <AppsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/launch/:appId" 
                element={
                  <ProtectedRoute>
                    <AppLauncherPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/frontend" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/song-pic-query" element={<SongPicQueryPage />} />
              <Route path="/download-order" element={<DownloadOrderPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/license" element={<LicensePage />} />
              <Route path="/sponsor" element={<SponsorPage />} />
              <Route path="/freedom-const" element={<FreedomConstPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
