// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

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

  _registerDialogHandlers: function() {
    $('.player-registration-dialog-button').click((event) => {
      this._hidePlayerRegistrationDialog();
      this._showLoadingScreen();
      this._game.listenForNewPlayerEvent((error, result) => {
        if (!error) {
          console.log('NewPlayer event received: ', result, window.web3account);
          // check if this event was send from our account
          if (result.args._from === window.web3account) {
            this._hideLoadingScreen();
            this._initPlayerInfo();
            this._registerNewGamePaneHandlers();
            this._showNewGamePane();
          }
        } else {
          // TODO: properly handle this error
          console.error(error);
        }
      });

      let playerName = $('#player-registration-dialog-input').val();

      this._game.newPlayer(playerName).then(() => {

      }).catch((e) => {
        this._hideLoadingScreen();
        this._showPlayerRegistrationDialog(true);
        console.error(e);
      });
    });
  },

  _registerNewGamePaneHandlers: function() {
    $('#new-game-button').click((event) => {
      console.log('NEW GAME');
      this._showLoadingScreen();
      this._hideNewGamePane();
    });
  },

  _showPlayerRegistrationDialog: function(error = false) {
    this._registerDialogHandlers();
    $('.player-registration-dialog').show();
    if (error) {
      $('.player-registration-dialog-error').show();
    }
  },

  _hidePlayerRegistrationDialog() {
    $('.player-registration-dialog').hide();
  },

  _showLoadingScreen: function() {
    let screen = $('.loading-overlay');
    screen.show();
    screen.fadeIn(1000);
  },

  _hideLoadingScreen: function() {
    $('.loading-overlay').fadeOut(1000);
  },

  _showNewGamePane: function() {
    let pane = $('.new-game-pane');
    pane.show();
    pane.fadeIn(1000);
  },

  _hideNewGamePane: function() {
    let pane = $('.new-game-pane');
    pane.fadeOut(1000);
  },

  _initPlayerInfoAndGameBoard: function(playerName = null) {
    this._initPlayerInfo(playerName);
    this._initGameBoard();
  },

  __initPlayerInfo: function(playerName) {
    let playerInfo = $('.player-info');
    playerInfo.show();
    playerInfo.css("opacity", 1);
    $('.player-name-text').html(playerName);
    // TODO: init win count
    // TODO: init loss count
  },

  _initPlayerInfo: function(playerName = null) {
    if (playerName === null) {
      this.whoAmI().then((name) => {
        this.__initPlayerInfo(name);
      }).catch(function(e) {
        console.error(e);
        // TODO properly handle this error
      });
    } else {
      this.__initPlayerInfo(playerName);
    }
  },

  _initGameBoard: function() {
    let gameBoard = $('.game-board');
    gameBoard.show();
    gameBoard.css("opacity", 1);
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
    this._showLoadingScreen();

    // is a registered player?
    this._game = new TicTacCryptoeGame();
    let playerName;

    this.whoAmI().then((name) => {
      playerName = name;
      this._initPlayerInfoAndGameBoard();
      this._hideLoadingScreen();
    }).catch((e) => {
      console.error(e);
      // show dialog
      this._showPlayerRegistrationDialog();
      this._hideLoadingScreen();
   });
    //this._registerHandlers();
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

