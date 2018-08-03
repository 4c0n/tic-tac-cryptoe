pragma solidity ^0.4.24;

import "./GameRegister.sol";

contract MovesRegister is GameRegister {
  struct Coordinate {
    uint8 x;
    uint8 y;
  }

  struct Move {
    Coordinate coord;
  }

  Move[] public moves;

  mapping (uint => uint) moveToPlayer;
  mapping (uint => uint) gameToLastMove;

  event NewMove(uint _from, uint _gameId, Coordinate coord);

  function requireIsPlaying(uint gameId) private view {
    // There is a game that the current user is a player of
    require(gameId != 0, "Player did not start a game yet!");

    // The game is not waiting for an opponent
    if (waitingForOpponent) {
      require(
        getGameIndexThatIsWaiting() != gameId - 1,
        "The game is waiting for an opponent to join!"
      );
    }
  }

  function requireAllowedToMakeMove() private view {
    uint playerId = getPlayerIndex();
    uint gameId = playerToGame[playerId];

    requireIsPlaying(gameId);

    gameId--;

    Game storage game = games[gameId];

    // This player may only make the first move if he/she was the player
    // that started the game
    if (game.moveCount == 0) {
      require(
        gameToPlayerThatStarted[gameId] == msg.sender,
        "Only the player that started the game is allowed to make the first move!"
      );
    }

    uint moveId = gameToLastMove[gameId] - 1;
    uint lastMovePlayer = moveToPlayer[moveId] - 1;

    // The last move should not have been made by the current player
    require(lastMovePlayer != playerId, "It is not your turn!");

    // TODO: The coords should be available

    // TODO: The game should not have a winner yet
  }

  function newMove(uint8 x, uint8 y) public {
    Coordinate memory coord = Coordinate(x, y);
    requireAllowedToMakeMove();
    uint moveId = moves.push(Move(coord));
    moveToPlayer[moveId - 1] = ownerToPlayer[msg.sender];
  }
}
