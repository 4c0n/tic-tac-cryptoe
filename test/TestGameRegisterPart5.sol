pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract TestGameRegisterPart5 {
  function testCannotMakeMoveWhenNotRegistered() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(200000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotMakeMoveWhenRegisteredButNoGameWasStarted() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegister(address(proxy)).newPlayer("player0");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotMakeMoveWhenRegisteredButGameIsQueued() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegister(address(proxy)).newPlayer("player0");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(address(proxy)).newGame();
    bool r2 = proxy.execute.gas(200000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotMakeMoveWhenItIsNotThePlayerHisTurn() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    register.newPlayer("player0");
    register.newGame();

    GameRegister(address(proxy)).newPlayer("player1");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(address(proxy)).newGame();
    bool r2 = proxy.execute.gas(200000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotMakeMoveWhenTheCellIsNotFree() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    register.newPlayer("player0");
    register.newGame();

    GameRegister(address(proxy)).newPlayer("player1");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(address(proxy)).newGame();
    bool r2 = proxy.execute.gas(200000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    register.makeMove(0, 0);

    GameRegister(address(proxy)).makeMove(0, 0);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotMakeMoveWhenNoMoreMovesArePossible() public {
    GameRegister register = new GameRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));

    register.newPlayer("player0");
    register.newGame();

    GameRegister(address(proxy)).newPlayer("player1");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(address(proxy)).newGame();
    bool r2 = proxy.execute.gas(200000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    register.makeMove(0, 0);

    GameRegister(address(proxy)).makeMove(1, 0);
    bool r3 = proxy.execute.gas(100000)();
    Assert.isTrue(r3, "r3 was supposed to be true");

    register.makeMove(0, 1);

    GameRegister(address(proxy)).makeMove(1, 1);
    bool r4 = proxy.execute.gas(100000)();
    Assert.isTrue(r4, "r4 was supposed to be true");

    register.makeMove(0, 2);

    GameRegister(address(proxy)).makeMove(1, 2);
    bool r = proxy.execute.gas(100000)();

    Assert.isFalse(r, "Error was not produced!");
  }
}

