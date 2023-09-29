import * as React from 'react';

import classNames from 'classnames';

import './Wrapper.scss';

const ROOT = 'mobile-app-atoms-wrapper';

export type Props = Readonly<{
  className?: string;
  children: React.ReactNode;
}>;

export default class Wrapper extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return <div className={className}>{this.props.children}</div>;
  }
}
