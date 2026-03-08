import { User } from '@supabase/supabase-js';

export type PostType = 'idea' | 'skill' | 'investment' | 'community';
export type VisibilityType = 'public' | 'private' | 'connections';

export interface Post {
  id: string;
  author_id: string;
  type: PostType;
  title?: string;
  content: string;
  media_urls: string[];
  sector?: string;
  stage?: string;
  raed_score?: number;
  equity_summary?: any;
  visibility: VisibilityType;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url: string;
    user_type: string;
  };
  reactions_count?: number;
  comments_count?: number;
  user_reaction?: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  created_at: string;
  author?: {
    full_name: string;
    avatar_url: string;
  };
  replies?: Comment[];
}

export interface Story {
  id: string;
  author_id: string;
  type: string;
  media_url?: string;
  caption?: string;
  expires_at: string;
  created_at: string;
  author?: {
    full_name: string;
    avatar_url: string;
  };
}

export type ConversationType = 'private' | 'project' | 'channel' | 'raed_dm';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  project_id?: string;
  created_by?: string;
  is_raed_member: boolean;
  created_at: string;
  members?: ConversationMember[];
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationMember {
  conversation_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: {
    full_name: string;
    avatar_url: string;
    user_type: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments?: string[];
  reply_to_message_id?: string;
  created_at: string;
  edited_at?: string;
  mentions_raed: boolean;
  metadata: any;
  sender?: {
    full_name: string;
    avatar_url: string;
    user_type: string;
  };
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  actor_id?: string;
  entity_id: string;
  entity_type: string;
  is_read: boolean;
  created_at: string;
  actor?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface ReputationEvent {
  id: string;
  user_id: string;
  type: string;
  delta: number;
  reason?: string;
  created_at: string;
}
