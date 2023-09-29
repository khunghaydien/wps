import * as React from 'react';

import classNames from 'classnames';

/**
 * ボタングループス - 共通コンポーネント
 * このコンポーネントでボタンをラップするとまとまった一つのボタンのように
 * スタイリングされる
 */
type Props = {
  children: React.ReactNode;
  className?: string;
};

export default class ButtonGroups extends React.Component<Props> {
  render() {
    const className = classNames('ts-button-group', this.props.className);
    return (
      <div className={className} role="group">
        {this.props.children}
      </div>
    );
  }
}
