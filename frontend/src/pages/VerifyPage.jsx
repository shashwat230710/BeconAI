import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, AlertCircle } from 'lucide-react';
import { TrustScoreCircle } from '../components/verify/TrustScoreCircle';
import { VerdictBadge } from '../components/verify/VerdictBadge';
import { EvidencePanel } from '../components/verify/EvidencePanel';
import { SentenceAnnotation } from '../components/verify/SentenceAnnotation';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

// Mock data for initial UI building
const mockResult = {
  id: "ver_test_123",
  overall_trust_score: 0.23,
  overall_verdict: "false",
  raw_input: "Scientists have discovered a new planet in our solar system that is 10 times larger than Jupiter. This incredible finding will change everything we know about the universe forever.",
  claims: [
    {
      id: "clm_1",
      claim_index: 0,
      original_sentence: "Scientists have discovered a new planet in our solar system",
      extracted_claim: "A new planet has been discovered in our solar system",
      verdict: "verified",
      confidence: 0.85,
      explanation: "NASA confirmed exoplanet discoveries, though the location in 'our solar system' is conflated with other discoveries.",
      sources: [
        { source_name: "NASA", source_domain: "nasa.gov", trust_score: 0.98, stance: "neutral", relevant_quote: "Thousands of exoplanets discovered outside our solar system.", source_url: "#" }
      ]
    },
    {
      id: "clm_2",
      claim_index: 1,
      original_sentence: "that is 10 times larger than Jupiter.",
      extracted_claim: "The discovered planet is 10 times larger than Jupiter",
      verdict: "false",
      confidence: 0.97,
      explanation: "No planet in our solar system exceeds Jupiter's size. Jupiter remains the largest planet.",
      sources: [
        { source_name: "Space.com", source_domain: "space.com", trust_score: 0.92, stance: "contradicts", relevant_quote: "Jupiter is the largest planet in our solar system.", source_url: "#" }
      ]
    },
    {
      id: "clm_3",
      claim_index: 2,
      original_sentence: "This incredible finding will change everything we know about the universe forever.",
      extracted_claim: "The finding changes everything known about the universe",
      verdict: "exaggerated",
      confidence: 0.75,
      explanation: "Sensationalist language used to describe routine astronomical discoveries.",
      sources: []
    }
  ]
};

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [activeClaimId, setActiveClaimId] = useState(null);
  
  // In a real app, we'd fetch data using the ID. For now, use mock if ID exists.
  const result = id ? mockResult : null;

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-text-tertiary mb-6" />
        <h1 className="text-3xl font-display font-bold mb-4">No Verification Found</h1>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          We couldn't find the verification result you're looking for. It may have expired or the ID is incorrect.
        </p>
        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
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
