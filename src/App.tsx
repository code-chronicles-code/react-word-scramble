import React, { type ReactNode } from "react";

import styles from "./App.module.css";
import FinishedRounds from "./FinishedRounds";
import useAppState from "./hooks/useAppState";
import useLoadData from "./hooks/useLoadData";
import countIf from "./util/countIf";
import pluralize from "./util/pluralize";

function Container({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.container} centered-container flex-col`}>
      {children}
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useAppState();
  useLoadData(dispatch);

  switch (state.phase) {
    case "pre-game": {
      if (state.wordPack == null) {
        return <Container>Loading data...</Container>;
      }

      return (
        <Container>
          <div>Word pack is ready with {state.wordPack.length} words!</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin
          </button>
        </Container>
      );
    }

    case "in-game": {
      return (
        <Container>
          <FinishedRounds
            rounds={state.finishedRounds}
            currentRound={state.currentRound}
          />
          <label className={`${styles.guessLabel} centered-container flex-col`}>
            <input
              type="text"
              autoFocus
              className={`${styles.guess} word`}
              value={state.guess}
              onChange={(ev) =>
                dispatch({ type: "update-guess", newGuess: ev.target.value })
              }
            />
            <div>Guess the word!</div>
          </label>
          <div className={`${styles.buttonRow} centered-container flex-row`}>
            <button onClick={() => dispatch({ type: "skip-word" })}>
              Skip
            </button>
            <button onClick={() => dispatch({ type: "end-game" })}>
              End game
            </button>
          </div>
        </Container>
      );
    }

    case "post-game": {
      const wordsGuessed = countIf(
        state.finishedRounds,
        (round) => round.didGuess
      );
      const wordsSkipped = state.finishedRounds.length - wordsGuessed;

      return (
        <Container>
          <FinishedRounds rounds={state.finishedRounds} />
          <div>
            You guessed {pluralize(wordsGuessed, "word")} and skipped{" "}
            {pluralize(wordsSkipped, "word")}.
          </div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Play again
          </button>
        </Container>
      );
    }
  }

  // This should never happen!
  return <Container>Something unexpected happened!</Container>;
}
