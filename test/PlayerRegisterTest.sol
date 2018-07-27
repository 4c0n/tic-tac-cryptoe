pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/PlayerRegister.sol";

contract PlayerRegisterProxy {
  function getNameWithoutRegistering() public {
    PlayerRegister register = new PlayerRegister();
    register.getPlayerName();
  }

  function getWinCountWithoutRegistering() public {
    PlayerRegister register = new PlayerRegister();
    register.getWinCount();
  }
}

contract PlayerRegisterTest {
  function testCanRegisterPlayer() public {
    PlayerRegister register = new PlayerRegister();
    register.newPlayer("player0");
    string memory name;
    (,,name) = register.players(0);
    Assert.equal(name, "player0", "Player was not registered!");
  }

  function testCannotRegisterTheSamePlayerTwice() public {
    PlayerRegister register = new PlayerRegister();
    ThrowProxy proxy = new ThrowProxy(address(register));
    PlayerRegister(address(proxy)).newPlayer("player0");
    bool r1 = proxy.execute.gas(200000)();
    Assert.isTrue(r1, "r1 was supposed to be true");
    bool r2 = proxy.execute.gas(200000)();

    Assert.isFalse(r2, "Error was not produced!");
  }

  function testCanRetrievePlayerNameAfterRegistration() public {
    PlayerRegister register = new PlayerRegister();
    register.newPlayer("player0");
    Assert.equal(
      "player0",
      register.getPlayerName(),
      "Could not retrieve player name after registering!"
    );
  }

  function testCannotRetrievePlayerNameIfNotRegistered() public {
    PlayerRegisterProxy registerProxy = new PlayerRegisterProxy();
    ThrowProxy throwProxy = new ThrowProxy(address(registerProxy));
    PlayerRegisterProxy(address(throwProxy)).getNameWithoutRegistering();
    bool r = throwProxy.execute();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCanRetrieveWinCountAfterRegistration() public {
    PlayerRegister register = new PlayerRegister();
    register.newPlayer("player0");
    Assert.equal(
      uint(0),
      uint(register.getWinCount()),
      "Could not retrieve the correct win count"
    );
  }

  function testCannotRetrieveWinCountIfNotRegistered() public {
    PlayerRegisterProxy registerProxy = new PlayerRegisterProxy();
    ThrowProxy throwProxy = new ThrowProxy(address(registerProxy));
    PlayerRegisterProxy(address(throwProxy)).getWinCountWithoutRegistering();
    bool r = throwProxy.execute();

    Assert.isFalse(r, "Error was not produced!");
  }
}

