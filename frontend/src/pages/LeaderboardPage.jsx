import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../components/common/Card';

const mockSources = [
  { rank: 1, name: "Reuters", domain: "reuters.com", score: 0.98, total: 12847, trend: 'up' },
  { rank: 2, name: "Associated Press", domain: "apnews.com", score: 0.97, total: 10532, trend: 'stable' },
  { rank: 3, name: "BBC News", domain: "bbc.co.uk", score: 0.95, total: 9841, trend: 'up' },
  { rank: 4, name: "NPR", domain: "npr.org", score: 0.94, total: 6720, trend: 'stable' },
  { rank: 5, name: "The Guardian", domain: "theguardian.com", score: 0.92, total: 8934, trend: 'down' },
  // ... jump to bottom
  { rank: 142, name: "ViralTruthBlog", domain: "viraltruth.net", score: 0.24, total: 1205, trend: 'down' },
  { rank: 143, name: "ConspiracyDaily", domain: "conspiracydaily.co", score: 0.12, total: 3450, trend: 'down' },
];

const LeaderboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Source Credibility Index</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Transparent, data-driven rankings of news publishers based on the historical accuracy of their claims as verified by Beacon.
        </p>
      </div>

      <Card className="overflow-hidden border-white/10 bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-text-tertiary text-sm uppercase tracking-wider border-b border-white/10">
                <th className="px-6 py-4 font-semibold w-16 text-center">Rank</th>
                <th className="px-6 py-4 font-semibold">Publisher</th>
                <th className="px-6 py-4 font-semibold text-right">Trust Score</th>
                <th className="px-6 py-4 font-semibold text-right">Total Checks</th>
                <th className="px-6 py-4 font-semibold text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockSources.map((source, idx) => (
                <motion.tr 
                  key={source.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-center font-mono text-text-secondary">
                    #{source.rank}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-inverse">{source.name}</div>
                    <div className="text-xs text-text-tertiary">{source.domain}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${
                            source.score >= 0.7 ? 'bg-verified-green' : 
                            source.score >= 0.4 ? 'bg-misleading-amber' : 'bg-false-red'
                          }`}
                          style={{ width: `${source.score * 100}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold font-mono ${
                        source.score >= 0.7 ? 'text-verified-green' : 
                        source.score >= 0.4 ? 'text-misleading-amber' : 'text-false-red'
                      }`}>
                        {(source.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-text-secondary">
                    {source.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {source.trend === 'up' && <TrendingUp className="w-5 h-5 text-verified-green" />}
                      {source.trend === 'down' && <TrendingDown className="w-5 h-5 text-false-red" />}
                      {source.trend === 'stable' && <Minus className="w-5 h-5 text-text-tertiary" />}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="mt-6 text-center text-sm text-text-tertiary flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" /> Rankings are calculated automatically based on continuous AI verification of publishers' content.
      </div>
    </div>
  );
};

export default LeaderboardPage;
