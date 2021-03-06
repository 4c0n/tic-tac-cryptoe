var PlayerRegister = artifacts.require("MovesRegister");

contract('PlayerRegister', function(accounts) {
  it("should emit event when new player is added", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.newPlayer("player0", {from: accounts[0]});
    }).then(function(tx) {
      assert.equal(tx.logs[0].event, "NewPlayer");
      assert.equal(tx.logs[0].args._from, accounts[0]);
    });
  });

  it("should be able to return the player name of the registered player", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getPlayerName({from: accounts[0]});
    }).then(function(name) {
      assert.equal(name, "player0");
    });
  });

  it("should be able to return the player name using a specific address", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getPlayerNameByAddress(accounts[0], {from: accounts[0]});
    }).then(function(name) {
      assert.equal(name, "player0");
    });
  });

  it("should error when requesting the name when not registered", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getPlayerName({from: accounts[1]});
    }).then(function() {
      // The call should not be successful.
      assert.equal(1, 2);
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert Account is not registered as a player!");
    });
  });

  it("should error when requesting the name of an address that has not registered", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getPlayerNameByAddress(accounts[5], {from: accounts[0]});
    }).then(function() {
      // The call should not be successful.
      assert.equal(false, true);
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert Account is not registered as a player!");
    });
  });

  it("should return the correct win count of the registered player", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getWinCount({from: accounts[0]});
    }).then(function(winCount) {
      assert.equal(winCount, 0);
    });
  });

  it("should return the correct win count of the player who's address was specified", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getWinCountByAddress(accounts[0], {from: accounts[0]});
    }).then(function(winCount) {
      assert.equal(winCount, 0);
    });
  });

  it("should error if requesting the win count when not registered", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getWinCount({from: accounts[1]});
    }).then(function() {
      // The call should not be successful
      assert.equal(1, 2);
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert Account is not registered as a player!");
    });
  });

  it("should error if requesting the win count of a specific player that did not register", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getWinCountByAddress(accounts[5], {from: accounts[0]});
    }).then(function() {
      // The call should not be successful
      assert.fail("success", "fail", "The call was not supposed to be successfull!");
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert Account is not registered as a player!");
    });
  });

  it("should return the correct loss count of the registered player", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getLossCount({from: accounts[0]});
    }).then(function(lossCount) {
      assert.equal(lossCount, 0);
    });
  });

  it("should return the correct loss count of the player who's address was specified", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getLossCountByAddress(accounts[0]);
    }).then(function(lossCount) {
      assert.equal(lossCount, 0);
    });
  });

  it("should error if requesting the loss count when not registered", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getLossCount({from: accounts[1]});
    }).then(function() {
      // The call should not be successful
      assert.equal(1, 2);
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert Account is not registered as a player!");
    });
  });

  it("should error if requesting the loss count of a specific player that did not register", function() {
    return PlayerRegister.deployed().then(function(instance) {
      return instance.getLossCountByAddress(accounts[5]);
    }).then(function() {
      assert.fail("success", "fail", "The call was not supposed to be successful!");
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert Account is not registered as a player!");
    });
  });
});
