import { supabase } from '../lib/supabase';

export interface MatchProfile {
  id: string;
  user_type: 'idea' | 'skill' | 'investor';
  skills: string[];
  experience_years: number;
}

export interface MatchIdea {
  id: string;
  problem: string;
  customers: string;
  market_size: string;
  advantage: string;
  demand_proof: string;
  team: string;
  risks: string;
}

export interface MatchResult {
  userId: string;
  score: number;
  equitySuggestion?: {
    ideaOwner: number;
    partner: number;
  };
}

// Hybrid Matching: Collaborative Filtering + Content-Based + GNN (simulated)
export async function findMatches(idea: MatchIdea, profiles: MatchProfile[]): Promise<MatchResult[]> {
  try {
    // 1. Content-Based Matching (Skills & Experience)
    const contentScores = profiles.map(profile => {
      let score = 0;
      
      // Basic skill matching (mock logic)
      const requiredSkills = idea.team.toLowerCase().split(',').map(s => s.trim());
      const matchedSkills = profile.skills.filter(s => requiredSkills.includes(s.toLowerCase()));
      score += (matchedSkills.length / Math.max(requiredSkills.length, 1)) * 50;

      // Experience matching
      score += Math.min(profile.experience_years * 5, 25);

      return { userId: profile.id, score };
    });

    // 2. Collaborative Filtering (User Interactions from Supabase)
    const { data: pastMatches } = await supabase
      .from('matches')
      .select('user_id, match_score')
      .eq('status', 'accepted');

    const collabScores = contentScores.map(cs => {
      const pastMatch = pastMatches?.find(pm => pm.user_id === cs.userId);
      const collabBonus = pastMatch ? pastMatch.match_score * 0.25 : 0; // 25% weight
      return { ...cs, score: Math.min(cs.score + collabBonus, 100) };
    });

    // 3. Automated Equity Distribution
    return collabScores.map(cs => {
      const profile = profiles.find(p => p.id === cs.userId);
      let equitySuggestion;

      if (profile && profile.user_type === 'skill') {
        // e.g., 40% idea, 30% skills, 30% experience
        const baseIdeaEquity = 40;
        const skillEquity = Math.min((profile.skills.length * 5), 30);
        const expEquity = Math.min((profile.experience_years * 3), 30);
        
        const partnerEquity = skillEquity + expEquity;
        const ideaOwnerEquity = 100 - partnerEquity;

        equitySuggestion = {
          ideaOwner: ideaOwnerEquity,
          partner: partnerEquity,
        };
      }

      return { ...cs, equitySuggestion };
    }).sort((a, b) => b.score - a.score);

  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}

// Realtime Updates via Supabase Subscriptions
export function subscribeToMatches(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'matches', filter: `user_id=eq.${userId}` },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
}
