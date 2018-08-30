pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract TestGameRegisterPart3 {
  function testCanReturnWhosTurnItIsWhenNoMovesWereMadeToThePlayerThatStarted() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    register.newPlayer("player0");
    register.newGame();

    GameRegister(address(proxy)).newPlayer("player1");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");
    GameRegister(address(proxy)).newGame();
    bool r2 = proxy.execute.gas(100000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    Assert.isTrue(register.isItMyTurn(), "It was not the player his turn, but it should have been");
  }

  function testCanReturnWhosTurnItIsWhenNoMovesWereMadeToThePlayerThatJoined() public {
  }

  function testCanReturnWhosTurnItIsWhenMovesWereMadeToThePlayerThatStarted() public {
  }

  function testCanReturnWhosTurnItIsWhenMovesWereMadeToThePlayerThatJoined() public {
  }
}

