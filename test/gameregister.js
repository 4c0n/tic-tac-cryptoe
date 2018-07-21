var GameRegister = artifacts.require("MovesRegister");

contract("GameRegister", function(accounts) {
  it("should emit queued event when new game is started", function() {
    var register;

    return GameRegister.deployed().then(function(instance) {
      register = instance;
      return register.newPlayer("player0", {from: accounts[0]});
    }).then(function() {
      return register.newGame({from: accounts[0]});
    }).then(function(tx) {
      assert.equal(tx.logs[0].event, "QueuedGame");
      assert.equal(tx.logs[0].args._from, 0);
    });
  });

  it("should emit start event when new game is started and there is a queued game", function() {
    var register;

    return GameRegister.deployed().then(function(instance) {
      register = instance;
      return register.newPlayer("player1", {from: accounts[1]});
    }).then(function() {
      return register.newGame({from: accounts[1]});
    }).then(function(tx) {
      assert.equal(tx.logs[0].event, "StartGame");
      assert.equal(tx.logs[0].args._from, 1);
    });
  });

  it("should return the correct game count", function() {
    return GameRegister.deployed().then(function(instance) {
      return instance.getGameCount({from: accounts[0]});
    }).then(function(count) {
      assert.equal(count, 1);
    });
  });

  it("should produce an error when the player is not registered", function() {
    return GameRegister.deployed().then(function(instance) {
      return instance.newGame({from: accounts[2]});
    }).then(function() {
      // This case should not happen
      assert.equal(1, 0);
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert");
    });
  });

  it("should produce an error when the player is already playing a game", function() {
    return GameRegister.deployed().then(function(instance) {
      return instance.newGame({from: accounts[0]});
    }).then(function() {
      // This case should not happen
      assert.equal(0, 1);
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert");
    });
  });
});
