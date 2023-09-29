import * as React from 'react';

import classNames from 'classnames';

import Icon, { Props as IconProps } from '../../../atoms/Icon';

import CSS from './CircleOutlineShapeIcon.scss';

const ROOT = 'mobile-app-molecules-commons-icons-circle-outline-shape-icon';

type Props = Readonly<
  IconProps & {
    className?: string;
    borderColor?: string;
  }
>;

export default class CircleOutlineShapeIcon extends React.PureComponent<Props> {
  render() {
    const size = this.props.size || 'medium';
    const className = classNames(ROOT, size, this.props.className);
    return (
      <span className={className}>
        <span
          className={classNames(`${ROOT}__container`, size)}
          style={{
            borderColor:
              this.props.borderColor || this.props.color || CSS.brand,
          }}
        >
          <Icon
            type={this.props.type}
            color={this.props.color || CSS.brand}
            size={size}
            className={this.props.className}
            style={this.props.style}
          />
        </span>
      </span>
    );
  }
}
