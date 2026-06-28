import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, TrendingUp, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { VerdictBadge } from '../components/verify/VerdictBadge';

const mockArticles = [
  {
    id: '1',
    title: 'NASA Confirms New Exoplanet Discovery in Habitable Zone',
    source: 'Reuters',
    category: 'Science',
    verdict: 'verified',
    trustScore: 0.96,
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    title: 'Central Bank Announces Unprecedented Digital Currency Policy',
    source: 'Financial Times',
    category: 'Finance',
    verdict: 'verified',
    trustScore: 0.92,
    time: '4h ago',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    title: 'Local Mayor Embezzled $5M According to Leaked Documents',
    source: 'ViralNews.net',
    category: 'Politics',
    verdict: 'false',
    trustScore: 0.12,
    time: '5h ago',
    image: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '4',
    title: 'New Diet Pill Guarantees 20lb Weight Loss in One Week',
    source: 'HealthGuru Blog',
    category: 'Health',
    verdict: 'false',
    trustScore: 0.05,
    time: '8h ago',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '5',
    title: 'Tech CEO Promises Flying Cars by Next Year',
    source: 'TechInsider',
    category: 'Technology',
    verdict: 'exaggerated',
    trustScore: 0.45,
    time: '12h ago',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
  }
];

const NewsCard = ({ article }) => (
  <Card className="overflow-hidden hover:border-white/30 transition-colors group cursor-pointer flex flex-col h-full">
    <div className="h-48 overflow-hidden relative">
      <img 
        src={article.image} 
        alt={article.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute top-3 right-3">
        <VerdictBadge verdict={article.verdict} className="text-xs px-2 py-1 shadow-lg bg-surface-dark/90 backdrop-blur-md" />
      </div>
      <div className="absolute bottom-3 left-3 flex gap-2">
        <Badge variant="default" className="bg-surface-dark/80 backdrop-blur-md text-white border-white/10">{article.category}</Badge>
      </div>
    </div>
    <CardContent className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-center text-xs text-text-tertiary mb-3">
        <span className="font-medium text-text-secondary">{article.source}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.time}</span>
      </div>
      <h3 className="text-lg font-display font-semibold mb-4 line-clamp-2 group-hover:text-opinion-purple transition-colors">
        {article.title}
      </h3>
      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-xs text-text-tertiary">Trust Score</div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                article.trustScore >= 0.7 ? 'bg-verified-green' : 
                article.trustScore >= 0.4 ? 'bg-misleading-amber' : 'bg-false-red'
              }`}
              style={{ width: `${article.trustScore * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-bold">{Math.round(article.trustScore * 100)}%</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BrowsePage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Politics', 'Technology', 'Science', 'Health', 'Finance'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Curated News Feed</h1>
        <p className="text-text-secondary text-lg">
          Browse the latest viral news and claims, pre-verified by Beacon's AI engine.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 sticky top-16 z-40 bg-surface-dark/95 backdrop-blur-md py-4 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-opinion-purple text-white' 
                  : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <Input placeholder="Search claims..." className="pl-9 bg-white/5 border-white/10" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockArticles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <NewsCard article={article} />
          </motion.div>
        ))}
      </div>
      
      {/* Load More */}
      <div className="mt-12 text-center">
        <Button variant="outline" className="px-8">Load More News</Button>
      </div>
    </div>
  );
};

export default BrowsePage;
