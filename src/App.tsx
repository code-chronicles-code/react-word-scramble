import React, { type ReactNode, useCallback, useEffect, useRef } from "react";

import styles from "./App.module.css";
import Rounds from "./Rounds";
import useAppState, { type Round } from "./hooks/useAppState";
import useLoadData from "./hooks/useLoadData";
import countIf from "./util/countIf";
import pluralize from "./util/pluralize";
import Word from "./Word";

function Container({
  children,
  currentRound,
  finishedRounds = [],
  guess,
}: {
  children: ReactNode;
  currentRound?: Round;
  finishedRounds?: readonly Round[];
  guess?: string;
}) {
  return (
    <div className={`${styles.container} centered-container flex-col`}>
      <Rounds
        finishedRounds={finishedRounds}
        currentRound={currentRound}
        guess={guess}
      />
      {children}
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useAppState();
  useLoadData(dispatch);

  const guessInputRef = useRef<HTMLInputElement | null>(null);

  const skipWord = useCallback(() => {
    dispatch({ type: "skip-word" });
    guessInputRef.current?.focus();
  }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    document.addEventListener(
      "keydown",
      (ev) => {
        if (ev.key === "Escape") {
          ev.preventDefault();
          skipWord();
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [skipWord]);

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
          <button onClick={() => dispatch({ type: "start-game" })} autoFocus>
            Play
          </button>
        </Container>
      );
    }

    case "in-game": {
      return (
        <Container
          finishedRounds={state.finishedRounds}
          currentRound={state.currentRound}
          guess={state.guess}
        >
          <label className={`${styles.guessLabel} centered-container flex-col`}>
            <div className={styles.guessContainer}>
              <div
                className={`${styles.guessUnderlay} word centered-container flex-col`}
              >
                <Word
                  word={
                    state.guess.toUpperCase() ||
                    // Make sure the container is never empty, so that it takes some vertical space.
                    " "
                  }
                  highlightInReference
                  highlightOutOfReference
                  referenceWord={state.currentRound.wordScrambled}
                />
              </div>
              <input
                ref={guessInputRef}
                type="text"
                autoFocus
                className={`${styles.guess} word`}
                value={state.guess}
                onChange={(ev) =>
                  dispatch({ type: "update-guess", newGuess: ev.target.value })
                }
              />
            </div>
            <div>Unscramble the word!</div>
          </label>
          <div className={`${styles.buttonRow} centered-container flex-row`}>
            <button onClick={skipWord}>Skip</button>
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
        (round) => round.status === "guessed",
      );
      const wordsSkipped = countIf(
        state.finishedRounds,
        (round) => round.status === "skipped",
      );

      return (
        <Container finishedRounds={state.finishedRounds}>
          <div>
            You guessed {pluralize(wordsGuessed, "word")} and skipped{" "}
            {pluralize(wordsSkipped, "word")}.
          </div>
          <button onClick={() => dispatch({ type: "start-game" })} autoFocus>
            Play again
          </button>
        </Container>
      );
    }
  }

  // This should never happen!
  return <Container>Something unexpected happened!</Container>;
}
