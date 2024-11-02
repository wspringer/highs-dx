import {
  HighsInfeasibleSolutionColumn,
  HighsInfeasibleSolutionRow,
  HighsLinearSolutionColumn,
  HighsLinearSolutionRow,
  HighsMixedIntegerLinearSolutionColumn,
  HighsMixedIntegerLinearSolutionRow,
  HighsModelStatus,
  HighsOptions,
} from "highs";
import { VariableNameOf } from "./lp.types";

export interface Highs {
  solve<S extends string>(
    problem: S,
    options?: HighsOptions
  ): HighsSolution<VariableNameOf<S>>;
}

export type HighsSolution<Names extends string> =
  | GenericHighsSolution<
      Names,
      true,
      HighsLinearSolutionColumn,
      HighsLinearSolutionRow
    >
  | GenericHighsSolution<
      Names,
      false,
      HighsMixedIntegerLinearSolutionColumn,
      HighsMixedIntegerLinearSolutionRow
    >
  | GenericHighsSolution<
      Names,
      boolean,
      HighsInfeasibleSolutionColumn,
      HighsInfeasibleSolutionRow,
      "Infeasible"
    >;

export type GenericHighsSolution<
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
