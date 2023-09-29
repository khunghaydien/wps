import * as React from 'react';

import classNames from 'classnames';

import clickable, { ClickableProps } from '../../../concerns/clickable';
import displayName from '../../../concerns/displayName';

import { compose } from '../../../utils/FnUtil';

import Icon, { IconSetType, Size } from './index';

import './IconButton.scss';
import colors from '../../../styles/exp/variables/_colors.scss';

const ROOT = 'ts-exp-icon-button';

type Props = Readonly<
  ClickableProps & {
    className?: string;
    color?: string;
    disableColor?: string;
    disabled?: boolean;
    icon: IconSetType;
    size?: Size;
    testId?: string;
  }
>;

// This component is temporary replacement of mobile component in PC
class IconButtonPresentation extends React.PureComponent<Props> {
  render() {
    const { disabled, disableColor, size = 'medium' } = this.props;
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--disabled`]: disabled,
    });

    let color = colors.blue600;
    if (disabled && disableColor) {
      color = disableColor;
    } else if (disabled) {
      color = colors.blue300;
    } else if (this.props.color) {
      color = this.props.color;
    }

    return (
      <button
        data-test-id={this.props.testId}
        className={className}
        disabled={disabled}
        onClick={this.props.onClick}
        type="button"
      >
        <Icon
          className={`${ROOT}__icon`}
          type={this.props.icon}
          color={color}
          size={size}
        />
      </button>
    );
  }
}

export default compose(
  displayName('IconButton'),
  clickable
)(IconButtonPresentation) as React.ComponentType<Record<string, any>>;
