import React from "react";

import styles from "./FinishedRounds.module.css";
import type { Round } from "./hooks/useAppState";
import Word from "./Word";

type Props = {
  rounds: readonly Round[];
  currentRound?: Round;
};

export default function FinishedRounds({ currentRound, rounds }: Props) {
  return (
    <div className={`${styles.container} centered-container flex-col`}>
      {rounds.map(({ wordUnscrambled: word, didGuess }, index) => (
        <Word
          key={index}
          word={word}
          color={didGuess ? "positive" : "negative"}
        />
      ))}
      {currentRound && <Word word={currentRound.wordScrambled} />}
    </div>
  );
}
