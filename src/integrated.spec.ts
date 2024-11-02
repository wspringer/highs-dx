import configureHighs from "./index";
import { verify, Identical } from "../test/util.types";

describe("highs", () => {
  it("should allow you to solve an LP model", async () => {
    const highs = await configureHighs();
    const solution = highs.solve(`Maximize
 obj:
    x1 + 2 x2 + 4 x3 + x4
Subject To
 c1: - x1 + x2 + x3 + 10 x4 <= 20
 c2: x1 - 4 x2 + x3 <= 30
 c3: x2 - 0.5 x4 = 0
Bounds
 0 <= x1 <= 40
 2 <= x4 <= 3
End`);
    type ColumnNames = keyof typeof solution.Columns;
    verify<Identical<ColumnNames, "x1" | "x2" | "x3" | "x4">>();
  });
});
