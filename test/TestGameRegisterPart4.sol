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
    bool r = throwProxy.execute.gas(2000000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotMakeMoveWhenNotRegistered() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotMakeMoveWhenRegisteredButNoGameWasStarted() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegister(address(proxy)).newPlayer("player0");
    bool r1 = proxy.execute.gas(100000)();

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }
}

