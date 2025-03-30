import React from "react";

import styles from "./App.module.css";
import useAppState from "./hooks/useAppState";
import useLoadData from "./hooks/useLoadData";
import countIf from "./util/countIf";
import pluralize from "./util/pluralize";

function App() {
  const [state, dispatch] = useAppState();
  useLoadData(dispatch);

  switch (state.phase) {
    case "pre-game": {
      if (state.wordPack == null) {
        return <div className={styles.container}>Loading data...</div>;
      }

      return (
        <div className={styles.container}>
          <div>Word pack is ready with {state.wordPack.length} words!</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin new game
          </button>
        </div>
      );
    }

    case "in-game": {
      return (
        <div className={styles.container}>
          <pre>{JSON.stringify(state.finishedRounds, null, 2)}</pre>
          <div>Guess the word: {state.currentRound.wordScrambled}</div>
          <div>
            <label>
              Guess:
              <input
                type="text"
                autoFocus
                value={state.guess}
                onChange={(ev) =>
                  dispatch({ type: "update-guess", newGuess: ev.target.value })
                }
              />
            </label>
          </div>
          <button onClick={() => dispatch({ type: "skip-word" })}>
            Skip word
          </button>
          <button onClick={() => dispatch({ type: "end-game" })}>
            End game
          </button>
        </div>
      );
    }

    case "post-game": {
      const wordsGuessed = countIf(
        state.finishedRounds,
        (round) => round.didGuess,
      );
      const wordsSkipped = state.finishedRounds.length - wordsGuessed;

      return (
        <div className={styles.container}>
          <pre>{JSON.stringify(state.finishedRounds, null, 2)}</pre>
          <div>
            You guessed {pluralize(wordsGuessed, "word")} and skipped{" "}
            {pluralize(wordsSkipped, "word")}.
          </div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin new game
          </button>
        </div>
      );
    }
  }

  // This should never happen!
  return <div className={styles.container}>Something unexpected happened!</div>;
}

export default App;
