import * as React from 'react';

import classNames from 'classnames';

import IconSet, { IconSetType } from './IconSet';

import './Icon.scss';

const ROOT = 'mobile-app-atoms-icon';

export type Props = {
  type: IconSetType;
  color?: string;
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
  className?: string;
  style?: {
    [key: string]: any;
  };
};

export default class Icon extends React.PureComponent<Props> {
  render() {
    const className = classNames(
      ROOT,
      this.props.size || 'medium',
      this.props.className || ''
    );
    const style = {
      ...this.props.style,
      fill: this.props.color || 'currentColor',
    };
    const IconComponent = IconSet[this.props.type];
    if (!IconComponent) {
      return null;
    }
    return (
      <IconComponent aria-hidden="true" className={className} style={style} />
    );
  }
}
