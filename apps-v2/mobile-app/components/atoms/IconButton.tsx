import * as React from 'react';

import classNames from 'classnames';

import clickable, { ClickableProps } from '../../../commons/concerns/clickable';
import displayName from '../../../commons/concerns/displayName';

import { compose } from '../../../commons/utils/FnUtil';

import Icon from './Icon';
// NOTE 通常はatoms -> atomsへの依存はよくないのだけど、Iconに限り例外的にそうしている
import { IconSetType } from './Icon/IconSet';

import './IconButton.scss';
import colors from '../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-atoms-icon-button';

type Props = Readonly<
  ClickableProps & {
    className?: string;
    icon: IconSetType;
    disabled?: boolean;
    testId?: string;
    color?: string | null | undefined;
    disableColor?: string | null | undefined;
    size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
  }
>;

class IconButtonPresentation extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--disabled`]: this.props.disabled,
    });

    let color = colors.blue600;
    if (this.props.disabled && this.props.disableColor) {
      color = this.props.disableColor;
    } else if (this.props.disabled) {
      color = colors.blue300;
    } else if (this.props.color) {
      color = this.props.color;
    }

    return (
      <button
        data-test-id={this.props.testId}
        className={className}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        type="button"
      >
        <Icon
          className={`${ROOT}__icon`}
          type={this.props.icon}
          color={color}
          size={this.props.size || 'medium'}
        />
      </button>
    );
  }
}

export default compose(
  displayName('IconButton'),
  clickable
)(IconButtonPresentation) as React.ComponentType<{
  [key: string]: any;
}>;
