import React from 'react';
import { Player, PlayerPosition } from '../../types';

interface DraftPickProps {
  player: Player;
  round: number;
  pickNumber: number;
  isHighlighted?: boolean;
  onClick?: () => void;
}

// Map position to background color
const positionColors: Record<PlayerPosition, string> = {
  'PG': 'bg-blue-100 text-blue-800',
  'SG': 'bg-green-100 text-green-800',
  'SF': 'bg-purple-100 text-purple-800',
  'PF': 'bg-yellow-100 text-yellow-800',
  'C': 'bg-red-100 text-red-800',
  'G': 'bg-teal-100 text-teal-800',
  'F': 'bg-indigo-100 text-indigo-800',
  'UTIL': 'bg-gray-100 text-gray-800'
};

const DraftPick: React.FC<DraftPickProps> = ({ 
  player, 
  round, 
  pickNumber, 
  isHighlighted = false,
  onClick
}) => {
  // Determine display position (use first position if multiple)
  const displayPosition = player.positions[0];
  
  // Handle click
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={`
        rounded-md p-2 border transition-all duration-200 cursor-pointer
        ${isHighlighted ? 'border-primary-500 shadow-md' : 'border-gray-200 hover:border-primary-300'}
        ${player.injuryStatus ? 'bg-red-50' : 'bg-white'}
      `}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">#{pickNumber}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${positionColors[displayPosition]}`}>
          {displayPosition}
        </span>
      </div>
      
      <div className="font-semibold text-gray-800 truncate">{player.name}</div>
      
      <div className="flex justify-between items-center mt-1 text-xs text-gray-600">
        <span>{player.team}</span>
        <span>Rank: {player.projectedRank}</span>
      </div>
      
      {player.injuryStatus && (
        <div className="mt-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
          {player.injuryStatus}
        </div>
      )}
    </div>
  );
};

export default DraftPick;