import React from 'react';
import { ExternalLink, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { VerdictBadge } from './VerdictBadge';

export const EvidencePanel = ({ claim }) => {
  if (!claim) {
    return (
      <Card className="h-full flex items-center justify-center p-8 bg-surface-dark border-white/5">
        <p className="text-text-tertiary text-center">
          Click on any highlighted sentence in the text to view the AI analysis and supporting evidence.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-surface-dark border-white/10">
      <CardHeader className="border-b border-white/10 bg-white/5">
        <div className="flex justify-between items-start gap-4 mb-4">
          <CardTitle className="text-xl">Claim Analysis</CardTitle>
          <VerdictBadge verdict={claim.verdict} className="text-xs px-2 py-1" />
        </div>
        <p className="text-text-inverse font-medium text-lg leading-relaxed">
          "{claim.extracted_claim}"
        </p>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-6">
        <div className="mb-8">
          <h4 className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-2">AI Explanation</h4>
          <p className="text-text-secondary leading-relaxed">{claim.explanation}</p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" /> 
            Sources ({claim.sources?.length || 0})
          </h4>
          
          <div className="space-y-4">
            {claim.sources?.map((source, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-surface-light/5 border border-white/5 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-text-inverse">{source.source_name}</div>
                  <div className={`text-xs px-2 py-1 rounded-md border ${
                    source.stance === 'supports' ? 'bg-verified-green/10 text-verified-green border-verified-green/20' :
                    source.stance === 'contradicts' ? 'bg-false-red/10 text-false-red border-false-red/20' :
                    'bg-white/10 text-text-tertiary border-white/20'
                  }`}>
                    {source.stance.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-text-tertiary mb-3">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-verified-green" /> 
                    {Math.round(source.trust_score * 100)}% Trust
                  </span>
                  <span>•</span>
                  <a href={source.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-text-inverse transition-colors">
                    {source.source_domain} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <blockquote className="border-l-2 border-white/20 pl-3 text-sm text-text-secondary italic">
                  "{source.relevant_quote}"
                </blockquote>
              </div>
            ))}
            
            {(!claim.sources || claim.sources.length === 0) && (
              <div className="text-center p-4 text-text-tertiary text-sm">
                No reliable sources found for this claim.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
