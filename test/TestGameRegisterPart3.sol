pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract GameRegisterProxy {
  function getIsItMyTurnWithoutMoves() public returns (bool) {
    GameRegister register = GameRegister(DeployedAddresses.MovesRegister());
    register.newPlayer("player1");
    register.newGame();

    return register.isItMyTurn();
  }

  function getIsItMyTurnWhenAMoveWasMade() public returns (bool) {
    GameRegister register = GameRegister(DeployedAddresses.MovesRegister());

    return register.isItMyTurn();
  }
}

contract TestGameRegisterPart3 {
  GameRegisterProxy proxy;

  function testCanReturnWhosTurnItIsWhenNoMovesWereMadeToThePlayerThatJoined() public {
    GameRegister register = GameRegister(DeployedAddresses.MovesRegister());

    register.newPlayer("player0");
    register.newGame();

    proxy = new GameRegisterProxy();
    bool r = proxy.getIsItMyTurnWithoutMoves();
    Assert.isFalse(r, "isItMyTurn should have returned false");
  }

  function testCanReturnWhosTurnItIsWhenMovesWereMadeToThePlayerThatStarted() public {
    GameRegister register = GameRegister(DeployedAddresses.MovesRegister());

    register.makeMove(0, 0);

    Assert.isFalse(register.isItMyTurn(), "It is the player his turn, but it should not be");
  }

  function testCanReturnWhosTurnItIsWhenMovesWereMadeToThePlayerThatJoined() public {
    bool r = proxy.getIsItMyTurnWhenAMoveWasMade();
    Assert.isTrue(r, "It is not the player's turn, but it should be");
  }
}

