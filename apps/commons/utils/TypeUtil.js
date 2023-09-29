// @flow

type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;

// TODO:REMOVE THIS FILE AFTER FULL TS MIGRATION

/**
 * reducerのステート型を定義します。
 *
 * @example
 * const reducers = {
 *   common,
 *   reducer1,
 *   reducer2,
 * };
 * export type State = type $State<typeof recuder>;
 */
export type $State<TReducer> = $ObjMap<TReducer, $ExtractFunctionReturn>;

/**
 * Extract a type that the function returns
 *
 * @example
 * const mapStateToProps = (state: State) => ({
 *   ...
 * });
 *
 * const mergeProps = (stateProps: $ExtractReturn<typeof mapStateToProps>, dispatchProps, mergeProps) => ({
 *   ...
 * });
 */
export type $ExtractReturn<Fn> = $Exact<
  $Call<<T>((...Iterable<any>) => T) => T, Fn>
>;
