import React, { useState, useEffect } from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18';
import { Trophy, RefreshCw } from 'https://esm.sh/lucide-react@0.263.1';

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const CONFIG = {
  // Your Givebutter API Key
  apiKey: 'YOUR_API_KEY_HERE',
  
  // Your Campaign ID (get from Givebutter URL or API)
  campaignId: 'YOUR_CAMPAIGN_ID_HERE',
  
  // Your fundraising goal
  goalAmount: 80000,
  
  // How often to refresh data (in milliseconds)
  refreshInterval: 1000, // 1 second
  
  // Add your contestants here with their Givebutter team IDs
  contestants: [
    { 
      id: 'team_id_1', // Replace with actual Givebutter team ID
      name: 'Contestant 1', 
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' 
    },
    { 
      id: 'team_id_2', 
      name: 'Contestant 2', 
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' 
    },
    { 
      id: 'team_id_3', 
      name: 'Contestant 3', 
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' 
    },
    { 
      id: 'team_id_4', 
      name: 'Contestant 4', 
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' 
    },
    // Add all 34 contestants here...
  ],
  
  // Define your tournament rounds
  rounds: {
    1: {
      active: ['team_id_1', 'team_id_2', 'team_id_3', 'team_id_4'], // Add all 34 team IDs
      startAmounts: {} // Empty for round 1 - everyone starts at $0
    },
    2: {
      active: ['team_id_1', 'team_id_2'], // Add 16 team IDs who advance
      startAmounts: {
        // Add the total each team raised at END of round 1
        // This lets us calculate "round 2 only" totals
        'team_id_1': 0, // Will be updated after round 1
        'team_id_2': 0,
      }
    },
    3: {
      active: ['team_id_1'], // Add 8 team IDs
      startAmounts: {
        'team_id_1': 0, // Will be updated after round 2
      }
    }
    // Add more rounds as needed
  }
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const FundraisingTournament = () => {
  const [view, setView] = useState('public');
  const [currentRound, setCurrentRound] = useState(1);
  const [teamData, setTeamData] = useState({});
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');

  // Fetch data from Givebutter
  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch campaign total
      const campaignRes = await fetch(
        `https://api.givebutter.com/v1/campaigns/${CONFIG.campaignId}`,
        { headers: { 'Authorization': `Bearer ${CONFIG.apiKey}` } }
      );
      
      if (!campaignRes.ok) {
        throw new Error(`Campaign API error: ${campaignRes.status}`);
      }
      
      const campaignData = await campaignRes.json();
      setTotalRaised(campaignData.data.total_donations || 0);

      // Fetch all teams
      const teamsRes = await fetch(
        `https://api.givebutter.com/v1/teams?campaign=${CONFIG.campaignId}`,
        { headers: { 'Authorization': `Bearer ${CONFIG.apiKey}` } }
      );
      
      if (!teamsRes.ok) {
        throw new Error(`Teams API error: ${teamsRes.status}`);
      }
      
      const teamsData = await teamsRes.json();
      
      // Process team data
      const processedTeams = {};
      teamsData.data.forEach(team => {
        const startAmount = CONFIG.rounds[currentRound]?.startAmounts?.[team.id] || 0;
        processedTeams[team.id] = {
          ...team,
          roundTotal: (team.total_donations || 0) - startAmount
        };
      });
      
      setTeamData(processedTeams);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, CONFIG.refreshInterval);
    return () => clearInterval(interval);
  }, [currentRound]);

  const getActiveContestants = () => {
    const activeIds = CONFIG.rounds[currentRound]?.active || [];
    return CONFIG.contestants
      .filter(c => activeIds.includes(c.id))
      .map(c => ({
        ...c,
        data: teamData[c.id]
      }))
      .sort((a, b) => (b.data?.roundTotal || 0) - (a.data?.roundTotal || 0));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Error Display
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded text-sm">
            <p className="font-semibold mb-2">Please check:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Your API key is correct</li>
              <li>Your campaign ID is correct</li>
              <li>Your team IDs match your Givebutter teams</li>
              <li>You have teams created in Givebutter</li>
            </ul>
          </div>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // PUBLIC VOTING PAGE
  const PublicView = () => {
    const contestants = getActiveContestants();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Fundraising Tournament</h1>
            <p className="text-xl text-gray-600">Round {currentRound} - Choose Your Champion</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contestants.map((contestant, index) => (
                <div key={contestant.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
                  {index < 3 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  )}
                  
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    <img src={contestant.photo} alt={contestant.name} className="w-32 h-32 rounded-full border-4 border-white" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{contestant.name}</h3>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-purple-600">
                        {formatCurrency(contestant.data?.roundTotal || 0)}
                      </div>
                      <div className="text-sm text-gray-500">raised this round</div>
                    </div>
                    
                    <a
                      href={contestant.data?.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                    >
                      Donate Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // TOTAL DISPLAY PAGE
  const TotalView = () => {
    const percentage = (totalRaised / CONFIG.goalAmount) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center p-8">
        <div className="text-center">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-8" />
          <h1 className="text-6xl font-bold text-white mb-4">Total Raised</h1>
          <div className="text-9xl font-bold text-yellow-400 mb-8">
            {formatCurrency(totalRaised)}
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-20 rounded-full h-12 overflow-hidden mb-4">
              <div 
                className="bg-yellow-400 h-full transition-all duration-1000 ease-out flex items-center justify-end pr-4"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              >
                <span className="text-green-900 font-bold text-lg">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="text-3xl text-white">
              Goal: {formatCurrency(CONFIG.goalAmount)}
            </div>
          </div>
          
          <div className="mt-8 text-white text-xl opacity-75">
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Updates every {CONFIG.refreshInterval / 1000} seconds
          </div>
        </div>
      </div>
    );
  };

  // HEAD-TO-HEAD DISPLAY PAGE
  const HeadToHeadView = () => {
    const contestant1 = CONFIG.contestants.find(c => c.id === team1Id);
    const contestant2 = CONFIG.contestants.find(c => c.id === team2Id);
    const data1 = teamData[team1Id];
    const data2 = teamData[team2Id];
    
    const total1 = data1?.roundTotal || 0;
    const total2 = data2?.roundTotal || 0;
    const maxTotal = Math.max(total1, total2, 1);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 p-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">Head to Head Battle</h1>
          <p className="text-2xl text-gray-300">Round {currentRound}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border-4 border-red-500">
              {contestant1 ? (
                <>
                  <img src={contestant1.photo} alt={contestant1.name} className="w-48 h-48 rounded-full mx-auto mb-6 border-8 border-red-500" />
                  <h2 className="text-4xl font-bold text-white mb-4">{contestant1.name}</h2>
                  <div className="text-7xl font-bold text-red-400 mb-4">
                    {formatCurrency(total1)}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-full h-8 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full transition-all duration-1000"
                      style={{ width: `${(total1 / maxTotal) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-white text-2xl py-20">Select Team 1</div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border-4 border-blue-500">
              {contestant2 ? (
                <>
                  <img src={contestant2.photo} alt={contestant2.name} className="w-48 h-48 rounded-full mx-auto mb-6 border-8 border-blue-500" />
                  <h2 className="text-4xl font-bold text-white mb-4">{contestant2.name}</h2>
                  <div className="text-7xl font-bold text-blue-400 mb-4">
                    {formatCurrency(total2)}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-full h-8 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000"
                      style={{ width: `${(total2 / maxTotal) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-white text-2xl py-20">Select Team 2</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-white text-xl opacity-75">
          <RefreshCw className="w-5 h-5 inline mr-2" />
          Live updates
        </div>
      </div>
    );
  };

  // ADMIN CONTROLS
  const AdminControls = () => (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 border-2 border-gray-300 max-h-[90vh] overflow-y-auto">
      <div className="text-xs font-bold text-gray-500 mb-2">ADMIN CONTROLS</div>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={() => setView('public')}
          className={`w-full px-4 py-2 rounded text-sm font-semibold ${
            view === 'public' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Public View
        </button>
        <button
          onClick={() => setView('total')}
          className={`w-full px-4 py-2 rounded text-sm font-semibold ${
            view === 'total' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Total Display
        </button>
        <button
          onClick={() => setView('headtohead')}
          className={`w-full px-4 py-2 rounded text-sm font-semibold ${
            view === 'headtohead' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Head-to-Head
        </button>
      </div>
      
      <div className="border-t pt-2 mb-2">
        <label className="text-xs text-gray-600 block mb-1">Round:</label>
        <select
          value={currentRound}
          onChange={(e) => setCurrentRound(Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
        >
          {Object.keys(CONFIG.rounds).map(round => (
            <option key={round} value={round}>Round {round}</option>
          ))}
        </select>
      </div>
      
      {view === 'headtohead' && (
        <>
          <div className="mb-2">
            <label className="text-xs text-gray-600 block mb-1">Team 1:</label>
            <select
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="">Select...</option>
              {CONFIG.contestants.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Team 2:</label>
            <select
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
            >
              <option value="">Select...</option>
              {CONFIG.contestants.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </>
      )}
      
      <button
        onClick={fetchData}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
      >
        Refresh Now
      </button>
    </div>
  );

  return (
    <>
      {view === 'public' && <PublicView />}
      {view === 'total' && <TotalView />}
      {view === 'headtohead' && <HeadToHeadView />}
      <AdminControls />
    </>
  );
};

// Render the app
ReactDOM.render(<FundraisingTournament />, document.getElementById('root'));