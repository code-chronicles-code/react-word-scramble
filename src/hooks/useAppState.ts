import { useReducer, type Dispatch } from "react";

import getRandomElement from "../util/getRandomElement";
import normalizeString from "../util/normalizeString";
import scrambleString from "../util/scrambleString";

export type Round = Readonly<{
  wordUnscrambled: string;
  wordScrambled: string;
  status?: "guessed" | "skipped";
}>;

function getNewRound(
  wordPack: readonly string[],
  bannedWords: readonly string[],
): Round {
  while (true) {
    const word = getRandomElement(wordPack);

    try {
      return {
        wordUnscrambled: word,
        wordScrambled: scrambleString(word, bannedWords),
      };
    } catch {
      console.warn("Struggled to scramble " + word);
    }
  }
}

type PreGameState = Readonly<{
  phase: "pre-game";
  bannedWords: readonly string[] | null;
  wordPack: readonly string[] | null;
}>;

type InGameState = Readonly<{
  phase: "in-game";
  currentRound: Round;
  finishedRounds: readonly Round[];
  guess: string;
  bannedWords: readonly string[];
  wordPack: readonly string[];
}>;

type PostGameState = {
  phase: "post-game";
  finishedRounds: readonly Round[];
  bannedWords: readonly string[];
  wordPack: readonly string[];
};

export type State = PreGameState | InGameState | PostGameState;

function getNewRoundState(state: InGameState, didGuess: boolean): InGameState {
  return {
    ...state,
    currentRound: getNewRound(state.wordPack, state.bannedWords),
    finishedRounds: [
      ...state.finishedRounds,
      { ...state.currentRound, status: didGuess ? "guessed" : "skipped" },
    ],
    guess: "",
  };
}

export function getInitialState(): State {
  return { phase: "pre-game", bannedWords: null, wordPack: null };
}

export type Action =
  | { type: "end-game" }
  | { type: "load-banned-words"; bannedWords: readonly string[] }
  | { type: "load-word-pack"; wordPack: readonly string[] }
  | { type: "skip-word" }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

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
        bannedWords: state.bannedWords,
        wordPack: state.wordPack,
      };
    }

    case "load-banned-words": {
      // No-op if not in pre-game phase, or if we already have banned words..
      if (state.phase !== "pre-game" || state.bannedWords) {
        return state;
      }

      return { ...state, bannedWords: action.bannedWords };
    }

    case "load-word-pack": {
      // No-op if not in pre-game phase, or if we already have a word pack.
      if (state.phase !== "pre-game" || state.wordPack) {
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
      const { bannedWords, wordPack } = state;
      if (bannedWords == null || wordPack == null) {
        return state;
      }

      return {
        phase: "in-game",
        currentRound: getNewRound(wordPack, bannedWords),
        finishedRounds: [],
        guess: "",
        bannedWords,
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
