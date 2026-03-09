import React, { useState } from 'react';
import { Plus, MoreVertical, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ProjectWorkspacePage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'تصميم الـ Pitch Deck', status: 'todo' },
    { id: 2, title: 'تطوير الـ MVP', status: 'in-progress' },
    { id: 3, title: 'البحث عن مستثمرين', status: 'done' },
    { id: 4, title: 'Develop user authentication flow', status: 'todo' },
  ]);

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 40, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8">مساحة عمل المشروع</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {['todo', 'in-progress', 'done'].map((status) => (
            <div key={status} className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 uppercase text-xs">{status}</h3>
              <div className="space-y-4">
                {tasks.filter(t => t.status === status).map(task => (
                  <motion.div 
                    key={task.id} 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm text-white">{task.title}</span>
                    <CheckCircle2 size={16} className={task.status === 'done' ? 'text-[#FFD700]' : 'text-gray-500'} />
                  </motion.div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> إضافة مهمة
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
