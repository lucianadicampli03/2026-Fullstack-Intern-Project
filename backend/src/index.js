const crypto = require("crypto");
const express = require("express");
const cors = require("cors");

const { loadWordList } = require("./words");
const { scoreGuess } = require("./wordle");

const app = express();
const PORT = process.env.PORT || 3001;

const words = loadWordList();
const allowed = new Set(words);

const games = new Map();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ name: "word game api", health: "/health" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/game", (req, res) => {
  const gameId = crypto.randomUUID();
  const secret = words[Math.floor(Math.random() * words.length)];

  games.set(gameId, {
    secret,
    guessesUsed: 0,
    status: "playing",
  });

  res.json({ gameId });
});

app.post("/guess", (req, res) => {
  const gameId = req.body?.gameId;
  let word = req.body?.word;

  if (!gameId || typeof word !== "string") {
    return res.status(400).json({ error: "gameId and word are required" });
  }

  word = word.trim().toUpperCase();

  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  if (game.status !== "playing") {
    return res.status(400).json({
      error: "Game already finished",
      state: game.status,
      answer: game.secret,
    });
  }

  if (word.length !== 5) {
    return res.status(400).json({ error: "Guess must be 5 letters" });
  }

  if (!allowed.has(word)) {
    return res.status(400).json({ error: "Not in word list" });
  }

  const evaluation = scoreGuess(game.secret, word);
  const solved = evaluation.every((cell) => cell.status === "correct");

  game.guessesUsed += 1;

  if (solved) {
    game.status = "won";
  } else if (game.guessesUsed >= 6) {
    game.status = "lost";
  }

  const remainingGuesses = Math.max(0, 6 - game.guessesUsed);

  const payload = {
    evaluation,
    state: game.status,
    remainingGuesses,
  };

  if (game.status === "lost") {
    payload.answer = game.secret;
  }

  res.json(payload);
});

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT} (${words.length} words loaded)`);
});
