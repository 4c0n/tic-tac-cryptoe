// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import movesregister_artifacts from '../../build/contracts/MovesRegister.json';

var MovesRegister = contract(movesregister_artifacts);
var account;

window.TicTacCryptoeGame = function() {
  MovesRegister.setProvider(web3.currentProvider);
  web3.eth.getAccounts(function(err, accounts) {
    account = accounts[0];
    web3.eth.defaultAccount = account;
    MovesRegister.web3.eth.defaultAccount = account;
  });
}

window.TicTacCryptoeGame.prototype.whoAmI = function() {
  return MovesRegister.deployed().then(function(instance) {
    return instance.getPlayerName.call({from: account});
  });
};

window.TicTacCryptoeGame.prototype.newPlayer = function(playerName) {
  return MovesRegister.deployed().then((instance) => {
    return instance.newPlayer(playerName, {from: account});
  });
};

window.TicTacCryptoeGame.prototype.listenForNewPlayerEvent = function(callback) {
  MovesRegister.deployed().then((instance) => {
    let newPlayerEvent = instance.NewPlayer({});
    newPlayerEvent.watch(callback);
  });
};

window.TicTacCryptoeGame.prototype.isItMyTurn = function() {
  return false;
};

window.TicTacCryptoeGame.prototype.isCellOccupied = function(coords) {
  return this._state[coords.y][coords.x] !== null;
};

window.TicTacCryptoeGame.prototype.makeMove = function(coords, playerId) {
  this._state[coords.y][coords.x] = playerId;

  setTimeout(this.gameStateChangedListener.bind(this, this._state));
};

window.TicTacCryptoeGame.prototype.getGameState = function() {
  if (this.iAmAWinner(0)) {
    return PLAYER_0_WON;
  } else if (this.iAmAWinner(1)) {
    return PLAYER_1_WON;
  } else if (this.moreMovesPossible()) {
    return MORE_MOVES_POSSIBLE;
  } else {
    return DRAW;
  }
};

window.TicTacCryptoeGame.prototype.iAmAWinner = function(playerId) {
  if (this._state[0][0] === playerId && this._state[0][1] === playerId && this._state[0][2] === playerId ||
    this._state[1][0] === playerId && this._state[1][1] === playerId && this._state[1][2] === playerId ||
    this._state[2][0] === playerId && this._state[2][1] === playerId && this._state[2][2] === playerId ||
    this._state[0][0] === playerId && this._state[1][0] === playerId && this._state[2][0] === playerId ||
    this._state[0][1] === playerId && this._state[1][1] === playerId && this._state[2][1] === playerId ||
    this._state[0][2] === playerId && this._state[1][2] === playerId && this._state[2][2] === playerId ||
    this._state[0][0] === playerId && this._state[1][1] === playerId && this._state[2][2] === playerId ||
    this._state[0][2] === playerId && this._state[1][1] === playerId && this._state[2][0] === playerId) {

    return true;
  }
};

// TODO: could also be done by keeping track of the number of moves made
window.TicTacCryptoeGame.prototype.moreMovesPossible = function() {
  for (let row of this._state) {
    for (let value of row) {
      if (value === null) {
        return true;
      }
    }
  }
};

window.TicTacCryptoeGame.prototype.gameStateChangedListener = function(state) {
  this._state = state;

  if (this._currentPlayerId === 0) {
    this._currentPlayerId = 1;
  } else {
    this._currentPlayerId = 0;
  }
};
