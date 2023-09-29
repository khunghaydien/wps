import * as React from 'react';

import classNames from 'classnames';

import Icon from '../../../atoms/Icon';
import TextButton from '../../../atoms/TextButton';

import './NextButton.scss';

const ROOT = 'mobile-app-components-molecules-commons-buttons-next-button';

type Props = Readonly<{
  className?: string;
  testId?: string;
  text: string;
  disabled?: boolean;
  onClick?: (arg0: React.SyntheticEvent<Element>) => void;
}>;

export default class PrevButton extends React.PureComponent<Props> {
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
          {this.props.text}
          <div>
            <Icon type="chevronright" size="small" />
          </div>
        </div>
      </TextButton>
    );
  }
}
