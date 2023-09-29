import * as validDateThrough from './validDateThrough';

type FromRemote<TEntity> = (arg0: Record<string, any>) => TEntity;
type ToRemote<TEntity> = (arg0: TEntity) => Record<string, any>;

export const defaultConverter = {
  fromRemote: [validDateThrough.fromRemote],

  toRemote: [validDateThrough.toRemote],
};

const unsafeCompose = (fs: Array<Function>) => {
  return fs.reduceRight(
    (f, g) => (args) => f(g(args)),
    (x) => x
  );
};

/**
 * Convert remote object to entity, and vice versa.
 *
 * Remote object means response of Web API.
 * Those functions provide data convertion between remote and local.
 *
 * Default converters are defined as `defaultConverter`.
 * Pass array of converters tothe second argument of `fromRemote/toRemote`
 * to obtain entity from remote object, otherwise `defaultConverter` will be used
 * as default.
 */
export default {
  /**
   * Convert remote object to entity.
   *
   * @param data Remote object
   * @param converters functions to convert remote object
   */
  fromRemote: <TEntity>(
    data: Record<string, any>,
    converters: FromRemote<any>[] = defaultConverter.fromRemote
  ): TEntity => {
    return unsafeCompose(converters)(data as any);
  },

  /**
   * Convert entity to remote object.
   *
   * @param entity Entity
   * @param converters functions to convert entity to remote object
   */
  toRemote: <TEntity>(
    entity: TEntity,
    converters: ToRemote<any>[] = defaultConverter.toRemote
  ): Record<string, any> => {
    return unsafeCompose(converters)(entity as any);
  },
};
