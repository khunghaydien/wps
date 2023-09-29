import * as React from 'react';

import classNames from 'classnames';

import ChevrondownIcon from '../../../images/icons/chevrondown.svg';
import Clear from '../../../images/icons/clear.svg';
import CloseCopy from '../../../images/icons/close-copy.svg';
import SearchIcon from '../../../images/icons/search.svg';

import './Icon.scss';

const ROOT = 'ts-exp-icon';

export type IconSetType = 'search' | 'close-copy' | 'chevrondown' | 'clear';

export type Size = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';

export type Props = {
  className?: string;
  color?: string;
  size?: Size;
  style?: Record<string, any>;
  type: IconSetType;
};

// This component is temporary replacement of mobile component in PC
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

    const additionalProps = {
      'aria-hidden': 'true',
      className,
      style,
    };
    switch (this.props.type) {
      case 'search':
        return <SearchIcon {...additionalProps} />;
      case 'close-copy':
        return <CloseCopy {...additionalProps} />;
      case 'clear':
        return <Clear {...additionalProps} />;
      case 'chevrondown':
        return <ChevrondownIcon {...additionalProps} />;

      default:
        return <></>;
    }
  }
}
