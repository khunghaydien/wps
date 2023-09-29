import React from 'react';

import './BlowingPopup.scss';

type Props = {
  showPopup: boolean;
  closeBlowingPopup: () => void;
  popupHeaderTitle: string;
  popupShowItemList: Array<string>;
  addRecord: (string) => void;
  style: any;
};

export default class BlowingPopup extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.onClickItem = this.onClickItem.bind(this);
  }

  onClickItem(type) {
    this.props.closeBlowingPopup();
    this.props.addRecord(type);
  }

  renderPopupBodyItem(formType) {
    return (
      <div className="blowing-popup__body__item">
        <div
          className="blowing-popup__pointer"
          onClick={() => this.onClickItem(formType.type)}
        >
          &nbsp;{formType.label}
        </div>
      </div>
    );
  }

  renderPopupHeader() {
    return (
      <div className="blowing-popup__header">
        <div className="blowing-popup__header__row">
          <img
            className="blowing-popup__icon-baloon"
            src={require('../../commons/images/iconPopBalloon.png')}
          />
          <div className="blowing-popup__header-title">
            &nbsp;{this.props.popupHeaderTitle}
          </div>
          <img
            onClick={this.props.closeBlowingPopup}
            className="blowing-popup__icon-close blowing-popup__pointer"
            src={require('../../commons/images/iconClose.png')}
          />
        </div>
      </div>
    );
  }

  renderPopupBody() {
    return (
      <div style={this.props.style} className="blowing-popup__body">
        <div className="blowing-popup__body__applications">
          {this.props.popupShowItemList.map((formType) => {
            return this.renderPopupBodyItem(formType);
          })}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={`blowing-popup ${
          this.props.showPopup ? '' : 'blowing-popup-none'
        }`}
      >
        <div
          className="blowing-popup__overlay"
          onClick={this.props.closeBlowingPopup}
        />
        <div className="blowing-popup__wrap">
          {this.renderPopupHeader()}
          {this.renderPopupBody()}
        </div>
      </div>
    );
  }
}
