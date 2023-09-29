import React from 'react';

import classNames from 'classnames';

import './HeaderCell.scss';

const ROOT = 'commons-fixed-header-table-header-cell';

type Props = {
  children?: React.ReactNode;
  className?: string;
};
/**
 * 共通コンポーネント - ヘッダー固定テーブル - ヘッダーセル
 * 必ずFixedHeaderTableとして使うこと
 */
export default class HeaderCell extends React.Component<Props> {
  static defaultProps = {
    className: '',
  };

  render() {
    const { className, children, ...props } = this.props;

    const cssClass = classNames(ROOT, className);

    return (
      <div className={`${cssClass}`} role="gridcell" {...props}>
        {children}
      </div>
    );
  }
}
