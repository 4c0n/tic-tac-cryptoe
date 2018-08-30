pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract GameRegisterProxy {
  function getCurrentGameIdWithoutRegistering() public {
    GameRegister register = new GameRegister();
    register.getCurrentGameId();
  }

  function getCurrentGameIdWithoutStartingANewGame() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");
    register.getCurrentGameId();
  }
  function getGamePlayingStatusWithoutRegistering() public {
    GameRegister register = new GameRegister();
    register.getGamePlayingStatus();
  }

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

contract TestGameRegisterPart2 {
  function testCannotReturnStatusWhenThePlayerIsNotRegistered() public {
    GameRegisterProxy register = new GameRegisterProxy();
    ThrowProxy proxy = new ThrowProxy(address(register));
    GameRegisterProxy(address(proxy)).getGamePlayingStatusWithoutRegistering();
    bool r = proxy.execute();

    Assert.isFalse(r, "No error was produced!");
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

  function testCannotReturnGameIdWhenNotRegistered() public {
    GameRegisterProxy register = new GameRegisterProxy();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegisterProxy(address(proxy)).getCurrentGameIdWithoutRegistering();
    bool r = proxy.execute();

    Assert.isFalse(r, "Did not produce error!");
  }

  function testCannotReturnGameIdWhenNotPlaying() public {
    GameRegisterProxy register = new GameRegisterProxy();
    ThrowProxy proxy = new ThrowProxy(address(register));

    GameRegisterProxy(address(proxy)).getCurrentGameIdWithoutStartingANewGame();
    bool r = proxy.execute();

    Assert.isFalse(r, "Did not produce error!");
  }
}

