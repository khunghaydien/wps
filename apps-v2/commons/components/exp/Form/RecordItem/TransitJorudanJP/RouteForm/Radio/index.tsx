import React from 'react';

import Highlight from '@apps/commons/components/exp/Highlight';

import './index.scss';

const ROOT = 'ts-route-form__options__radio';

type Props = {
  checked: string;
  isDifferent?: boolean;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  items: Array<{ key: any; value: string }>;
  name: string;
  preChecked?: boolean;
  readOnly: boolean;
  onChange: (arg0: string) => void;
};

export default class RouteOption extends React.Component<Props> {
  isHighlight = (key: boolean): boolean => {
    const { isHighlightDiff, isDifferent, isHighlightNewRecord, preChecked } =
      this.props;

    const isHighlightRadio = isHighlightNewRecord
      ? preChecked === key
      : isDifferent && preChecked !== key;
    return !!isHighlightDiff && isHighlightRadio;
  };

  render() {
    return (
      <ul className={ROOT}>
        {this.props.items.map((item, idx) => {
          const htmlId = this.props.name + idx;
          return (
            <li className={`${ROOT}-item`} key={htmlId}>
              <label className={`${ROOT}-item-label`} htmlFor={htmlId}>
                <input
                  className={`${ROOT}-item-input`}
                  type="radio"
                  name={this.props.name}
                  id={htmlId}
                  value={item.key}
                  checked={this.props.checked === item.key}
                  onChange={() => this.props.onChange(item.key)}
                  disabled={this.props.readOnly}
                />
                <span className={`${ROOT}-item__radio-btn`} />
                <Highlight highlight={this.isHighlight(item.key)}>
                  {item.value}
                </Highlight>
              </label>
            </li>
          );
        })}
      </ul>
    );
  }
}
