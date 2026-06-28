import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout/Layout';
import HomePage from './pages/HomePage';

// Page Stubs
const VerifyPage = () => <div className="container mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-display font-bold mb-4">Verify Content</h1></div>
const BrowsePage = () => <div className="container mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-display font-bold mb-4">Browse Verified News</h1></div>
const LeaderboardPage = () => <div className="container mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-display font-bold mb-4">Source Leaderboard</h1></div>
const HeatmapPage = () => <div className="container mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-display font-bold mb-4">Misinformation Heatmap</h1></div>
const NotFoundPage = () => <div className="container mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-display font-bold mb-4 text-false-red">404 - Not Found</h1></div>

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
