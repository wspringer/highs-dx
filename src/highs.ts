/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 Wilfred Springer
 */
import highsJsLoader, { HighsLoaderOptions } from "highs";
import { Highs } from "./highs.types";

export default function highsLoader(
  options?: HighsLoaderOptions
): Promise<Highs> {
  return highsJsLoader(options);
}
