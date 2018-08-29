// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import movesregister_artifacts from '../../build/contracts/MovesRegister.json';

var MovesRegister = contract(movesregister_artifacts);
window.web3account; // TODO: get rid of this global (just use web3 default account)

window.TicTacCryptoeGame = function() {
  MovesRegister.setProvider(web3.currentProvider);
  web3.eth.getAccounts(function(err, accounts) {
    window.web3account = accounts[0];
    web3.eth.defaultAccount = window.web3account;
    MovesRegister.web3.eth.defaultAccount = window.web3account;
  });
}

window.TicTacCryptoeGame.prototype.getPlayerName = function(address = null) {
  return MovesRegister.deployed().then(function(instance) {
    if (address === null) {
      return instance.getPlayerName();
    }
    return instance.getPlayerNameByAddress(address);
  });
};

window.TicTacCryptoeGame.prototype.newPlayer = function(playerName) {
  return MovesRegister.deployed().then((instance) => {
    return instance.newPlayer(playerName, {from: window.web3account});
  });
};

window.TicTacCryptoeGame.prototype.listenForNewPlayerEvent = function(callback) {
  MovesRegister.deployed().then((instance) => {
    let newPlayerEvent = instance.NewPlayer({});
    newPlayerEvent.watch(callback);
  });
};

window.TicTacCryptoeGame.prototype.getWinCount = function(address = null) {
  return MovesRegister.deployed().then((instance) => {
    if (address === null) {
      return instance.getWinCount({from: window.web3account});
    }
    return instance.getWinCountByAddress(address);
  });
};

window.TicTacCryptoeGame.prototype.getLossCount = function(address = null) {
  return MovesRegister.deployed().then((instance) => {
    if (address === null) {
      return instance.getLossCount({from: window.web3account});
    }
    return instance.getLossCountByAddress(address);
  });
};

window.TicTacCryptoeGame.prototype.getGamePlayingStatus = function() {
  return MovesRegister.deployed().then((instance) => {
    return instance.getGamePlayingStatus({from: window.web3account});
  });
};

window.TicTacCryptoeGame.prototype.newGame = function() {
  return MovesRegister.deployed().then((instance) => {
    return instance.newGame({from: window.web3account});
  });
};

window.TicTacCryptoeGame.prototype.listenForQueuedGameEvent = function(callback) {
  return MovesRegister.deployed().then((instance) => {
    let queuedGameEvent = instance.QueuedGame({});
    queuedGameEvent.watch(callback);
  });
};

window.TicTacCryptoeGame.prototype.listenForStartGameEvent = function(callback) {
  return MovesRegister.deployed().then((instance) => {
    let startGameEvent = instance.StartGame({});
    startGameEvent.watch(callback);
  });
};

window.TicTacCryptoeGame.prototype.getOpponentAddress = function() {
  return MovesRegister.deployed().then((instance) => {
    return instance.getOpponentAddress({from: window.web3account});
  });
};

window.TicTacCryptoeGame.prototype.getCurrentGameId = function() {
  return MovesRegister.deployed().then((instance) => {
    return instance.getCurrentGameId({from: window.web3account});
  });
};

window.TicTacCryptoeGame.prototype.getGameBoard = function(gameId) {
  return MovesRegister.deployed().then((instance) => {
    return instance.games(gameId, {from: window.web3account});
  }).then((rawGame) => {
    return {
      moveCount: rawGame[0].toString(),
      cell0: rawGame[1].toString(),
      cell1: rawGame[2].toString(),
      cell2: rawGame[3].toString(),
      cell3: rawGame[4].toString(),
      cell4: rawGame[5].toString(),
      cell5: rawGame[6].toString(),
      cell6: rawGame[7].toString(),
      cell7: rawGame[8].toString(),
      cell8: rawGame[9].toString()
    };
  });
};
//-------------------------------------------------------------------

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
