pragma solidity ^0.4.24;

import "./Ownable.sol";

contract PlayerRegister is Ownable {
  struct Player {
    uint16 winCount;
    uint16 lossCount;
    string name;
  }

  Player[] public players;

  // default value == 0 so that we can still check if a value is set
  // the index stored in the uint is off by +1.
  mapping (address => uint) ownerToPlayer;

  event NewPlayer(address indexed _from, string name);

  // TODO: try to convert to modifier
  function requirePlayerExists() internal view {
    require(
      ownerToPlayer[msg.sender] != 0,
      "Account is not registered as a player!"
    );
  }

  // TODO: try to convert to  modifier
  function requirePlayerExists(address account) internal view {
    require(
      ownerToPlayer[account] != 0,
      "Account is not registered as a player!"
    );
  }

  function getPlayer() private view returns (Player) {
    return players[getPlayerIndex()];
  }

  function getPlayerIndex() internal view returns (uint) {
    return ownerToPlayer[msg.sender] - 1;
  }

  function newPlayer(string name) public {
    require(
      ownerToPlayer[msg.sender] == 0,
      "Account is already registered as player!"
    );
    // TODO: validate name
    uint id = players.push(Player(0, 0, name));
    ownerToPlayer[msg.sender] = id;
    emit NewPlayer(msg.sender, name);
  }

  function getPlayerName() public view returns (string) {
    requirePlayerExists();
    return getPlayer().name;
  }

  function getPlayerName(address account) public view returns (string) {
    requirePlayerExists(account);
    return players[ownerToPlayer[account] - 1].name;
  }

  function getWinCount() public view returns (uint16) {
    requirePlayerExists();
    return getPlayer().winCount;
  }

  function getLossCount() public view returns (uint16) {
    requirePlayerExists();
    return getPlayer().lossCount;
  }
}
