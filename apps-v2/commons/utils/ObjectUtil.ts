import _ from 'lodash';

export default class ObjectUtil {
  /**
   * object 内の path にある値を取り出す
   * 取り出した値が null または undefined なら defaultValue を返す
   */
  static getOrDefault(object: unknown, path: string, defaultValue: any) {
    const gettingValue = _.get(object, path, defaultValue);
    return _.isNil(gettingValue) ? defaultValue : gettingValue;
  }

  /**
   * object 内の path にある値を取り出す
   * 取り出した値が null または undefined なら空文字を返す
   */
  static getOrEmpty(object: unknown, path: string) {
    return this.getOrDefault(object, path, '');
  }

  /**
   * 指定されたkeyにvalueをセットしたオブジェクトを返す
   */
  static updateFiledValue(
    object: Record<string, unknown>,
    key: string,
    value: any
  ) {
    const cloneObj = _.cloneDeep(object);
    cloneObj[key] = value;
    return cloneObj;
  }
}
