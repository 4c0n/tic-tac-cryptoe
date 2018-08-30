pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract TestGameRegisterPart5 {
  function testCannotMakeMoveWhenRegisteredButGameIsQueued() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegister(address(proxy)).newPlayer("player0");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(address(proxy)).newGame();
    bool r2 = proxy.execute.gas(100000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }
/*
  function testCannotMakeMoveWhenItIsNotThePlayerHisTurn() public {
    Assert.fail("Test is not implemented yet!");
  }

  function testCannotMakeMoveWhenTheCellIsNotFree() public {
    Assert.fail("Test is not implemented yet!");
  }

  function testCannotMakeMoveWhenNoMoreMovesArePossible() public {
    Assert.fail("Test is not implemented yet!");
  }

  function testCanMakeMove() public {
    Assert.fail("Test is not implemented yet!");
  }
*/
}

