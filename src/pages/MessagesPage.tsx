import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, MoreVertical, Send, Paperclip, Mic, 
  Smile, Phone, Video, Info, Sparkles, CheckCheck,
  ChevronRight, ArrowLeft, MessageSquare, Users, Hash,
  Pin, Trash2, Edit3, Reply, Forward, Image as ImageIcon,
  FileText, BarChart2, Calendar, MapPin, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Conversation, Message, ConversationType } from '../types/social';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

// --- Messages Page Component ---
export const MessagesPage = () => {
  const { t, language, dir } = useLanguage();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'private' | 'project' | 'channel'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchConversations();
    
    // Realtime subscription for new messages/conversations
    const channel = supabase
      .channel('messages_page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchConversations)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        // Update last message in conversation list
        setConversations(prev => prev.map(c => {
          if (c.id === payload.new.conversation_id) {
            return { ...c, last_message: payload.new as Message };
          }
          return c;
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  const fetchConversations = async () => {
    if (!user) return;
    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          members:conversation_members(
            *,
            profile:profiles(full_name, avatar_url, user_type)
          ),
          last_message:messages(content, created_at, sender_id)
        `)
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('type', activeTab);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Filter conversations where user is a member
      const filtered = data?.filter(c => c.members.some((m: any) => m.user_id === user.id)) || [];
      setConversations(filtered);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen pt-20 flex overflow-hidden bg-[#0B0C0E]" dir={dir}>
      {/* Sidebar: Conversation List */}
      <div className={`
        ${isSidebarOpen ? 'w-full md:w-80 lg:w-96' : 'w-0'} 
        transition-all duration-300 border-e border-white/5 flex flex-col bg-[#141517]/50 backdrop-blur-xl
      `}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">المحادثات</h2>
            <button className="p-2 bg-[#FFD700] text-black rounded-xl hover:bg-[#FFC000] transition-all"><Plus size={20} /></button>
          </div>
          
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="البحث في الرسائل..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-sm text-white focus:outline-none focus:border-[#FFD700]/50"
            />
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl overflow-x-auto no-scrollbar">
            {(['all', 'private', 'project', 'channel'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'الكل' : tab === 'private' ? 'خاص' : tab === 'project' ? 'مشاريع' : 'قنوات'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar px-3 space-y-1">
          {loading ? (
            Array(5).fill(0).map((_, i) => <ConversationSkeleton key={i} />)
          ) : conversations.length > 0 ? (
            conversations.map((conv) => (
              <ConversationItem 
                key={conv.id} 
                conversation={conv} 
                isActive={activeConversation?.id === conv.id}
                onClick={() => {
                  setActiveConversation(conv);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
              />
            ))
          ) : (
            <EmptyConversations />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col relative">
        {activeConversation ? (
          <ChatWindow 
            conversation={activeConversation} 
            onBack={() => setIsSidebarOpen(true)} 
          />
        ) : (
          <NoActiveChat />
        )}
      </div>
    </div>
  );
};

// --- Chat Window Component ---
const ChatWindow = ({ conversation, onBack }: { conversation: Conversation, onBack: () => void }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    const channel = supabase
      .channel(`chat_${conversation.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversation.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(full_name, avatar_url, user_type)
        `)
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return;
    
    const mentionsRaed = inputText.includes('@RAED') || inputText.includes('@رائد');
    const messageContent = inputText;
    setInputText('');

    try {
      const { data: msgData, error } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        content: messageContent,
        mentions_raed: mentionsRaed
      }).select().single();

      if (error) throw error;

      if (mentionsRaed) {
        // Trigger RAED response logic (Edge Function or local simulation for now)
        setTimeout(async () => {
          await supabase.from('messages').insert({
            conversation_id: conversation.id,
            sender_id: '00000000-0000-0000-0000-000000000000', // System/RAED ID
            content: `مرحباً بك! أنا رائد. لقد قمت بمنشني في هذه المحادثة. كيف يمكنني مساعدتك في مشروعك اليوم؟`,
            metadata: { is_raed: true }
          });
        }, 1500);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const otherMember = conversation.members?.find(m => m.user_id !== user?.id);

  return (
    <div className="flex flex-col h-full bg-[#0B0C0E]">
      {/* Chat Header */}
      <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[#141517]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="md:hidden p-2 text-gray-400 hover:text-white"><ArrowLeft size={20} /></button>
          <div className="relative">
            <img 
              src={otherMember?.profile?.avatar_url || `https://ui-avatars.com/api/?name=${conversation.name || otherMember?.profile?.full_name}&background=FFD700&color=000`} 
              className="w-12 h-12 rounded-2xl object-cover"
              alt="Avatar"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#141517] rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-white">{conversation.name || otherMember?.profile?.full_name}</h3>
            <p className="text-xs text-green-500 font-medium">متصل الآن</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-gray-400 hover:text-[#FFD700] hover:bg-white/5 rounded-xl transition-all"><Phone size={20} /></button>
          <button className="p-2.5 text-gray-400 hover:text-[#FFD700] hover:bg-white/5 rounded-xl transition-all"><Video size={20} /></button>
          <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Info size={20} /></button>
        </div>
      </div>

      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar"
      >
        {loading ? (
          <div className="flex justify-center py-10"><Sparkles className="animate-spin text-[#FFD700]" /></div>
        ) : messages.length > 0 ? (
          messages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} isMe={msg.sender_id === user?.id} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <MessageSquare size={48} className="mb-4" />
            <p>لا توجد رسائل بعد. ابدأ المحادثة الآن!</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#141517]/80 backdrop-blur-md border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-4">
            <div className="flex-grow relative">
              <div className="absolute right-4 bottom-3.5 flex gap-2">
                <button className="text-gray-500 hover:text-[#FFD700] transition-colors"><Smile size={20} /></button>
                <button className="text-gray-500 hover:text-[#FFD700] transition-colors"><Paperclip size={20} /></button>
              </div>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="اكتب رسالتك هنا... (استخدم @RAED لسؤالي)" 
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-3.5 pr-16 pl-12 text-sm text-white focus:outline-none focus:border-[#FFD700]/50 resize-none max-h-32"
                rows={1}
              />
              <button className="absolute left-4 bottom-3.5 text-gray-500 hover:text-[#FFD700] transition-colors"><Mic size={20} /></button>
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-4 bg-[#FFD700] text-black rounded-2xl hover:bg-[#FFC000] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD700]/10"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const ConversationItem: React.FC<{ conversation: Conversation, isActive: boolean, onClick: () => void }> = ({ conversation, isActive, onClick }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const otherMember = conversation.members?.find(m => m.user_id !== user?.id);
  
  return (
    <button 
      onClick={onClick}
      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
        isActive ? 'bg-[#FFD700]/10 border border-[#FFD700]/20' : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <div className="relative">
        <img 
          src={otherMember?.profile?.avatar_url || `https://ui-avatars.com/api/?name=${conversation.name || otherMember?.profile?.full_name}&background=FFD700&color=000`} 
          className="w-14 h-14 rounded-2xl object-cover"
          alt="Avatar"
        />
        {isActive && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FFD700] rounded-lg flex items-center justify-center text-black"><CheckCheck size={10} /></div>}
      </div>
      <div className="flex-grow text-start overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`font-bold truncate ${isActive ? 'text-[#FFD700]' : 'text-white'}`}>
            {conversation.name || otherMember?.profile?.full_name}
          </h4>
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            {conversation.last_message ? formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: false, locale: language === 'ar' ? ar : undefined }) : ''}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 truncate max-w-[180px]">
            {conversation.last_message?.content || 'ابدأ المحادثة الآن...'}
          </p>
          {conversation.unread_count ? (
            <span className="bg-[#FFD700] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {conversation.unread_count}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};

const MessageBubble: React.FC<{ message: Message, isMe: boolean }> = ({ message, isMe }) => {
  const isRaed = message.sender_id === '00000000-0000-0000-0000-000000000000' || message.metadata?.is_raed;

  return (
    <div className={`flex ${isMe ? 'justify-start' : 'justify-end'} ${isRaed ? 'justify-center' : ''}`}>
      <div className={`max-w-[80%] flex gap-3 ${isMe ? 'flex-row' : 'flex-row-reverse'} ${isRaed ? 'flex-col items-center max-w-[90%]' : ''}`}>
        {!isRaed && (
          <img 
            src={message.sender?.avatar_url || `https://ui-avatars.com/api/?name=${message.sender?.full_name}&background=FFD700&color=000`} 
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0 mt-auto"
            alt="Avatar"
          />
        )}
        
        <div className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} ${isRaed ? 'items-center' : ''}`}>
          <div className={`
            px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg
            ${isMe ? 'bg-[#FFD700] text-black rounded-br-none' : 'bg-white/5 text-white border border-white/10 rounded-bl-none'}
            ${isRaed ? 'bg-gradient-to-br from-[#FFD700]/20 to-purple-500/20 border border-[#FFD700]/30 text-white rounded-3xl text-center' : ''}
          `}>
            {isRaed && (
              <div className="flex items-center justify-center gap-2 mb-2 text-[#FFD700] font-bold text-xs uppercase tracking-widest">
                <Sparkles size={14} />
                <span>RAED AI INSIGHT</span>
              </div>
            )}
            {message.content}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 px-1">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

const ConversationSkeleton = () => (
  <div className="p-4 rounded-2xl flex items-center gap-4 opacity-50">
    <div className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse"></div>
    <div className="flex-grow space-y-2">
      <div className="w-32 h-4 bg-white/5 rounded-full animate-pulse"></div>
      <div className="w-48 h-3 bg-white/5 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const NoActiveChat = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
      <MessageSquare size={48} className="text-gray-600" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">مرحباً بك في مركز الرسائل</h3>
    <p className="text-gray-400 max-w-md mx-auto">
      تواصل مع المؤسسين، الخبراء، والمستثمرين لبناء مشروعك القادم. استخدم @RAED في أي محادثة للحصول على استشارة فورية.
    </p>
  </div>
);

const EmptyConversations = () => (
  <div className="text-center py-20 px-6">
    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
      <Users size={32} className="text-gray-600" />
    </div>
    <h4 className="text-white font-bold mb-2">لا توجد محادثات</h4>
    <p className="text-xs text-gray-500">ابدأ بالبحث عن شركاء في سوق الأفكار</p>
  </div>
);
