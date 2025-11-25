import React, { useState } from 'react';
import './index.css';

// Utility: calculateWinner
// Returns 'X', 'O', or null
export function calculateWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Utility: getBotMove
// Implements the simple heuristic described in the instructions.
export function getBotMove(board, botSymbol = 'O', humanSymbol = 'X') {
  // helper to find winning move for symbol
  const findWinningMove = (b, symbol) => {
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        const copy = b.slice();
        copy[i] = symbol;
        if (calculateWinner(copy) === symbol) return i;
      }
    }
    return null;
  };

  // 1) winning move
  const win = findWinningMove(board, botSymbol);
  if (win !== null) return win;

  // 2) block human
  const block = findWinningMove(board, humanSymbol);
  if (block !== null) return block;

  // 3) take center
  if (!board[4]) return 4;

  // 4) take a corner
  const corners = [0,2,6,8];
  for (let c of corners) if (!board[c]) return c;

  // 5) pick any empty
  for (let i = 0; i < 9; i++) if (!board[i]) return i;

  return null;
}

function ModeSelector({ mode, setMode, onReset }) {
  return (
    <div className="mode-selector">
      <label>
        <input
          type="radio"
          name="mode"
          checked={mode === 'pvp'}
          onChange={() => { setMode('pvp'); onReset(); }}
        />
        Player vs Player
      </label>
      <label>
        <input
          type="radio"
          name="mode"
          checked={mode === 'pvb'}
          onChange={() => { setMode('pvb'); onReset(); }}
        />
        Player vs Bot
      </label>
    </div>
  );
}

function StatusDisplay({ status, currentPlayer }) {
  let text = '';
  if (status === 'ongoing') text = `Current player: ${currentPlayer}`;
  else if (status === 'draw') text = 'Draw';
  else text = `${status} wins`;

  return <div className="status">{text}</div>;
}

function Square({ value, onClick, disabled }) {
  return (
    <button className="square" onClick={onClick} disabled={disabled}>
      {value}
    </button>
  );
}

function Board({ board, onSquareClick, disabled }) {
  return (
    <div className="board">
      {board.map((v, i) => (
        <Square
          key={i}
          value={v}
          onClick={() => onSquareClick(i)}
          disabled={disabled || v !== null}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [status, setStatus] = useState('ongoing'); // 'ongoing' | 'X' | 'O' | 'draw'
  const [mode, setMode] = useState('pvp');

  const reset = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setStatus('ongoing');
  };

  const handleSquareClick = (index) => {
    if (status !== 'ongoing') return;
    if (board[index]) return;

    // Player vs Player: both players click
    if (mode === 'pvp') {
      const nextBoard = board.slice();
      nextBoard[index] = currentPlayer;
      setBoard(nextBoard);
      const winner = calculateWinner(nextBoard);
      if (winner) {
        setStatus(winner);
        return;
      }
      if (nextBoard.every(cell => cell !== null)) {
        setStatus('draw');
        return;
      }
      setCurrentPlayer(prev => (prev === 'X' ? 'O' : 'X'));
      return;
    }

    // Player vs Bot: human is always X
    if (mode === 'pvb') {
      // ignore if not human's turn
      if (currentPlayer !== 'X') return;

      // apply human move
      const afterHuman = board.slice();
      afterHuman[index] = 'X';
      // update board and check
      const humanWinner = calculateWinner(afterHuman);
      if (humanWinner) {
        setBoard(afterHuman);
        setStatus(humanWinner);
        return;
      }
      if (afterHuman.every(cell => cell !== null)) {
        setBoard(afterHuman);
        setStatus('draw');
        return;
      }

      // bot's turn (O) - choose synchronously
      const botIndex = getBotMove(afterHuman, 'O', 'X');
      if (botIndex === null) {
        // no moves left
        setBoard(afterHuman);
        if (afterHuman.every(cell => cell !== null)) setStatus('draw');
        return;
      }
      const afterBot = afterHuman.slice();
      afterBot[botIndex] = 'O';

      const botWinner = calculateWinner(afterBot);
      setBoard(afterBot);
      if (botWinner) {
        setStatus(botWinner);
        return;
      }
      if (afterBot.every(cell => cell !== null)) {
        setStatus('draw');
        return;
      }

      // continue with human's turn
      setCurrentPlayer('X');
    }
  };

  // When mode changes, ensure reset and starting player X
  const handleModeChange = (newMode) => {
    setMode(newMode);
    reset();
  };

  const disabled = status !== 'ongoing';

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <ModeSelector mode={mode} setMode={handleModeChange} onReset={reset} />
      <StatusDisplay status={status} currentPlayer={currentPlayer} />
      <Board board={board} onSquareClick={handleSquareClick} disabled={disabled} />
      <div className="controls">
        <button onClick={reset}>Reset</button>
      </div>
      <p className="hint">Human is X. Bot is O (when Player vs Bot selected).</p>
    </div>
  );
}
