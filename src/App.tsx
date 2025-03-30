import React, { useReducer } from "react";

import styles from "./App.module.css";
import { getInitialState, reducer } from "./appState";

function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  let content = null;
  switch (state.phase) {
    case "pre-game": {
      content = (
        <button onClick={() => dispatch({ type: "start-game" })}>
          Begin new game
        </button>
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
