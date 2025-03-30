import React from "react";

import styles from "./Rounds.module.css";
import type { Round } from "./hooks/useAppState";
import Word from "./Word";

type Props = {
  finishedRounds: readonly Round[];
  currentRound?: Round;
  guess?: string;
};

export default function Rounds({ currentRound, finishedRounds, guess }: Props) {
  return (
    <div className={`${styles.container} centered-container flex-col`}>
      <div className={`${styles.innerContainer} centered-container flex-col`}>
        {finishedRounds.map(({ wordUnscrambled: word, status }, index) => (
          <Word
            key={index}
            word={word}
            color={
              status === "guessed"
                ? "positive"
                : status === "skipped"
                  ? "negative"
                  : undefined
            }
          />
        ))}
      </div>
      {currentRound && (
        <Word
          word={currentRound.wordScrambled}
          highlightInReference
          referenceWord={guess?.toUpperCase()}
        />
      )}
    </div>
  );
}
