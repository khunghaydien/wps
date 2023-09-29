import React from 'react';

import classNames from 'classnames';

import './HeaderRow.scss';

const ROOT = 'commons-fixed-header-table-header-row';

type Props = {
  children: Array<React.ReactNode> | React.ReactNode;
  className?: string;
};
/**
 * 共通コンポーネント - ヘッダー固定テーブル - ヘッダー行
 * 必ずFixedHeaderTableとして使うこと
 */
export default class HeaderRow extends React.Component<Props> {
  static defaultProps = {
    className: '',
    children: '',
  };

  static role = 'HeaderRow';

  render() {
    const { className, children, ...props } = this.props;

    const cssClass = classNames(ROOT, className);

    return (
      <div className={`${cssClass}`} role="row" {...props}>
        {children}
      </div>
    );
  }
}
