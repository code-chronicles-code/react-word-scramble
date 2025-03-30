import { useReducer, type Dispatch } from "react";

import getRandomElement from "../util/getRandomElement";
import normalizeString from "../util/normalizeString";
import scrambleString from "../util/scrambleString";

export type Round = Readonly<{
  wordUnscrambled: string;
  wordScrambled: string;
  didGuess: boolean;
}>;

function getNewRound(wordPack: readonly string[]): Round {
  const word = getRandomElement(wordPack);

  return {
    wordUnscrambled: word,
    wordScrambled: scrambleString(word),
    didGuess: false,
  };
}

type PreGameState = Readonly<{
  phase: "pre-game";
  wordPack: readonly string[] | null;
}>;

type InGameState = Readonly<{
  phase: "in-game";
  currentRound: Round;
  finishedRounds: readonly Round[];
  guess: string;
  wordPack: readonly string[];
}>;

type PostGameState = {
  phase: "post-game";
  finishedRounds: readonly Round[];
  wordPack: readonly string[];
};

export type State = PreGameState | InGameState | PostGameState;

function getNewRoundState(state: InGameState, didGuess: boolean): InGameState {
  return {
    ...state,
    currentRound: getNewRound(state.wordPack),
    finishedRounds: [
      ...state.finishedRounds,
      didGuess ? { ...state.currentRound, didGuess: true } : state.currentRound,
    ],
    guess: "",
  };
}

export function getInitialState(): State {
  return { phase: "pre-game", wordPack: null };
}

export type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string }
  | { type: "skip-word" }
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
        finishedRounds: [...state.finishedRounds, state.currentRound],
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

    case "skip-word": {
      // No-op if not in a game.
      if (state.phase !== "in-game") {
        return state;
      }

      return getNewRoundState(state, false);
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
        currentRound: getNewRound(wordPack),
        finishedRounds: [],
        guess: "",
        wordPack,
      };
    }

    case "update-guess": {
      // No-op if not in a game.
      if (state.phase !== "in-game") {
        return state;
      }

      if (
        normalizeString(action.newGuess) === state.currentRound.wordUnscrambled
      ) {
        return getNewRoundState(state, true);
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
