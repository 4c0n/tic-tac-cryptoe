pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract GameRegisterProxy {
  function getIsItMyTurnWithQueuedGame() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player1");
    register.newGame();
    register.isItMyTurn();
  }
}

contract TestGameRegisterPart4 {
  function testCannotReturnWhosTurnItIsWhenRegisteredButGameIsQueued() public {
    GameRegisterProxy register = new GameRegisterProxy();
    ThrowProxy throwProxy = new ThrowProxy(address(register));

    GameRegisterProxy(address(throwProxy)).getIsItMyTurnWithQueuedGame();
    bool r = throwProxy.execute.gas(10000)();

    Assert.isFalse(r, "Error was not produced!");
  }
}

