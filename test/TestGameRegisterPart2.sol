pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "./ThrowProxy.sol";
import "../contracts/GameRegister.sol";

contract TestGameRegisterPart2 {
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

  function testCannotReturnGameIdWhenNotRegistered() public {
    Assert.fail("Implementation required!");
  }

  function testCannotReturnGameIdWhenNotPlaying() public {
    Assert.fail("Implementation required!");
  }
}

