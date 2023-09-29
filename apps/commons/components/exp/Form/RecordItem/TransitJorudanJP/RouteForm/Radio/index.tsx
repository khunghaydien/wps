import React from 'react';

import './index.scss';

const ROOT = 'ts-route-form__options__radio';

type Props = {
  checked: string;
  items: Array<{ key: any; value: string }>;
  name: string;
  readOnly: boolean;
  onChange: (arg0: string) => void;
};

export default class RouteOption extends React.Component<Props> {
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
                {item.value}
              </label>
            </li>
          );
        })}
      </ul>
    );
  }
}
