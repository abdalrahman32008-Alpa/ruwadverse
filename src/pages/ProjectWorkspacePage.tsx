import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
}

export const ProjectWorkspacePage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState<string | null>(null); // status id where adding

  useEffect(() => {
    if (!user) return;
    fetchTasks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [...prev, payload.new as Task]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new as Task : t));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (status: 'todo' | 'in-progress' | 'done') => {
    if (!newTaskTitle.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTaskTitle,
          status,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setTasks([...tasks, data]);
      setNewTaskTitle('');
      setAddingTask(null);
      toast.success('تمت إضافة المهمة');
    } catch (error) {
      toast.error('فشل إضافة المهمة');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
      
      if (newStatus === 'done') {
        const currentScore = Number(localStorage.getItem('enthusiasm_score') || '85');
        localStorage.setItem('enthusiasm_score', Math.min(currentScore + 2, 100).toString());
        window.dispatchEvent(new Event('enthusiasm_updated'));
        toast.success('أحسنت! زاد مستوى حماسك ومصداقيتك');
      }

      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error('فشل تحديث الحالة');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('تم حذف المهمة');
    } catch (error) {
      toast.error('فشل حذف المهمة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center">
        <Loader2 className="animate-spin text-[#FFD700]" size={40} />
      </div>
    );
  }

  const columns = [
    { id: 'todo', label: 'قيد الانتظار' },
    { id: 'in-progress', label: 'قيد العمل' },
    { id: 'done', label: 'مكتمل' }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto relative overflow-hidden pb-20">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">مساحة عمل المشروع</h1>
          <div className="text-sm text-gray-400">
            {tasks.length} مهام إجمالية
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="linear-card p-6 rounded-3xl bg-[#141517]/80 backdrop-blur-md border border-white/10 flex flex-col min-h-[400px]">
              <h3 className="text-lg font-bold text-white mb-4 uppercase text-xs flex justify-between items-center">
                {column.label}
                <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-gray-400">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </h3>
              
              <div className="space-y-4 flex-1">
                <AnimatePresence mode="popLayout">
                  {tasks.filter(t => t.status === column.id).map(task => (
                    <motion.div 
                      key={task.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button 
                          onClick={() => updateTaskStatus(task.id, column.id === 'done' ? 'todo' : 'done')}
                          className={`shrink-0 transition-colors ${task.status === 'done' ? 'text-[#FFD700]' : 'text-gray-500 hover:text-white'}`}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <span className={`text-sm text-white ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {addingTask === column.id ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/10 border border-[#FFD700]/30"
                  >
                    <input 
                      autoFocus
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTask(column.id as any)}
                      placeholder="ما هي المهمة؟"
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500 mb-3"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setAddingTask(null)}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        إلغاء
                      </button>
                      <button 
                        onClick={() => addTask(column.id as any)}
                        className="text-xs bg-[#FFD700] text-black px-3 py-1 rounded-lg font-bold"
                      >
                        إضافة
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setAddingTask(column.id)}
                    className="mt-2 w-full py-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-dashed border-white/10"
                  >
                    <Plus size={16} /> إضافة مهمة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
