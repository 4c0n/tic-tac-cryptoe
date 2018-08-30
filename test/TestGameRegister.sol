pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract TestGameRegister {
  function testCanReturnCorrectGameId() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");
    register.newGame();

    ThrowProxy proxy = new ThrowProxy(address(register));
    GameRegister(address(proxy)).newPlayer("player1");
    proxy.execute.gas(100000)();
    GameRegister(address(proxy)).newGame();
    proxy.execute.gas(100000)();

    Assert.equal(0, register.getCurrentGameId(), "Did not return correct game id!");
  }

  function testCanReturnCorrectOpponentAddressToPlayerThatStartedWhenPlayingTheGame() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");
    register.newGame();

    ThrowProxy proxy = new ThrowProxy(address(register));
    address proxyAddress = address(proxy);
    GameRegister(proxyAddress).newPlayer("player1");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(proxyAddress).newGame();
    bool r2 = proxy.execute.gas(100000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    address oppAddress = register.getOpponentAddress();

    Assert.equal(proxyAddress, oppAddress, "Could not get correct opponent address!");
  }

  function testCanReturnCorrectOpponentAddressToPlayerThatJoinedWhenPlayingTheGame() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");

    ThrowProxy proxy = new ThrowProxy(address(register));
    address proxyAddress = address(proxy);
    GameRegister(proxyAddress).newPlayer("player1");
    bool r1 = proxy.execute.gas(100000)();
    Assert.isTrue(r1, "r1 was supposed to be true");

    GameRegister(proxyAddress).newGame();
    bool r2 = proxy.execute.gas(1000000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    register.newGame();

    address oppAddress = register.getOpponentAddress();
    Assert.equal(proxyAddress, oppAddress, "Could not get correct opponent address!");
  }
}

