import React from 'react';

import classNames from 'classnames';

import './BodyCell.scss';

const ROOT = 'commons-fixed-header-table-body-cell';

type Props = {
  children: React.ReactNode;
  className?: string;
};
/**
 * 共通コンポーネント - ヘッダー固定テーブル - ボディセル
 * 必ずFixedHeaderTableとして使うこと
 */
export default class BodyCell extends React.Component<Props> {
  static defaultProps = {
    children: null,
    className: '',
  };

  render() {
    const { className, children, ...props } = this.props;

    const cssClass = classNames(ROOT, className);

    return (
      <div className={`${cssClass}`} role="grid" {...props}>
        {children}
      </div>
    );
  }
}
