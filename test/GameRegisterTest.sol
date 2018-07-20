pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/GameRegister.sol";

// Proxy contract for testing throws
contract ThrowProxy {
  address public target;
  bytes data;

  constructor(address _target) public {
    target = _target;
  }

  //prime the data using the fallback function.
  function() public {
    data = msg.data;
  }

  function execute() public returns (bool) {
    return target.call(data);
  }
}

contract GameRegisterTest {
  function testCanStartNewGame() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");
    register.newGame();
    uint moveCount;
    (moveCount) = register.games(0);
    Assert.equal(moveCount, 0, "Game was not started!");
  }

  function testCannotStartNewGameWhenNotRegistered() public {
    GameRegister register = new GameRegister();
    ThrowProxy throwProxy = new ThrowProxy(address(register));
    GameRegister(address(throwProxy)).newGame();
    bool r = throwProxy.execute.gas(200000)();

    Assert.isFalse(r, "Error was not produced!");
  }

  function testCannotStartNewGameWhenAlreadyPlaying() public {
    GameRegister register = new GameRegister();
    register.newPlayer("player0");
    register.newGame();
    ThrowProxy throwProxy = new ThrowProxy(address(register));
    GameRegister(address(throwProxy)).newGame();
    bool r = throwProxy.execute.gas(200000)();

    Assert.isFalse(r, "No errpr was produced!");
  }

  function testCanJoinGameThatIsWaitingForAnOpponent() public {
  }
}

