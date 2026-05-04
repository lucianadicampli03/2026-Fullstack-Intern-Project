import { useEffect, useState } from "react";
import { apiUrl } from "./api.js";
import "./App.css";

const EMPTY_GRID = Array.from({ length: 6 }, () => Array(5).fill(""));

function App() {
  const [gameId, setGameId] = useState("");
  const [rows, setRows] = useState(EMPTY_GRID);
  const [colors, setColors] = useState(Array.from({ length: 6 }, () => Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [state, setState] = useState("playing");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("Type a 5-letter word and press Enter.");

  useEffect(() => {
    startGame();
  }, []);

  async function startGame() {
    const res = await fetch(apiUrl("/game"), { method: "POST" });
    const data = await res.json();
    setGameId(data.gameId);
    setRows(Array.from({ length: 6 }, () => Array(5).fill("")));
    setColors(Array.from({ length: 6 }, () => Array(5).fill("")));
    setCurrentRow(0);
    setCurrentCol(0);
    setState("playing");
    setAnswer("");
    setMessage("New game started.");
  }

  function onTypeLetter(letter) {
    if (state !== "playing") return;
    if (currentCol >= 5) return;
    if (!/^[A-Z]$/.test(letter)) return;

    const next = rows.map((r) => [...r]);
    next[currentRow][currentCol] = letter;
    setRows(next);
    setCurrentCol((c) => c + 1);
  }

  function onBackspace() {
    if (state !== "playing") return;
    if (currentCol === 0) return;

    const next = rows.map((r) => [...r]);
    next[currentRow][currentCol - 1] = "";
    setRows(next);
    setCurrentCol((c) => c - 1);
  }

  async function onEnter() {
    if (state !== "playing") return;
    if (currentCol < 5) {
      setMessage("Word must be 5 letters.");
      return;
    }

    const guess = rows[currentRow].join("");
    const res = await fetch(apiUrl("/guess"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, word: guess }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Guess rejected.");
      return;
    }

    const nextColors = colors.map((r) => [...r]);
    data.evaluation.forEach((cell, i) => {
      nextColors[currentRow][i] = cell.status;
    });
    setColors(nextColors);

    if (data.state === "won") {
      setState("won");
      setMessage("You won 🎉");
      return;
    }

    if (data.state === "lost") {
      setState("lost");
      setAnswer(data.answer);
      setMessage("Game over.");
      return;
    }

    setCurrentRow((r) => r + 1);
    setCurrentCol(0);
    setMessage(`Guesses left: ${data.remainingGuesses}`);
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (!gameId) return;

      if (e.key === "Enter") {
        onEnter();
        return;
      }

      if (e.key === "Backspace") {
        onBackspace();
        return;
      }

      onTypeLetter(e.key.toUpperCase());
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameId, rows, currentRow, currentCol, state, colors]);

  return (
    <main className="app">
      <h1>Definitely Not Wordle</h1>
      <p className="message">{message}</p>

      <section className="board">
        {rows.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`tile ${colors[rowIndex][colIndex] || ""}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </section>

      {(state === "won" || state === "lost") && (
        <div className="end">
          {state === "won" ? "Nice work." : `The word was: ${answer}`}
        </div>
      )}

      <button className="new-game" onClick={startGame}>
        New game
      </button>
    </main>
  );
}

export default App;
