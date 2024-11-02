import { VariableNameOf } from "../src/lp.types";

declare module "highs" {
  interface TypesafeHighs {
    solve<S extends string>(
      problem: S,
      options?: HighsOptions
    ): TypesafeHighsSolution<VariableNameOf<S>>;
  }

  type TypesafeHighsSolution<Names extends string> =
    | TypesafeGenericHighsSolution<
        Names,
        true,
        HighsLinearSolutionColumn,
        HighsLinearSolutionRow
      >
    | TypesafeGenericHighsSolution<
        Names,
        false,
        HighsMixedIntegerLinearSolutionColumn,
        HighsMixedIntegerLinearSolutionRow
      >
    | TypesafeGenericHighsSolution<
        Names,
        boolean,
        HighsInfeasibleSolutionColumn,
        HighsInfeasibleSolutionRow,
        "Infeasible"
      >;

  type TypesafeGenericHighsSolution<
    Names extends string,
    IsLinear extends boolean,
    ColType,
    RowType,
    Status extends HighsModelStatus = HighsModelStatus
  > = {
    Status: Status;
    ObjectiveValue: number;
    Columns: Record<Names, ColType>;
    Rows: RowType[];
  };

  /** Loads HiGHS */
  export default function highsLoader(
    options?: HighsLoaderOptions
  ): Promise<TypesafeHighs>;
}
