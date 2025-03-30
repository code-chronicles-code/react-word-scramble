import React from "react";

import styles from "./Word.module.css";
import getFrequencyMap from "./util/getFrequencyMap";

type Props = {
  word: string;
  color?: "positive" | "negative" | "neutral";

  referenceWord?: string;
  highlightInReference?: boolean;
  highlightOutOfReference?: boolean;
};

export default function Word({
  word,
  color = "neutral",
  referenceWord,
  highlightInReference,
  highlightOutOfReference,
}: Props) {
  const wordContent = (() => {
    if (
      referenceWord == null ||
      (!highlightInReference && !highlightOutOfReference)
    ) {
      return word;
    }

    const freq = getFrequencyMap(referenceWord);

    return (
      <>
        {[...word].map((c, i) => {
          let color: undefined | string = undefined;
          if ((freq[c] ?? 0) > 0) {
            --freq[c];
            if (highlightInReference) {
              color = "royalblue";
            }
          } else if (highlightOutOfReference) {
            color = "crimson";
          }

          return (
            <span key={i} style={{ color }}>
              {c}
            </span>
          );
        })}
      </>
    );
  })();

  return (
    <div
      className={[
        "word",
        color === "positive" && styles.textPositive,
        color === "negative" && styles.textNegative,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {wordContent}
    </div>
  );
}
