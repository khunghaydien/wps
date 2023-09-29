import React from 'react';

import classNames from 'classnames';

import './SelectField.scss';

type Props = {
  id: string;
  options: Array<any>;
  disabled: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | Array<string>;
  multiple?: boolean;
  size?: number;
  required?: boolean;
};

/**
 * プルダウン項目 - 共通コンポーネント
 * FIXME デモ向け仮実装
 *
 * プルダウンの選択肢は以下の構造の Array<Object> を props.options に指定する
 *
 * ```
 * [
 *   { text: '選択肢1', value: 100 },
 *   { text: '選択肢2', value: 200 },
 *   ...
 * ]
 * ```
 */
export default class SelectField extends React.Component<Props> {
  static get defaultProps() {
    return {
      id: '',
      options: [],
      disabled: false,
      value: '',
      multiple: false,
      size: 0,
      required: false,
    };
  }

  renderOptions(item, index) {
    return (
      <option
        key={index}
        value={item.value}
        disabled={item.disabled || null}
        hidden={item.placeholder}
        selected={item.placeholder}
      >
        {item.text}
      </option>
    );
  }

  render() {
    const cssClass = classNames(
      'slds-select',
      'ts-select',
      this.props.className
    );

    return (
      <select
        onChange={this.props.onChange}
        className={cssClass}
        id={this.props.id}
        disabled={
          this.props.options.length === 0 || this.props.disabled === true
        }
        value={this.props.value || ''}
        multiple={this.props.multiple}
        size={this.props.size}
        required={this.props.required}
      >
        {this.props.options.map(this.renderOptions)}
      </select>
    );
  }
}
