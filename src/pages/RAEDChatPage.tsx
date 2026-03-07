import React from 'react';
import { RAEDChat } from '../chat/RAEDChat';

export const RAEDChatPage = () => {
  return (
    <div className="h-[calc(100vh-120px)] rounded-3xl bg-[#141517] border border-white/10 overflow-hidden">
      <RAEDChat />
    </div>
  );
};
