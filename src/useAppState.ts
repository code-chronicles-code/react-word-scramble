import { useReducer, type Dispatch } from "react";

import getRandomElement from "./util/getRandomElement";
import normalizeString from "./util/normalizeString";

export type State = Readonly<
  | {
      phase: "pre-game";
      wordPack: readonly string[] | null;
    }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
      wordsGuessed: number;
      wordPack: readonly string[];
    }
  | {
      phase: "post-game";
      wordsGuessed: number;
      wordPack: readonly string[];
    }
>;

export function getInitialState(): State {
  return { phase: "pre-game", wordPack: null };
}

export type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string }
  | { type: "end-game" };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "end-game": {
      // No-op if not in a game.
      if (state.phase !== "in-game") {
        return state;
      }

      return {
        phase: "post-game",
        wordsGuessed: state.wordsGuessed,
        wordPack: state.wordPack,
      };
    }

    case "load-data": {
      // No-op if not in pre-game phase.
      if (state.phase !== "pre-game") {
        return state;
      }

      return { ...state, wordPack: action.wordPack };
    }

    case "start-game": {
      // No-op if already in a game.
      if (state.phase === "in-game") {
        return state;
      }

      // No-op if data is not loaded.
      const { wordPack } = state;
      if (wordPack == null) {
        return state;
      }

      return {
        phase: "in-game",
        goal: getRandomElement(wordPack),
        guess: "",
        wordsGuessed: 0,
        wordPack,
      };
    }

    case "update-guess": {
      // No-op if not in a game.
      if (state.phase !== "in-game") {
        return state;
      }

      if (normalizeString(action.newGuess) === state.goal) {
        return {
          ...state,
          wordsGuessed: state.wordsGuessed + 1,
          goal: getRandomElement(state.wordPack),
          guess: "",
        };
      }

      return { ...state, guess: action.newGuess };
    }
  }

  // This should never happen!
  return state;
}

export default function useAppState(): [State, Dispatch<Action>] {
  return useReducer(reducer, null, getInitialState);
}
