import * as React from 'react';

import classNames from 'classnames';

import Icon, { Props as IconProps } from '../../../atoms/Icon';

import CSS from './CircleShapeIcon.scss';

const ROOT = 'mobile-app-molecules-commons-icons-circle-shape-icon';

type Props = Readonly<
  IconProps & {
    className?: string;
    backgroundColor?: string;
  }
>;

export default class CircleShapeIcon extends React.PureComponent<Props> {
  render() {
    const size = this.props.size || 'medium';
    const className = classNames(ROOT, size, this.props.className);

    return (
      <span className={className}>
        <span
          className={`${ROOT}__container`}
          style={{
            backgroundColor: this.props.backgroundColor || CSS.brand,
          }}
        >
          <Icon
            type={this.props.type}
            color={this.props.color || CSS.textReverse}
            size={size}
            className={this.props.className}
            style={this.props.style}
          />
        </span>
      </span>
    );
  }
}
