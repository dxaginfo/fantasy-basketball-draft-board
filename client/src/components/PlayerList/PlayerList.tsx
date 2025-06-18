import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  setFilter, 
  setSort, 
  addToQueue, 
  selectPlayer,
  fetchPlayers
} from '../../store/slices/playersSlice';
import { 
  Player, 
  PlayerPosition, 
  SortConfig, 
  FilterConfig 
} from '../../types';
import PlayerRow from './PlayerRow';
import PlayerSearch from './PlayerSearch';
import PlayerFilters from './PlayerFilters';
import PlayerQueue from './PlayerQueue';

const PlayerList: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    filteredPlayers, 
    loading, 
    error, 
    filter, 
    sort, 
    playerQueue 
  } = useSelector((state: RootState) => state.players);
  
  const [showFilters, setShowFilters] = useState(false);
  const [showQueue, setShowQueue] = useState(true);
  
  useEffect(() => {
    // Fetch players when component mounts
    dispatch(fetchPlayers());
  }, [dispatch]);
  
  const handleSearchChange = (searchTerm: string) => {
    dispatch(setFilter({ searchTerm }));
  };
  
  const handleFilterChange = (newFilter: Partial<FilterConfig>) => {
    dispatch(setFilter(newFilter));
  };
  
  const handleSortChange = (key: string) => {
    // Toggle direction if sorting by the same key, otherwise default to ascending
    const direction = sort.key === key && sort.direction === 'ascending'
      ? 'descending'
      : 'ascending';
    
    dispatch(setSort({ key, direction }));
  };
  
  const handlePlayerClick = (player: Player) => {
    dispatch(selectPlayer(player));
  };
  
  const handleAddToQueue = (player: Player) => {
    dispatch(addToQueue(player));
  };
  
  const renderSortArrow = (key: string) => {
    if (sort.key !== key) return null;
    
    return sort.direction === 'ascending' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };
  
  if (loading && filteredPlayers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Available Players</h2>
          
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${showFilters ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <button
              className={`px-3 py-1 rounded text-sm font-medium ${showQueue ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setShowQueue(!showQueue)}
            >
              {showQueue ? 'Hide Queue' : 'Show Queue'}
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <PlayerSearch onSearch={handleSearchChange} initialValue={filter.searchTerm} />
        </div>
        
        {showFilters && (
          <div className="mt-4">
            <PlayerFilters 
              currentFilter={filter} 
              onFilterChange={handleFilterChange} 
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className={`flex-grow ${showQueue ? 'md:w-2/3' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('projectedRank')}>
                    Rank {renderSortArrow('projectedRank')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('name')}>
                    Player {renderSortArrow('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('team')}>
                    Team {renderSortArrow('team')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('stats.points')}>
                    PTS {renderSortArrow('stats.points')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('stats.rebounds')}>
                    REB {renderSortArrow('stats.rebounds')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('stats.assists')}>
                    AST {renderSortArrow('stats.assists')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player) => (
                  <PlayerRow 
                    key={player.id} 
                    player={player} 
                    onClick={() => handlePlayerClick(player)}
                    onAddToQueue={() => handleAddToQueue(player)}
                    isInQueue={playerQueue.some(p => p.id === player.id)}
                  />
                ))}
                
                {filteredPlayers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No players found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {showQueue && (
          <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200">
            <PlayerQueue />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;