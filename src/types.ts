export type UserRole = 'founder' | 'skill' | 'investor' | 'admin';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  sector: string;
  status: 'analyzing' | 'listed' | 'matched' | 'funded';
  funding_needed: number;
  success_rate?: number;
  created_at: string;
  owner?: {
    full_name: string;
    avatar_url?: string;
    user_type: string;
  };
}

export interface MarketTrend {
  id: string;
  sector: string;
  trend_data: any;
  created_at: string;
}
