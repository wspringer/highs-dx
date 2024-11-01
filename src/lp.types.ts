/* prettier-ignore-file */
/* eslint-disable */

// Helper Types
type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
  ? Trim<T>
  : S extends `\n${infer T}`
  ? Trim<T>
  : S extends `${infer T}\n`
  ? Trim<T>
  : S extends `\r${infer T}`
  ? Trim<T>
  : S extends `${infer T}\r`
  ? Trim<T>
  : S extends `\t${infer T}`
  ? Trim<T>
  : S extends `${infer T}\t`
  ? Trim<T>
  : S;

// LP Keywords to exclude (all uppercase)
type LPKeywords =
  | "MAXIMIZE"
  | "MINIMIZE"
  | "SUBJECT"
  | "TO"
  | "S.T."
  | "ST"
  | "SUCH"
  | "THAT"
  | "BOUNDS"
  | "GENERAL"
  | "GENERALS"
  | "BINARY"
  | "BINARIES"
  | "END"
  | "FREE"
  | "OBJ"
  | "INF"
  | "INFINITY"
  // Comparison operators and symbols
  | "+"
  | "-"
  | "*"
  | "/"
  | "<="
  | ">="
  | "="
  | "<"
  | ">";

// Word characters (letters, digits, underscore)
type WordChar =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "_";

// Define Digit characters
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

// Type to check if a string is a non-empty number
type IsNumber<S extends string> = S extends `${Digit}${infer Rest}`
  ? Rest extends ""
    ? true
    : IsNumber<Rest>
  : false;

// Maximum recursion depth to prevent compiler errors
type MaxRecursionDepth = 100;

// Remove labels from a single line
type RemoveLabel<S extends string> = S extends `${infer _Label}:${infer Rest}`
  ? Trim<Rest>
  : S;

// Split LP model into lines
type SplitLines<S extends string, Acc extends string[] = []> = S extends ""
  ? Acc
  : S extends `${infer Line}\n${infer Rest}`
  ? SplitLines<Rest, [...Acc, Line]>
  : [...Acc, S];

// Process each line to remove labels
type RemoveLabelsFromLines<
  Lines extends string[],
  Acc extends string[] = []
> = Lines extends [infer Line, ...infer Rest]
  ? Line extends string
    ? RemoveLabelsFromLines<
        Rest extends string[] ? Rest : [],
        [...Acc, RemoveLabel<Line>]
      >
    : Acc
  : Acc;

// Concatenate lines back into a single string
type JoinLines<
  Lines extends string[],
  Separator extends string = "\n",
  Result extends string = ""
> = Lines extends [infer Line extends string, ...infer Rest extends string[]]
  ? JoinLines<Rest, Separator, `${Result}${Line}${Separator}`>
  : Result;

// Extract a word from the string
type ExtractWord<
  S extends string,
  WordAcc extends string = ""
> = S extends `${infer First}${infer Rest}`
  ? First extends WordChar
    ? ExtractWord<Rest, `${WordAcc}${First}`>
    : [WordAcc, S]
  : [WordAcc, S];

// Tokenize the string into words
type Tokenize<
  S extends string,
  Acc extends string[] = []
> = S extends `${infer First}${infer Rest}`
  ? First extends WordChar
    ? ExtractWord<S> extends [
        infer Word extends string,
        infer RestAfterWord extends string
      ]
      ? Tokenize<RestAfterWord, [...Acc, Word]>
      : Acc
    : Tokenize<Rest, Acc>
  : Acc;

// Remove LP keywords and numbers from the list of tokens
type RemoveKeywordsAndNumbers<
  Tokens extends string[],
  Acc extends string[] = []
> = Tokens extends [infer Head extends string, ...infer Tail extends string[]]
  ? Uppercase<Head> extends LPKeywords
    ? RemoveKeywordsAndNumbers<Tail, Acc>
    : IsNumber<Head> extends true
    ? RemoveKeywordsAndNumbers<Tail, Acc>
    : RemoveKeywordsAndNumbers<Tail, [...Acc, Head]>
  : Acc;

// Remove duplicate variable names
type Unique<T extends string[], Acc extends string[] = []> = T extends [
  infer Head extends string,
  ...infer Tail extends string[]
]
  ? Head extends Acc[number]
    ? Unique<Tail, Acc>
    : Unique<Tail, [...Acc, Head]>
  : Acc;

// Extract variable names from the LP model
type ExtractVariableNames<S extends string> =
  SplitLines<S> extends infer Lines extends string[]
    ? RemoveLabelsFromLines<Lines> extends infer LinesWithoutLabels extends string[]
      ? JoinLines<LinesWithoutLabels> extends infer CleanedString extends string
        ? Unique<RemoveKeywordsAndNumbers<Tokenize<CleanedString>>>
        : []
      : []
    : [];

// Extract variable names from the LP model
export type VariableNameOf<S extends string> = ExtractVariableNames<S>[number];
