import React from 'react';

import classNames from 'classnames';

import './BodyRow.scss';

const ROOT = 'commons-fixed-header-table-body-row';
type Props = {
  children: Array<React.ReactNode> | React.ReactNode;
  className?: string;
  onClick?: () => void;
};
/**
 * 共通コンポーネント - ヘッダー固定テーブル - ボディ行
 * 必ずFixedHeaderTableとして使うこと
 */
export default class BodyRow extends React.Component<Props> {
  static defaultProps = {
    className: '',
  };

  static role = 'BodyRow';

  render() {
    const { className, children, ...props } = this.props;

    const cssClass = classNames(ROOT, className);

    return (
      <div className={`${cssClass}`} role="columnheader" {...props}>
        {children}
      </div>
    );
  }
}
