import { describe, it, expect } from 'vitest';
import { findMatches, MatchIdea, MatchProfile } from '../services/matchingEngine';

describe('Matching Engine', () => {
  it('should calculate content scores correctly based on skills and experience', async () => {
    const idea: MatchIdea = {
      id: 'idea-1',
      problem: 'Education gap',
      customers: 'Students',
      market_size: 'EdTech',
      advantage: 'AI Personalization',
      demand_proof: '100 signups',
      team: 'React, Node.js, AI',
      risks: 'High competition'
    };

    const profiles: MatchProfile[] = [
      {
        id: 'user-1',
        user_type: 'skill',
        skills: ['React', 'Node.js'],
        experience_years: 5
      },
      {
        id: 'user-2',
        user_type: 'skill',
        skills: ['Marketing', 'Sales'],
        experience_years: 2
      }
    ];

    const matches = await findMatches(idea, profiles);

    expect(matches).toHaveLength(2);
    
    // user-1 should have a higher score because of matching skills and more experience
    const user1Match = matches.find(m => m.userId === 'user-1');
    const user2Match = matches.find(m => m.userId === 'user-2');

    expect(user1Match?.score).toBeGreaterThan(user2Match?.score || 0);

    // Check equity suggestion for user-1
    expect(user1Match?.equitySuggestion).toBeDefined();
    expect(user1Match?.equitySuggestion?.partner).toBeGreaterThan(0);
    expect(user1Match?.equitySuggestion?.ideaOwner).toBeLessThan(100);
  });
});
