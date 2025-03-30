import { type Dispatch, useEffect } from "react";

import normalizeString from "../util/normalizeString";
import stripNonLetters from "../util/stripNonLetters";
import type { Action } from "./useAppState";

export default function useLoadData(dispatch: Dispatch<Action>) {
  useEffect(() => {
    for (const [id, title] of Object.entries({
      cats: "Cats",
      fruits: "Fruits",
      "us-states": "US States",
    })) {
      fetch(`${id}.txt`)
        .then((response) => response.text())
        .then((text) =>
          dispatch({
            type: "load-word-pack",
            wordPack: {
              title,
              id,
              words: text.split("\n").map(normalizeString).filter(Boolean),
            },
          }),
        );
    }

    fetch("https://unpkg.com/naughty-words@1.2.0/en.json")
      .then((response) => response.json())
      .then((bannedWords) =>
        dispatch({
          type: "load-banned-words",
          bannedWords: Array.from(bannedWords, (word) =>
            stripNonLetters(normalizeString(String(word))),
          ).filter(Boolean),
        }),
      );
  }, [dispatch]);
}
