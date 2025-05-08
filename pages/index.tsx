import { useState, useEffect } from 'react';
import Head from 'next/head';
import SEO from '@/components/SEO';
import Header from '@/components/Header';

// Dummy data for players
// ... existing code ...

// Dummy data for businesses based on bizwordle.csv
const dummyBusinesses = [
  { name: "Apple", industry: "Technology", founded: 1976, headquarters: "USA", fortuneRank: 3, ceo: "Tim Cook" },
  { name: "Microsoft", industry: "Technology", founded: 1975, headquarters: "USA", fortuneRank: 6, ceo: "Satya Nadella" },
  { name: "Amazon", industry: "E-commerce", founded: 1994, headquarters: "USA", fortuneRank: 2, ceo: "Andy Jassy" },
  { name: "Tesla", industry: "Automotive", founded: 2003, headquarters: "USA", fortuneRank: 33, ceo: "Elon Musk" },
  { name: "Google", industry: "Technology", founded: 1998, headquarters: "USA", fortuneRank: 8, ceo: "Sundar Pichai" },
  { name: "Walmart", industry: "Retail", founded: 1962, headquarters: "USA", fortuneRank: 1, ceo: "Doug McMillon" },
  { name: "Toyota", industry: "Automotive", founded: 1937, headquarters: "Japan", fortuneRank: 10, ceo: "Koji Sato" },
  { name: "Meta", industry: "Technology", founded: 2004, headquarters: "USA", fortuneRank: 34, ceo: "Mark Zuckerberg" },
  { name: "Berkshire Hathaway", industry: "Conglomerate", founded: 1839, headquarters: "USA", fortuneRank: 7, ceo: "Warren Buffett" },
  { name: "JPMorgan Chase", industry: "Banking", founded: 1799, headquarters: "USA", fortuneRank: 17, ceo: "Jamie Dimon" },
];

// Game state interface
interface GameState {
  mysteryBusiness: typeof dummyBusinesses[0] | null;
  guesses: typeof dummyBusinesses[0][];
  gameOver: boolean;
  won: boolean;
  gaveUp: boolean;
  loading: boolean;
  maxGuesses: number;
}

