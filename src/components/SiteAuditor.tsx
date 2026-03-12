import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, X, Copy, CheckCircle, AlertTriangle, RefreshCw, BrainCircuit, ShieldAlert, Move } from 'lucide-react';
import { RAEDAgentService } from '../services/raedAgentService';
import ReactMarkdown from 'react-markdown';

interface AuditIssue {
  id: string;
  type: 'ui_overlap' | 'text_overflow' | 'console_error' | 'accessibility' | 'empty_interactive';
  element?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'fixed' | 'verifying' | 'failed_verification';
  aiAnalysis?: string;
  isAnalyzing?: boolean;
}

export const SiteAuditor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const [isContinuous, setIsContinuous] = useState(false);

  // Helper to check if element is visible
  const isVisible = (el: Element) => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.getBoundingClientRect().width > 0;
  };

  // Helper to check if elements actually overlap visually
  const isOverlapping = (rect1: DOMRect, rect2: DOMRect) => {
    return !(rect1.right <= rect2.left || 
             rect1.left >= rect2.right || 
             rect1.bottom <= rect2.top || 
             rect1.top >= rect2.bottom);
  };

  const performScan = () => {
    const newIssues: AuditIssue[] = [];
    const allElements = Array.from(document.querySelectorAll('*')).filter(isVisible);
    
    // 1. Check for text overflow
    allElements.forEach((el) => {
      if (el.scrollWidth > el.clientWidth && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
        const overflowX = window.getComputedStyle(el).overflowX;
        if (overflowX !== 'auto' && overflowX !== 'scroll' && overflowX !== 'hidden') {
          newIssues.push({
            id: `overflow_${Math.random().toString(36).substring(7)}`,
            type: 'text_overflow',
            element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className && typeof el.className === 'string' ? `.${el.className.split(' ')[0]}` : ''),
            message: 'نص أو محتوى يخرج عن إطار الحاوية (Text Overflow).',
            severity: 'medium',
            status: 'open'
          });
        }
      }
    });

    // 2. Comprehensive Overlap Check (All interactables)
    const interactables = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]')).filter(isVisible);
    
    for (let i = 0; i < interactables.length; i++) {
      for (let j = i + 1; j < interactables.length; j++) {
        const el1 = interactables[i];
        const el2 = interactables[j];
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        
        // Check intersection
        if (isOverlapping(rect1, rect2)) {
           // If one is not a child of another
           if (!el1.contains(el2) && !el2.contains(el1)) {
              const style1 = window.getComputedStyle(el1);
              const style2 = window.getComputedStyle(el2);
              
              // Ignore if one of them is pointer-events: none
              if (style1.pointerEvents === 'none' || style2.pointerEvents === 'none') continue;

              const context = `(Z-index: ${style1.zIndex} vs ${style2.zIndex}, Position: ${style1.position} vs ${style2.position})`;
              
              newIssues.push({
                id: `overlap_${Math.random().toString(36).substring(7)}`,
                type: 'ui_overlap',
                element: `${el1.tagName.toLowerCase()} vs ${el2.tagName.toLowerCase()}`,
                message: `تداخل بين عنصرين تفاعليين مما قد يمنع النقر. ${context}`,
                severity: 'high',
                status: 'open'
              });
           }
        }
      }
    }

    // 3. Check for missing alt tags on images
    const images = Array.from(document.querySelectorAll('img:not([alt]), img[alt=""]')).filter(isVisible);
    if (images.length > 0) {
      newIssues.push({
        id: `a11y_${Math.random().toString(36).substring(7)}`,
        type: 'accessibility',
        message: `تم العثور على ${images.length} صورة بدون نص بديل (Alt tag).`,
        severity: 'low',
        status: 'open'
      });
    }

    // 4. Check for empty buttons/links
    interactables.forEach((el) => {
      const text = (el as HTMLElement).innerText?.trim();
      const ariaLabel = el.getAttribute('aria-label');
      const hasChildren = el.children.length > 0;
      
      if (!text && !ariaLabel && !hasChildren) {
         newIssues.push({
          id: `empty_${Math.random().toString(36).substring(7)}`,
          type: 'empty_interactive',
          element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
          message: `عنصر تفاعلي فارغ ولا يحتوي على نص أو Aria-label.`,
          severity: 'medium',
          status: 'open'
        });
      }
    });

    return newIssues;
  };

  const scanSite = () => {
    setIsScanning(true);
    setIssues([]); // Reset issues
    
    setTimeout(() => {
      const newIssues = performScan();
      
      // Deduplicate issues based on type and message
      const uniqueIssues = newIssues.filter((issue, index, self) =>
        index === self.findIndex((t) => (
          t.type === issue.type && t.message === issue.message
        ))
      );

      setIssues(uniqueIssues);
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    let observer: MutationObserver;
    let timeoutId: NodeJS.Timeout;

    if (isContinuous) {
      observer = new MutationObserver(() => {
        // Debounce the scan to avoid performance issues
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const newIssues = performScan();
          setIssues(prev => {
            const combined = [...prev, ...newIssues];
            return combined.filter((issue, index, self) =>
              index === self.findIndex((t) => (
                t.type === issue.type && t.message === issue.message
              ))
            );
          });
        }, 1000);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    return () => {
      if (observer) observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [isContinuous]);

  useEffect(() => {
    // Catch console errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      
      // Filter out React DevTools and specific benign errors
      if (message.includes('React DevTools') || message.includes('Warning:')) {
         originalError.apply(console, args);
         return;
      }

      setIssues(prev => {
        if (prev.some(i => i.message === message)) return prev;
        return [...prev, {
          id: `console_${Math.random().toString(36).substring(7)}`,
          type: 'console_error',
          message: message.substring(0, 150) + (message.length > 150 ? '...' : ''),
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

  const analyzeIssue = async (id: string) => {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;

    setIssues(prev => prev.map(i => i.id === id ? { ...i, isAnalyzing: true } : i));
    
    const details = `Type: ${issue.type}, Message: ${issue.message}, Element: ${issue.element || 'N/A'}`;
    const analysis = await RAEDAgentService.analyzeUIIssue(details);
    
    setIssues(prev => prev.map(i => i.id === id ? { ...i, isAnalyzing: false, aiAnalysis: analysis } : i));
  };

  const verifyFix = (id: string) => {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;

    setIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'verifying' } : i));

    // Simulate verification by re-running a mini scan for that specific issue type
    setTimeout(async () => {
      let isFixed = true;
      
      if (issue.type === 'ui_overlap') {
         // Quick re-check of overlaps
         const interactables = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]')).filter(isVisible);
         let overlapFound = false;
         for (let i = 0; i < interactables.length; i++) {
           for (let j = i + 1; j < interactables.length; j++) {
             const rect1 = interactables[i].getBoundingClientRect();
             const rect2 = interactables[j].getBoundingClientRect();
             if (isOverlapping(rect1, rect2)) {
               if (!interactables[i].contains(interactables[j]) && !interactables[j].contains(interactables[i])) {
                 const style1 = window.getComputedStyle(interactables[i]);
                 const style2 = window.getComputedStyle(interactables[j]);
                 if (style1.pointerEvents !== 'none' && style2.pointerEvents !== 'none') {
                   overlapFound = true; break;
                 }
               }
             }
           }
           if (overlapFound) break;
         }
         isFixed = !overlapFound;
      } else if (issue.type === 'text_overflow') {
         // Quick re-check of overflows
         const allElements = Array.from(document.querySelectorAll('*')).filter(isVisible);
         const overflowFound = allElements.some(el => el.scrollWidth > el.clientWidth && window.getComputedStyle(el).overflowX !== 'auto' && window.getComputedStyle(el).overflowX !== 'scroll' && window.getComputedStyle(el).overflowX !== 'hidden');
         isFixed = !overflowFound;
      }

      if (isFixed) {
        setIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'fixed' } : i));
      } else {
        // If it failed verification, ask AI why
        const analysis = await RAEDAgentService.analyzeUIIssue(`لقد حاولت إصلاح هذه المشكلة (${issue.message}) ولكن عند إعادة التحقق، لا تزال المشكلة موجودة. لماذا قد تستمر هذه المشكلة وكيف أتأكد من حلها جذرياً؟`);
        setIssues(prev => prev.map(i => i.id === id ? { ...i, status: 'failed_verification', aiAnalysis: analysis } : i));
      }
    }, 1500);
  };

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        className="absolute bottom-4 right-4 pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-3 rounded-full border border-red-500/20 shadow-lg backdrop-blur-sm transition-all group flex items-center justify-center relative"
          title="المدقق الذكي (اسحب للتحريك)"
        >
          <Bug size={24} className="group-hover:scale-110 transition-transform" />
          <Move size={12} className="absolute -top-1 -left-1 text-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          {issues.filter(i => i.status === 'open' || i.status === 'failed_verification').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {issues.filter(i => i.status === 'open' || i.status === 'failed_verification').length}
            </span>
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-20 right-4 w-[calc(100vw-2rem)] sm:w-[450px] max-w-full bg-[#0B0C0E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#141517]">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-red-400" size={20} />
                <div>
                  <h3 className="font-bold text-white text-sm">المدقق الذكي (AI Auditor)</h3>
                  <p className="text-[10px] text-gray-400">فحص شامل للواجهة والأداء</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] text-gray-400">فحص مستمر</span>
                  <div className={`w-8 h-4 rounded-full transition-colors relative ${isContinuous ? 'bg-green-500' : 'bg-gray-700'}`}>
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isContinuous} 
                      onChange={(e) => setIsContinuous(e.target.checked)} 
                    />
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isContinuous ? 'left-0.5 translate-x-4' : 'left-0.5'}`} />
                  </div>
                </label>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <RefreshCw className="animate-spin mb-4 text-[#FFD700]" size={32} />
                  <p className="text-sm font-bold text-white mb-1">جاري الفحص العميق...</p>
                  <p className="text-xs">نبحث عن التداخلات، خروج النصوص، ومشاكل الأداء</p>
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-500/50" />
                  <p className="text-sm font-bold text-white mb-1">المنصة تبدو ممتازة!</p>
                  <p className="text-xs">لم يتم العثور على أي مشاكل. قم بإجراء فحص جديد للتأكد.</p>
                </div>
              ) : (
                issues.map(issue => (
                  <div key={issue.id} className={`p-4 rounded-xl border transition-all ${
                    issue.status === 'fixed' ? 'bg-green-500/5 border-green-500/20 opacity-60' : 
                    issue.status === 'failed_verification' ? 'bg-red-500/10 border-red-500/30' :
                    'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-start gap-3">
                      {issue.severity === 'high' ? <ShieldAlert className="text-red-400 shrink-0 mt-1" size={18} /> :
                       issue.severity === 'medium' ? <AlertTriangle className="text-yellow-400 shrink-0 mt-1" size={18} /> :
                       <AlertTriangle className="text-blue-400 shrink-0 mt-1" size={18} />}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-bold ${issue.status === 'fixed' ? 'line-through text-gray-500' : 'text-white'}`}>
                            {issue.type.replace('_', ' ').toUpperCase()}
                          </p>
                          {issue.status === 'failed_verification' && (
                            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/20">فشل الإصلاح</span>
                          )}
                          {issue.status === 'fixed' && (
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                              <CheckCircle size={10} /> تم الإصلاح
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-300 mb-2 leading-relaxed">{issue.message}</p>
                        {issue.element && <p className="text-[10px] text-gray-500 mb-3 font-mono bg-black/30 p-1.5 rounded border border-white/5 break-all">{issue.element}</p>}

                        {/* AI Analysis Section */}
                        {issue.aiAnalysis && (
                          <div className="mt-3 mb-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                            <div className="flex items-center gap-1.5 mb-2">
                              <BrainCircuit size={14} className="text-purple-400" />
                              <span className="text-xs font-bold text-purple-400">تحليل الذكاء الاصطناعي</span>
                            </div>
                            <div className="text-xs text-gray-300 prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown>{issue.aiAnalysis}</ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        {issue.status !== 'fixed' && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <button 
                              onClick={() => analyzeIssue(issue.id)}
                              disabled={issue.isAnalyzing}
                              className="text-[10px] bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              {issue.isAnalyzing ? <RefreshCw size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                              {issue.isAnalyzing ? 'جاري التحليل...' : 'اسأل الذكاء الاصطناعي'}
                            </button>
                            
                            <button 
                              onClick={() => verifyFix(issue.id)}
                              disabled={issue.status === 'verifying'}
                              className="text-[10px] bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              {issue.status === 'verifying' ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              {issue.status === 'verifying' ? 'جاري التحقق...' : 'التحقق من الإصلاح'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#141517] flex gap-2">
              <button
                onClick={scanSite}
                disabled={isScanning}
                className="flex-1 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#FFD700]/10"
              >
                <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
                {isScanning ? 'جاري الفحص...' : 'فحص شامل للواجهة'}
              </button>
              <button
                onClick={copyReport}
                disabled={issues.filter(i => i.status !== 'fixed').length === 0}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'تم النسخ!' : 'نسخ التقرير للذكاء'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
