export async function compareStartup(ideaTitle: string, sector: string) {
  // Mock Crunchbase API call
  console.log(`Comparing ${ideaTitle} in ${sector} against Crunchbase database...`);
  return {
    similarStartups: [
      { name: 'Competitor A', funding: '$1.5M', stage: 'Seed' },
      { name: 'Competitor B', funding: '$500K', stage: 'Pre-Seed' },
    ],
    sectorAverageValuation: '$2.5M',
    marketSaturation: 'Medium',
  };
}
