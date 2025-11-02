# Tic Tac Toe

A simple Tic Tac Toe game built in vanilla JavaScript using the module/factory pattern, following The Odin Project requirements. The game keeps the board/state in JS, renders it to the DOM, and lets two players play in the browser.

## Objectives

* Keep global code to a minimum.
* Separate responsibilities:

  * Gameboard: stores and exposes the board.
  * Game controller: turn order, win/tie detection, reset.
  * Display/DOM controller: rendering and user interaction.
* Allow players to enter names, start/restart, and see the result.

## Structure

* index.html – markup for the board container, status area, and player form.
* style.css – simple dark, centered layout, 3×3 grid, disabled state.
* script.js – modules for Gameboard, GameController, and DisplayController.

## Main Modules

1. Gameboard (IIFE)

   * Holds a 1D array of 9 cells (empty string, "X", or "O").
   * Exposes methods to get the board, set a mark at an index (if empty), and reset.
   * This is the single source of truth for the board.

2. Player (factory)

   * Creates a player object with name and mark ("X" or "O").

3. GameController (IIFE)

   * Creates and tracks two players.
   * Tracks whose turn it is.
   * Validates moves through the Gameboard.
   * Checks for win (all 3-in-a-row combinations) and tie (board full).
   * Can reset to start a new game.
   * Exposes a way to set player names from the UI.

4. DisplayController (IIFE)

   * Renders the current board array into the page.
   * Listens for clicks on board squares and sends the index to GameController.
   * Disables squares that are taken or when the game is over.
   * Shows messages like “Player 1’s turn (X)”, “Player 2 wins!”, or “It’s a tie.”
   * Listens to the form submit (start/restart), prevents default, updates names, and resets the game.

## Game Flow

1. On load:

   * Display controller builds a 3×3 grid in the DOM.
   * Gameboard starts empty.
   * Status area shows whose turn it is.

2. Player clicks a square:

   * Display controller gets the index and calls GameController.playRound(index).
   * GameController asks Gameboard to place the mark.
   * GameController checks for win or tie.
   * Display controller re-renders and updates the status.

3. On win or tie:

   * Board squares are visually disabled.
   * Status shows the outcome.

4. On form submit (start/restart):

   * New names are set.
   * Board and state are reset.
   * UI is re-rendered.


