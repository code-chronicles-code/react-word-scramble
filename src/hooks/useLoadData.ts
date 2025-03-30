import { type Dispatch, useEffect } from "react";

import normalizeString from "../util/normalizeString";

export default function useLoadData(
  dispatch: Dispatch<{ type: "load-data"; wordPack: readonly string[] }>,
) {
  useEffect(() => {
    fetch("fruits.txt")
      .then((response) => response.text())
      .then((text) => {
        dispatch({
          type: "load-data",
          wordPack: text.split("\n").map(normalizeString).filter(Boolean),
        });
      });
  }, [dispatch]);
}
