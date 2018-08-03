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
        console.log('NewPlayer event received: ', result, window.web3account);

        if (!error) {
         // check if this event was send from our account
          if (result.args._from === window.web3account) {
            this._hideLoadingScreen();
            this._initPlayerInfo();
            this._initNewGamePane();
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
      // listen for QueuedGame event
      this._game.listenForQueuedGameEvent((error, result) => {
        if (!error) {
          console.log('QueuedGame event received: ', result, window.web3account);
          if (result.args._from === window.web3account) {
            this._initQueuedGamePane();
            this._hideLoadingScreen();
          };
        } else {
          // TODO: handle this error
          console.log(error);
        }
      });

      this._game.listenForStartGameEvent((error, result) => {
        if (!error) {
          // TODO: add conditions and only handle the event if it is meant for the current account
          console.log('StartGame event received: ', result, window.web3account);
          if (result.args._to === window.web3account) {
            this._hideQueuedGamePane();
            this._showLoadingScreen();
            // init the opponent info
            this._initOpponentInfo(result.args._from);
            // TODO: init the game board
            this._hideLoadingScreen();
          }
        } else {
          // TODO: handle this error
          console.log(error);
        }
      });

      this._showLoadingScreen();
      this._hideNewGamePane();
      this._game.newGame().then(() => {
        // Wait for event
      }).catch((e) => {
        // TODO: handle this error
        console.error(e);
      });
    });
  },

  _showPlayerRegistrationDialog: function(error = false) {
    this._registerDialogHandlers();
    $('.player-registration-dialog').show();
    if (error) {
      $('.player-registration-dialog-error').show();
    }
  },

  _hidePlayerRegistrationDialog: function() {
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

  _showQueuedGamePane: function() {
    let pane = $('.queued-game-pane');
    pane.show();
    pane.fadeIn(1000);
  },

  _hideQueuedGamePane: function() {
    let pane = $('.queued-game-pane');
    pane.fadeOut(1000);
  },

  _initPlayerInfoAndGameBoard: function(playerName = null) {
    this._initPlayerInfo(playerName);
    this._initGameBoard();
  },

  __initPlayerInfo: function(playerName, winCount, lossCount) {
    let playerInfo = $('.player-info');
    playerInfo.show();
    playerInfo.css("opacity", 1);
    $('.player-name-text').html(playerName);
    $('.player-wincount-text').html(winCount);
    $('.player-losscount-text').html(lossCount);
  },

  _initPlayerInfo: function(playerName = null) {
    if (playerName === null) {
      this._game.getPlayerName().then((name) => {
        playerName = name;
      }).catch((e) => {
        console.error(e);
        // TODO properly handle this error
      });
    }

    let winCount;
    this._game.getWinCount().then((count) => {
      winCount = count.toString();
    }).catch((e) => {
      console.error(e);
      // TODO: implement better error handling
    });

    let lossCount;
    this._game.getLossCount().then((count) => {
      lossCount = count.toString();
      this.__initPlayerInfo(playerName, winCount, lossCount);
    }).catch((e) => {
      console.error(e);
    });
  },

  _initNewGamePane: function() {
    this._registerNewGamePaneHandlers();
    this._showNewGamePane();
  },

  _initQueuedGamePane: function() {
    this._showQueuedGamePane();
  },

  _initOpponentInfo: function(address) {
    // TODO: get opponent info
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

    this._game.getPlayerName().then((name) => { // Is registered
      playerName = name;
      this._initPlayerInfo();
      this._game.getGamePlayingStatus().then((status) => {
        console.log(status);
        if (status === 'not_started') {
          this._initNewGamePane();
        } else if (status === 'queued') {
          // show some screen
          this._initQueuedGamePane();
        } else if (status === 'playing') {
          // TODO: init game board
        }
        this._hideLoadingScreen();
      }).catch((e) => {
        console.error(e);
        // TODO: handle this error
      });
    }).catch((e) => { // Is most likely not registered
      console.error(e);
      // show dialog
      this._showPlayerRegistrationDialog();
      this._hideLoadingScreen();
   });
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

  iAmAWinner: function(playerId) {
    return this._game.iAmAWinner(playerId);
  },

  getGameState: function() {
    return this._game.getGameState();
  }
};

