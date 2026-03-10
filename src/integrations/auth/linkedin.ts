export async function importLinkedInProfile(accessToken: string) {
  // Mock LinkedIn API call
  console.log('Importing LinkedIn profile with token:', accessToken);
  return {
    fullName: 'Ahmed Developer',
    headline: 'Senior Full Stack Developer at Tech Corp',
    skills: ['React', 'Node.js', 'TypeScript', 'System Design'],
    experienceYears: 7,
    pastStartups: 1,
  };
}
