import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Paperclip, ArrowRight, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  unreadCount: number;
  timestamp: Date;
}

export const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id (id, name, avatar_url),
            receiver:receiver_id (id, name, avatar_url)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data) {
          const msgs: Message[] = data.map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            receiverId: m.receiver_id,
            text: m.content,
            timestamp: new Date(m.created_at),
            isRead: m.read
          }));

          // Group messages by conversation partner
          const groupedMessages: Record<string, Message[]> = {};
          const conversationMap: Record<string, Conversation> = {};

          msgs.forEach(msg => {
            const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
            
            if (!groupedMessages[partnerId]) {
              groupedMessages[partnerId] = [];
            }
            groupedMessages[partnerId].push(msg);

            // Find partner details from the message data
            // We need to find the original data object for this message to get user details
            const originalMsg = data.find((d: any) => d.id === msg.id);
            const partner = msg.senderId === user.id ? originalMsg.receiver : originalMsg.sender;

            if (partner) {
                // Only set if not already set or update if newer?
                // Actually we iterate all messages, so we will update repeatedly.
                // Better to init conversationMap first?
                // Or just update.
                
                // We want the latest message for the conversation preview
                const currentConv = conversationMap[partnerId];
                const isNewer = !currentConv || msg.timestamp > currentConv.timestamp;

                if (isNewer) {
                    conversationMap[partnerId] = {
                        id: partnerId,
                        user: {
                            id: partner.id,
                            name: partner.name || 'مستخدم',
                            avatar: partner.avatar_url || `https://i.pravatar.cc/150?u=${partner.id}`,
                            status: 'offline' // Placeholder
                        },
                        lastMessage: msg.text,
                        unreadCount: 0, // Will calc later
                        timestamp: msg.timestamp
                    };
                }
            }
          });
          
          // Calculate unread counts
          Object.keys(groupedMessages).forEach(partnerId => {
             const partnerMsgs = groupedMessages[partnerId];
             const unread = partnerMsgs.filter(m => m.senderId !== user.id && !m.isRead).length;
             if (conversationMap[partnerId]) {
                 conversationMap[partnerId].unreadCount = unread;
             }
          });

          setMessages(groupedMessages);
          setConversations(Object.values(conversationMap).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const currentMessages = selectedConversationId ? (messages[selectedConversationId] || []) : [];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: selectedConversationId,
            content: newMessage,
            read: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const msg: Message = {
        id: data.id,
        senderId: user.id,
        receiverId: selectedConversationId,
        text: data.content,
        timestamp: new Date(data.created_at),
        isRead: false
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), msg]
      }));
      
      // Update last message in conversation list
      setConversations(prev => prev.map(c => {
        if (c.id === selectedConversationId) {
          return {
            ...c,
            lastMessage: newMessage,
            timestamp: new Date()
          };
        }
        return c;
      }));

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] rounded-3xl bg-[#141517] border border-white/10 flex overflow-hidden relative">
      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-[-200px] w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-[-200px] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* Conversations List */}
      <div className={`w-full md:w-1/3 border-l border-white/10 flex flex-col relative z-10 ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10">
          <h2 className="font-bold text-xl mb-4">المحادثات</h2>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             [1, 2, 3].map(i => (
               <div key={i} className="p-4 flex gap-3">
                 <div className="skeleton-line w-12 h-12 rounded-full" />
                 <div className="flex-1">
                   <div className="skeleton-line w-1/2 mb-2" />
                   <div className="skeleton-line w-3/4" />
                 </div>
               </div>
             ))
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Send size={24} className="opacity-50" />
              </div>
              <h3>لا توجد محادثات بعد</h3>
              <p className="text-sm">ابدأ بالتواصل مع أصحاب الأفكار والمستثمرين</p>
            </div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`p-4 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors ${selectedConversationId === conv.id ? 'bg-white/5 border-r-2 border-[#FFD700]' : ''}`}
              >
                <div className="relative">
                  <img src={conv.user.avatar} alt={conv.user.name} className="w-12 h-12 rounded-full object-cover" />
                  {conv.user.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141517] rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-sm truncate">{conv.user.name}</h3>
                    <span className="text-xs text-gray-500">
                      {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#FFD700] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#0B0C0E] ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#141517]">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedConversationId(null)} className="md:hidden text-gray-400">
                  <ArrowRight size={24} />
                </button>
                <img src={selectedConversation.user.avatar} alt={selectedConversation.user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold">{selectedConversation.user.name}</h3>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    {selectedConversation.user.status === 'online' ? 'متصل الآن' : 'غير متصل'}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-gray-400">
                <button className="hover:text-white"><Phone size={20} /></button>
                <button className="hover:text-white"><Video size={20} /></button>
                <button className="hover:text-white"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.senderId === user?.id 
                      ? 'bg-[#FFD700] text-black rounded-tr-sm' 
                      : 'bg-[#141517] text-white border border-white/10 rounded-tl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.senderId === user?.id ? 'text-black/60' : 'text-gray-400'}`}>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.senderId === user?.id && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#141517] border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
                <button className="p-2 text-gray-400 hover:text-white">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك..." 
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFC000] disabled:opacity-50 transition-colors"
                >
                  <Send size={18} className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="opacity-50" />
            </div>
            <p>اختر محادثة للبدء</p>
          </div>
        )}
      </div>
    </div>
  );
};
