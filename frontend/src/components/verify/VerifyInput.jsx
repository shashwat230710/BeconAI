import React from 'react';
import { motion } from 'framer-motion';
import { Search, Link as LinkIcon, Mic, Video, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';

export const VerifyInput = ({ onSubmit, isLoading }) => {
  const [inputType, setInputType] = React.useState('text');
  const [content, setContent] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ type: inputType, content, mode: 'quick' });
  };

  const inputTypes = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'url', label: 'URL', icon: LinkIcon },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'video', label: 'Video', icon: Video },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <div className="flex border-b border-white/10 bg-surface-dark/80">
        {inputTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setInputType(type.id)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              inputType === type.id
                ? 'bg-opinion-purple/20 text-opinion-purple border-b-2 border-opinion-purple'
                : 'text-text-tertiary hover:text-text-inverse hover:bg-white/5'
            }`}
          >
            <type.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{type.label}</span>
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        {inputType === 'text' || inputType === 'url' ? (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {inputType === 'text' ? <FileText className="h-5 w-5 text-text-tertiary" /> : <LinkIcon className="h-5 w-5 text-text-tertiary" />}
            </div>
            <Input
              type={inputType === 'url' ? 'url' : 'text'}
              className="pl-10 h-12 text-base"
              placeholder={inputType === 'text' ? 'Paste an article, claim, or quote to verify...' : 'https://example.com/article...'}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
            {inputType === 'audio' ? <Mic className="w-8 h-8 text-text-tertiary mb-3" /> : <Video className="w-8 h-8 text-text-tertiary mb-3" />}
            <p className="text-sm text-text-inverse font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-text-tertiary">
              {inputType === 'audio' ? 'MP3, WAV, M4A up to 25MB' : 'MP4, MOV, WebM up to 100MB'}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-text-tertiary flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Powered by LangGraph & Claude 3.5 Sonnet
          </div>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={(e) => {
                e.preventDefault();
                onSubmit({ type: inputType, content, mode: 'deep' });
              }}
              disabled={isLoading || (!content.trim() && (inputType === 'text' || inputType === 'url'))}
            >
              Deep Analysis
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              isLoading={isLoading}
              disabled={!content.trim() && (inputType === 'text' || inputType === 'url')}
            >
              Quick Verify
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

// Assuming ShieldCheck is imported, adding it here for completeness
const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);
