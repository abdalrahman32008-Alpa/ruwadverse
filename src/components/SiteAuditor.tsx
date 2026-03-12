import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, X, Copy, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface AuditIssue {
  id: string;
  type: 'ui_overlap' | 'text_overflow' | 'console_error' | 'auth_issue' | 'accessibility';
  element?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'fixed';
}

export const SiteAuditor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const scanSite = () => {
    setIsScanning(true);
    setIssues([]);
    
    setTimeout(() => {
      const newIssues: AuditIssue[] = [];
      const elements = document.querySelectorAll('*');
      
      // 1. Check for text overflow
      elements.forEach((el) => {
        if (el.scrollWidth > el.clientWidth && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
          // Ignore elements that are meant to scroll
          const overflowX = window.getComputedStyle(el).overflowX;
          if (overflowX !== 'auto' && overflowX !== 'scroll' && overflowX !== 'hidden') {
            newIssues.push({
              id: Math.random().toString(36).substring(7),
              type: 'text_overflow',
              element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className && typeof el.className === 'string' ? `.${el.className.split(' ')[0]}` : ''),
              message: 'Text or content is overflowing its container horizontally.',
              severity: 'medium',
              status: 'open'
            });
          }
        }
      });

      // 2. Check for overlapping elements (simplified heuristic)
      // This is a heavy operation, so we only check a subset of important elements like buttons and links
      const interactables = document.querySelectorAll('button, a, input, select, textarea');
      const interactablesArray = Array.from(interactables);
      
      for (let i = 0; i < interactablesArray.length; i++) {
        for (let j = i + 1; j < interactablesArray.length; j++) {
          const rect1 = interactablesArray[i].getBoundingClientRect();
          const rect2 = interactablesArray[j].getBoundingClientRect();
          
          // Check if they are visible and overlap
          if (
            rect1.width > 0 && rect1.height > 0 &&
            rect2.width > 0 && rect2.height > 0 &&
            !(rect1.right < rect2.left || 
              rect1.left > rect2.right || 
              rect1.bottom < rect2.top || 
              rect1.top > rect2.bottom)
          ) {
             // If one is not a child of another
             if (!interactablesArray[i].contains(interactablesArray[j]) && !interactablesArray[j].contains(interactablesArray[i])) {
                newIssues.push({
                  id: Math.random().toString(36).substring(7),
                  type: 'ui_overlap',
                  element: 'Multiple interactive elements',
                  message: `Elements are overlapping, which may prevent clicks.`,
                  severity: 'high',
                  status: 'open'
                });
                break; // Just report one overlap per element to avoid spam
             }
          }
        }
      }

      // 3. Check for missing alt tags on images
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        newIssues.push({
          id: Math.random().toString(36).substring(7),
          type: 'accessibility',
          message: `Found ${images.length} image(s) missing 'alt' attributes.`,
          severity: 'low',
          status: 'open'
        });
      }

      // Deduplicate issues
      const uniqueIssues = newIssues.filter((issue, index, self) =>
        index === self.findIndex((t) => (
          t.type === issue.type && t.message === issue.message
        ))
      );

      setIssues(uniqueIssues);
      setIsScanning(false);
    }, 1500);
  };

  useEffect(() => {
    // Catch console errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      setIssues(prev => {
        // Avoid duplicates
        if (prev.some(i => i.message === message)) return prev;
        return [...prev, {
          id: Math.random().toString(36).substring(7),
          type: 'console_error',
          message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
          severity: 'high',
          status: 'open'
        }];
      });
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const copyReport = () => {
    const report = issues.map(i => `[${i.severity.toUpperCase()}] ${i.type}: ${i.message} ${i.element ? `(Element: ${i.element})` : ''}`).join('\n');
    const prompt = `Here is the site audit report. Please fix these issues:\n\n${report}`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markAsFixed = (id: string) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: 'fixed' } : i));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-red-500/10 hover:bg-red-500/20 text-red-500 p-3 rounded-full border border-red-500/20 shadow-lg backdrop-blur-sm transition-all group"
        title="AI Site Auditor"
      >
        <Bug size={24} className="group-hover:scale-110 transition-transform" />
        {issues.filter(i => i.status === 'open').length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {issues.filter(i => i.status === 'open').length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-4 z-50 w-96 bg-[#0B0C0E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141517]">
              <div className="flex items-center gap-2">
                <Bug className="text-red-400" size={20} />
                <h3 className="font-bold text-white">AI Site Auditor</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <RefreshCw className="animate-spin mb-2 text-[#FFD700]" size={24} />
                  <p className="text-sm">Scanning DOM for UI/UX & Technical issues...</p>
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle size={32} className="mx-auto mb-2 text-green-500/50" />
                  <p className="text-sm">No issues found. Run a scan to check.</p>
                </div>
              ) : (
                issues.map(issue => (
                  <div key={issue.id} className={`p-3 rounded-xl border ${issue.status === 'fixed' ? 'bg-green-500/5 border-green-500/10 opacity-50' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {issue.severity === 'high' ? <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} /> :
                         issue.severity === 'medium' ? <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={16} /> :
                         <AlertTriangle className="text-blue-400 shrink-0 mt-0.5" size={16} />}
                        <div>
                          <p className={`text-sm font-bold ${issue.status === 'fixed' ? 'line-through text-gray-500' : 'text-white'}`}>
                            {issue.type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{issue.message}</p>
                          {issue.element && <p className="text-[10px] text-gray-500 mt-1 font-mono">{issue.element}</p>}
                        </div>
                      </div>
                      {issue.status === 'open' && (
                        <button onClick={() => markAsFixed(issue.id)} className="text-xs text-green-400 hover:bg-green-400/10 p-1 rounded transition-colors whitespace-nowrap">
                          Mark Fixed
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#141517] flex gap-2">
              <button
                onClick={scanSite}
                disabled={isScanning}
                className="flex-1 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
                {isScanning ? 'Scanning...' : 'Scan Now'}
              </button>
              <button
                onClick={copyReport}
                disabled={issues.filter(i => i.status === 'open').length === 0}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy for AI'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
