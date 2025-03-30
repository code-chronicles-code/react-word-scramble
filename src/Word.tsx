import React from "react";

import styles from "./Word.module.css";

type Props = {
  word: string;
  color?: "positive" | "negative" | "neutral";
};

export default function Word({ word, color = "neutral" }: Props) {
  return (
    <div
      className={[
        color === "positive"
          ? styles.textPositive
          : color === "negative"
            ? styles.textNegative
            : null,
        "word",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {word}
    </div>
  );
}
