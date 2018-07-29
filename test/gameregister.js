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
      assert.equal(tx.logs[0].args._from, accounts[0]);
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

  it("should return the correct game playing status when no game has been started", function() {
    var register;

    return GameRegister.deployed().then(function(instance) {
      register = instance;
      return register.newPlayer("player2", {from: accounts[2]});
    }).then(function() {
      return register.getGamePlayingStatus({from: accounts[2]});
    }).then(function(status) {
      assert.equal(status, "not_started");
    });
  });

  it("should return the correct game playing status when the game is queued", function() {
    var register;

    return GameRegister.deployed().then(function(instance) {
      register = instance;
      return register.newGame({from: accounts[2]});
    }).then(function() {
      return register.getGamePlayingStatus({from: accounts[2]});
    }).then(function(status) {
      assert.equal(status, "queued");
    });
  });

  it("should return the correct game playing status when playing the game", function() {
    var register;

    return GameRegister.deployed().then(function(instance) {
      register = instance;
      return register.newPlayer("player3", {from: accounts[3]});
    }).then(function() {
      return register.newGame({from: accounts[3]});
    }).then(function() {
      return register.getGamePlayingStatus({from: accounts[3]});
    }).then(function(status) {
      assert.equal(status, "playing");
    });
  });

  it("should produce an error when the game playing status is requested and the player is not registered", function() {
    return GameRegister.deployed().then(function(instance) {
      return instance.getGamePlayingStatus({from: accounts[4]});
    }).then(function() {
      // The call is not supposed to succeed
      assert.equal(1, 2);
    }).catch(function(e) {
      assert.equal(e.message, "VM Exception while processing transaction: revert")
    });
  });
});
