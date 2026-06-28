import { Routes, Route } from 'react-router-dom'

// Page Stubs
const HomePage = () => <div className="p-8 text-center"><h1 className="text-4xl font-display mb-4">Beacon (VeritAI)</h1><p className="text-text-tertiary">Truth Verification Engine</p></div>
const VerifyPage = () => <div className="p-8 text-center"><h1 className="text-4xl font-display mb-4">Verify Content</h1></div>
const BrowsePage = () => <div className="p-8 text-center"><h1 className="text-4xl font-display mb-4">Browse Verified News</h1></div>
const LeaderboardPage = () => <div className="p-8 text-center"><h1 className="text-4xl font-display mb-4">Source Leaderboard</h1></div>
const HeatmapPage = () => <div className="p-8 text-center"><h1 className="text-4xl font-display mb-4">Misinformation Heatmap</h1></div>
const NotFoundPage = () => <div className="p-8 text-center"><h1 className="text-4xl font-display mb-4 text-false-red">404 - Not Found</h1></div>

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-dark text-text-inverse font-sans">
      {/* Navbar Stub */}
      <nav className="w-full p-4 border-b border-white/10 flex justify-between items-center bg-surface-dark/80 backdrop-blur-md">
        <div className="font-display font-bold text-xl tracking-tight">Beacon.ai</div>
        <div className="flex gap-6 text-sm font-medium">
          <a href="/" className="hover:text-opinion-purple transition-colors">Home</a>
          <a href="/verify" className="hover:text-opinion-purple transition-colors">Verify</a>
          <a href="/browse" className="hover:text-opinion-purple transition-colors">Browse</a>
          <a href="/leaderboard" className="hover:text-opinion-purple transition-colors">Leaderboard</a>
        </div>
      </nav>

      {/* Main Content */}
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

      {/* Footer Stub */}
      <footer className="w-full p-6 border-t border-white/10 text-center text-text-tertiary text-sm">
        &copy; {new Date().getFullYear()} Beacon (VeritAI). All rights reserved.
      </footer>
    </div>
  )
}

export default App
