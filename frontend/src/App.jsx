import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import BrowsePage from './pages/BrowsePage';
import LeaderboardPage from './pages/LeaderboardPage';
import HeatmapPage from './pages/HeatmapPage';

const NotFoundPage = () => <div className="container mx-auto px-4 py-32 text-center"><h1 className="text-4xl font-display font-bold mb-4 text-false-red">404 - Not Found</h1><p className="text-text-tertiary">The page you are looking for does not exist.</p></div>

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-dark text-text-inverse font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
