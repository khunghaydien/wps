import React from 'react';

import classNames from 'classnames';
import isNil from 'lodash/isNil';

import './Tab.scss';

// 表示する最大の通知数
const MAX_DISP_NOTIFICATION_COUNT = 99;

/**
 * タブ - 共通コンポーネント
 */
export type Props = {
  label: string;
  selected: boolean;
  onSelect: (arg0: React.KeyboardEvent<any>) => void;
  icon?: string;
  iconWidth?: string;
  notificationCount?: number;
  'data-testid'?: string;
};

export default class Tab extends React.Component<Props> {
  constructor(props: any) {
    super(props);

    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  // FIXME 第2引数にe.targetを渡すとブラウザが固まるため未実装
  onKeyPress(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      this.props.onSelect(e);
    }
  }

  // keypressと引数を揃えるため、イベントハンドラを挟む
  // FIXME 第2引数にe.targetを渡すとブラウザが固まるため未実装
  onClick(e: React.KeyboardEvent<any>) {
    this.props.onSelect(e);
  }

  /** MAX_DISP_NOTIFICATION_COUNT以上の数字が来た場合省略する */
  omitNotificationCount(num: number) {
    if (num > MAX_DISP_NOTIFICATION_COUNT) {
      return `${MAX_DISP_NOTIFICATION_COUNT}+`;
    } else {
      // 戻り値の型を統一
      return `${num}`;
    }
  }

  /** 通知の表示 */
  renderNotification() {
    if (
      !isNil(this.props.notificationCount) &&
      this.props.notificationCount > 0
    ) {
      return (
        <span className="tab__notification">
          {this.omitNotificationCount(this.props.notificationCount)}
        </span>
      );
    } else {
      return null;
    }
  }

  renderIcon() {
    if (this.props.icon) {
      return (
        <img
          className="tab__icon"
          src={this.props.icon}
          width={this.props.iconWidth}
          alt=""
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const cssClass = classNames('tab', { 'tab--active': this.props.selected });

    return (
      <div className={cssClass} data-testid={this.props['data-testid']}>
        <a
          className="tab__anchor"
          role="button"
          // @ts-ignore
          onClick={this.onClick}
          onKeyPress={this.onKeyPress}
          tabIndex={0}
        >
          <span className="tab__char-wrapper">
            {this.renderIcon()}
            {this.props.label}
          </span>
          {this.renderNotification()}
        </a>
      </div>
    );
  }
}
