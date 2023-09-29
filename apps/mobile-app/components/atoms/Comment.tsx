import * as React from 'react';

import classNames from 'classnames';

import './Comment.scss';

const ROOT = 'mobile-app-atoms-comment';

export type Props = Readonly<{
  position?: 'left' | 'right';
  value?: string | number;
  className?: string;
}>;

export default class Comment extends React.PureComponent<Props> {
  render() {
    const position = this.props.position || 'left';
    const className = classNames(
      ROOT,
      this.props.className,
      `${ROOT}--${position}`
    );

    return <div className={className}>{this.props.value}</div>;
  }
}
