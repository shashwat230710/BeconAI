import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, Menu, X, BarChart2 } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Verify', path: '/verify' },
    { name: 'Browse', path: '/browse' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Heatmap', path: '/heatmap' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface-dark/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-text-inverse hover:opacity-80 transition-opacity">
          <ShieldCheck className="w-6 h-6 text-opinion-purple" />
          <span className="font-display font-bold text-xl tracking-tight">Beacon<span className="text-opinion-purple">.ai</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-opinion-purple ${location.pathname === link.path ? 'text-opinion-purple' : 'text-text-tertiary'}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <Button variant="ghost" size="sm" className="hidden lg:flex">Log in</Button>
          <Button variant="primary" size="sm">Get Extension</Button>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden text-text-inverse p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-dark px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium transition-colors hover:text-opinion-purple ${location.pathname === link.path ? 'text-opinion-purple' : 'text-text-tertiary'}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-center">Log in</Button>
            <Button variant="primary" className="w-full justify-center">Get Extension</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-surface-dark py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-opinion-purple" />
          <span className="font-display font-semibold">Beacon.ai</span>
        </div>
        <p className="text-text-tertiary text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Beacon (VeritAI). Powered by LangGraph & Claude.
        </p>
        <div className="flex gap-4 text-sm text-text-tertiary">
          <a href="#" className="hover:text-text-inverse transition-colors">Privacy</a>
          <a href="#" className="hover:text-text-inverse transition-colors">Terms</a>
          <a href="#" className="hover:text-text-inverse transition-colors">API Docs</a>
        </div>
      </div>
    </footer>
  );
};
