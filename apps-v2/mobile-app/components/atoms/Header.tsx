import * as React from 'react';

import classNames from 'classnames';

import './Header.scss';

const ROOT = 'mobile-app-atoms-header';

type Props = {
  className?: string;
  children: React.ReactNode;
  level?: 1 | 2;
};

export default class Header extends React.PureComponent<Props> {
  render() {
    const level = this.props.level || 1;
    return (
      <div
        className={classNames(ROOT, this.props.className, {
          [`${ROOT}--level-1`]: level === 1,
          [`${ROOT}--level-2`]: level === 2,
        })}
      >
        {this.props.children}
      </div>
    );
  }
}
