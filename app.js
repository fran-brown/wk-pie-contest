// ============================================
// WK HOLIDAY GIVING CAMPAIGN :D
// ============================================
const USE_MOCK_DATA = false; // Set to true for testing without API

const CONFIG = {
  // Givebutter API info
  campaignId: '516562',
  
  // Fundraising goal
  goalAmount: 80000,
  refreshInterval: 15000, // 15 seconds

  // Admin Controls (for testing)
  showAdminControls: false,
  
  // Brand colors
  colors: {
    primary: '#72c8f1',,
    yellow: '#fff56d'
  },
  
  // Tournament Brackets Configuration
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
    // Round 2 (4 matches, 8 contestants)
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
      { team1: 'Jojo Ball', team2: 'Ian Groom' },
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
  },
  
  // Bios and images for participants
  // Note: key MUST exactly match the team name
  participantBios: {
    // Karaoke Bracket
    "Caleb Jensen": {
      bio: "",
      image: "images/Caleb Jensen.png"
    },
    "Jane Monaghan": {
      bio: "",
      image: "images/Jane Monaghan.png"
    },
    "Ellie Jones": {
      bio: "Beloved,\n\nYour money is going to Caldera anyway. You don't need me to tell you why that's great. But it is my duty to inform you of the many secondary benefits of voting for me.\n\nWith me in the running, this is no mere karaoke competition. This is a sound healing bath. My voice has been known to cure the common cold, re-align chakras, cause ecstatic visions, make your uncle agree with your politics during Thanksgiving dinner, and eliminate fertility issues.\n\nNow, I may not be able to hit every note in the world, but the notes that I DO hit - oh boy. It's something else.\n\nIf you're currently working with your therapist on self-esteem or impostor syndrome, you can rest easy knowing that voting for me is an affirmation of your own excellent taste. Next time you think “Why have I never been featured on WK Fitcheck?” you can tell yourself “No. Calm down. I voted for Ellie so I know I have good taste. It's THEM that's the problem. No panic attack today.”\n\nVoting for me will also help you connect with co-workers you haven't bonded with yet, because you know there's a 99% chance they're also going to vote for me. This is excellent fodder for elevator chats, and it could be the start of a beautiful friendship.",
      image: "images/Ellie Jones.jpg"
    },
    "Katie Schaller": {
      bio: "",
      image: "images/Katie Schaller.jpeg"
    },
    "Mariah Mercier": {
      bio: "Half pony, half woman, half dog. Donate and I will dress up like a puppy and perform my tail off for you. Send me to the finals and I promise to try really hard to probably not pee on the floor.",
      image: "images/Mariah Mercier.jpg"
    },
    "Nai Lucifora": {
      bio: "Let's donate to be good humans!",
      image: "images/Nai_Lucifora.jpg"
    },
    "Jason Strickland": {
      bio: "Numbers by day, high notes by night!",
      image: "images/Jason Strickland.jpg"
    },
    "Lloyd Winter": {
      bio: "",
      image: "images/default.jpg"
    },
    "Becky Brinkerhoff": {
      bio: "Hi. I'm Becky. I was trained in musical theater. This is my only outlet since selling out. ",
      image: "images/Becky Brinkerhoff.jpeg"
    },
    "Gelareh Dehnad": {
      bio: "Hello! My name is Gelareh (gelluhray) and I am 50% silly, 50% anxious! I have been described as a confetti cannon in a library! IYKYK. I love laughing, exclamation points, and donating to a good cause (wink, wink)! I hate snakes, celery, and restaurant waiting lists.",
      image: "images/Gelareh Dehnad.jpg"
    },
    "Jared Randle": {
      bio: "",
      image: "images/Jared Randle.jpeg"
    },
    "Fran Brown": {
      bio: "Time to seal the Honmoon >:)",
      image: "images/Frances Brown.jpeg"
    },
    "Laura Wood": {
      bio: "Karaoke is my drug. It's not often that drugs raise money for charity, so this is cool!",
      image: "images/Laura Wood.jpg"
    },
    "Siobhan Robinson": {
      bio: "Every kid deserves the opportunity to gtfo the city and connect with nature! Caldera is a beautiful place and I'm excited to help bring them some $$$ to continue their super important mission.",
      image: "images/Siobhan Robinson.png"
    },
    "David Henriquez": {
      bio: "Hi! I'm David and I am here for the vibez so let's vibe out. help me get to the finals with your cash that will ultimately help our Caldera kids -- you can pay ca$h, venmo, zelle, applepay, anything helps -- LFG",
      image: "images/David Henriquez.jpg"
    },
    "Felipe Riberio": {
      bio: "",
      image: "images/felipe ribeiro.png"
    },

    // Lip Sync Bracket
    "MJ": {
      bio: "",
      image: "images/MJ.jpg"
    },
    "Maisie Plew": {
      bio: "Help me embarrass myself for ✨charity✨",
      image: "images/Maisie Plew.png"
    },
    "Lindsay Varquez": {
      bio: "i don't bake pies but i bake sub-par lip syncing performances. ",
      image: "images/Lindsay Varquez.jpeg"
    },
    "Galen Kary": {
      bio: "",
      image: "images/Galen Kary.jpg"
    },
    "Paige Fitzmaurice": {
      bio: "For this tasty challenge, I'm serving the right kind of pie. The ultimate father figure of flavor. More bake and even more shake. ",
      image: "images/Paige Fitzmaurice.png"
    },
    "Jacobi Mehringer": {
      bio: "",
      image: "images/Jacobi.png"
    },
    "Ada Jackson": {
      bio: "Super excited to live out my Zendaya, Channing Tatum, Tom Holland, LL Cool J dreams!!! I think I was born for something like this and need everyone to lock tf in and donate so that I can perform! Thank you and your welcome in advance! :)",
      image: "images/Ada Jackson.jpg"
    },
    "Will Curtis": {
      bio: "",
      image: "images/Will Curtis.jpeg"
    },
    "Eloe Gill-Williams": {
      bio: "Eloe is a Caldera alumni who has personally benefitted in his own life from the Caldera program. Caldera put a camera in his hands in 2004 and he has made a career of his skillset and creative vision. He has seen the first hand positive impact on his community. The now multi-generation spanning program has and continues to create access to the creative arts and outdoors. Eloe dedicates his time to the program to continue teaching young learners in Caldera. Exploring and expanding the creative intuition and vision Dan Wieden had for a more diverse and inclusive world through art and equity. Why choose Eloe ? Eloe comes from a long line of lip sync'ers, some of the best to have ever done it. This northeast Portland prodigy was raised amongst Mics & Men and his evolution from Caldera Kid to Master of Ceremony, Microphone Ruler is unmatched. When Eloe is not teaching the youth of today working to build a better world for tomorrow. He can be found clutching many mics in an effort to one day clench the title.",
      image: "images/Eloe_Gill-Williams.jpg"
    },
    "Lauren Hill Vaughan": {
      bio: "",
      image: "images/Lauren Hill Vaugh.jpeg"
    },
    "Paris Fontes-Michel": {
      bio: "",
      image: "images/paris Fontes Michel.jpg"
    },
    "Maile Levy": {
      bio: "I guess I'll shake ass for the kids (& Jinnina)",
      image: "images/Maile Levy.jpeg"
    },
    "Jojo Ball": {
      bio: "",
      image: "images/Jojo Ball.jpg"
    },
    "Ian Groom": {
      bio: "",
      image: "images/IanGroom.png"
    },
    "Jovan Lim & Priya Moorthy": {
      bio: "",
      image: "images/default.jpg"
    },
    "Tasha Danner": {
      bio: "I'm Tasha and I work at Caldera. I'm in Accounting, so I'll be able to count how generous you are being! Come support our amazing youth! ",
      image: "images/Tasha Danner - Tasha Danner.jpg"
    }
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
    this.activeView = 'bracket'; // 'bracket', 'participants'
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
      // START: NETLIFY FETCH LOGIC
      // ===================================

      // Path to Netlify function
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
      
      // Check if the proxy function returned an error
      if (proxyResponse.error) {
          throw new Error(`API Error via proxy: ${proxyResponse.error}`);
      }
      
      // The proxy returns { data: [...] }
      const allTeams = proxyResponse.data;
      console.log('All teams fetched via proxy:', allTeams);
      
      const processedTeams = {};
      let total = 0;
      
      allTeams.forEach(team => {
        const amount = team.raised || 0; 
        
        processedTeams[team.name] = {
          name: team.name,
          total_donations: amount,           // Map 'raised' to 'total_donations'
          donor_count: team.supporters || 0, // Map 'supporters' to 'donor_count'
          url: team.url
        };
        total += amount;
      });
      
      // ===================================
      // END: NETLIFY FETCH LOGIC
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
              <div class="font-bold" style="color: ${isWinner1 ? CONFIG.colors.yellow : '#333'};">
                ${this.formatCurrency(amount1)}
              </div>
              <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div class="h-2 rounded-full transition-all duration-500" style="width: ${(amount1 / maxAmount) * 100}%; background-color: #333"></div>
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
              <div class="font-bold" style="color: ${isWinner2 ? CONFIG.colors.yellow : '#333'};">
                ${this.formatCurrency(amount2)}
              </div>
              <div class="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div class="h-2 rounded-full transition-all duration-500" style="width: ${(amount2 / maxAmount) * 100}%; background-color: #333};"></div>
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

  // ===== NEW FUNCTION =====
  // Gets all unique participant names from the bracket configs
  getAllParticipantNames() {
    const names = new Set();
    
    // Get names from Karaoke bracket
    CONFIG.karaokeBracket.round1.forEach(match => {
      if (match.team1) names.add(match.team1);
      if (match.team2) names.add(match.team2);
    });
    
    // Get names from Lip Sync bracket
    CONFIG.lipSyncBracket.round1.forEach(match => {
      if (match.team1) names.add(match.team1);
      if (match.team2) names.add(match.team2);
    });
    
    return Array.from(names).sort(); // Return a sorted array
  }

  // Renders the participants list view
  renderParticipantsList() {
    const allNames = this.getAllParticipantNames();
    
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${allNames.map(name => {
          const teamData = this.teamData[name] || {};
          const bioData = CONFIG.participantBios[name] || {};
          
          const raised = teamData.total_donations || 0;
          const donors = teamData.donor_count || 0;
          
          return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              
              ${bioData.image ? `<img class="w-full aspect-square object-cover" src="${bioData.image}" alt="${name}">` : '<div class="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>'}
              
              <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-2xl font-bold font-display mb-2" style="color: ${CONFIG.colors.primary};">${name}</h3>
                
                <p class="text-sm text-gray-600 mb-4 flex-grow">
                  ${bioData.bio || '<em>No bio available.</em>'}
                </p>
                
                <div class="flex justify-between items-center mb-4 text-sm">
                  <div class="text-gray-700">
                    <span class="font-bold text-lg" style="color: #333;">${this.formatCurrency(raised)}</span> raised
                  </div>
                  <div class="text-gray-500">${donors} donors</div>
                </div>
                
                ${teamData.url ? `
                  <a href="${teamData.url}" target="_blank" rel="noopener noreferrer" 
                     class="block w-full text-center text-white px-4 py-2 rounded font-semibold transition-all hover:opacity-80" 
                     style="background-color: ${CONFIG.colors.primary};">
                    Donate to ${name.split(' ')[0]}
                  </a>
                ` : `
                  <div class="block w-full text-center text-gray-400 bg-gray-100 px-4 py-2 rounded font-semibold">
                    Donation link not active
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('')}
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
            
            <div class="lg:flex lg:items-center">
              
              <div class="text-center lg:text-left mb-6 lg:mb-0 lg:flex-grow">
                <h1 class="text-5xl md:text-6xl font-display" style="color: ${CONFIG.colors.primary};">
                  W+K HOLIDAY GIVING CAMPAIGN
                </h1>
              </div>
              
              <div class="flex-shrink-0 flex flex-col justify-center lg:items-start gap-4 lg:ml-12">
                
                <div class="text-center lg:text-left">
                  <div class="text-sm text-gray-500 uppercase tracking-wider">Total Raised</div>
                  <div class="text-4xl md:text-5xl font-bold" style="color: #333};">
                    ${this.formatCurrency(this.totalRaised)}
                  </div>
                </div>
                
                <div class="text-center lg:text-left">
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
              ${USE_MOCK_DATA ? `<span class="font-semibold" style="color: #333;">🧪 MOCK DATA</span>` : ''}
            </div>
          </div>
          
          <!-- View Toggle -->
          <div class="flex justify-center mb-8">
            <div class="inline-flex bg-white rounded-lg p-1 shadow-md">
              <button id="view-bracket" class="px-6 py-2 rounded-md font-semibold transition-all text-sm" 
                      style="background-color: ${this.activeView === 'bracket' ? '#333' : 'transparent'}; 
                             color: ${this.activeView === 'bracket' ? 'white' : '#333'};">
                Bracket View
              </button>
              <button id="view-participants" class="px-6 py-2 rounded-md font-semibold transition-all text-sm" 
                      style="background-color: ${this.activeView === 'participants' ? '#333' : 'transparent'}; 
                             color: ${this.activeView === 'participants' ? 'white' : '#333'};">
                Participants
              </button>
            </div>
          </div>
          
          <!-- Brackets -->
          <div class="max-w-[1600px] mx-auto">
            ${this.activeView === 'bracket' ? `
              <div class="lg:grid lg:grid-cols-2 lg:gap-8">
                ${this.renderBracket(this.fillBracketToStage(CONFIG.karaokeBracket, this.bracketStage.karaoke), 'Karaoke Battle', '#333')}
                ${this.renderBracket(this.fillBracketToStage(CONFIG.lipSyncBracket, this.bracketStage.lipsync), 'Lip Sync Battle', '#333')}
              </div>
            ` : `
              ${this.renderParticipantsList()}
            `}
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
          <div class="mt-3 p-2 rounded text-xs text-white" style="background-color: #333;">
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
    const viewBracket = document.getElementById('view-bracket');
    const viewParticipants = document.getElementById('view-participants');
    
    if (viewBracket) viewBracket.onclick = () => { this.activeView = 'bracket'; this.render(); };
    if (viewParticipants) viewParticipants.onclick = () => { this.activeView = 'participants'; this.render(); };
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