pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract TestGameRegister {
  function testCanReturnCorrectOpponentAddressWhenPlayingTheGame() public {
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

  function testCannotReturnOpponentAddressWhenTheGameIsQueued() public {
  }

  function testCannotReturnOpponentAddressWhenNoGameWasStarted() public {
  }

  function testCannotReturnOpponentAddressWhenNotRegistered() public {
  }
}

