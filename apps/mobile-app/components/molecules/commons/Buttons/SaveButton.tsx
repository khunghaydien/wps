import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../../commons/languages';

import Button from '../../../atoms/Button';

import './PrevButton.scss';

const ROOT = 'mobile-app-components-molecules-commons-buttons-save-button';

type Props = Readonly<{
  className?: string;
  testId?: string;
  disabled?: boolean;
  onClick?: (arg0: React.SyntheticEvent<Element>) => void;
}>;

export default class PrevButton extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <Button
        className={className}
        priority="primary"
        variant="neutral"
        testId={this.props.testId}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        {msg().Com_Btn_Save}
      </Button>
    );
  }
}
