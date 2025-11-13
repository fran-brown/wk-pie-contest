// ============================================
// CONFIGURATION
// ============================================
const USE_MOCK_DATA = false; // Set to true for testing without API

const CONFIG = {
  // Your Givebutter API credentials
  apiKey: '8406|OC8orSbCvsMy6H4R8gFCfSKgkv7f2RiKeYUHSlmv',
  campaignId: '516562',
  
  // Fundraising goal
  goalAmount: 80000,
  refreshInterval: 15000, // 15 seconds

  // Updated CORS Proxy (https://cors.sh)
  corsProxy: 'https://api.cors.sh/',
  corsProxyApiKey: 'cors-demo', // replace with your own from https://cors.sh
  
  // Brand colors
  colors: {
    primary: '#72c8f1',
    orange: '#f15a22',
    pink: '#f7b7d3',
    yellow: '#fff56d'
  },
  
  // Tournament Brackets Configuration
  karaokeBracket: {
    round1: [
      { team1: 'Caleb Jensen', team2: 'Jane Monaghan' },
      { team1: 'Ellie Jones', team2: 'Katie Schaller' },
      { team1: 'Mariah Mercier', team2: 'Nai Lucifora' },
      { team1: 'Jason Strickland', team2: 'Lloyd Winter' },
      { team1: 'Becky Brinkerhoff', team2: 'Gelareh Dehnad' },
      { team1: 'Jared Randle', team2: 'Fran Brown' },
      { team1: 'Laura Wood', team2: 'Siobhan Robinson' },
      { team1: 'David Henriquez', team2: 'Felipe Riberio' },
    ],
    round2: [
      { team1: '', team2: '' },
      { team1: '', team2: '' },
      { team1: '', team2: '' },
      { team1: '', team2: '' },
    ],
    round3: [
      { team1: '', team2: '' },
      { team1: '', team2: '' },
    ],
    finals: { team1: '', team2: '' },
  },
  
  lipSyncBracket: {
    round1: [
      { team1: 'MJ', team2: 'Maisie Plew' },
      { team1: 'Lindsay Varquez', team2: 'Galen Kary' },
      { team1: 'Paige Fitzmaurice', team2: 'Jacobi Mehringer' },
      { team1: 'Ada Jackson', team2: 'Will Curtis' },
      { team1: 'Eloe Gill-Williams (Caldera)', team2: 'Lauren Hill' },
      { team1: 'Paris Fontes-Michel', team2: 'Maile Levy' },
      { team1: 'Jojo Ball', team2: 'Kacey Kelley' },
      { team1: 'Jovan Lim & Priya Moorthy', team2: 'Tasha Danner' },
    ],
    round2: [
      { team1: '', team2: '' },
      { team1: '', team2: '' },
      { team1: '', team2: '' },
      { team1: '', team2: '' },
    ],
    round3: [
      { team1: '', team2: '' },
      { team1: '', team2: '' },
    ],
    finals: { team1: '', team2: '' },
  }
};

// ============================================
// MOCK DATA (for testing)
// ============================================
const generateMockData = () => {
  const allTeamNames = [
    'Ada Jackson', 'Becky Brinkerhoff', 'Caleb Jensen', 'David Henriquez',
    'Ellie Jones', 'Eloe Gill-Williams', 'Felipe Riberio', 'Fran Brown',
    'Galen Kary', 'Gelareh Dehnad', 'Jacobi Mehringer', 'Jane Monaghan',
    'Jared Randle', 'Jason Strickland', 'Jojo Ball', 'Jovan Lim & Priya Moorthy',
    'Kacey Kelley', 'Laura Wood', 'Lauren Hill Vaughan', 'Lindsay Varquez',
    'Maisie Plew', 'Mariah Mercier', 'MJ', 'Molly Dyson',
    'Nai Lucifora', 'Paige Fitzmaurice', 'Paris Fontes-Michel', 
    'Siobhan Robinson', 'Will Curtis'
  ];
  
  const teamData = {};
  let totalRaised = 0;
  
  allTeamNames.forEach(name => {
    const amount = Math.floor(Math.random() * 3000) + 500;
    teamData[name] = {
      name: name,
      total_donations: amount,
      donor_count: Math.floor(Math.random() * 30) + 5,
      url: `https://givebutter.com/c/ipQ6Hw/${name.replace(/\s+/g, '-')}`
    };
    totalRaised += amount;
  });
  
  return { teamData, totalRaised };
};

// ============================================
// MAIN APP
// ============================================
class TournamentBracket {
  constructor() {
    this.teamData = {};
    this.totalRaised = 0;
    this.loading = true;
    this.error = null;
    this.lastUpdate = new Date();
    this.activeView = 'both';
    
    this.init();
  }

  init() {
    this.render();
    this.fetchData();
    setInterval(() => this.fetchData(), CONFIG.refreshInterval);
  }

  async fetchData() {
    try {
      this.error = null;

      if (USE_MOCK_DATA) {
        const mockData = generateMockData();
        this.teamData = mockData.teamData;
        this.totalRaised = mockData.totalRaised;
        this.loading = false;
        this.lastUpdate = new Date();
        this.render();
        return;
      }

      // ==============================
      // Fetch from Givebutter via cors.sh proxy
      // ==============================
      const givebutterUrl = `https://api.givebutter.com/v1/teams?campaign=${CONFIG.campaignId}`;
      const proxiedUrl = `${CONFIG.corsProxy}${givebutterUrl}`;

      console.log('Fetching Givebutter teams via proxy:', proxiedUrl);

      const teamsRes = await fetch(proxiedUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CONFIG.apiKey}`,
          'Accept': 'application/json',
          'x-cors-api-key': CONFIG.corsProxyApiKey
        }
      });

      if (!teamsRes.ok) {
        const errorText = await teamsRes.text();
        console.error('API Error:', teamsRes.status, errorText);
        throw new Error(`Givebutter API error: ${teamsRes.status}`);
      }

      const teamsData = await teamsRes.json();
      console.log('Teams data received:', teamsData);

      // Process teams
      const processedTeams = {};
      let total = 0;

      if (teamsData.data && Array.isArray(teamsData.data)) {
        teamsData.data.forEach(team => {
          processedTeams[team.name] = {
            name: team.name,
            total_donations: team.total_donations || 0,
            donor_count: team.donor_count || 0,
            url: team.url
          };
          total += team.total_donations || 0;
        });
      }

      this.teamData = processedTeams;
      this.totalRaised = total;
      this.loading = false;
      this.lastUpdate = new Date();
      this.render();

    } catch (err) {
      console.error('Error fetching data:', err);
      this.error = err.message;
      this.loading = false;
      this.render();
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // (Keep your render functions exactly as before)
  renderMatchup(match, matchIndex, roundName) { /* ... same as before ... */ }
  renderBracket(bracket, title, color) { /* ... same as before ... */ }
  renderError() { /* ... same as before ... */ }
  renderAdminControls() { /* ... same as before ... */ }
  attachEventListeners() { /* ... same as before ... */ }

  render() {
    // (same as before, no changes needed)
  }
}

// Initialize
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new TournamentBracket();
  });
} else {
  app = new TournamentBracket();
}