import React from 'react';
import Draggable from 'react-draggable';

import classNames from 'classnames';

import imgBtnCloseDialog from '../../../images/btnCloseDialog.png';
import Footer from './Footer';

import './index.scss';

export const Z_INDEX_DEFAULT = 5100000;

const ROOT = 'commons-dialog-frame';

type Props = {
  title: string | React.ReactNode;
  titleIcon?: string;
  children?: React.ReactNode;
  hide: () => void;
  className: string;
  // ヘッダーに副次的に表示するエレメント
  // 右に寄せて配置される
  headerSub: React.ReactElement;
  zIndex?: number;
  // Footerに表示する要素を通す、何もなかった場合はFooterそのものを描画しない
  initialFocus?: string;
  footer?: React.ReactNode;
  withoutCloseButton?: boolean;
  showFooter?: boolean;
  draggable?: boolean;
};

class DialogFrame extends React.Component<Props> {
  // eslint-disable-next-line react/sort-comp
  static Footer = Footer;
  prevFocusElement = null;
  closeButton = null;
  static get defaultProps() {
    return {
      titleIcon: '',
      className: '',
      headerSub: null,
      zIndex: Z_INDEX_DEFAULT,
      withoutCloseButton: false,
    };
  }

  constructor(props) {
    super(props);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderContents = this.renderContents.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  componentDidMount() {
    this.prevFocusElement = document.activeElement;
    this.focusInitial();
  }

  componentWillUnmount() {
    if (this.prevFocusElement) {
      this.prevFocusElement.focus();
    }
  }

  // フォーカス移動
  focusInitial() {
    // IDの指定がなければcloseボタンにフォーカスを付与
    if (this.props.initialFocus) {
      const elem = document.getElementById(this.props.initialFocus);
      if (elem) {
        elem.focus();
      }
    } else if (this.closeButton) {
      this.closeButton.focus();
    }
  }

  renderHeaderSub() {
    if (this.props.headerSub) {
      return (
        <div className={`${ROOT}__header-sub`}>{this.props.headerSub}</div>
      );
    } else {
      return null;
    }
  }

  renderHeader() {
    return (
      <div
        className={`slds-grid slds-grid--vertical-align-center ${ROOT}__header${
          this.props.draggable ? ` ${ROOT}__header__cursor` : ''
        }`}
      >
        {this.props.titleIcon ? (
          <div className={`${ROOT}__header-icon`}>
            <img
              className={`${ROOT}__icon-title`}
              src={this.props.titleIcon}
              alt=""
            />
          </div>
        ) : null}
        <div className={`slds-grow ${ROOT}__header-title`}>
          {this.props.title}
        </div>

        {this.renderHeaderSub()}
      </div>
    );
  }

  renderContents() {
    return (
      <div className={`${ROOT}__wrap`}>
        <div className={`${ROOT}__contents`}>{this.props.children}</div>
      </div>
    );
  }

  renderFooter() {
    if (!this.props.footer) {
      return null;
    }

    return <div className={`${ROOT}__footer`}>{this.props.footer}</div>;
  }

  render() {
    const cssClass = classNames(ROOT, 'slds', this.props.className, {
      [`${ROOT}--no-footer`]: !this.props.footer,
    });

    const content = (
      <div className={cssClass} role="dialog">
        {this.props.withoutCloseButton ? null : (
          <button
            key="closeButton"
            type="button"
            className={`${ROOT}__close`}
            onClick={this.props.hide}
            ref={(closeButton) => {
              this.closeButton = closeButton;
            }}
          >
            <img src={imgBtnCloseDialog} alt="close" />
          </button>
        )}
        {this.props.title && this.renderHeader()}
        {this.renderContents()}
        {this.renderFooter()}
      </div>
    );

    // TODO: TransitionGroup ＆ zIndexつける要素は、TransitionGroupの出力要素？
    return (
      <div className={`${ROOT}__wrapper`} style={{ zIndex: this.props.zIndex }}>
        <div className={`${ROOT}__overlay`} onClick={this.props.hide} />
        {this.props.draggable ? (
          <Draggable
            disabled={!this.props.draggable}
            handle={`.${ROOT}__header`}
          >
            {content}
          </Draggable>
        ) : (
          content
        )}
      </div>
    );
  }
}

DialogFrame.Footer = Footer;

export default DialogFrame;
