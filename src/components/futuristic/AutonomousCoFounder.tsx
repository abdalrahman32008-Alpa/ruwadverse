import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Code, Database, Globe, Play, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export const AutonomousCoFounder = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTask, setCurrentTask] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const tasks = [
    { id: 1, name: 'تحليل المنافسين (Competitor Scraping)', icon: <Globe size={16} />, duration: 3000 },
    { id: 2, name: 'بناء الهوية البصرية (Brand Identity)', icon: <Cpu size={16} />, duration: 4000 },
    { id: 3, name: 'إعداد البنية التحتية (Cloud Setup)', icon: <Database size={16} />, duration: 3500 },
    { id: 4, name: 'برمجة الصفحة المقصودة (Landing Page)', icon: <Code size={16} />, duration: 5000 },
  ];

  const startExecution = () => {
    setIsExecuting(true);
    setLogs(['> INITIALIZING RAED AUTONOMOUS CORE v3.0']);
    setCurrentTask(0);
  };

  useEffect(() => {
    if (isExecuting && currentTask < tasks.length) {
      const task = tasks[currentTask];
      
      // Add start log
      setLogs(prev => [...prev, `> [${task.name}] STARTING EXECUTION...`]);
      
      // Simulate progress logs
      const progressInterval = setInterval(() => {
        setLogs(prev => [...prev, `> [${task.name}] Processing neural weights... ${(Math.random() * 100).toFixed(1)}%`]);
      }, task.duration / 3);

      // Complete task
      const timer = setTimeout(() => {
        clearInterval(progressInterval);
        setLogs(prev => [...prev, `> [${task.name}] COMPLETED SUCCESSFULLY.`, '----------------------------------------']);
        setCurrentTask(prev => prev + 1);
      }, task.duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    } else if (isExecuting && currentTask === tasks.length) {
      setLogs(prev => [...prev, '> ALL TASKS COMPLETED. AWAITING NEW DIRECTIVES.']);
      setIsExecuting(false);
    }
  }, [isExecuting, currentTask]);

  // Auto-scroll logs
  useEffect(() => {
    const logContainer = document.getElementById('terminal-logs');
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#0B0C0E] border border-white/10 rounded-3xl p-6 relative overflow-hidden font-mono mt-8">
      {/* Cyberpunk Grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#00ff00_1px,transparent_1px),linear-gradient(to_bottom,#00ff00_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="text-green-500" />
            الشريك المؤسس الذاتي (Autonomous Co-Founder)
          </h3>
          <p className="text-gray-400 text-sm mt-1">تفويض المهام التقنية والتسويقية لـ RAED AI للتنفيذ الفعلي</p>
        </div>
        
        {!isExecuting && currentTask === 0 && (
          <button 
            onClick={startExecution}
            className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Play size={16} />
            بدء التنفيذ المستقل (Execute)
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        {/* Task List */}
        <div className="col-span-1 space-y-3">
          <h4 className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-wider">قائمة المهام (Task Queue)</h4>
          {tasks.map((task, idx) => {
            const isCompleted = currentTask > idx;
            const isActive = currentTask === idx && isExecuting;
            
            return (
              <div 
                key={task.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isActive ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                  isCompleted ? 'bg-white/5 border-white/10 opacity-50' : 'bg-black/40 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isActive ? 'text-green-400' : isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                    {task.icon}
                  </div>
                  <span className={`text-sm ${isActive ? 'text-white font-bold' : isCompleted ? 'text-gray-500 line-through' : 'text-gray-400'}`}>
                    {task.name}
                  </span>
                </div>
                {isActive && <Loader2 size={14} className="animate-spin text-green-500" />}
                {isCompleted && <CheckCircle2 size={14} className="text-green-500" />}
              </div>
            );
          })}
          
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-2">
            <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-yellow-400/80 leading-relaxed">
              تحذير: التنفيذ المستقل يستهلك رصيد الحوسبة (Compute Credits). يرجى مراجعة المخرجات قبل الاعتماد النهائي.
            </p>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="col-span-2 bg-black border border-white/10 rounded-2xl p-4 relative overflow-hidden flex flex-col h-[300px]">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500 ml-2">raed-core@ruwadverse:~</span>
          </div>
          
          <div 
            id="terminal-logs"
            className="flex-1 overflow-y-auto custom-scrollbar text-xs text-green-400 font-mono space-y-1"
          >
            {logs.length === 0 ? (
              <div className="text-gray-600">Awaiting execution command...</div>
            ) : (
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${log.includes('ERROR') ? 'text-red-500' : log.includes('COMPLETED') ? 'text-white font-bold' : ''}`}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {isExecuting && (
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-3 bg-green-500 ml-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
