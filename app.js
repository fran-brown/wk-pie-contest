// ============================================
// CONFIGURATION
// ============================================
const USE_MOCK_DATA = true; // Set to true for testing without API

const CONFIG = {
  // Your Givebutter API credentials
  apiKey: '8220|N6IMXbh66eh8joEe4KDu4ODdaTCYtwA2QuggHI7N',
  campaignId: 'ipQ6Hw',
  
  // Fundraising goal
  goalAmount: 80000,
  refreshInterval: 15000, // 15 seconds
  
  // Tournament Brackets Configuration
  // Map your Givebutter team names to bracket positions
  karaokeBracket: {
    // Round 1 (8 matches, 16 contestants)
    round1: [
      { team1: 'Ada Jackson', team2: 'Becky Brinkerhoff' },
      { team1: 'Caleb Jensen', team2: 'David Henriquez' },
      { team1: 'Ellie Jones', team2: 'Eloe Gill-Williams' },
      { team1: 'Felipe Riberio', team2: 'Fran Brown' },
      { team1: 'Galen Kary', team2: 'Gelareh Dehnad' },
      { team1: 'Jacobi Mehringer', team2: 'Jane Monaghan' },
      { team1: 'Jared Randle', team2: 'Jason Strickland' },
      { team1: 'Jojo Ball', team2: 'Jovan Lim & Priya Moorthy' },
    ],
    // Round 2 (4 matches, 8 contestants) - Will be filled as you advance winners
    round2: [
      { team1: '', team2: '' },
      { team1: '', team2: '' },
      { team1: '', team2: '' },
      { team1: '', team2: '' },
    ],
    // Round 3 (2 matches, 4 contestants)
    round3: [
      { team1: '', team2: '' },
      { team1: '', team2: '' },
    ],
    // Finals (1 match, 2 contestants)
    finals: { team1: '', team2: '' },
  },
  
  lipSyncBracket: {
    round1: [
      { team1: 'Kacey Kelley', team2: 'Laura Wood' },
      { team1: 'Lauren Hill Vaughan', team2: 'Lindsay Varquez' },
      { team1: 'Maisie Plew', team2: 'Mariah Mercier' },
      { team1: 'MJ', team2: 'Molly Dyson' },
      { team1: 'Nai Lucifora', team2: 'Paige Fitzmaurice' },
      { team1: 'Paris Fontes-Michel', team2: 'Siobhan Robinson' },
      { team1: 'Will Curtis', team2: 'Ada Jackson' }, // Using Ada as placeholder
      { team1: 'Becky Brinkerhoff', team2: 'Caleb Jensen' }, // Using as placeholders
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

// Mock data generator for testing
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
    this.activeView = 'both'; // 'both', 'karaoke', 'lipsync'
    
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
      } else {
        // Fetch teams from Givebutter
        const teamsRes = await fetch(
          `https://api.givebutter.com/v1/teams?campaign=${CONFIG.campaignId}`,
          { headers: { 'Authorization': `Bearer ${CONFIG.apiKey}` } }
        );
        
        if (!teamsRes.ok) {
          throw new Error(`API error: ${teamsRes.status} - Check your API key`);
        }
        
        const teamsData = await teamsRes.json();
        
        // Process team data - key by team name
        const processedTeams = {};
        let total = 0;
        
        teamsData.data.forEach(team => {
          processedTeams[team.name] = {
            name: team.name,
            total_donations: team.total_donations || 0,
            donor_count: team.donor_count || 0,
            url: team.url
          };
          total += team.total_donations || 0;
        });
        
        this.teamData = processedTeams;
        this.totalRaised = total;
        this.loading = false;
        this.lastUpdate = new Date();
        this.render();
      }
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
  
  renderMatchup(match, matchIndex, roundName) {
    const team1Data = this.teamData[match.team1] || { total_donations: 0, name: match.team1 };
    const team2Data = this.teamData[match.team2] || { total_donations: 0, name: match.team2 };
    
    const amount1 = team1Data.total_donations || 0;
    const amount2 = team2Data.total_donations || 0;
    const maxAmount = Math.max(amount1, amount2, 1);
    
    const isWinner1 = amount1 > amount2;
    const isWinner2 = amount2 > amount1;
    
    if (!match.team1 && !match.team2) {
      return `
        <div class="bg-gray-100 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300">
          <div class="text-gray-400 text-center text-sm">TBD</div>
        </div>
      `;
    }
    
    return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4 border-2 ${
        isWinner1 || isWinner2 ? 'border-green-500' : 'border-gray-200'
      }">
        <!-- Team 1 -->
        <div class="p-3 border-b ${isWinner1 ? 'bg-green-50' : 'bg-white'} relative">
          ${isWinner1 ? '<div class="absolute left-2 top-2 text-green-600">👑</div>' : ''}
          <div class="flex items-center justify-between ${match.team1 ? '' : 'opacity-50'}">
            <div class="flex-1 ${isWinner1 ? 'pl-6' : ''}">
              <div class="font-semibold text-sm ${!match.team1 ? 'text-gray-400' : 'text-gray-900'}">
                ${match.team1 || 'TBD'}
              </div>
              <div class="text-xs text-gray-500">${team1Data.donor_count || 0} donors</div>
            </div>
            <div class="text-right">
              <div class="font-bold ${isWinner1 ? 'text-green-600' : 'text-gray-700'}">
                ${this.formatCurrency(amount1)}
              </div>
              <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-500"
                     style="width: ${(amount1 / maxAmount) * 100}%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Team 2 -->
        <div class="p-3 ${isWinner2 ? 'bg-green-50' : 'bg-white'} relative">
          ${isWinner2 ? '<div class="absolute left-2 top-2 text-green-600">👑</div>' : ''}
          <div class="flex items-center justify-between ${match.team2 ? '' : 'opacity-50'}">
            <div class="flex-1 ${isWinner2 ? 'pl-6' : ''}">
              <div class="font-semibold text-sm ${!match.team2 ? 'text-gray-400' : 'text-gray-900'}">
                ${match.team2 || 'TBD'}
              </div>
              <div class="text-xs text-gray-500">${team2Data.donor_count || 0} donors</div>
            </div>
            <div class="text-right">
              <div class="font-bold ${isWinner2 ? 'text-green-600' : 'text-gray-700'}">
                ${this.formatCurrency(amount2)}
              </div>
              <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-500"
                     style="width: ${(amount2 / maxAmount) * 100}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  renderBracket(bracket, title, color) {
    const rounds = [
      { name: 'Round 1', matches: bracket.round1, grid: 'grid-cols-2' },
      { name: 'Quarter Finals', matches: bracket.round2, grid: 'grid-cols-2' },
      { name: 'Semi Finals', matches: bracket.round3, grid: 'grid-cols-1' },
      { name: 'Finals', matches: [bracket.finals], grid: 'grid-cols-1' }
    ];
    
    return `
      <div class="mb-12">
        <div class="text-center mb-6">
          <h2 class="text-4xl font-bold ${color} mb-2">${title}</h2>
          <div class="inline-block bg-gradient-to-r from-${color.split('-')[1]}-500 to-${color.split('-')[1]}-600 text-white px-6 py-2 rounded-full">
            <span class="text-lg font-semibold">16 Contestants</span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          ${rounds.map((round, roundIndex) => `
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-4 text-center sticky top-0 bg-white py-2 z-10">
                ${round.name}
              </h3>
              <div class="space-y-4">
                ${round.matches.map((match, matchIndex) => 
                  this.renderMatchup(match, matchIndex, round.name)
                ).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  render() {
    const root = document.getElementById('root');
    
    if (this.error) {
      root.innerHTML = this.renderError();
      return;
    }
    
    if (this.loading) {
      root.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading tournament data...</p>
          </div>
        </div>
      `;
      return;
    }
    
    root.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 pb-24">
        <!-- Header -->
        <div class="max-w-7xl mx-auto">
          <div class="text-center py-8 mb-8 bg-white rounded-2xl shadow-lg">
            <h1 class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Battle of the Talents
            </h1>
            <p class="text-xl text-gray-600 mb-4">Karaoke vs Lip Sync Championship</p>
            
            <!-- Total Raised -->
            <div class="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full shadow-lg">
              <div class="text-sm opacity-90">Total Raised</div>
              <div class="text-4xl font-bold">${this.formatCurrency(this.totalRaised)}</div>
              <div class="text-sm opacity-90">Goal: ${this.formatCurrency(CONFIG.goalAmount)}</div>
            </div>
            
            <div class="mt-4 text-sm text-gray-500">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Last updated: ${this.lastUpdate.toLocaleTimeString()}
              ${USE_MOCK_DATA ? ' <span class="text-orange-600 font-semibold">🧪 MOCK DATA</span>' : ''}
            </div>
          </div>
          
          <!-- View Toggle -->
          <div class="flex justify-center gap-4 mb-8">
            <button id="view-both" class="px-6 py-3 rounded-lg font-semibold transition-all ${
              this.activeView === 'both' 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }">
              Both Brackets
            </button>
            <button id="view-karaoke" class="px-6 py-3 rounded-lg font-semibold transition-all ${
              this.activeView === 'karaoke' 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }">
              🎤 Karaoke Only
            </button>
            <button id="view-lipsync" class="px-6 py-3 rounded-lg font-semibold transition-all ${
              this.activeView === 'lipsync' 
                ? 'bg-pink-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }">
              💋 Lip Sync Only
            </button>
          </div>
          
          <!-- Brackets -->
          <div class="max-w-[1600px] mx-auto">
            ${this.activeView === 'both' || this.activeView === 'karaoke' 
              ? this.renderBracket(CONFIG.karaokeBracket, '🎤 Karaoke Battle', 'text-purple-600') 
              : ''}
            
            ${this.activeView === 'both' || this.activeView === 'lipsync' 
              ? this.renderBracket(CONFIG.lipSyncBracket, '💋 Lip Sync Battle', 'text-pink-600') 
              : ''}
          </div>
        </div>
      </div>
      
      ${this.renderAdminControls()}
    `;
    
    this.attachEventListeners();
  }
  
  renderError() {
    return `
      <div class="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h2 class="text-2xl font-bold text-red-600 mb-4">⚠️ Configuration Error</h2>
          <p class="text-gray-700 mb-4">${this.error}</p>
          <div class="bg-gray-100 p-4 rounded text-sm mb-4">
            <p class="font-semibold mb-2">Please check:</p>
            <ul class="list-disc list-inside space-y-1 text-gray-600">
              <li>Your API key is correct in app.js</li>
              <li>Campaign ID is set to: ${CONFIG.campaignId}</li>
              <li>Team names in CONFIG match Givebutter exactly</li>
              <li>API key has proper permissions</li>
            </ul>
          </div>
          <button onclick="app.fetchData()" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry Connection
          </button>
        </div>
      </div>
    `;
  }
  
  renderAdminControls() {
    return `
      <div class="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 border-2 border-gray-300 z-50">
        <div class="text-xs font-bold text-gray-500 mb-3">⚙️ ADMIN CONTROLS</div>
        
        <button onclick="app.fetchData()" class="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 mb-2">
          🔄 Refresh Now
        </button>
        
        <div class="text-xs text-gray-600 mt-2">
          Auto-refresh: ${CONFIG.refreshInterval / 1000}s
        </div>
        
        ${USE_MOCK_DATA ? `
          <div class="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
            <strong>⚠️ Mock Mode</strong><br>
            Set USE_MOCK_DATA = false
          </div>
        ` : `
          <div class="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
            <strong>✓ Live Data</strong><br>
            Connected to Givebutter
          </div>
        `}
      </div>
    `;
  }
  
  attachEventListeners() {
    const viewBoth = document.getElementById('view-both');
    const viewKaraoke = document.getElementById('view-karaoke');
    const viewLipsync = document.getElementById('view-lipsync');
    
    if (viewBoth) viewBoth.onclick = () => { this.activeView = 'both'; this.render(); };
    if (viewKaraoke) viewKaraoke.onclick = () => { this.activeView = 'karaoke'; this.render(); };
    if (viewLipsync) viewLipsync.onclick = () => { this.activeView = 'lipsync'; this.render(); };
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