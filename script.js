// Gameboard module (IIFE)
const Gameboard = (() => {
  const board = Array(9).fill("");

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) board[i] = "";
  };

  return { getBoard, setMark, reset };
})();

// Player factory
const Player = (name, mark) => {
  return { name, mark };
};

// Game controller module
const GameController = (() => {
  let player1 = Player("Player 1", "X");
  let player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let gameOver = false;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diags
  ];

  const setPlayers = (p1Name, p2Name) => {
    player1 = Player(p1Name || "Player 1", "X");
    player2 = Player(p2Name || "Player 2", "O");
    currentPlayer = player1;
  };

  const getCurrentPlayer = () => currentPlayer;
  const isGameOver = () => gameOver;

  const playRound = (index) => {
    if (gameOver) return { status: "over" };

    const moved = Gameboard.setMark(index, currentPlayer.mark);
    if (!moved) return { status: "invalid" };

    // check win
    if (checkWin(currentPlayer.mark)) {
      gameOver = true;
      return { status: "win", winner: currentPlayer };
    }

    // check tie
    if (isBoardFull()) {
      gameOver = true;
      return { status: "tie" };
    }

    // swap
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    return { status: "next", player: currentPlayer };
  };

  const checkWin = (mark) => {
    const board = Gameboard.getBoard();
    return winningCombos.some((combo) =>
      combo.every((i) => board[i] === mark)
    );
  };

  const isBoardFull = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const reset = () => {
    Gameboard.reset();
    currentPlayer = player1;
    gameOver = false;
  };

  return { playRound, getCurrentPlayer, isGameOver, reset, setPlayers };
})();

// Display / DOM controller
const DisplayController = (() => {
  const boardEl = document.querySelector("#board");
  const statusEl = document.querySelector("#status");
  const formEl = document.querySelector("#player-form");

  // build 9 squares
  const initBoard = () => {
    boardEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const sq = document.createElement("button");
      sq.type = "button";
      sq.classList.add("square");
      sq.dataset.index = i;
      boardEl.appendChild(sq);
    }
  };

  const render = () => {
    const board = Gameboard.getBoard();
    const squares = boardEl.querySelectorAll(".square");
    squares.forEach((sq, idx) => {
      sq.textContent = board[idx];
      sq.classList.toggle("disabled", board[idx] !== "" || GameController.isGameOver());
    });
    if (GameController.isGameOver()) return;
    const player = GameController.getCurrentPlayer();
    statusEl.textContent = `${player.name}'s turn (${player.mark})`;
  };

  const showWin = (player) => {
    statusEl.textContent = `${player.name} wins! 🎉`;
  };

  const showTie = () => {
    statusEl.textContent = "It's a tie.";
  };

  // event: board clicks
  boardEl.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.classList.contains("square")) return;
    const idx = Number(target.dataset.index);
    const result = GameController.playRound(idx);

    if (result.status === "win") {
      render();
      showWin(result.winner);
      return;
    }
    if (result.status === "tie") {
      render();
      showTie();
      return;
    }
    if (result.status === "invalid") {
      // ignore
      return;
    }
    render();
  });

  // event: start/restart
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);
    const p1 = formData.get("p1");
    const p2 = formData.get("p2");
    GameController.setPlayers(p1, p2);
    GameController.reset();
    render();
  });

  // initial
  initBoard();
  render();
})();


