import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  avatar_url: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online?: boolean;
}

export const MessagesPage = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]); // Mock data for now
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial data
  useEffect(() => {
    setChatUsers([
      { id: '1', name: 'Ahmed Ali', avatar_url: 'https://picsum.photos/seed/u1/50/50', lastMessage: 'مرحباً، هل يمكننا مناقشة المشروع؟', lastMessageTime: '10:30 AM', unreadCount: 2, online: true },
      { id: '2', name: 'Sarah Smith', avatar_url: 'https://picsum.photos/seed/u2/50/50', lastMessage: 'تم إرسال العقد للمراجعة.', lastMessageTime: 'Yesterday', unreadCount: 0, online: false },
    ]);
  }, []);

  useEffect(() => {
    if (!activeChat || !user) return;

    // Fetch messages for active chat
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${activeChat},receiver_id.eq.${activeChat}`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as Message;
        if (newMessage.sender_id === activeChat || newMessage.sender_id === user.id) {
          setMessages((prev) => [...prev, newMessage]);
          // Play sound if receiver
          if (newMessage.receiver_id === user.id) {
            new Audio('/notification.mp3').play().catch(() => {});
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat || !user) return;

    const newMessage = {
      sender_id: user.id,
      receiver_id: activeChat,
      content: messageInput,
      read: false
    };

    // Optimistic update
    // setMessages([...messages, { ...newMessage, id: 'temp-' + Date.now(), created_at: new Date().toISOString() }]);
    
    const { error } = await supabase.from('messages').insert(newMessage);
    if (error) console.error('Error sending message:', error);
    
    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-20 pb-4 px-4 flex justify-center">
      <div className="w-full max-w-6xl h-[calc(100vh-120px)] bg-[#141517] border border-white/5 rounded-2xl overflow-hidden flex shadow-2xl">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 border-l border-white/5 flex flex-col bg-[#0B0C0E]/50">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-xl font-bold mb-4 text-white">الرسائل</h2>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="بحث..." 
                className="w-full bg-[#141517] border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-[#FFD700]/50"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chatUsers.map((chatUser) => (
              <div 
                key={chatUser.id}
                onClick={() => setActiveChat(chatUser.id)}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 ${activeChat === chatUser.id ? 'bg-white/5 border-l-4 border-l-[#FFD700]' : ''}`}
              >
                <div className="relative">
                  <img src={chatUser.avatar_url} alt={chatUser.name} className="w-12 h-12 rounded-full object-cover" />
                  {chatUser.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#141517]"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm truncate text-white">{chatUser.name}</h3>
                    <span className="text-xs text-gray-500">{chatUser.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{chatUser.lastMessage}</p>
                </div>
                {chatUser.unreadCount && chatUser.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-[#FFD700] text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {chatUser.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#141517] relative">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#141517]/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <img src={chatUsers.find(u => u.id === activeChat)?.avatar_url} alt="User" className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-bold text-white">{chatUsers.find(u => u.id === activeChat)?.name}</h3>
                    <span className="text-xs text-green-500 flex items-center gap-1">● متصل الآن</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-[#FFD700]"><Phone size={20} /></button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-[#FFD700]"><Video size={20} /></button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 mt-20">
                    <p>لا توجد رسائل بعد. ابدأ المحادثة!</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe ? 'bg-[#FFD700] text-black rounded-tl-none' : 'bg-[#2A2D35] text-white rounded-tr-none'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-black/60' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && (msg.read ? <CheckCheck size={12} /> : <Check size={12} />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/5 bg-[#141517]">
                <div className="flex items-center gap-2 bg-[#0B0C0E] rounded-xl p-2 border border-white/10 focus-within:border-[#FFD700]/50 transition-colors">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors"><Paperclip size={20} /></button>
                  <input 
                    type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اكتب رسالتك..." 
                    className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none px-2"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFC000] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare size={64} className="mb-4 opacity-20" />
              <p>اختر محادثة للبدء</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
