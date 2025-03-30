import React, { useEffect } from "react";

import styles from "./App.module.css";
import useAppState from "./useAppState";

function App() {
  const [state, dispatch] = useAppState();

  useEffect(() => {
    fetch("fruits.txt")
      .then((response) => response.text())
      .then((text) => {
        setTimeout(
          () =>
            dispatch({
              type: "load-data",
              wordPack: text
                .split("\n")
                .map((word) => word.toUpperCase().trim())
                .filter(Boolean),
            }),
          3000,
        );
      });
  }, [dispatch]);

  let content = null;
  switch (state.phase) {
    case "pre-game": {
      if (state.wordPack == null) {
        content = <>Loading data...</>;
        break;
      }

      content = (
        <>
          <div>Word pack is ready with {state.wordPack.length} words!</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin new game
          </button>
        </>
      );
      break;
    }

    case "in-game": {
      content = (
        <>
          <div>Goal: {state.goal}</div>
          <div>
            <label>
              Guess:
              <input
                type="text"
                value={state.guess}
                onChange={(ev) =>
                  dispatch({ type: "update-guess", newGuess: ev.target.value })
                }
              />
            </label>
          </div>
        </>
      );
      break;
    }

    case "post-game": {
      content = (
        <>
          <div>Nice game! You guessed {state.goal}</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin new game
          </button>
        </>
      );
      break;
    }
  }

  return (
    <div className={styles.container}>
      {content}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

export default App;
