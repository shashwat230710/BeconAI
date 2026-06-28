import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VerifyInput } from '../components/verify/VerifyInput';
import { useVerification } from '../hooks/useVerification';
import { AlertCircle } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { submitVerification } = useVerification();
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerifySubmit = async (data) => {
    setIsVerifying(true);
    setErrorMsg('');
    try {
      const verificationId = await submitVerification(data);
      navigate(`/verify?id=${verificationId}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to connect to the verification engine.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-opinion-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-text-tertiary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-verified-green"></span>
              Live: Analyzing 2,400+ claims globally
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              Verify the <span className="text-transparent bg-clip-text bg-gradient-to-r from-opinion-purple to-[#A78BFA]">Truth</span> in Seconds.
            </h1>
            
            <p className="text-xl text-text-tertiary mb-10 max-w-2xl mx-auto leading-relaxed">
              Drop any article, link, or video into Beacon. Our 5-agent AI pipeline analyzes the claims, finds primary sources, and delivers a transparent verdict.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-2"
          >
            {errorMsg && (
              <div className="max-w-3xl mx-auto mb-4 p-4 rounded-lg bg-false-red/10 border border-false-red/30 flex items-start gap-3 text-false-red">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{errorMsg}</p>
              </div>
            )}
            <VerifyInput onSubmit={handleVerifySubmit} isLoading={isVerifying} />
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-white/10 bg-surface-dark/50 py-10">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-24">
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-white mb-1">1M+</div>
            <div className="text-sm text-text-tertiary">Claims Verified</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-white mb-1">500k+</div>
            <div className="text-sm text-text-tertiary">Sources Indexed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-white mb-1">99.8%</div>
            <div className="text-sm text-text-tertiary">Verification Accuracy</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
