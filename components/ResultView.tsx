import React, { useState } from 'react';
import { CompanyAnalysis } from '../types';
import { Copy, Check, ChevronRight, ChevronDown, Layers, Users, Zap, MessageSquare } from 'lucide-react';

interface ResultViewProps {
  analysis: CompanyAnalysis;
}

export const ResultView: React.FC<ResultViewProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.generatedSystemInstruction);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Industry" icon={Layers} value={analysis.industry} />
        <Card title="Tone" icon={MessageSquare} value={analysis.brandTone} />
        <Card title="Key Focus" icon={Zap} value={analysis.keySellingPoints[0] || 'N/A'} />
        <Card title="Audience" icon={Users} value={analysis.targetAudience[0] || 'General'} />
      </div>

      {/* Detailed Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 border-b border-slate-800 pb-2">
          Company Profile Extracted
        </h3>
        <p className="text-slate-400 mb-6">{analysis.description}</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-medium text-brand-400 uppercase tracking-wider mb-3">Key Selling Points</h4>
            <ul className="space-y-2">
              {analysis.keySellingPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-brand-400 uppercase tracking-wider mb-3">Identified Products</h4>
            <ul className="space-y-2">
              {analysis.products.slice(0, 4).map((prod, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"></span>
                  <span><strong className="text-slate-200">{prod.name}</strong>: {prod.description.substring(0, 50)}...</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Prompt Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div 
          className="p-4 bg-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-750 transition-colors"
          onClick={() => setShowPrompt(!showPrompt)}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-100">Generated System Prompt</h3>
            <span className="text-xs bg-brand-900 text-brand-300 px-2 py-0.5 rounded border border-brand-800">Ready to Use</span>
          </div>
          <div className="flex items-center gap-3">
            {showPrompt ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
          </div>
        </div>
        
        {showPrompt && (
          <div className="p-0 animate-in slide-in-from-top-2 duration-300">
             <div className="relative">
                <pre className="bg-slate-950 p-6 text-sm text-slate-400 overflow-x-auto whitespace-pre-wrap font-mono max-h-[400px]">
                  {analysis.generatedSystemInstruction}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg border border-slate-700 shadow-lg transition-all flex items-center gap-2 text-xs font-medium"
                >
                  {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, icon: Icon, value }: { title: string, icon: any, value: string }) => (
  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-start justify-between hover:border-slate-700 transition-colors">
    <div>
      <p className="text-slate-500 text-xs font-medium uppercase mb-1">{title}</p>
      <p className="text-slate-200 font-semibold text-sm line-clamp-2">{value}</p>
    </div>
    <div className="bg-slate-800 p-2 rounded-lg text-brand-500">
      <Icon size={18} />
    </div>
  </div>
);
