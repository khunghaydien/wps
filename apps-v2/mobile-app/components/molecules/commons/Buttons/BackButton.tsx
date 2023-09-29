import * as React from 'react';

import classNames from 'classnames';

import Icon from '../../../atoms/Icon';
import TextButton from '../../../atoms/TextButton';

import './BackButton.scss';

const ROOT = 'mobile-app-components-molecules-commons-buttons-back-button';

type Props = Readonly<{
  className?: string;
  testId?: string;
  text: string;
  disabled?: boolean;
  onClick?: (arg0: React.SyntheticEvent<Element>) => void;
}>;

export default class BackButton extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <TextButton
        className={className}
        testId={this.props.testId}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        <div className={`${ROOT}__text`}>
          <div>
            <Icon type="back-copy" size="small" />
          </div>
          {this.props.text}
        </div>
      </TextButton>
    );
  }
}
