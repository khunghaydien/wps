import * as React from 'react';

import classNames from 'classnames';

import './Chip.scss';

const ROOT = 'mobile-app-atoms-chip';

type Props = Readonly<{
  className?: string;
  text: string;
}>;

export default class Chip extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return <div className={className}>{this.props.text}</div>;
  }
}
