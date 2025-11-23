import React, { useState, useEffect } from 'react';
import { AppState, CompanyAnalysis } from './types';
import { geminiService } from './services/geminiService';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ChatPlayground } from './components/ChatPlayground';
import { ResultView } from './components/ResultView';
import { Bot, Sparkles, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';
import { Chat } from '@google/genai';

export default function App() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Basic URL validation/formatting
    let formattedUrl = url;
    if (!url.startsWith('http')) {
      formattedUrl = `https://${url}`;
    }

    setState(AppState.ANALYZING);
    setErrorMsg('');
    setAnalysis(null);
    setChatSession(null);

    try {
      const result = await geminiService.analyzeWebsite(formattedUrl);
      setAnalysis(result);
      
      // Initialize chat session immediately with the result
      const chat = geminiService.createChatSession(result.generatedSystemInstruction);
      setChatSession(chat);
      
      setState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please check the URL and try again.");
      setState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
              <Bot className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Site<span className="text-brand-400">2</span>Persona
            </span>
          </div>
          <div className="flex gap-4 text-sm text-slate-400">
             <a href="#" className="hover:text-brand-400 transition-colors">How it works</a>
             <a href="#" className="hover:text-brand-400 transition-colors">Pricing</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero / Input Section */}
        <div className={`transition-all duration-700 ease-in-out ${state === AppState.IDLE ? 'mt-20 text-center' : 'mb-8'}`}>
          {state === AppState.IDLE && (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-brand-400 mb-6">
                <Sparkles size={12} />
                <span>Powered by Gemini 2.5 Flash</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Turn any website into a <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-500">
                  Sales Agent Prompt
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Enter a company URL. Our AI will scan the pages, understand the product, 
                and generate a perfect system instruction for your AI sales bot.
              </p>
            </>
          )}

          <div className={`mx-auto ${state === AppState.IDLE ? 'max-w-xl' : 'max-w-4xl flex gap-4'}`}>
             <form onSubmit={handleAnalyze} className={`relative group w-full ${state !== AppState.IDLE && 'flex gap-4'}`}>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ExternalLink className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="example.com"
                    className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === AppState.ANALYZING || !url}
                  className={`bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                    ${state === AppState.IDLE ? 'absolute right-2 top-2 bottom-2 px-6' : 'px-8 py-4'}
                  `}
                >
                  {state === AppState.ANALYZING ? 'Scanning...' : 'Analyze'}
                  {state === AppState.IDLE && <ArrowRight size={18} />}
                </button>
             </form>
          </div>
        </div>

        {/* Error Message */}
        {state === AppState.ERROR && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-200">
            <AlertCircle className="text-red-500" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Content Area */}
        <div className="max-w-7xl mx-auto">
          {state === AppState.ANALYZING && (
            <div className="py-20">
              <AnalysisLoader />
            </div>
          )}

          {state === AppState.SUCCESS && analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Left Column: Data & Prompt */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-1 bg-brand-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-white">Analysis Result</h2>
                </div>
                <ResultView analysis={analysis} />
              </div>

              {/* Right Column: Playground */}
              <div className="lg:sticky lg:top-24 h-fit space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-white">Test Playground</h2>
                </div>
                <ChatPlayground chatSession={chatSession} companyName={analysis.name} />
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    This playground uses the generated system prompt above.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
