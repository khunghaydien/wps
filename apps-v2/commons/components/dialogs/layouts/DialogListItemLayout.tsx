import React from 'react';

import classNames from 'classnames';

import './DialogListLayout.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default class DialogListItemLayout extends React.Component<Props> {
  render() {
    const clsnm = classNames(
      this.props.className,
      'ts-dialog-list-layout__item'
    );

    return <li className={clsnm}>{this.props.children}</li>;
  }
}
