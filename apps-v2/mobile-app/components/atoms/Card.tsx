import * as React from 'react';

import classNames from 'classnames';

import './Card.scss';

const ROOT = 'mobile-app-atoms-card';

type Props = Readonly<{
  className?: string;
  title?: string;
  flat?: boolean;
  children?: React.ReactNode;
}>;

export default class Card extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--flat`]: this.props.flat,
    });
    return (
      <div className={className}>
        {this.props.title ? (
          <div className={`${ROOT}__title`}>{this.props.title}</div>
        ) : null}
        {this.props.children}
      </div>
    );
  }
}
