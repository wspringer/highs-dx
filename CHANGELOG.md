# highs-dx

## 0.2.0

### Minor Changes

- 4e1694a: Added a test illustrating typesafe integration with highs-js
- e74af00: Switch from lp_solve syntax to CPLEX lp syntax

  Note that the new way of extracting variables is now less precise. The syntax of
  a CPLEX lp file is considerably more complicated than we were handling before.
  As a result, the "parser" is less precise. There might be oversights, and we
  have yet to test when TypeScript gives up.

- 4e1694a: Fixes an issue that caused the `VariableNameOf` type to be exported under the wrong name.
- 8f204e7: Rename the project from highs-ts to highs-dx
- 4e1694a: Adds a declaration file for the modified high-js types.

### Patch Changes

- 4e1694a: Prevents the tests from getting exported
