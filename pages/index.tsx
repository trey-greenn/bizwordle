import { useState, useEffect } from 'react';
import Head from 'next/head';
import SEO from '@/components/SEO';

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
    <div className="container">
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

      <footer className="footer">
        <p>Created by Diz</p>
        <p>This site is not affiliated with Fortune 500 companies.</p>
      </footer>
    </div>
  );
}