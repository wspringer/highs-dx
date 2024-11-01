// Helper Types
// prettier-ignore
type Trim<S extends string> = S extends ` ${infer T}` ? Trim<T> :
  S extends `${infer T} ` ? Trim<T> :
  S extends `\n${infer T}` ? Trim<T> :
  S extends `${infer T}\n` ? Trim<T> :
  S extends `\r${infer T}` ? Trim<T> :
  S extends `${infer T}\r` ? Trim<T> :
  S;

// prettier-ignore
type Alphabetic = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' |
  'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' |
  'u' | 'v' | 'w' | 'x' | 'y' | 'z' |
  'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' |
  'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' |
  'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | '_';

// prettier-ignore
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

// Extract Variable from a Term
type ExtractVariableFromTerm<S extends string> =
  S extends `${infer Sign extends "+" | "-"}${infer Rest}`
    ? ExtractVariableCoefficient<Rest>
    : ExtractVariableCoefficient<S>;

type ExtractVariableCoefficient<S extends string> =
  S extends `${Digit}${infer Rest}`
    ? ExtractVariableCoefficient<Rest>
    : ExtractVariableName<S>;

// Extract Variable Name
type ExtractVariableName<
  S extends string,
  Acc extends string = ""
> = S extends `${infer First}${infer Rest}`
  ? First extends Alphabetic | Digit
    ? ExtractVariableName<Rest, `${Acc}${First}`>
    : Acc extends ""
    ? never
    : Acc
  : Acc extends ""
  ? never
  : Acc;

// Split Expression into Terms
type SplitExpression<S extends string> = SplitByOperators<Trim<S>>;

type SplitByOperators<
  S extends string,
  Acc extends string[] = []
> = S extends ""
  ? Acc
  : S extends `${infer Sign extends "+" | "-"}${infer Rest}`
  ? SplitByOperatorsHelper<Rest, `${Sign}`, Acc>
  : SplitByOperatorsHelper<S, "", Acc>;

type SplitByOperatorsHelper<
  S extends string,
  CurrentTerm extends string,
  Acc extends string[]
> = S extends `${infer Char}${infer Rest}`
  ? Char extends "+" | "-"
    ? SplitByOperatorsHelper<Rest, `${Char}`, [...Acc, CurrentTerm]>
    : SplitByOperatorsHelper<Rest, `${CurrentTerm}${Char}`, Acc>
  : [...Acc, CurrentTerm];

// Extract Variables from Expression
type ExtractVariablesFromExpression<S extends string> =
  SplitExpression<S> extends infer Terms
    ? Terms extends string[]
      ? ExtractVariablesFromTerms<Terms>
      : []
    : [];

type ExtractVariablesFromTerms<
  Terms extends string[],
  Vars extends string[] = []
> = Terms extends [infer Term, ...infer Rest extends string[]]
  ? Term extends string
    ? ExtractVariableFromTerm<Term> extends infer Var
      ? Var extends string
        ? ExtractVariablesFromTerms<Rest, [...Vars, Var]>
        : ExtractVariablesFromTerms<Rest, Vars>
      : ExtractVariablesFromTerms<Rest, Vars>
    : Vars
  : Vars;

// Combine Variables from Left and Right Expressions
type CombineVariables<A extends string[], B extends string[]> = [...A, ...B];

// Extract Variables from Expression in Constraint
type ExtractVariablesFromExpressionInConstraint<S extends string> =
  Trim<S> extends `${infer Left}${infer Comparator extends
    | "<="
    | ">="
    | "="}${infer Right}`
    ? CombineVariables<
        ExtractVariablesFromExpression<Left>,
        ExtractVariablesFromExpression<Right>
      >
    : ExtractVariablesFromExpression<S>;

// Extract Variables from Declarations
type ExtractVariablesFromDeclarations<
  S extends string,
  Vars extends string[] = []
> = Trim<S> extends ""
  ? Vars
  : Trim<S> extends `${infer Var},${infer Rest}`
  ? ExtractVariableName<Trim<Var>> extends infer VarName
    ? VarName extends string
      ? ExtractVariablesFromDeclarations<Rest, [...Vars, VarName]>
      : ExtractVariablesFromDeclarations<Rest, Vars>
    : ExtractVariablesFromDeclarations<Rest, Vars>
  : ExtractVariableName<Trim<S>> extends infer VarName
  ? VarName extends string
    ? [...Vars, VarName]
    : Vars
  : Vars;

// Extract Variables from Constraints and Declarations
type ExtractVariablesFromConstraints<
  S extends string,
  Vars extends string[] = []
> = Trim<S> extends ""
  ? Vars
  : Trim<S> extends `${infer Line};${infer Rest}`
  ? Trim<Line> extends `${"int" | "bin"} ${infer VarDecl}`
    ? ExtractVariablesFromDeclarations<VarDecl> extends infer VarsInDecl
      ? VarsInDecl extends string[]
        ? ExtractVariablesFromConstraints<Rest, [...Vars, ...VarsInDecl]>
        : ExtractVariablesFromConstraints<Rest, Vars>
      : ExtractVariablesFromConstraints<Rest, Vars>
    : ExtractVariablesFromExpressionInConstraint<
        Trim<Line>
      > extends infer VarsInLine
    ? VarsInLine extends string[]
      ? ExtractVariablesFromConstraints<Rest, [...Vars, ...VarsInLine]>
      : ExtractVariablesFromConstraints<Rest, Vars>
    : ExtractVariablesFromConstraints<Rest, Vars>
  : Trim<S> extends `${"int" | "bin"} ${infer VarDecl}`
  ? ExtractVariablesFromDeclarations<VarDecl> extends infer VarsInDecl
    ? VarsInDecl extends string[]
      ? [...Vars, ...VarsInDecl]
      : Vars
    : Vars
  : ExtractVariablesFromExpressionInConstraint<Trim<S>> extends infer VarsInLine
  ? VarsInLine extends string[]
    ? [...Vars, ...VarsInLine]
    : Vars
  : Vars;

// Unique Variables
type Unique<T extends any[], R extends any[] = []> = T extends [
  infer H,
  ...infer Rest
]
  ? H extends R[number]
    ? Unique<Rest, R>
    : Unique<Rest, [...R, H]>
  : R;

// Variables Object
type VariablesObject<Vars extends string[]> = {
  [K in Vars[number]]: number;
};

/**
 * Extracts a type capable of holding the results from the LP model passed.
 */
export type resultType<S extends string> =
  ExtractVariables<S> extends infer Vars
    ? Vars extends string[]
      ? VariablesObject<Unique<Vars>>
      : never
    : never;

type ExtractVariables<S extends string> =
  Trim<S> extends `${infer Objective};${infer Rest}`
    ? ExtractVariablesFromObjective<
        Trim<Objective>
      > extends infer VarsInObjective
      ? VarsInObjective extends string[]
        ? ExtractVariablesFromConstraints<Rest, VarsInObjective>
        : ExtractVariablesFromConstraints<Rest>
      : ExtractVariablesFromConstraints<Rest>
    : ExtractVariablesFromConstraints<S>;

type ExtractVariablesFromObjective<S extends string> =
  Trim<S> extends `${infer _Direction}:${infer Expr}`
    ? ExtractVariablesFromExpression<Expr>
    : [];
