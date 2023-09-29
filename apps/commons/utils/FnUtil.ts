/**
 * Identity function
 */
export const identity = <T>(x: T): T => x;

type Fn<X, Y> = (arg0: X) => Y;

/**
 * Internal implementation for compose
 */
const compose_ = (...fns: Function[]): Function =>
  fns.reduceRight(
    (g: Function, f: Function) =>
      (...args) =>
        f(g(...args)),
    (x) => x
  );

/**
 * Compose functions
 * @param fns Functions
 * @return Composed function
 */
export const compose: (<X0>(arg0: void) => X0) &
  (<X0, X1>(arg0: Fn<X0, X1>, arg1: void) => Fn<X0, X1>) &
  (<X0, X1, X2>(arg0: Fn<X1, X2>, arg1: Fn<X0, X1>, arg2: void) => Fn<X0, X2>) &
  (<X0, X1, X2, X3>(
    arg0: Fn<X2, X3>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X0, X1>,
    arg3: void
  ) => Fn<X0, X3>) &
  (<X0, X1, X2, X3, X4>(
    arg0: Fn<X3, X4>,
    arg1: Fn<X2, X3>,
    arg2: Fn<X1, X2>,
    arg3: Fn<X0, X1>,
    arg4: void
  ) => Fn<X0, X4>) &
  (<X0, X1, X2, X3, X4, X5>(
    arg0: Fn<X4, X5>,
    arg1: Fn<X3, X4>,
    arg2: Fn<X2, X3>,
    arg3: Fn<X1, X2>,
    arg4: Fn<X0, X1>,
    arg5: void
  ) => Fn<X0, X5>) &
  (<X0, X1, X2, X3, X4, X5, X6>(
    arg0: Fn<X5, X6>,
    arg1: Fn<X4, X5>,
    arg2: Fn<X3, X4>,
    arg3: Fn<X2, X3>,
    arg4: Fn<X1, X2>,
    arg5: Fn<X0, X1>,
    arg6: void
  ) => Fn<X0, X6>) &
  (<X0, X1, X2, X3, X4, X5, X6, X7>(
    arg0: Fn<X6, X7>,
    arg1: Fn<X5, X6>,
    arg2: Fn<X4, X5>,
    arg3: Fn<X3, X4>,
    arg4: Fn<X2, X3>,
    arg5: Fn<X1, X2>,
    arg6: Fn<X0, X1>,
    arg7: void
  ) => Fn<X0, X7>) &
  (<X0, X1, X2, X3, X4, X5, X6, X7, X8>(
    arg0: Fn<X7, X8>,
    arg1: Fn<X6, X7>,
    arg2: Fn<X5, X6>,
    arg3: Fn<X4, X5>,
    arg4: Fn<X3, X4>,
    arg5: Fn<X2, X3>,
    arg6: Fn<X1, X2>,
    arg7: Fn<X0, X1>,
    arg8: void
  ) => Fn<X0, X8>) &
  (<X0, X1, X2, X3, X4, X5, X6, X7, X8, X9>(
    arg0: Fn<X8, X9>,
    arg1: Fn<X7, X8>,
    arg2: Fn<X6, X7>,
    arg3: Fn<X5, X6>,
    arg4: Fn<X4, X5>,
    arg5: Fn<X3, X4>,
    arg6: Fn<X2, X3>,
    arg7: Fn<X1, X2>,
    arg8: Fn<X0, X1>,
    arg9: void
  ) => Fn<X0, X9>) &
  (<T, R>(arg0: Array<Fn<T, R>>) => Fn<T, R>) = compose_ as any; // Hack

/**
 * Internal implementation for compose
 */
const pipe_ = (...fns: Function[]): Function =>
  fns.reduceRight(
    (f: Function, g: Function) =>
      (...args) =>
        f(g(...args)),
    (x) => x
  );

/**
 * Pipe
 * @param fns Functions
 * @return Composed function
 */
export const pipe: (<X0>(arg0: void) => X0) &
  (<X0, X1>(arg0: Fn<X0, X1>, arg1: void) => Fn<X0, X1>) &
  (<X0, X1, X2>(arg0: Fn<X0, X1>, arg1: Fn<X1, X2>, arg2: void) => Fn<X0, X2>) &
  (<X0, X1, X2, X3>(
    arg0: Fn<X0, X1>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X2, X3>,
    arg3: void
  ) => Fn<X0, X3>) &
  (<X0, X1, X2, X3, X4>(
    arg0: Fn<X0, X1>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X2, X3>,
    arg3: Fn<X3, X4>,
    arg4: void
  ) => Fn<X0, X4>) &
  (<X0, X1, X2, X3, X4, X5>(
    arg0: Fn<X0, X1>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X2, X3>,
    arg3: Fn<X3, X4>,
    arg4: Fn<X4, X5>,
    arg5: void
  ) => Fn<X0, X5>) &
  (<X0, X1, X2, X3, X4, X5, X6>(
    arg0: Fn<X0, X1>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X2, X3>,
    arg3: Fn<X3, X4>,
    arg4: Fn<X4, X5>,
    arg5: Fn<X5, X6>,
    arg6: void
  ) => Fn<X0, X6>) &
  (<X0, X1, X2, X3, X4, X5, X6, X7>(
    arg0: Fn<X0, X1>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X2, X3>,
    arg3: Fn<X3, X4>,
    arg4: Fn<X4, X5>,
    arg5: Fn<X5, X6>,
    arg6: Fn<X6, X7>,
    arg7: void
  ) => Fn<X0, X7>) &
  (<X0, X1, X2, X3, X4, X5, X6, X7, X8>(
    arg0: Fn<X0, X1>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X2, X3>,
    arg3: Fn<X3, X4>,
    arg4: Fn<X4, X5>,
    arg5: Fn<X5, X6>,
    arg6: Fn<X6, X7>,
    arg7: Fn<X7, X8>,
    arg8: void
  ) => Fn<X0, X8>) &
  (<X0, X1, X2, X3, X4, X5, X6, X7, X8, X9>(
    arg0: Fn<X0, X1>,
    arg1: Fn<X1, X2>,
    arg2: Fn<X2, X3>,
    arg3: Fn<X3, X4>,
    arg4: Fn<X4, X5>,
    arg5: Fn<X5, X6>,
    arg6: Fn<X6, X7>,
    arg7: Fn<X7, X8>,
    arg8: Fn<X8, X9>,
    arg9: void
  ) => Fn<X0, X9>) &
  (<T, R>(arg0: Array<Fn<T, R>>) => Fn<T, R>) = pipe_ as any; // Hack