// GameHeaders component to display the game parameters
const GameHeaders = () => {
  const headers = [
    { name: "Industry", color: "#4CAF50" },  // Green
    { name: "Founded", color: "#2196F3" },   // Blue
    { name: "Headquarters", color: "#FF9800" }, // Orange
    { name: "Fortune 500 Rank", color: "#E91E63" }, // Pink
    { name: "CEO", color: "#9C27B0" }        // Purple
  ];

  return (
    <div className="game-headers">
      <h3 className="game-headers-title">Guess these business attributes:</h3>
      <div className="game-headers-container">
        {headers.map((header) => (
          <div 
            key={header.name} 
            className="game-header-box"
            style={{ backgroundColor: header.color }}
          >
            {header.name}
          </div>
        ))}
      </div>
      <style jsx>{`
        .game-headers {
          margin: 1.5rem 0;
          text-align: center;
        }
        .game-headers-title {
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
          color: #555;
        }
        .game-headers-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }
        .game-header-box {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .game-header-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        @media (max-width: 600px) {
          .game-headers-container {
            gap: 0.5rem;
          }
          .game-header-box {
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState<typeof dummyBusinesses>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    mysteryBusiness: null,
    guesses: [],
    gameOver: false,
    won: false,
    gaveUp: false,
    loading: true,
    maxGuesses: 8
  });

  // Initialize game on component mount
  useEffect(() => {
    // Select a random business as the mystery business
    const randomIndex = Math.floor(Math.random() * dummyBusinesses.length);
    setGameState(prev => ({
      ...prev,
      mysteryBusiness: dummyBusinesses[randomIndex],
      loading: false
    }));
    
    // Check if user has played before
    const hasPlayed = localStorage.getItem('bizWordleHasPlayed');
    if (hasPlayed) {
      setShowInstructions(false);
    } else {
      localStorage.setItem('bizWordleHasPlayed', 'true');
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      const filtered = dummyBusinesses.filter(business => 
        business.name.toLowerCase().includes(term.toLowerCase()) &&
        !gameState.guesses.some(guess => guess.name === business.name)
      );
      setFilteredBusinesses(filtered);
    } else {
      setFilteredBusinesses([]);
    }
  };

  // Handle business selection
  const selectBusiness = (business: typeof dummyBusinesses[0]) => {
    setSearchTerm('');
    setFilteredBusinesses([]);
    
    // Check if business is already guessed
    if (gameState.guesses.some(guess => guess.name === business.name)) {
      return;
    }
    
    // Check if business is the mystery business
    const isCorrect = business.name === gameState.mysteryBusiness?.name;
    
    const newGuesses = [...gameState.guesses, business];
    
    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      gameOver: isCorrect || newGuesses.length >= prev.maxGuesses,
      won: isCorrect
    }));
  };

  // Handle give up
  const handleGiveUp = () => {
    setGameState(prev => ({
      ...prev,
      gameOver: true,
      gaveUp: true
    }));
  };

  // Handle new game
  const handleNewGame = () => {
    const randomIndex = Math.floor(Math.random() * dummyBusinesses.length);
    setGameState({
      mysteryBusiness: dummyBusinesses[randomIndex],
      guesses: [],
      gameOver: false,
      won: false,
      gaveUp: false,
      loading: false,
      maxGuesses: 8
    });
  };

  // Check if a property matches the mystery business
  const isMatch = (guess: typeof dummyBusinesses[0], property: keyof typeof dummyBusinesses[0]) => {
    if (!gameState.mysteryBusiness) return false;
    return guess[property] === gameState.mysteryBusiness[property];
  };

  // Get directional hint for numeric values
  const getDirectionalHint = (guess: typeof dummyBusinesses[0], property: 'founded' | 'fortuneRank') => {
    if (!gameState.mysteryBusiness) return null;
    
    if (guess[property] === gameState.mysteryBusiness[property]) {
      return null;
    }
    
    if (property === 'fortuneRank') {
      // For Fortune 500 Rank, lower number is better, so arrows are flipped
      if (guess[property] > gameState.mysteryBusiness[property]) {
        return <span className={`directionalHint higher`}>↓</span>;
      } else {
        return <span className={`directionalHint lower`}>↑</span>;
      }
    } else {
      // For founded year, higher is more recent
      if (guess[property] < gameState.mysteryBusiness[property]) {
        return <span className={`directionalHint higher`}>↑</span>;
      } else {
        return <span className={`directionalHint lower`}>↓</span>;
      }
    }
  };

  // Share results
  const shareResults = () => {
    if (!gameState.mysteryBusiness) return;
    
    let shareText = `Biz Wordle - ${gameState.mysteryBusiness.name}\n`;
    shareText += gameState.won ? `I got it in ${gameState.guesses.length}/${gameState.maxGuesses} guesses!` : 'I gave up!';
    shareText += '\n\n';
    
    // Add emoji grid representation of guesses
    gameState.guesses.forEach(guess => {
      const industryMatch = isMatch(guess, 'industry') ? '🟩' : '⬜';
      const foundedMatch = isMatch(guess, 'founded') ? '🟩' : '⬜';
      const headquartersMatch = isMatch(guess, 'headquarters') ? '🟩' : '⬜';
      const fortuneRankMatch = isMatch(guess, 'fortuneRank') ? '🟩' : '⬜';
      const ceoMatch = isMatch(guess, 'ceo') ? '🟩' : '⬜';
      
      shareText += `${industryMatch}${foundedMatch}${headquartersMatch}${fortuneRankMatch}${ceoMatch}\n`;
    });
    
    shareText += '\nPlay at: https://bizwordle.me';
    
    navigator.clipboard.writeText(shareText)
      .then(() => alert('Results copied to clipboard!'))
      .catch(() => alert('Failed to copy results. Please try again.'));
  };

  if (gameState.loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="w-full">
      <Header/>
      <SEO/>

      <main className="main">
        <h1 className="title">Biz Wordle</h1>
        
        {showInstructions && (
          <div className="instructions">
            <p>Guess the mystery business in {gameState.maxGuesses} tries or less!</p>
            <p>Green cells indicate a match with the mystery business.</p>
            <p>For numeric values, arrows indicate if the mystery business's value is higher (↑) or lower (↓).</p>
            <button 
              className="newGameButton" 
              onClick={() => setShowInstructions(false)}
            >
              Got it!
            </button>
          </div>
        )}
        
        {!gameState.gameOver ? (
          <>
            <GameHeaders />
            
            <div className="gameControls">
              <div className="searchContainer">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Start typing to guess a business..."
                  className="searchInput"
                />
                {filteredBusinesses.length > 0 && (
                  <div className="dropdown">
                    {filteredBusinesses.map((business) => (
                      <div 
                        key={business.name} 
                        className="dropdownItem"
                        onClick={() => selectBusiness(business)}
                      >
                        {business.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="buttonContainer">
                <button 
                  className="guessButton"
                  onClick={() => {
                    if (filteredBusinesses.length > 0) {
                      selectBusiness(filteredBusinesses[0]);
                    }
                  }}
                  disabled={filteredBusinesses.length === 0}
                >
                  Guess
                </button>
                <button 
                  className="giveUpButton"
                  onClick={handleGiveUp}
                  disabled={gameState.guesses.length === 0}
                >
                  Give up
                </button>
              </div>
            </div>

            <div className="guessCount">
              Guesses: {gameState.guesses.length}/{gameState.maxGuesses}
            </div>

            <div className="guessesContainer">
              {gameState.guesses.length > 0 && (
                <table className="guessTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Industry</th>
                      <th>Founded</th>
                      <th>Headquarters</th>
                      <th>Fortune 500 Rank</th>
                      <th>CEO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.guesses.map((guess, index) => (
                      <tr key={index}>
                        <td>{guess.name}</td>
                        <td className={isMatch(guess, 'industry') ? "match" : ''}>
                          {guess.industry}
                        </td>
                        <td className={isMatch(guess, 'founded') ? "match" : ''}>
                          {guess.founded}
                          {!isMatch(guess, 'founded') && getDirectionalHint(guess, 'founded')}
                        </td>
                        <td className={isMatch(guess, 'headquarters') ? "match" : ''}>
                          {guess.headquarters}
                        </td>
                        <td className={isMatch(guess, 'fortuneRank') ? "match" : ''}>
                          {guess.fortuneRank}
                          {!isMatch(guess, 'fortuneRank') && getDirectionalHint(guess, 'fortuneRank')}
                        </td>
                        <td className={isMatch(guess, 'ceo') ? "match" : ''}>
                          {guess.ceo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="gameOverContainer">
            <h2>The mystery business was:</h2>
            <h1 className="mysteryPlayerReveal">
              {gameState.mysteryBusiness?.name}
            </h1>
            
            {gameState.won ? (
              <p>You got it in {gameState.guesses.length} tries!</p>
            ) : (
              <p>You {gameState.gaveUp ? 'gave up' : 'ran out of guesses'} after {gameState.guesses.length} guesses.</p>
            )}
            
            <button 
              className="shareButton"
              onClick={shareResults}
            >
              Share Results
            </button>
            
            <button 
              className="newGameButton"
              onClick={handleNewGame}
            >
              New Game
            </button>
          </div>
        )}
      </main>


      {/* Blog Section for SEO */}
      <section className="blog-section">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">MLB Wordle Blog</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Daily Post */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">TODAY'S PUZZLE</span>
              <h3 className="text-xl font-bold mt-2 mb-3">
                <a href="/blog/todays-mlb-wordle-april-23-2025" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Today's MLB Wordle – April 23, 2025 (Hint & Stats)
                </a>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Struggling with today's MLB Wordle? Here's a subtle hint: This All-Star has dominated the American League for years. Plus check out today's most common first guesses!
              </p>
              <a href="/blog/todays-mlb-wordle-april-23-2025" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Read more →
              </a>
            </article>
            
            {/* Evergreen Content */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">STRATEGY GUIDE</span>
              <h3 className="text-xl font-bold mt-2 mb-3">
                <a href="/blog/how-to-win-mlb-wordle-every-time" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  How to Win MLB Wordle Every Time: Pro Tips & Strategies
                </a>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Master the daily MLB player guessing game with our expert strategies. Learn which players to guess first, how to use process of elimination, and win MLB Wordle in fewer guesses!
              </p>
              <a href="/blog/how-to-win-mlb-wordle-every-time" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Read more →
              </a>
            </article>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* More SEO-rich content blocks */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2">
                <a href="/blog/mlb-wordle-vs-traditional-wordle" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  MLB Wordle vs Traditional Wordle: Key Differences Explained
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                How our baseball-themed word game puts a unique spin on the classic formula for MLB fans.
              </p>
            </article>
            
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2">
                <a href="/blog/most-guessed-players-mlb-wordle" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  10 Most Guessed Players in MLB Wordle History
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                From Mike Trout to Shohei Ohtani: See which baseball stars everyone tries first in our daily baseball guessing game.
              </p>
            </article>
            
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold mb-2">
                <a href="/blog/baseball-word-games-history" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  The History of Baseball Word Games and Puzzles
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                From baseball crosswords to modern MLB Wordle - explore how America's pastime has inspired word puzzles through the decades.
              </p>
            </article>
          </div>
          
          {/* Rich SEO footer with long-tail keywords */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium mb-4 text-gray-700 dark:text-gray-300">Popular MLB Wordle Topics</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <a href="/tags/daily-baseball-puzzle" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">daily baseball puzzle</a>
              <a href="/tags/mlb-word-game" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">mlb word game</a>
              <a href="/tags/baseball-wordle" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">baseball wordle</a>
              <a href="/tags/guess-the-mlb-player" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">guess the mlb player</a>
              <a href="/tags/baseball-guessing-game" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">baseball guessing game</a>
              <a href="/tags/mlb-player-quiz" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">mlb player quiz</a>
              <a href="/tags/baseball-stats-game" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">baseball stats game</a>
              <a href="/tags/daily-mlb-challenge" className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">daily mlb challenge</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}