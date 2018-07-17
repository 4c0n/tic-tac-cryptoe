// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

const PLAYER_0_WON = 'PLAYER 0 WON';
const PLAYER_1_WON = 'PLAYER 1 WON';
const MORE_MOVES_POSSIBLE = 'MORE MOVES POSSIBLE';
const DRAW = 'DRAW';

window.TicTacCryptoe = {
  _game: null,

  _registerHandlers: function() {
    $('.game-cell').click((event) => {
      this._cellClickHandler(event.currentTarget);
    });
  },

  _cellClickHandler: function(cellElement) {
    // Check if it is really the users turn to play
    if (!this.isItMyTurn()) {
      return;
    }

    // Extract coords from element id
    let coords = this._getCoords(cellElement.id);

    // Check if this cell is occupied
    if (this.isCellOccupied(coords)) {
      return;
    }

    // Get current player information and make move
    let playerId = this.whoAmI();
    this.makeMove(coords, playerId);

    // evaluate game state to determine what should happen next
    let state = this.getGameState();
    let message = '';
    if (state === PLAYER_0_WON) {
      message = 'Player 0 won!';
    } else if (state === PLAYER_1_WON) {
      message = 'Player 1 won!';
    } else if (state === MORE_MOVES_POSSIBLE) {
      if (playerId === 0) {
        message = 'Your turn Player 1!';
      } else {
        message = 'Your turn Player 0!';
      }
    } else if (state === DRAW) {
      message = 'Draw!';
    }
    $('#game-message-text').html(message);

    // Don't allow more moves to be made if the outcome has been decided
    if (state !== MORE_MOVES_POSSIBLE) {
      $('.game-cell').off();
    }
  },

  _getCoords: (cellElementId) => {
    let x = cellElementId.charAt(cellElementId.length - 3);
    let y = cellElementId.charAt(cellElementId.length - 1);

    return {x: x, y: y};
  },

  init: function() {
    this._registerHandlers();
    this._game = new TicTacCryptoeGame();
  },

  isItMyTurn: function() {
    return this._game.isItMyTurn();
  },

  isCellOccupied: function(coords) {
    return this._game.isCellOccupied(coords);
  },

  makeMove: function(coords, playerId) {
    this._game.makeMove(coords, playerId);

    let selector = '#game-cell-text-' + coords.x + '-' + coords.y;
    if (playerId === 0) {
      $(selector).text('O');
    } else {
      $(selector).text('X');
    }
  },

  whoAmI: function() {
    return this._game.whoAmI();
  },

  iAmAWinner: function(playerId) {
    return this._game.iAmAWinner(playerId);
  },

  getGameState: function() {
    return this._game.getGameState();
  }
};

/*-------------------------------------------------------------------------*/
// TODO: split off to separate file
function TicTacCryptoeGame() {
  this._state = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  this._currentPlayerId = 0;
}

TicTacCryptoeGame.prototype.isItMyTurn = function() {
  return this.whoAmI() === this._currentPlayerId;
};

TicTacCryptoeGame.prototype.isCellOccupied = function(coords) {
  return this._state[coords.y][coords.x] !== null;
};

TicTacCryptoeGame.prototype.whoAmI = function() {
  return this._currentPlayerId;
};

TicTacCryptoeGame.prototype.makeMove = function(coords, playerId) {
  this._state[coords.y][coords.x] = playerId;

  setTimeout(this.gameStateChangedListener.bind(this, this._state));
};

TicTacCryptoeGame.prototype.getGameState = function() {
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

TicTacCryptoeGame.prototype.iAmAWinner = function(playerId) {
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
TicTacCryptoeGame.prototype.moreMovesPossible = function() {
  for (let row of this._state) {
    for (let value of row) {
      if (value === null) {
        return true;
      }
    }
  }
};

TicTacCryptoeGame.prototype.gameStateChangedListener = function(state) {
  this._state = state;

  if (this._currentPlayerId === 0) {
    this._currentPlayerId = 1;
  } else {
    this._currentPlayerId = 0;
  }
};
