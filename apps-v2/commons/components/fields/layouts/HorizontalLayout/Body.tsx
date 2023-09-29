import React from 'react';

import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  className?: string;
  cols: number | string;
};

/**
 * Children Layout
 * HorizontalLayoutを必ず親とする
 */
export default class Body extends React.Component<Props> {
  static get defaultProps() {
    return {
      cols: 9,
      children: null,
    };
  }

  render() {
    const childrenClass = classNames(
      `slds-size--${this.props.cols}-of-12`,
      'ts-horizontal-layout__body',
      this.props.className
    );

    return <div className={childrenClass}>{this.props.children}</div>;
  }
}
