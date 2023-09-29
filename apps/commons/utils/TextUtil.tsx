import React from 'react';

const PATTERN_PLACE_HOLDER = /\[%(\d+)\]/g; // [%1]形式

class TextUtil {
  static nl2br(str: string): React.ReactNode {
    if (!str) {
      return '';
    }

    const splitted = str.split('\n');
    const { length } = splitted;

    return str.split('\n').map((line, key) => {
      if (key < length - 1) {
        return (
          <span key={key}>
            {line}
            <br />
          </span>
        );
      }
      return <span key={key}>{line}</span>;
    });
  }

  /**
   * 任意の文字列について、プレースホルダに任意の変数を適用して返却する
   * @param {String} str
   * @param {...String} variables
   * @return {String}
   */
  static template(str?: string, ...variables: (number | string)[]) {
    if (str === undefined) {
      throw new TypeError('TextUtil.template: 変換元となる文字列がありません');
    }

    return String(str).replace(
      PATTERN_PLACE_HOLDER,
      (matched: string, strIndex: string): string => {
        const index = Number(strIndex);

        if (!(index - 1 in variables)) {
          // @ts-ignore
          const args = Array.from(arguments); // eslint-disable-line prefer-rest-params
          throw new TypeError(
            `TextUtil.template: 適用する変数の指定に不足があります: args=${JSON.stringify(
              args
            )}`
          );
        }

        return String(variables[index - 1]);
      }
    );
  }

  /**
   * 任意の文字列を要素ごとに分解する
   * @param {String} str
   * @return {Array}
   */
  static parseText(
    str: string
  ): Array<{ tag: boolean; value: number } | { value: string }> {
    if (!PATTERN_PLACE_HOLDER.test(str)) {
      return [{ value: str }];
    }

    const tokens = [];

    let matched;
    let lastIndex = 0;
    PATTERN_PLACE_HOLDER.lastIndex = 0;
    // eslint-disable-next-line no-cond-assign
    while ((matched = PATTERN_PLACE_HOLDER.exec(str))) {
      if (matched === null) {
        break;
      }
      const value = matched[0];
      const { index } = matched;
      if (index > lastIndex) {
        tokens.push({
          value: str.slice(lastIndex, index),
        });
      }
      tokens.push({
        tag: true,
        value: parseInt(matched[1]),
      });
      lastIndex = index + value.length;
    }
    if (lastIndex < str.length) {
      tokens.push({
        value: str.slice(lastIndex),
      });
    }

    return tokens;
  }

  /**
   * Highlights the keyword inside the text
   * @param {string} [text=''] actual string
   * @param {string} [keyword=''] highlighted string
   * @param {string} [classNames] optional classNames
   * @returns {HTMLSpanElement}
   */
  static getMarkedLabel(text = '', keyword = '', classNames?: string) {
    const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
    return (
      (idx > -1 && (
        <span className={classNames}>
          {text.substring(0, idx)}
          <mark>{text.substring(idx, idx + keyword.length)}</mark>
          {text.substring(idx + keyword.length)}
        </span>
      )) || <span className={classNames}>{text}</span>
    );
  }
}

export default TextUtil;
