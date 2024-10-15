import React from 'react';

type TileProps = {
  color: string;
  onClick: () => void;
  isActive: boolean;
};

const Tile: React.FC<TileProps> = ({ color, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: isActive ? 'lightgrey' : color,
        width: '100px',
        height: '100px',
        margin: '10px',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}
    />
  );
};

export default Tile;
