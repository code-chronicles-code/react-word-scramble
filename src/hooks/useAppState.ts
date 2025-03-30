import { useReducer, type Dispatch } from "react";

import normalizeString from "../util/normalizeString";
import scrambleString from "../util/scrambleString";
import shuffleInfinitely from "../util/shuffleInfinitely";

export type Round = Readonly<{
  wordUnscrambled: string;
  wordScrambled: string;
  status?: "guessed" | "skipped";
}>;

export type WordPack = Readonly<{
  id: string;
  title: string;
  words: readonly string[];
}>;

function getNewRound(
  getNextWord: () => string,
  bannedWords: readonly string[],
): Round {
  while (true) {
    const word = getNextWord();

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
  wordPacks: Record<string, WordPack>;
}>;

type InGameState = Readonly<{
  phase: "in-game";
  currentRound: Round;
  finishedRounds: readonly Round[];
  guess: string;
  bannedWords: readonly string[];
  wordPacks: Record<string, WordPack>;
  getNextWord: () => string;
}>;

type PostGameState = {
  phase: "post-game";
  finishedRounds: readonly Round[];
  bannedWords: readonly string[];
  wordPacks: Record<string, WordPack>;
};

export type State = PreGameState | InGameState | PostGameState;

function getNewRoundState(state: InGameState, didGuess: boolean): InGameState {
  return {
    ...state,
    currentRound: getNewRound(state.getNextWord, state.bannedWords),
    finishedRounds: [
      ...state.finishedRounds,
      { ...state.currentRound, status: didGuess ? "guessed" : "skipped" },
    ],
    guess: "",
  };
}

export function getInitialState(): State {
  return {
    phase: "pre-game",
    bannedWords: null,
    wordPacks: {},
  };
}

export type Action =
  | { type: "change-guess"; newGuess: string }
  | { type: "end-game" }
  | { type: "load-banned-words"; bannedWords: readonly string[] }
  | { type: "load-word-pack"; wordPack: WordPack }
  | { type: "skip-word" }
  | { type: "start-game"; selectedWordPackId: string };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "change-guess": {
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

    case "end-game": {
      // No-op if not in a game.
      if (state.phase !== "in-game") {
        return state;
      }

      return {
        phase: "post-game",
        finishedRounds: [...state.finishedRounds, state.currentRound],
        bannedWords: state.bannedWords,
        wordPacks: state.wordPacks,
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
      // No-op if not in pre-game phase.
      if (state.phase !== "pre-game") {
        return state;
      }

      return {
        ...state,
        wordPacks: {
          ...state.wordPacks,
          [action.wordPack.id]: action.wordPack,
        },
      };
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

      const { wordPacks, bannedWords } = state;

      // No-op if word pack or banned words aren't loaded.
      const wordPack = wordPacks[action.selectedWordPackId];
      if (wordPack == null || bannedWords == null) {
        return state;
      }

      const getNextWord = shuffleInfinitely(wordPack.words);
      return {
        phase: "in-game",
        currentRound: getNewRound(getNextWord, bannedWords),
        finishedRounds: [],
        guess: "",
        bannedWords,
        getNextWord,
        wordPacks,
      };
    }
  }

  // This should never happen!
  return state;
}

export default function useAppState(): [State, Dispatch<Action>] {
  return useReducer(reducer, null, getInitialState);
}
