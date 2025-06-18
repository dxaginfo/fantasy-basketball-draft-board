import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Draft, DraftTeam, Player } from '../../types';
import { RootState } from '../../store';
import DraftPick from './DraftPick';
import DraftTimer from './DraftTimer';
import TeamHeader from './TeamHeader';
import CurrentPickDisplay from './CurrentPickDisplay';
import EmptyPick from './EmptyPick';

interface DraftBoardProps {
  draftId: string;
}

const DraftBoard: React.FC<DraftBoardProps> = ({ draftId }) => {
  const dispatch = useDispatch();
  const { currentDraft, loading, error } = useSelector((state: RootState) => state.draft);
  const { players } = useSelector((state: RootState) => state.players);
  const [boardData, setBoardData] = useState<Array<Array<{
    round: number;
    pick: number;
    teamId: string;
    player?: Player;
    isPending: boolean;
    isCurrentPick: boolean;
  }>>>([]);

  useEffect(() => {
    // Initialize board data based on current draft
    if (currentDraft) {
      initializeBoardData(currentDraft);
    }
  }, [currentDraft, players]);

  const initializeBoardData = (draft: Draft) => {
    const { settings, teams, currentPick } = draft;
    const { rounds, serpentine } = settings;
    
    const newBoardData: Array<Array<any>> = [];
    
    for (let round = 1; round <= rounds; round++) {
      newBoardData[round - 1] = [];
      
      // Determine pick order based on serpentine setting
      let roundTeams = [...teams].sort((a, b) => a.position - b.position);
      if (serpentine && round % 2 === 0) {
        // Reverse the order for even-numbered rounds in serpentine drafts
        roundTeams = roundTeams.reverse();
      }
      
      // Create picks for this round
      roundTeams.forEach((team, index) => {
        const pickNumber = serpentine && round % 2 === 0
          ? (round - 1) * teams.length + (teams.length - index)
          : (round - 1) * teams.length + (index + 1);
        
        // Find if this pick has already been made
        const existingPick = team.picks.find(p => p.round === round && p.pickNumber === pickNumber);
        
        // Determine if this is the current pick
        const isCurrentPick = currentPick.round === round && currentPick.teamId === team.id;
        
        // Determine if this is a pending pick (in the future)
        const isPending = !existingPick && 
          (currentPick.round < round || 
           (currentPick.round === round && currentPick.pick <= pickNumber));
        
        // Find the player data if this pick has been made
        let pickedPlayer;
        if (existingPick && existingPick.playerId) {
          pickedPlayer = players.find(p => p.id === existingPick.playerId);
        }
        
        newBoardData[round - 1][index] = {
          round,
          pick: pickNumber,
          teamId: team.id,
          player: pickedPlayer,
          isPending,
          isCurrentPick,
        };
      });
    }
    
    setBoardData(newBoardData);
  };

  if (loading) {
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

  if (!currentDraft) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <p>No draft data available. Please select or create a draft.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">{currentDraft.name}</h2>
        
        {currentDraft.status === 'in-progress' && (
          <DraftTimer 
            endTime={new Date().getTime() + 60000} // Example: 1 minute timer
            onTimeEnd={() => console.log('Time ended')}
          />
        )}
      </div>
      
      {currentDraft.status === 'in-progress' && (
        <CurrentPickDisplay 
          round={currentDraft.currentPick.round}
          pick={currentDraft.currentPick.pick}
          team={currentDraft.teams.find(t => t.id === currentDraft.currentPick.teamId)!}
        />
      )}
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Team Headers */}
          <div className="flex border-b border-gray-200">
            <div className="w-20 shrink-0 p-3 bg-gray-100 font-semibold text-gray-500 text-center">
              Round
            </div>
            
            {currentDraft.teams
              .sort((a, b) => {
                // Sort by position for display
                return a.position - b.position;
              })
              .map((team) => (
                <TeamHeader 
                  key={team.id}
                  team={team}
                  isCurrentTeam={team.id === currentDraft.currentPick.teamId}
                />
              ))
            }
          </div>
          
          {/* Draft Rounds */}
          {boardData.map((round, roundIndex) => (
            <div 
              key={`round-${roundIndex + 1}`} 
              className={`flex ${roundIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="w-20 shrink-0 p-3 font-bold text-gray-700 flex items-center justify-center border-r border-gray-200">
                {roundIndex + 1}
              </div>
              
              {round.map((pick, pickIndex) => (
                <div 
                  key={`pick-${roundIndex + 1}-${pickIndex + 1}`}
                  className="w-40 p-2 border-r border-gray-200 flex-shrink-0"
                >
                  {pick.player ? (
                    <DraftPick 
                      player={pick.player}
                      round={pick.round}
                      pickNumber={pick.pick}
                      isHighlighted={false}
                    />
                  ) : (
                    <EmptyPick 
                      isCurrentPick={pick.isCurrentPick}
                      isPending={pick.isPending}
                      round={pick.round}
                      pickNumber={pick.pick}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DraftBoard;