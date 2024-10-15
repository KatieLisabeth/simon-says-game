import React, { useEffect, useState } from 'react';
import './App.css';
import Tile from './components/Tile';

const colors = ['red', 'blue', 'green', 'yellow'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const App: React.FC = () => {
  const [gameSequence, setGameSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [message, setMessage] = useState('Choose a level and press Start to begin!');
  const [isGameOver, setIsGameOver] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [requiredClicks, setRequiredClicks] = useState(0);
  const [showLastSequence, setShowLastSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState<'easy' | 'normal' | 'harder'>('easy'); // New state for level

  const startGame = () => {
    const newSequence = [getRandomColor()];
    setGameSequence(newSequence);
    setPlayerSequence([]);
    setIsPlayerTurn(false);
    setMessage('Watch the sequence!');
    setIsGameOver(false);
    setClickCount(0);
    setRequiredClicks(newSequence.length);
    setShowLastSequence(false);
    setScore(0);
  };

  useEffect(() => {
    if (gameSequence.length > 0 && !isPlayerTurn) {
      let i = 0;
      const blinkSpeed = level === 'harder' ? 700 : 1000;
      const activeDuration = level === 'harder' ? 300 : 500;
      const interval = setInterval(() => {
        setActiveTile(gameSequence[i]);


        setTimeout(() => {
          setActiveTile(null);
        }, activeDuration);

        i++;
        if (i >= gameSequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMessage('Your turn!');
            setIsPlayerTurn(true);
          }, 500);
        }
      }, blinkSpeed);
    }
  }, [gameSequence, isPlayerTurn, level]);

  const handleTileClick = (color: string) => {
    if (!isPlayerTurn || isGameOver) return;

    setClickCount(clickCount + 1);

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== gameSequence[currentIndex]) {
      setMessage('Game Over! You clicked the wrong tile.');
      setIsGameOver(true);
      setShowLastSequence(true);
      return;
    }

    if (newPlayerSequence.length === gameSequence.length) {
      setMessage('Well done! Watch the next sequence.');
      setIsPlayerTurn(false);
      setPlayerSequence([]);
      const newSequence = [...gameSequence, getRandomColor()];
      setGameSequence(newSequence);
      setClickCount(0);
      setRequiredClicks(newSequence.length);
      setScore(score + 1);
    }
  };

  return (
    <div className="App">
      <h1>Simon Says Game</h1>
      <p>{message}</p>

      {/* Difficulty Level Selector */}
      <div>
        <label>
          <input
            type="radio"
            value="easy"
            checked={level === 'easy'}
            onChange={() => setLevel('easy')}
          />
          Easy
        </label>
        <label>
          <input
            type="radio"
            value="normal"
            checked={level === 'normal'}
            onChange={() => setLevel('normal')}
          />
          Normal
        </label>
        <label>
          <input
            type="radio"
            value="harder"
            checked={level === 'harder'}
            onChange={() => setLevel('harder')}
          />
          Harder
        </label>
      </div>

      {/* Display the current score */}
      <p>Score: {score}</p>

      {/* Only show the last sequence after game over */}
      {isGameOver && showLastSequence && (
        <div className="sequence">
          <strong>Last Sequence:</strong>{' '}
          {gameSequence.map((color, index) => (
            <span key={index} style={{ color, fontWeight: 'bold', marginRight: '5px' }}>
              {color}
            </span>
          ))}
        </div>
      )}

      <div className="tiles">
        {colors.map((color) => (
          <Tile
            key={color}
            color={color}
            onClick={() => handleTileClick(color)}
            isActive={activeTile === color}
          />
        ))}
      </div>

      {/* Show click count only in easy mode */}
      {level === 'easy' && (
        <p>
          Clicked: {clickCount} / {requiredClicks} times
        </p>
      )}

      <button onClick={startGame} disabled={!isGameOver && gameSequence.length > 0}>
        Start New Game
      </button>
    </div>
  );
};

export default App;
