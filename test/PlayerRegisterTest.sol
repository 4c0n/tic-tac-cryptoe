pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PlayerRegister.sol";

contract PlayerRegisterTest {
  function execute(string signature) internal returns (bool) {
    bytes4 sig = bytes4(keccak256(signature));
    address self = address(this);
    return self.call(sig);
  }

  function registerTwice() public {
    PlayerRegister register = new PlayerRegister();
    register.newPlayer("player0");
    register.newPlayer("player1");
  }

  function getPlayerNameWithoutRegistering() public {
    PlayerRegister register = new PlayerRegister();
    register.getPlayerName();
  }

  function testCanRegisterPlayer() public {
    PlayerRegister register = new PlayerRegister();
    register.newPlayer("player0");
  }

  function testCannotRegisterTheSamePlayerTwice() public {
    Assert.isFalse(execute('registerTwice()'), "Error was not produced!");
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
    Assert.isFalse(execute('getPlayerNameWithoutRegistering()'), "Error was not produced!");
  }
}

