import React, { useEffect, useState } from 'react';
import { Loader2, Search, Globe, BrainCircuit } from 'lucide-react';

const steps = [
  { icon: Globe, text: "Connecting to website..." },
  { icon: Search, text: "Scanning pages and sub-pages..." },
  { icon: BrainCircuit, text: "Analyzing brand voice & offerings..." },
  { icon: Loader2, text: "Synthesizing AI Persona..." },
];

export const AnalysisLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500); // Change step every 2.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
          {React.createElement(steps[currentStep].icon, { 
            className: `w-12 h-12 text-brand-400 ${currentStep === 3 ? 'animate-spin' : 'animate-bounce'}`, 
            strokeWidth: 1.5 
          })}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-slate-100">
          Building your Sales Agent
        </h3>
        <p className="text-slate-400 max-w-sm mx-auto h-6 transition-all duration-300">
          {steps[currentStep].text}
        </p>
      </div>

      <div className="flex gap-2">
        {steps.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx <= currentStep ? 'w-8 bg-brand-500' : 'w-2 bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
