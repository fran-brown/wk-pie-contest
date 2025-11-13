// ============================================
// CONFIGURATION
// ============================================
const USE_MOCK_DATA = false; // Set to true for testing without API

const CONFIG = {
  // Your Givebutter API credentials
  campaignId: '516562',
  
  // Fundraising goal
  goalAmount: 80000,
  refreshInterval: 15000, // 15 seconds

  // Admin Controls
  showAdminControls: false,
  
  // Brand colors
  colors: {
    primary: '#72c8f1',
    orange: '#f15a22',
    pink: '#f7b7d3',
    yellow: '#fff56d'
  },
  
  // Tournament Brackets Configuration
  // Map your Givebutter team names to bracket positions
  karaokeBracket: {
    // Round 1 (8 matches, 16 contestants)
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
      { team1: 'MJ', team2: 'Maisie Plew' },
      { team1: 'Lindsay Varquez', team2: 'Galen Kary' },
      { team1: 'Paige Fitzmaurice', team2: 'Jacobi Mehringer' },
      { team1: 'Ada Jackson', team2: 'Will Curtis' },
      { team1: 'Eloe Gill-Williams', team2: 'Lauren Hill Vaughan' },
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

// Mock data generator for testing
const generateMockData = () => {
  const allTeamNames = [
    'JCM Noah'
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
    this.bracketStage = { karaoke: 0, lipsync: 0 };
    
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
        return; // Exit function
      } 
      
      // ===================================
      // START: NEW NETLIFY FETCH LOGIC
      // ===================================

      // This is the auto-generated path to your new Netlify function
      const proxiedUrl = '/.netlify/functions/givebutter'; 
      
      console.log('Fetching from Netlify proxy:', proxiedUrl);
      
      const teamsRes = await fetch(proxiedUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!teamsRes.ok) {
        const errorText = await teamsRes.text();
        throw new Error(`Proxy error (${teamsRes.status}): ${errorText}`);
      }

      const proxyResponse = await teamsRes.json();
      
      // Check if the proxy function itself returned an error
      if (proxyResponse.error) {
          throw new Error(`API Error via proxy: ${proxyResponse.error}`);
      }
      
      // The proxy returns { data: [...] }
      const allTeams = proxyResponse.data;
      console.log('All teams fetched via proxy:', allTeams);
      
      const processedTeams = {};
      let total = 0;
      
      allTeams.forEach(team => {
        // **THIS IS THE CRITICAL FIX**
        // We map the API fields ('raised', 'supporters')
        // to the fields your app expects ('total_donations', 'donor_count').
        const amount = team.raised || 0; 
        
        processedTeams[team.name] = {
          name: team.name,
          total_donations: amount,              // Map 'raised' to 'total_donations'
          donor_count: team.supporters || 0,  // Map 'supporters' to 'donor_count'
          url: team.url
        };
        total += amount;
      });
      
      // ===================================
      // END: NEW NETLIFY FETCH LOGIC
      // ===================================
        
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
        <div class="bg-white rounded-lg p-4 mb-4 border-2 border-dashed border-gray-300">
          <div class="text-gray-400 text-center text-sm">TBD</div>
        </div>
      `;
    }
    
    return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4" style="border: 3px solid ${isWinner1 || isWinner2 ? CONFIG.colors.yellow : '#e5e7eb'};">
        <div class="p-3 border-b relative" style="background-color: ${isWinner1 ? CONFIG.colors.yellow : 'white'}; border-bottom: 1px solid #e5e7eb;">
          ${isWinner1 ? '<div class="absolute left-2 top-2 text-2xl">👑</div>' : ''}
          <div class="flex items-center justify-between ${match.team1 ? '' : 'opacity-50'}">
            <div class="flex-1" style="padding-left: ${isWinner1 ? '32px' : '0'};">
              <div class="font-semibold text-sm" style="color: #333;">
                ${match.team1 || 'TBD'}
              </div>
              <div class="text-xs" style="color: #666;">${team1Data.donor_count || 0} donors</div>
              
              ${team1Data.url ? `
                <a href="${team1Data.url}" target="_blank" rel="noopener noreferrer" 
                   class="inline-block text-xs text-white px-2 py-0.5 rounded mt-1 transition-all hover:opacity-80" 
                   style="background-color: ${CONFIG.colors.primary};">
                  Donate
                </a>
              ` : ''}
              </div>
            <div class="text-right">
              <div class="font-bold" style="color: ${isWinner1 ? CONFIG.colors.orange : '#333'};">
                ${this.formatCurrency(amount1)}
              </div>
              <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div class="h-2 rounded-full transition-all duration-500" style="width: ${(amount1 / maxAmount) * 100}%; background-color: ${CONFIG.colors.orange};"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-3 relative" style="background-color: ${isWinner2 ? CONFIG.colors.yellow : 'white'};">
          ${isWinner2 ? '<div class="absolute left-2 top-2 text-2xl">👑</div>' : ''}
          <div class="flex items-center justify-between ${match.team2 ? '' : 'opacity-50'}">
            <div class="flex-1" style="padding-left: ${isWinner2 ? '32px' : '0'};">
              <div class="font-semibold text-sm" style="color: #333;">
                ${match.team2 || 'TBD'}
              </div>
              <div class="text-xs" style="color: #666;">${team2Data.donor_count || 0} donors</div>

              ${team2Data.url ? `
                <a href="${team2Data.url}" target="_blank" rel="noopener noreferrer" 
                   class="inline-block text-xs text-white px-2 py-0.5 rounded mt-1 transition-all hover:opacity-80" 
                   style="background-color: ${CONFIG.colors.primary};">
                  Donate
                </a>
              ` : ''}
              </div>
            <div class="text-right">
              <div class="font-bold" style="color: ${isWinner2 ? CONFIG.colors.orange : '#333'};">
                ${this.formatCurrency(amount2)}
              </div>
              <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div class="h-2 rounded-full transition-all duration-500" style="width: ${(amount2 / maxAmount) * 100}%; background-color: ${CONFIG.colors.orange};"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  renderBracket(bracket, title, color) {
    const rounds = [
      { name: 'Round 1', matches: bracket.round1 },
      { name: 'Quarter Finals', matches: bracket.round2 },
      { name: 'Semi Finals', matches: bracket.round3 },
      { name: 'Finals', matches: [bracket.finals] }
    ];
    
    return `
      <div class="mb-12">
        <div class="text-center mb-6">
          <h2 class="text-5xl font-bold mb-3" style="color: ${color};">${title}</h2>
          <div class="inline-block text-white px-6 py-2 rounded-full" style="background-color: ${color};">
            <span class="text-lg font-semibold">16 Contestants</span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-6">
          ${rounds.map((round, roundIndex) => `
            <div>
              <h3 class="text-2xl font-bold mb-4 text-center sticky top-0 py-3 z-10 bg-white" style="color: ${color}; border-bottom: 3px solid ${color};">
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
  
  getAmountByName(name) {
    if (!name) return 0;
    const t = this.teamData[name];
    return t && typeof t.total_donations === 'number' ? t.total_donations : 0;
  }
  
  computeWinners(matches) {
    const winners = [];
    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      const n1 = m.team1 || '';
      const n2 = m.team2 || '';
      const a1 = this.getAmountByName(n1);
      const a2 = this.getAmountByName(n2);
      let w = '';
      if (n1 && !n2) w = n1;
      else if (!n1 && n2) w = n2;
      else if (!n1 && !n2) w = '';
      else if (a1 > a2) w = n1;
      else if (a2 > a1) w = n2;
      else w = n1;
      winners.push(w);
    }
    return winners;
  }
  
  pairIntoMatches(names) {
    const matches = [];
    for (let i = 0; i < names.length; i += 2) {
      matches.push({ team1: names[i] || '', team2: names[i + 1] || '' });
    }
    return matches;
  }
  
  fillBracket(baseBracket) {
    const round1 = baseBracket.round1.slice();
    const r2Winners = this.computeWinners(round1);
    const round2 = this.pairIntoMatches(r2Winners);
    const r3Winners = this.computeWinners(round2);
    const round3 = this.pairIntoMatches(r3Winners);
    const finalWinners = this.computeWinners(round3);
    const finals = { team1: finalWinners[0] || '', team2: finalWinners[1] || '' };
    return { round1, round2, round3, finals };
  }

  fillBracketToStage(baseBracket, stage) {
    const round1 = baseBracket.round1.slice();
    let round2 = baseBracket.round2.slice();
    let round3 = baseBracket.round3.slice();
    let finals = { ...baseBracket.finals };
    if (stage >= 1) {
      const r2Winners = this.computeWinners(round1);
      round2 = this.pairIntoMatches(r2Winners);
    }
    if (stage >= 2) {
      const r3Winners = this.computeWinners(round2);
      round3 = this.pairIntoMatches(r3Winners);
    }
    if (stage >= 3) {
      const finalWinners = this.computeWinners(round3);
      finals = { team1: finalWinners[0] || '', team2: finalWinners[1] || '' };
    }
    return { round1, round2, round3, finals };
  }
  
  render() {
    const root = document.getElementById('root');
    
    if (this.error) {
      root.innerHTML = this.renderError();
      return;
    }
    
    if (this.loading) {
      root.innerHTML = `
        <div class="min-h-screen flex items-center justify-center" style="background-color: ${CONFIG.colors.primary};">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
            <p class="text-white text-lg">Loading tournament data...</p>
          </div>
        </div>
      `;
      return;
    }
    
    root.innerHTML = `
      <div class="min-h-screen p-4 pb-24" style="background-color: ${CONFIG.colors.primary};">
        <!-- Header -->
        <div class="max-w-7xl mx-auto">
          <div class="py-8 px-6 md:px-12 mb-8 bg-white rounded-2xl shadow-lg">
            
            <div class="lg:flex lg:justify-between lg:items-center">
              
              <div class="text-center lg:text-left mb-6 lg:mb-0">
                <h1 class="text-5xl md:text-6xl font-display" style="color: ${CONFIG.colors.primary};">
                  W+K HOLIDAY GIVING CAMPAIGN
                </h1>
              </div>
              
              <div class="flex-shrink-0 flex justify-center lg:justify-end gap-6 md:gap-10">
                
                <div class="text-center lg:text-right">
                  <div class="text-sm text-gray-500 uppercase tracking-wider">Total Raised</div>
                  <div class="text-4xl md:text-5xl font-bold" style="color: ${CONFIG.colors.orange};">
                    ${this.formatCurrency(this.totalRaised)}
                  </div>
                </div>
                
                <div class="text-center lg:text-right">
                  <div class="text-sm text-gray-500 uppercase tracking-wider">Goal</div>
                  <div class="text-4xl md:text-5xl font-bold" style="color: #333;">
                    ${this.formatCurrency(CONFIG.goalAmount)}
                  </div>
                </div>

              </div>
            </div>
            
            <div class="mt-6 text-sm text-center lg:text-left" style="color: #333;">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Last updated: ${this.lastUpdate.toLocaleTimeString()}
              ${USE_MOCK_DATA ? `<span class="font-semibold" style="color: ${CONFIG.colors.orange};">🧪 MOCK DATA</span>` : ''}
            </div>
          </div>
          
          <!-- View Toggle -->
          <div class="flex justify-center mb-8">
            <div class="inline-flex bg-white rounded-lg p-1 shadow-md">
              <button id="view-both" class="px-5 py-2 rounded-md font-semibold transition-all text-sm" 
                      style="background-color: ${this.activeView === 'both' ? CONFIG.colors.orange : 'transparent'}; 
                             color: ${this.activeView === 'both' ? 'white' : '#333'};">
                Both Brackets
              </button>
              <button id="view-karaoke" class="px-5 py-2 rounded-md font-semibold transition-all text-sm" 
                      style="background-color: ${this.activeView === 'karaoke' ? CONFIG.colors.pink : 'transparent'}; 
                             color: ${this.activeView === 'karaoke' ? 'white' : '#333'};">
                Karaoke Only
              </button>
              <button id="view-lipsync" class="px-5 py-2 rounded-md font-semibold transition-all text-sm" 
                      style="background-color: ${this.activeView === 'lipsync' ? CONFIG.colors.pink : 'transparent'}; 
                             color: ${this.activeView === 'lipsync' ? 'white' : '#333'};">
                Lip Sync Only
              </button>
            </div>
          </div>
          
          <!-- Brackets -->
          <div class="max-w-[1600px] mx-auto lg:grid lg:grid-cols-2 lg:gap-8">
            ${this.activeView === 'both' || this.activeView === 'karaoke' 
              ? this.renderBracket(this.fillBracketToStage(CONFIG.karaokeBracket, this.bracketStage.karaoke), 'Karaoke Battle', CONFIG.colors.pink) 
              : ''}
            
            ${this.activeView === 'both' || this.activeView === 'lipsync' 
              ? this.renderBracket(this.fillBracketToStage(CONFIG.lipSyncBracket, this.bracketStage.lipsync), 'Lip Sync Battle', CONFIG.colors.pink) 
              : ''}
          </div>
        </div>
      </div>
      
      ${CONFIG.showAdminControls ? this.renderAdminControls() : ''}
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
        <div class="text-xs font-bold text-gray-500 mb-3">ADMIN CONTROLS</div>
        
        <button onclick="app.fetchData()" class="w-full px-4 py-2 text-white rounded text-sm font-semibold hover:opacity-90 mb-2" style="background-color: ${CONFIG.colors.primary};">
          🔄 Refresh Now
        </button>
        
        <div class="text-xs text-gray-600 mt-2">
          Auto-refresh: ${CONFIG.refreshInterval / 1000}s
        </div>
        
        ${USE_MOCK_DATA ? `
          <div class="mt-3 p-2 rounded text-xs text-white" style="background-color: ${CONFIG.colors.orange};">
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