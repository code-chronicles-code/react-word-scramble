import getRandomWord from "./getRandomWord";

export type State =
  | {
      phase: "pre-game";
    }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
    }
  | {
      phase: "post-game";
      goal: string;
    };

export function getInitialState(): State {
  return { phase: "pre-game" };
}

export type Action =
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start-game": {
      // No-op if already in a game.
      if (state.phase === "in-game") {
        return state;
      }

      return {
        phase: "in-game",
        goal: getRandomWord(),
        guess: "",
      };
    }

    case "update-guess": {
      // No-op if not in a game.
      if (state.phase !== "in-game") {
        return state;
      }

      if (action.newGuess === state.goal) {
        return { phase: "post-game", goal: state.goal };
      }

      return { ...state, guess: action.newGuess };
    }
  }

  return state;
}
