import React from 'react';

import './Footer.scss';

const ROOT = 'commons-dialog-frame-footer';

type Props = {
  sub: React.ReactNode;
  children: React.ReactNode;
};

/**
 * 右から順にエレメントが並んでいくシンプルなフッターレイアウトを提供する
 * デザインによってばらつきが激しいためレイアウトを分離した
 */
export default class Footer extends React.Component<Props> {
  static defaultProps = {
    sub: null,
  };

  render() {
    return (
      <div className={`slds-grid ${ROOT}`}>
        <div className={`slds-grow ${ROOT}__sub`}>
          {this.props.sub ? this.props.sub : null}
        </div>

        <div className={`${ROOT}__inner`}>{this.props.children}</div>
      </div>
    );
  }
}
