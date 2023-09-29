import React from 'react';

import classNames from 'classnames';

import DialogListItemLayout from './DialogListItemLayout';

import './DialogListLayout.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
};

class DialogListLayout extends React.Component<Props> {
  static Item = DialogListItemLayout;
  render() {
    const clsnm = classNames(this.props.className, 'ts-dialog-list-layout');

    return <ul className={clsnm}>{this.props.children}</ul>;
  }
}

DialogListLayout.Item = DialogListItemLayout;

export default DialogListLayout;
