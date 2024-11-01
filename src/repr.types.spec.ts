import { resultType } from "./repr.types";

type Assignable<T, U> = T extends U ? true : false;
type Identical<T, U> = Assignable<T, U> & Assignable<U, T>;
const verify = <T extends true>() => {
  // This function is only called for its type
  return true as T;
};

describe("repr utilities", () => {
  describe("resultType", () => {
    it("should work on a simple model", () => {
      type T = resultType<`
        max: 3x1+5x2-7x3;
        x1+2x2-3x3>=2;
        int x1,x2,x3;
      `>;
      verify<Identical<T, { x1: number; x2: number; x3: number }>>;
    });

    it("should work on a model that has no integer variables", () => {
      type T = resultType<`
        max: 3x1+5x2-7x3;
        x1+2x2-3x3>=2;
      `>;
      verify<Identical<T, { x1: number; x2: number; x3: number }>>();
    });

    it("should work on a model that uses variables with more than one character", () => {
      type T = resultType<`
        max: 3foo1+5x2-7x3;
        foo1+2x2-3x3>=2;
        int foo1,x2,x3,x4;
      `>;
      verify<
        Identical<T, { foo1: number; x2: number; x3: number; x4: number }>
      >();
    });

    it("should work on a model that has no constraints", () => {
      type T = resultType<`
        max: 3x1+5x2-7x3;
        int x1,x2,x3;
      `>;
      verify<Identical<T, { x1: number; x2: number; x3: number }>>();
    });

    it("should work on a model that has only an objective", () => {
      type T = resultType<`
        max: 3x1+5x2-7x3;
      `>;
      verify<Identical<T, { x1: number; x2: number; x3: number }>>();
    });

    it("should return an empty object for an empty string", () => {
      type T = resultType<"">;
      verify<Identical<T, {}>>();
    });

    it("should work for minimization problems", () => {
      type T = resultType<`
        min: 3x1+5x2-7x3;
        int x1,x2,x3;
      `>;
      verify<Identical<T, { x1: number; x2: number; x3: number }>>();
    });
  });
});
