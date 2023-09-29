import React from 'react';

import classNames from 'classnames';

import Body from './Body';
import Label from './Label';

import './index.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
};
/**
 * Horizontal Layout
 * フォーム画面で用いられるラベル+項目、横並びのレイアウトを提供する
 */
class HorizontalLayout extends React.Component<Props> {
  static Label = Label;
  static Body = Body;

  render() {
    const layoutClass = classNames(
      'ts-horizontal-layout',
      'slds-grid',
      this.props.className
    );

    return <div className={layoutClass}>{this.props.children}</div>;
  }
}

export default HorizontalLayout;
