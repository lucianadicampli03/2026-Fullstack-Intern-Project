function scoreGuess(secret, guess) {
  secret = secret.toUpperCase();
  guess = guess.toUpperCase();

  if (secret.length !== 5 || guess.length !== 5) {
    throw new Error("Words must be 5 letters");
  }

  const status = Array(5).fill(null);

  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      status[i] = "correct";
    }
  }

  const remaining = {};
  for (let i = 0; i < 5; i++) {
    if (status[i] === "correct") continue;
    const ch = secret[i];
    remaining[ch] = (remaining[ch] || 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    if (status[i] === "correct") continue;

    const ch = guess[i];
    if (remaining[ch] > 0) {
      status[i] = "present";
      remaining[ch]--;
    } else {
      status[i] = "absent";
    }
  }

  return guess.split("").map((letter, i) => ({
    letter,
    status: status[i],
  }));
}

module.exports = { scoreGuess };
