import React, { useEffect } from "react";

import styles from "./App.module.css";
import useAppState from "./useAppState";
import normalizeString from "./util/normalizeString";
import pluralize from "./util/pluralize";

function App() {
  const [state, dispatch] = useAppState();

  useEffect(() => {
    fetch("fruits.txt")
      .then((response) => response.text())
      .then((text) => {
        dispatch({
          type: "load-data",
          wordPack: text.split("\n").map(normalizeString).filter(Boolean),
        });
      });
  }, [dispatch]);

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
          <div>Goal: {state.goal}</div>
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
          <button onClick={() => dispatch({ type: "end-game" })}>
            End game
          </button>
        </div>
      );
    }

    case "post-game": {
      return (
        <div className={styles.container}>
          <div>You guessed {pluralize(state.wordsGuessed, "word")}.</div>
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
