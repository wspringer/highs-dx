/**
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2024 Wilfred Springer
 */
export type Assignable<T, U> = [T] extends [U] ? true : false;
export type Identical<T, U> = [Assignable<T, U>, Assignable<U, T>] extends [
  true,
  true
]
  ? true
  : false;

export const verify = <T extends true>() => true as T;
