# README

![Build Status](https://github.com/wspringer/highs-dx/actions/workflows/build.yml/badge.svg?branch=main)

`highs-dx` is offering a slightly improved developer experience when using
[HiGHS](https://highs.dev/) in a TypeScript environment. The one thing it adds
on top of everything offered through
[highs-js](https://github.com/lovasoa/highs-js) is typesafe access to the
variables of the solution. That means the **TypeScript compiler** will prevent
you from referring to undefined variables in your model, and your **IDE** will
give sensible completion for all the variables at your disposal.

Currently, this library is a drop-in replacement for
[highs-js](https://github.com/lovasoa/highs-js).

## Usage

```shell
npm install highs-dx
```

This project exports a default function for creating an instance of Highs. You
use it in _exactly_ the same way as
[highs-js](https://github.com/lovasoa/highs-js?tab=readme-ov-file#usage).

## FAQ

### Why is this a separate project?

It doesn't have to be, but there's no free ride. Adding typesafety to model
variable references requires quite a bit of typescript magic, which might impact
your compilation times. Also, it's not battletested yet: it might break with
larger models. So, handle with care.

### The parser doesn't seem very accurate. Why is that?

CPLEX lp is pretty forgiven, but as a consequence, the type structures required
to exactly represent the AST and balancing that with the limitations of
TypeScript resulted into models where TypeScript basically just gave up. As a
consequence, I switched to a slightly different approach where I'm not exactly
"parsing" the AST, but look for patterns. The results are fairly accurate at
this stage, but I'm not making any guarantees it will work in all situations.
