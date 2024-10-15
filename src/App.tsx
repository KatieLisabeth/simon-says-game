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
  const [message, setMessage] = useState('Press Start to begin!');
  const [isGameOver, setIsGameOver] = useState(false);


  const startGame = () => {
    setGameSequence([getRandomColor()]);
    setPlayerSequence([]);
    setIsPlayerTurn(false);
    setMessage('Watch the sequence!');
    setIsGameOver(false);
  };


  useEffect(() => {
    if (gameSequence.length > 0 && !isPlayerTurn) {
      let i = 0;
      const interval = setInterval(() => {
        setActiveTile(gameSequence[i]);
        setTimeout(() => setActiveTile(null), 500);
        i++;
        if (i >= gameSequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMessage('Your turn!');
            setIsPlayerTurn(true);
          }, 500);
        }
      }, 1000);
    }
  }, [gameSequence, isPlayerTurn]);

 
  const handleTileClick = (color: string) => {
    if (!isPlayerTurn || isGameOver) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== gameSequence[currentIndex]) {
      setMessage('Game Over! You clicked the wrong tile.');
      setIsGameOver(true);
      return;
    }

    if (newPlayerSequence.length === gameSequence.length) {
      setMessage('Well done! Watch the next sequence.');
      setIsPlayerTurn(false);
      setPlayerSequence([]);
      setGameSequence([...gameSequence, getRandomColor()]);
    }
  };

  return (
    <div className="App">
      <h1>Simon Says Game</h1>
      <p>{message}</p>
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
      <button onClick={startGame} disabled={!isGameOver && gameSequence.length > 0}>
        Start Game
      </button>
    </div>
  );
};

export default App;
