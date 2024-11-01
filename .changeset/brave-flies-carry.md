---
"lpts": minor
---

Switch from lp_solve syntax to CPLEX lp syntax

Note that the new way of extracting variables is now less precise. The syntax of
a CPLEX lp file is considerably more complicated than we were handling before.
As a result, the "parser" is less precise. There might be oversights, and we
have yet to test when TypeScript gives up.
