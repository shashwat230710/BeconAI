import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, AlertCircle, Loader2 } from 'lucide-react';
import { TrustScoreCircle } from '../components/verify/TrustScoreCircle';
import { VerdictBadge } from '../components/verify/VerdictBadge';
import { EvidencePanel } from '../components/verify/EvidencePanel';
import { SentenceAnnotation } from '../components/verify/SentenceAnnotation';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useVerification } from '../hooks/useVerification';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data: result, status, error } = useVerification(id);
  const [activeClaimId, setActiveClaimId] = useState(null);
  
  // Set first claim active when results load
  useEffect(() => {
    if (result?.claims?.length > 0 && !activeClaimId) {
      setActiveClaimId(result.claims[0].id);
    }
  }, [result, activeClaimId]);

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-false-red mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4">Error Fetching Results</h1>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          {error || "We couldn't retrieve the verification result you're looking for."}
        </p>
        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
      </div>
    );
  }

  if (status === 'processing' || !result) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-16 h-16 text-opinion-purple animate-spin mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4">Analyzing Content...</h1>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          Our LangGraph AI pipeline is currently extracting claims, retrieving sources, and analyzing evidence.
        </p>
      </div>
    );
  }

  const activeClaim = result.claims.find(c => c.id === activeClaimId) || result.claims[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
      >
        <div className="flex items-center gap-6">
          <TrustScoreCircle score={result.overall_trust_score} size="md" />
          <div>
            <div className="text-sm text-text-tertiary font-medium mb-1 uppercase tracking-wider">Overall Verdict</div>
            <VerdictBadge verdict={result.overall_verdict} />
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <AlertCircle className="w-4 h-4" /> Flag
          </Button>
          <Button variant="secondary" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-300px)] min-h-[600px]">
        {/* Left Column: Annotated Text */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col h-full"
        >
          <Card className="flex-grow flex flex-col overflow-hidden bg-surface-dark border-white/10">
            <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <h3 className="font-display font-semibold text-lg">Analyzed Content</h3>
              <div className="text-sm text-text-tertiary">{result.claims.length} claims identified</div>
            </div>
            <div className="p-8 overflow-y-auto flex-grow text-lg leading-relaxed bg-[#111827]">
              {result.claims.map((claim, idx) => (
                <React.Fragment key={claim.id}>
                  <SentenceAnnotation
                    claim={claim}
                    isActive={activeClaimId === claim.id}
                    onClick={() => setActiveClaimId(claim.id)}
                  />
                  {/* Re-insert space after sentence if not last */}
                  {idx < result.claims.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Evidence Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <EvidencePanel claim={activeClaim} />
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyPage;
