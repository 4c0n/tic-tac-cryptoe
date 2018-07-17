pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PlayerRegister.sol";

contract PlayerRegisterTest {
  function registersAgain(string signature) internal returns (bool) {
    bytes4 sig = bytes4(keccak256(signature));
    address self = address(this);
  }

  function testCanRegisterPlayer() public {
    PlayerRegister register = new PlayerRegister();
    register.newPlayer("player0");
  }

  function testCannotRegisterTheSamePlayerTwice() public {
    PlayerRegister register = new PlayerRegister();
    register.newPlayer("player0");
    
  }
}

