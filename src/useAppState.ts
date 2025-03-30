import { useReducer, type Dispatch } from "react";

import getRandomElement from "./util/getRandomElement";

export type State = Readonly<
  | {
      phase: "pre-game";
      wordPack: readonly string[] | null;
    }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
      wordPack: readonly string[];
    }
  | {
      phase: "post-game";
      goal: string;
      wordPack: readonly string[];
    }
>;

export function getInitialState(): State {
  return { phase: "pre-game", wordPack: null };
}

export type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
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
        wordPack,
      };
    }

    case "update-guess": {
      // No-op if not in a game.
      if (state.phase !== "in-game") {
        return state;
      }

      if (action.newGuess === state.goal) {
        return {
          phase: "post-game",
          goal: state.goal,
          wordPack: state.wordPack,
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
