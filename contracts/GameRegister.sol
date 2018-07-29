pragma solidity ^0.4.24;

import "./PlayerRegister.sol";

contract GameRegister is PlayerRegister {
  struct Game {
    uint moveCount;
  }
    
  Game[] public games;

  // if true the last added game is waiting (games[games.length - 1])
  bool waitingForOpponent;
    
  // Game id is also off by +1 for the same reason
  mapping (uint => uint) playerToGame;
  mapping (uint => uint) gameToPlayerThatStarted;
    
  event QueuedGame(uint indexed _from, uint id);
  event StartGame(uint indexed _from, uint indexed _to);
    
  function requirePlayerIsNotAlreadyPlaying() private view {
    require(
      playerToGame[getPlayerIndex()] == 0,
      "Player is already playing a game!"
    );
  }

  function getGameIndexThatIsWaiting() internal view returns (uint) {
    return games.length - 1;
  }

  // TODO add tests for this function
  function getGamePlayingStatus() public view returns (string) {
    requirePlayerExists();
    uint playerId = getPlayerIndex();
    uint gameId = playerToGame[playerId];
    if (gameId != 0) {
      gameId--;
      // a game was started
      if (waitingForOpponent && getGameIndexThatIsWaiting() == gameId) {
        return "queued";
      }
      return "playing";
    }
    return "not_started";
  }

  function newGame() public {
    requirePlayerExists();
    requirePlayerIsNotAlreadyPlaying();

    uint playerId = getPlayerIndex();
    uint gameId;
    if (waitingForOpponent) {
      gameId = getGameIndexThatIsWaiting();
      playerToGame[playerId] = gameId + 1;
      waitingForOpponent = false;
      uint opponentId = gameToPlayerThatStarted[gameId];
      emit StartGame(playerId, opponentId);
    } else {
      gameId = games.push(Game(0));
      playerToGame[playerId] = gameId;
      gameToPlayerThatStarted[gameId - 1] = playerId;
      waitingForOpponent = true;
      emit QueuedGame(playerId, gameId);
    }
  }

  function getGameCount() public view returns (uint) {
    return games.length;
  }
}
