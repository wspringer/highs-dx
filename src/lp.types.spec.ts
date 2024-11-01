import { VariableNameOf } from "./lp.types";

type Assignable<T, U> = [T] extends [U] ? true : false;
type Identical<T, U> = [Assignable<T, U>, Assignable<U, T>] extends [true, true]
  ? true
  : false;

const verify = <T extends true>() => true as T;

describe("lp utilities", () => {
  describe("resultType", () => {
    it("should work on a simple CPLEX lp model", () => {
      type Name = VariableNameOf<`Maximize
 obj: 2 x1 + 3 x2 - x3

c1: x1 + x2 <= 10
c2: x1 - x3 >= 5`>;
      verify<Identical<Name, "x1" | "x2" | "x3">>;
    });

    it("should work on a more complex CPLEX lp model", () => {
      type Name = VariableNameOf<`Maximize
 obj: 2 x1 + 3 x2 - x3

Subject To
 c1: x1 + x2 <= 10
 c2: x1 - x3 >= 5

Bounds
 0 <= x1 <= 10
 x2 free

General
 x1

Binary
 x3`>;
      verify<Identical<Name, "x1" | "x2" | "x3">>;
    });

    it("should work with End and equals constraints", () => {
      type Name = VariableNameOf<`Minimize
  obj: 3 x1 - 4 x2 + x3

  Subject To
  c1: x1 + 2 x2 + x3 >= 15
  c2: x1 - x2 = 5

  Bounds
  0 <= x1 <= 10
  x2 free

  End`>;
      verify<Identical<Name, "x1" | "x2" | "x3">>;
    });

    it("should work with mixed type variable names", () => {
      type Name = VariableNameOf<`Maximize
 Profit: 5 ProductA + 4 ProductB

Subject To
 Resources:
 2 ProductA + 3 ProductB <= 100
 DemandA:
 ProductA >= 10
 DemandB:
 ProductB >= 20

General
 ProductA
 ProductB

Binary
 IsActive`>;
      verify<Identical<Name, "ProductA" | "ProductB" | "IsActive">>;
    });
  });
});
