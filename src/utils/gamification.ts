
export interface UserProfile {
  id: string;
  userType: 'idea' | 'skill' | 'investor';
  skills?: string[];
  interests?: string[];
  experience?: number;
  completedProjects?: number;
  endorsements?: number;
  activityPoints?: number;
}

export const calculateMatchScore = (userA: UserProfile, userB: UserProfile): number => {
  let score = 0;

  // Basic compatibility check
  if (userA.userType === userB.userType) return 0; // Usually looking for complementary types

  // Skill matching (simplified)
  const commonSkills = userA.skills?.filter(skill => userB.interests?.includes(skill)).length || 0;
  score += commonSkills * 10;

  // Experience matching
  const expDiff = Math.abs((userA.experience || 0) - (userB.experience || 0));
  score += Math.max(0, 20 - expDiff * 2);

  // Endorsements bonus
  score += Math.min(20, (userB.endorsements || 0));

  return Math.min(100, Math.max(0, score));
};

export const calculateUserLevel = (points: number): { level: string; progress: number; nextLevelPoints: number } => {
  const levels = [
    { name: 'Bronze', threshold: 0 },
    { name: 'Silver', threshold: 100 },
    { name: 'Gold', threshold: 500 },
    { name: 'Diamond', threshold: 1000 },
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i].threshold) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || { name: 'Max', threshold: points };
    }
  }

  const progress = nextLevel.name === 'Max' 
    ? 100 
    : Math.min(100, ((points - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100);

  return {
    level: currentLevel.name,
    progress,
    nextLevelPoints: nextLevel.threshold,
  };
};
