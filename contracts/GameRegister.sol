pragma solidity ^0.4.24;

import "./PlayerRegister.sol";

contract GameRegister is PlayerRegister {
  enum CellState { Free, O, X }

  struct Game {
    uint moveCount;

    // row 0
    CellState cell0;
    CellState cell1;
    CellState cell2;

    // row 1
    CellState cell3;
    CellState cell4;
    CellState cell5;

    // row 2
    CellState cell6;
    CellState cell7;
    CellState cell8;
  }

  Game[] public games;

  // if true the last added game is waiting (games[games.length - 1])
  bool waitingForOpponent;

  // Game id is also off by +1 for the same reason
  mapping (uint => uint) playerToGame;
  mapping (uint => address) gameToPlayerThatStarted;
  mapping (uint => address) gameToPlayerThatJoined;
  mapping (uint => address) gameToPlayerThatMadeTheLastMove;

  event QueuedGame(address indexed _from, uint id);
  event StartGame(address indexed _from, address indexed _to);

  function requirePlayerIsNotAlreadyPlaying() private view {
    require(
      playerToGame[getPlayerIndex()] == 0,
      "Player is already playing a game!"
    );
  }

  function requireIsPlaying() private view {
    requirePlayerExists();
    uint playerId = getPlayerIndex();
    uint gameId = playerToGame[playerId];
    require(
      (gameId != 0) && !(waitingForOpponent && getGameIndexThatIsWaiting() == (gameId - 1)),
      "Not playing!"
    );
  }

  function getGameIndexThatIsWaiting() internal view returns (uint) {
    return games.length - 1;
  }

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
      gameToPlayerThatJoined[gameId] = msg.sender;
      waitingForOpponent = false;
      address opponentAddress = gameToPlayerThatStarted[gameId];
      emit StartGame(msg.sender, opponentAddress);
    } else {
      gameId = games.push(
        Game(
          0,
          CellState.Free,
          CellState.Free,
          CellState.Free,
          CellState.Free,
          CellState.Free,
          CellState.Free,
          CellState.Free,
          CellState.Free,
          CellState.Free
        )
      );
      playerToGame[playerId] = gameId;
      gameToPlayerThatStarted[gameId - 1] = msg.sender;
      waitingForOpponent = true;
      emit QueuedGame(msg.sender, gameId);
    }
  }

  function getGameCount() public view returns (uint) {
    return games.length;
  }

  function getOpponentAddress() public view returns (address) {
    uint gameId = getCurrentGameId();

    address started = gameToPlayerThatStarted[gameId];
    address joined = gameToPlayerThatJoined[gameId];

    if (started == msg.sender) {
      return joined;
    }
    return started;
  }

  function getCurrentGameId() public view returns (uint) {
    requireIsPlaying();
    uint gameId = playerToGame[getPlayerIndex()];
    gameId--;

    return gameId;
  }

  function isItMyTurn() public view returns (bool) {
    uint gameId = getCurrentGameId();

    if (gameToPlayerThatMadeTheLastMove[gameId] == 0) {
      // No move was made yet, so the player that started the game is up
      if (gameToPlayerThatStarted[gameId] == msg.sender) {
        return true;
      }
      return false;
    }

    address player = gameToPlayerThatMadeTheLastMove[gameId];
    if (player != msg.sender) {
      return true;
    }

    return false;
  }

  function makeMove(uint8 x, uint8 y) public {
    require(isItMyTurn() == true, "It is the other player's turn!");

    uint gameId = getCurrentGameId();
    Game game = games(gameId);

    // TODO: Check if the cell is free
    // TODO: Check if more moves are possible
    // TODO: Make move
    gameToPlayerThatMadeTheLastMove[gameId] = msg.sender;
  }
}
