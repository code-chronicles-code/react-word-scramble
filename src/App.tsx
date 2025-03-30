import React, { type ReactNode } from "react";

import styles from "./App.module.css";
import Rounds from "./Rounds";
import useAppState, { type Round } from "./hooks/useAppState";
import useLoadData from "./hooks/useLoadData";
import countIf from "./util/countIf";
import pluralize from "./util/pluralize";

function Container({
  children,
  finishedRounds = [],
  currentRound,
}: {
  children: ReactNode;
  currentRound?: Round;
  finishedRounds?: readonly Round[];
}) {
  return (
    <div className={`${styles.container} centered-container flex-col`}>
      <Rounds finishedRounds={finishedRounds} currentRound={currentRound} />
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
          <div>
            Word pack (<strong>fruits</strong>) is ready with{" "}
            {pluralize(state.wordPack.length, "word")}!
          </div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Begin
          </button>
        </Container>
      );
    }

    case "in-game": {
      return (
        <Container
          finishedRounds={state.finishedRounds}
          currentRound={state.currentRound}
        >
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
            <div>Unscramble the word!</div>
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
        (round) => round.didGuess,
      );
      const wordsSkipped = state.finishedRounds.length - wordsGuessed;

      return (
        <Container finishedRounds={state.finishedRounds}>
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
