import React from 'react';

// styles
import './Overlap.scss';

const ROOT = 'ts-overlap';

type Props = {
  isVisible: boolean;
  className?: string;
  size?: number;
  children: React.ReactNode;
};

export default class Overlap extends React.Component<Props> {
  render() {
    const { isVisible, className } = this.props;

    let overlap = '';
    let size = null;

    if (isVisible) {
      overlap = `${ROOT}--visible`;
      size = `${this.props.size}%` || '0';
    }

    const styles = {
      left: size,
    };

    return (
      <div className={`${ROOT} ${overlap} ${className}`} style={styles}>
        {this.props.children}
      </div>
    );
  }
}
