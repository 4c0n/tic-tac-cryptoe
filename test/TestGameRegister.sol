pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract GameRegisterProxy {
  function getOpponentAddressWhenGameIsQueued() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");
    register.newGame();
    register.getOpponentAddress();
  }

  function getOpponentAddressWithoutStartingGame() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");
    register.getOpponentAddress();
  }

  function getOpponentAddressWithoutRegistering() public {
    GameRegister register = new GameRegister();
    register.getOpponentAddress();
  }
}

contract TestGameRegister {
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
    bool r2 = proxy.execute.gas(100000)();
    Assert.isTrue(r2, "r2 was supposed to be true");

    register.newGame();

    address oppAddress = register.getOpponentAddress();
    Assert.equal(proxyAddress, oppAddress, "Could not get correct opponent address!");
  }

  function testCannotReturnOpponentAddressWhenTheGameIsQueued() public {
    GameRegisterProxy registerProxy = new GameRegisterProxy();
    ThrowProxy throwProxy = new ThrowProxy(address(registerProxy));

    GameRegisterProxy(address(throwProxy)).getOpponentAddressWhenGameIsQueued();
    Assert.isFalse(throwProxy.execute(), "Did not produce error!");
  }

  function testCannotReturnOpponentAddressWhenNoGameWasStarted() public {
    GameRegisterProxy registerProxy = new GameRegisterProxy();
    ThrowProxy throwProxy = new ThrowProxy(address(registerProxy));

    GameRegisterProxy(address(throwProxy)).getOpponentAddressWithoutStartingGame();
    Assert.isFalse(throwProxy.execute(), "Did not produce error!");
 }

  function testCannotReturnOpponentAddressWhenNotRegistered() public {
    GameRegisterProxy registerProxy = new GameRegisterProxy();
    ThrowProxy throwProxy = new ThrowProxy(address(registerProxy));

    GameRegisterProxy(address(throwProxy)).getOpponentAddressWithoutRegistering();
    Assert.isFalse(throwProxy.execute(), "Did not produce error!");
  }
}

