import { VariableNameOf } from "./lp.types";
import { verify, Identical } from "../test/util.types";

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

    it("should support slightly larger models", () => {
      type Name = VariableNameOf<`Maximize
 obj: 3 x1 + 5 x2 + 2 x3 - x4 + 7 x5

Subject To
 demand_1: 2 x1 + 3 x2 + 4 x3 + x4 <= 20
 demand_2: 5 x1 + 2 x2 + 3 x5 >= 15
 demand_3: x2 + 4 x3 + 2 x4 + 3 x5 <= 18
 machine_capacity: x1 + x3 + x5 <= 10
 manpower_limit: 4 x2 + 3 x4 + 2 x5 <= 25
 max_orders: x1 + x2 + x3 + x4 + x5 <= 30
 min_orders: x1 + x2 >= 5
 specific_order: x3 = 3

Bounds
 0 <= x1 <= 5
 2 <= x2 <= 8
 x3 free
 0 <= x4 <= 10
 x5 >= 1

General
 x4
 x5

Binary
 is_active_1
 is_active_2`>;
      verify<
        Identical<
          Name,
          "x1" | "x2" | "x3" | "x4" | "x5" | "is_active_1" | "is_active_2"
        >
      >;
    });

    it("should support a model twice as large", () => {
      type Name = VariableNameOf<`Maximize
 obj: 4 x1 + 6 x2 + 3 x3 + 7 x4 + 2 x5 + 5 x6 - 3 x7 + 8 x8 + x9 + 4 x10

Subject To
 demand_1: 2 x1 + 3 x2 + 4 x3 + x4 + 2 x5 <= 35
 demand_2: 5 x1 + 2 x2 + 3 x6 + x7 >= 20
 demand_3: x2 + 4 x3 + 2 x4 + 3 x5 + x8 <= 30
 machine_capacity_1: x1 + x3 + x5 + x7 <= 12
 machine_capacity_2: x2 + x4 + x6 + x8 <= 14
 manpower_limit_1: 4 x2 + 3 x4 + 2 x5 + 5 x9 <= 40
 manpower_limit_2: 3 x3 + x6 + 2 x8 + 3 x10 <= 28
 min_orders_1: x1 + x2 + x3 >= 8
 min_orders_2: x4 + x5 + x6 >= 6
 specific_order_1: x7 = 2
 specific_order_2: x8 = 4
 max_orders: x1 + x2 + x3 + x4 + x5 + x6 + x7 + x8 + x9 + x10 <= 50

Bounds
 0 <= x1 <= 6
 1 <= x2 <= 10
 0 <= x3 <= 8
 x4 free
 x5 >= 2
 0 <= x6 <= 15
 3 <= x7 <= 7
 x8 free
 0 <= x9 <= 12
 2 <= x10 <= 9

General
 x4
 x5
 x6
 x7
 x8
 x9
 x10

Binary
 is_active_1
 is_active_2
 is_active_3
 is_active_4`>;
      verify<
        Identical<
          Name,
          | "x1"
          | "x2"
          | "x3"
          | "x4"
          | "x5"
          | "x6"
          | "x7"
          | "x8"
          | "x9"
          | "x10"
          | "is_active_1"
          | "is_active_2"
          | "is_active_3"
          | "is_active_4"
        >
      >;
    });
  });
});
