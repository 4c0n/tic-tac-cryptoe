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

  });

  it("should error when requesting the name when not registered", function() {

  });
});
