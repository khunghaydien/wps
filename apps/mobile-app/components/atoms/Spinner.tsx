import * as React from 'react';

import './Spinner.scss';

const ROOT = 'mobile-app-atoms-spinner';

type Props = {
  color?: string;
  size?: 'large' | 'medium' | 'small' | 'x-small' | 'xx-small';
  assistiveText?: string;
};

export default class Spinner extends React.PureComponent<Props> {
  render() {
    const style = {
      background: this.props.color || '#b0adab',
    };
    const spinnerSize = this.props.size || 'large';
    return (
      <div className={`${ROOT} slds-spinner_container`}>
        <div
          role="status"
          className={`slds-spinner slds-spinner--${spinnerSize}`}
          style={style}
        >
          <span className="slds-assistive-text">
            {this.props.assistiveText || 'Loading...'}
          </span>
          <div className="slds-spinner__dot-a" style={style} />
          <div className="slds-spinner__dot-b" style={style} />
        </div>
      </div>
    );
  }
}
