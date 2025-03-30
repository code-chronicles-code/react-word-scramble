import React from "react";

import styles from "./Rounds.module.css";
import type { Round } from "./hooks/useAppState";
import Word from "./Word";

type Props = {
  finishedRounds: readonly Round[];
  currentRound?: Round;
};

export default function Rounds({ currentRound, finishedRounds }: Props) {
  return (
    <div className={`${styles.container} centered-container flex-col`}>
      {finishedRounds.map(({ wordUnscrambled: word, didGuess }, index) => (
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
