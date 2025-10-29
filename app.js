// ============================================
// MOCK DATA MODE - Testing without Givebutter API
// Set USE_MOCK_DATA to false when ready to use real API
// ============================================
const USE_MOCK_DATA = true;

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Givebutter API settings (fill these in later)
  apiKey: 'YOUR_API_KEY_HERE',
  campaignId: 'YOUR_CAMPAIGN_ID_HERE',
  
  // Fundraising settings
  goalAmount: 80000,
  refreshInterval: 10000, // 10 seconds
  
  // Your contestants (update with real names and photos later)
  contestants: [
    { id: 'team_1', name: 'Alice Johnson', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    { id: 'team_2', name: 'Bob Smith', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { id: 'team_3', name: 'Carol White', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
    { id: 'team_4', name: 'David Brown', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: 'team_5', name: 'Emma Davis', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
    { id: 'team_6', name: 'Frank Miller', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank' },
    { id: 'team_7', name: 'Grace Wilson', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace' },
    { id: 'team_8', name: 'Henry Moore', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry' },
    { id: 'team_9', name: 'Iris Taylor', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iris' },
    { id: 'team_10', name: 'Jack Anderson', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' },
    { id: 'team_11', name: 'Kelly Thomas', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kelly' },
    { id: 'team_12', name: 'Liam Jackson', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam' },
  ],
  
  // Tournament rounds configuration
  rounds: {
    1: {
      active: ['team_1', 'team_2', 'team_3', 'team_4', 'team_5', 'team_6', 'team_7', 'team_8', 'team_9', 'team_10', 'team_11', 'team_12'],
      startAmounts: {}
    },
    2: {
      active: ['team_1', 'team_2', 'team_3', 'team_4', 'team_5', 'team_6'],
      startAmounts: {
        'team_1': 1500,
        'team_2': 2300,
        'team_3': 1800,
        'team_4': 2100,
        'team_5': 1950,
        'team_6': 2250,
      }
    },
    3: {
      active: ['team_1', 'team_2', 'team_3'],
      startAmounts: {
        'team_1': 3200,
        'team_2': 4100,
        'team_3': 3800,
      }
    }
  }
};

// ============================================
// MOCK DATA GENERATOR
// ============================================
const generateMockData = (round) => {
  const mockTeamData = {};
  const activeIds = CONFIG.rounds[round]?.active || [];
  
  activeIds.forEach(teamId => {
    const startAmount = CONFIG.rounds[round]?.startAmounts?.[teamId] || 0;
    const baseAmount = Math.floor(Math.random() * 3000) + 500;
    const totalDonations = startAmount + baseAmount;
    
    mockTeamData[teamId] = {
      id: teamId,
      total_donations: totalDonations,
      roundTotal: baseAmount,
      url: `https://givebutter.com/donate/${teamId}`,
      donor_count: Math.floor(Math.random() * 50) + 10
    };
  });
  
  const mockTotalRaised = Object.values(mockTeamData).reduce((sum, team) => sum + team.total_donations, 0);
  
  return { teamData: mockTeamData, totalRaised: mockTotalRaised };
};

// ============================================
// MAIN APP - Pure JavaScript (No React needed)
// ============================================
class FundraisingTournament {
  constructor() {
    this.view = 'public';
    this.currentRound = 1;
    this.teamData = {};
    this.totalRaised = 0;
    this.loading = true;
    this.error = null;
    this.lastUpdate = new Date();
    this.team1Id = '';
    this.team2Id = '';
    
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
        // Use mock data for testing
        const mockData = generateMockData(this.currentRound);
        this.teamData = mockData.teamData;
        this.totalRaised = mockData.totalRaised;
        this.loading = false;
        this.lastUpdate = new Date();
        this.render();
      } else {
        // Real API calls
        const campaignRes = await fetch(
          `https://api.givebutter.com/v1/campaigns/${CONFIG.campaignId}`,
          { headers: { 'Authorization': `Bearer ${CONFIG.apiKey}` } }
        );
        
        if (!campaignRes.ok) {
          throw new Error(`Campaign API error: ${campaignRes.status}`);
        }
        
        const campaignData = await campaignRes.json();
        this.totalRaised = campaignData.data.total_donations || 0;

        const teamsRes = await fetch(
          `https://api.givebutter.com/v1/teams?campaign=${CONFIG.campaignId}`,
          { headers: { 'Authorization': `Bearer ${CONFIG.apiKey}` } }
        );
        
        if (!teamsRes.ok) {
          throw new Error(`Teams API error: ${teamsRes.status}`);
        }
        
        const teamsData = await teamsRes.json();
        
        const processedTeams = {};
        teamsData.data.forEach(team => {
          const startAmount = CONFIG.rounds[this.currentRound]?.startAmounts?.[team.id] || 0;
          processedTeams[team.id] = {
            ...team,
            roundTotal: (team.total_donations || 0) - startAmount
          };
        });
        
        this.teamData = processedTeams;
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
  
  getActiveContestants() {
    const activeIds = CONFIG.rounds[this.currentRound]?.active || [];
    return CONFIG.contestants
      .filter(c => activeIds.includes(c.id))
      .map(c => ({
        ...c,
        data: this.teamData[c.id]
      }))
      .sort((a, b) => (b.data?.roundTotal || 0) - (a.data?.roundTotal || 0));
  }
  
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  render() {
    const root = document.getElementById('root');
    
    if (this.error) {
      root.innerHTML = this.renderError();
      return;
    }
    
    let content = '';
    if (this.view === 'public') content = this.renderPublicView();
    else if (this.view === 'total') content = this.renderTotalView();
    else if (this.view === 'headtohead') content = this.renderHeadToHeadView();
    
    root.innerHTML = content + this.renderAdminControls();
    this.attachEventListeners();
  }
  
  renderError() {
    return `
      <div class="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h2 class="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p class="text-gray-700 mb-4">${this.error}</p>
          <div class="bg-gray-100 p-4 rounded text-sm">
            <p class="font-semibold mb-2">Please check:</p>
            <ul class="list-disc list-inside space-y-1 text-gray-600">
              <li>Your API key is correct</li>
              <li>Your campaign ID is correct</li>
              <li>Your team IDs match your Givebutter teams</li>
              <li>You have teams created in Givebutter</li>
            </ul>
          </div>
          <button onclick="app.fetchData()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    `;
  }
  
  renderPublicView() {
    const contestants = this.getActiveContestants();
    
    if (this.loading) {
      return `
        <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      `;
    }
    
    const contestantCards = contestants.map((contestant, index) => {
      const rankBadge = index < 3 ? `
        <div class="absolute top-4 right-4 z-10">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
          }">
            ${index + 1}
          </div>
        </div>
      ` : '';
      
      return `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
          ${rankBadge}
          <div class="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <img src="${contestant.photo}" alt="${contestant.name}" class="w-32 h-32 rounded-full border-4 border-white" />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">${contestant.name}</h3>
            <div class="mb-4">
              <div class="text-3xl font-bold text-purple-600">
                ${this.formatCurrency(contestant.data?.roundTotal || 0)}
              </div>
              <div class="text-sm text-gray-500">raised this round</div>
            </div>
            <a href="${contestant.data?.url || '#'}" target="_blank" rel="noopener noreferrer"
               class="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
              Donate Now
            </a>
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-8 pt-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Fundraising Tournament</h1>
            <p class="text-xl text-gray-600">Round ${this.currentRound} - Choose Your Champion</p>
            ${USE_MOCK_DATA ? '<p class="text-sm text-orange-600 mt-2">🧪 Using Mock Data for Testing</p>' : ''}
            <div class="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Last updated: ${this.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${contestantCards}
          </div>
        </div>
      </div>
    `;
  }
  
  renderTotalView() {
    const percentage = (this.totalRaised / CONFIG.goalAmount) * 100;
    
    return `
      <div class="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center p-8">
        <div class="text-center">
          <svg class="w-24 h-24 text-yellow-400 mx-auto mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          <h1 class="text-6xl font-bold text-white mb-4">Total Raised</h1>
          ${USE_MOCK_DATA ? '<p class="text-xl text-orange-400 mb-4">🧪 Mock Data Mode</p>' : ''}
          <div class="text-9xl font-bold text-yellow-400 mb-8">
            ${this.formatCurrency(this.totalRaised)}
          </div>
          <div class="max-w-4xl mx-auto">
            <div class="bg-white bg-opacity-20 rounded-full h-12 overflow-hidden mb-4">
              <div class="bg-yellow-400 h-full transition-all duration-1000 ease-out flex items-center justify-end pr-4"
                   style="width: ${Math.min(percentage, 100)}%">
                <span class="text-green-900 font-bold text-lg">
                  ${percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div class="text-3xl text-white">
              Goal: ${this.formatCurrency(CONFIG.goalAmount)}
            </div>
          </div>
          <div class="mt-8 text-white text-xl opacity-75">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Updates every ${CONFIG.refreshInterval / 1000} seconds
          </div>
        </div>
      </div>
    `;
  }
  
  renderHeadToHeadView() {
    const contestant1 = CONFIG.contestants.find(c => c.id === this.team1Id);
    const contestant2 = CONFIG.contestants.find(c => c.id === this.team2Id);
    const data1 = this.teamData[this.team1Id];
    const data2 = this.teamData[this.team2Id];
    
    const total1 = data1?.roundTotal || 0;
    const total2 = data2?.roundTotal || 0;
    const maxTotal = Math.max(total1, total2, 1);
    
    const renderContestant = (contestant, data, total, color) => {
      if (!contestant) {
        return `<div class="text-white text-2xl py-20">Select Team</div>`;
      }
      return `
        <img src="${contestant.photo}" alt="${contestant.name}" class="w-48 h-48 rounded-full mx-auto mb-6 border-8 border-${color}-500" />
        <h2 class="text-4xl font-bold text-white mb-4">${contestant.name}</h2>
        <div class="text-7xl font-bold text-${color}-400 mb-4">
          ${this.formatCurrency(total)}
        </div>
        <div class="bg-white bg-opacity-20 rounded-full h-8 overflow-hidden">
          <div class="bg-${color}-500 h-full transition-all duration-1000"
               style="width: ${(total / maxTotal) * 100}%"></div>
        </div>
      `;
    };
    
    return `
      <div class="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 p-8">
        <div class="text-center mb-12">
          <h1 class="text-6xl font-bold text-white mb-4">Head to Head Battle</h1>
          <p class="text-2xl text-gray-300">Round ${this.currentRound}</p>
          ${USE_MOCK_DATA ? '<p class="text-lg text-orange-400 mt-2">🧪 Mock Data Mode</p>' : ''}
        </div>
        <div class="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div class="text-center">
            <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border-4 border-red-500">
              ${renderContestant(contestant1, data1, total1, 'red')}
            </div>
          </div>
          <div class="text-center">
            <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border-4 border-blue-500">
              ${renderContestant(contestant2, data2, total2, 'blue')}
            </div>
          </div>
        </div>
        <div class="text-center mt-8 text-white text-xl opacity-75">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Live updates
        </div>
      </div>
    `;
  }
  
  renderAdminControls() {
    const roundOptions = Object.keys(CONFIG.rounds).map(round => 
      `<option value="${round}" ${this.currentRound == round ? 'selected' : ''}>Round ${round}</option>`
    ).join('');
    
    const contestantOptions = CONFIG.contestants.map(c => 
      `<option value="${c.id}">${c.name}</option>`
    ).join('');
    
    const headToHeadControls = this.view === 'headtohead' ? `
      <div class="mb-2">
        <label class="text-xs text-gray-600 block mb-1">Team 1:</label>
        <select id="team1-select" class="w-full px-2 py-1 border rounded text-sm">
          <option value="">Select...</option>
          ${contestantOptions}
        </select>
      </div>
      <div>
        <label class="text-xs text-gray-600 block mb-1">Team 2:</label>
        <select id="team2-select" class="w-full px-2 py-1 border rounded text-sm">
          <option value="">Select...</option>
          ${contestantOptions}
        </select>
      </div>
    ` : '';
    
    return `
      <div class="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 border-2 border-gray-300 max-h-[90vh] overflow-y-auto z-50">
        <div class="text-xs font-bold text-gray-500 mb-2">ADMIN CONTROLS</div>
        
        <div class="space-y-2 mb-4">
          <button id="view-public" class="w-full px-4 py-2 rounded text-sm font-semibold ${
            this.view === 'public' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }">
            Public View
          </button>
          <button id="view-total" class="w-full px-4 py-2 rounded text-sm font-semibold ${
            this.view === 'total' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }">
            Total Display
          </button>
          <button id="view-headtohead" class="w-full px-4 py-2 rounded text-sm font-semibold ${
            this.view === 'headtohead' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
          }">
            Head-to-Head
          </button>
        </div>
        
        <div class="border-t pt-2 mb-2">
          <label class="text-xs text-gray-600 block mb-1">Round:</label>
          <select id="round-select" class="w-full px-2 py-1 border rounded text-sm">
            ${roundOptions}
          </select>
        </div>
        
        ${headToHeadControls}
        
        <button id="refresh-btn" class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700">
          Refresh Now
        </button>
        
        ${USE_MOCK_DATA ? `
          <div class="mt-4 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
            <strong>Mock Mode Active</strong><br>
            Set USE_MOCK_DATA = false in app.js to use real API
          </div>
        ` : ''}
      </div>
    `;
  }
  
  attachEventListeners() {
    const viewPublic = document.getElementById('view-public');
    const viewTotal = document.getElementById('view-total');
    const viewHeadToHead = document.getElementById('view-headtohead');
    const roundSelect = document.getElementById('round-select');
    const refreshBtn = document.getElementById('refresh-btn');
    const team1Select = document.getElementById('team1-select');
    const team2Select = document.getElementById('team2-select');
    
    if (viewPublic) viewPublic.onclick = () => { this.view = 'public'; this.render(); };
    if (viewTotal) viewTotal.onclick = () => { this.view = 'total'; this.render(); };
    if (viewHeadToHead) viewHeadToHead.onclick = () => { this.view = 'headtohead'; this.render(); };
    
    if (roundSelect) roundSelect.onchange = (e) => {
      this.currentRound = Number(e.target.value);
      this.fetchData();
    };
    
    if (refreshBtn) refreshBtn.onclick = () => this.fetchData();
    
    if (team1Select) {
      team1Select.value = this.team1Id;
      team1Select.onchange = (e) => {
        this.team1Id = e.target.value;
        this.render();
      };
    }
    
    if (team2Select) {
      team2Select.value = this.team2Id;
      team2Select.onchange = (e) => {
        this.team2Id = e.target.value;
        this.render();
      };
    }
  }
}

// Initialize the app when page loads
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new FundraisingTournament();
  });
} else {
  app = new FundraisingTournament();
}