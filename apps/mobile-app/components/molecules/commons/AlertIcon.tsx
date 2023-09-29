import React from 'react';

import classNames from 'classnames';
import { $PropertyType } from 'utility-types';

import Icon, { Props as IconProps } from '../../atoms/Icon';

import './AlertIcon.scss';
import colors from '../../../styles/variables/_colors.scss';

export type Variant = 'attention' | 'warning';

const ROOT = 'mobile-app-molecules-commons-alert-icon';

export type Props = {
  variant: Variant;
  size?: $PropertyType<IconProps, 'size'>;
  className?: string;
};

export default class AlertIcon extends React.PureComponent<Props> {
  getColor() {
    const { variant } = this.props;
    switch (variant) {
      case 'attention':
        return colors.attention;
      case 'warning':
        return colors.alert;
      default:
        return undefined;
    }
  }

  render() {
    const { className } = this.props;
    const size = this.props.size || 'medium';
    return (
      <div className={classNames(ROOT, className, size)}>
        <div className={classNames(`${ROOT}__container`)}>
          <Icon
            type="warning-reverse"
            size={size}
            className={`${ROOT}__icon`}
            color={this.getColor()}
          />
        </div>
      </div>
    );
  }
}
