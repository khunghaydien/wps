import React from 'react';

import Radio from '../Radio';

import './index.scss';

type Props = {
  checked: string;
  items: Array<{ key: string; value: string }>;
  name: string;
  readOnly: boolean;
  title: string;
  onChange: (arg0: string) => void;
};

const ROOT = 'ts-route-form__options';

export default class RouteOption extends React.Component<Props> {
  render() {
    if (this.props.readOnly) {
      return null;
    }

    return (
      <div className={ROOT}>
        <div className={`${ROOT}-key`}>{this.props.title}</div>
        {/* <div className={`${ROOT}-separater`}>:</div> */}
        <div className={`${ROOT}-value`}>
          <Radio
            name={this.props.name}
            items={this.props.items}
            checked={this.props.checked}
            onChange={this.props.onChange}
            readOnly={this.props.readOnly}
          />
        </div>
      </div>
    );
  }
}
