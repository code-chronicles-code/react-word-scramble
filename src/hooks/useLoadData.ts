import { type Dispatch, useEffect } from "react";

import normalizeString from "../util/normalizeString";
import type { Action } from "./useAppState";

export default function useLoadData(dispatch: Dispatch<Action>) {
  useEffect(() => {
    fetch("fruits.txt")
      .then((response) => response.text())
      .then((text) =>
        dispatch({
          type: "load-word-pack",
          wordPack: text.split("\n").map(normalizeString).filter(Boolean),
        }),
      );

    fetch("https://unpkg.com/naughty-words@1.2.0/en.json")
      .then((response) => response.json())
      .then((bannedWords) =>
        dispatch({
          type: "load-banned-words",
          bannedWords: Array.from(bannedWords, (word) =>
            normalizeString(String(word)),
          ),
        }),
      );
  }, [dispatch]);
}
