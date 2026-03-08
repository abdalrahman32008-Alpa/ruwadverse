import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Paperclip, ArrowRight, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface Message {
  id: string;
  senderId: string;
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

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    user: { id: 'u1', name: 'أحمد محمد', avatar: 'https://i.pravatar.cc/150?u=1', status: 'online' },
    lastMessage: 'هل يمكننا مناقشة تفاصيل المشروع؟',
    unreadCount: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    user: { id: 'u2', name: 'سارة علي', avatar: 'https://i.pravatar.cc/150?u=2', status: 'offline' },
    lastMessage: 'شكراً لك، سأرسل الملفات قريباً.',
    unreadCount: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '3',
    user: { id: 'u3', name: 'خالد عمر', avatar: 'https://i.pravatar.cc/150?u=3', status: 'online' },
    lastMessage: 'تم استلام الدفعة الأولى.',
    unreadCount: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: 'u1', text: 'مرحباً، كيف حالك؟', timestamp: new Date(Date.now() - 1000 * 60 * 60), isRead: true },
    { id: 'm2', senderId: 'me', text: 'أهلاً أحمد، أنا بخير. ماذا عنك؟', timestamp: new Date(Date.now() - 1000 * 60 * 55), isRead: true },
    { id: 'm3', senderId: 'u1', text: 'بخير والحمد لله. كنت أود مناقشة فكرة المشروع الجديد.', timestamp: new Date(Date.now() - 1000 * 60 * 10), isRead: false },
    { id: 'm4', senderId: 'u1', text: 'هل يمكننا مناقشة تفاصيل المشروع؟', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false }
  ]
};

export const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const currentMessages = selectedConversationId ? (messages[selectedConversationId] || []) : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date(),
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
  };

  return (
    <div className="h-[calc(100vh-120px)] rounded-3xl bg-[#141517] border border-white/10 flex overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full md:w-1/3 border-l border-white/10 flex flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
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
          {conversations.map(conv => (
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
          ))}
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
                <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.senderId === 'me' 
                      ? 'bg-[#FFD700] text-black rounded-tr-sm' 
                      : 'bg-[#141517] text-white border border-white/10 rounded-tl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.senderId === 'me' ? 'text-black/60' : 'text-gray-400'}`}>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.senderId === 'me' && <CheckCheck size={12} />}
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
