import React from 'react';

import TextUtil from '../utils/TextUtil';

import msg from '../languages';

import './ProxyIndicator.scss';

const ROOT = 'commons-proxy-indicator';

const generateMessageInnerHTML = (employeeName) =>
  TextUtil.template(
    msg().Com_Msg_OperatingAs,
    `<div><strong>${employeeName}</strong></div>`
  );

export type Props = {
  standalone: boolean;
  employeePhotoUrl: string;
  employeeName: string;
  onClickExitButton: (arg0: React.SyntheticEvent<HTMLButtonElement>) => void;
};

type State = {
  messageInnerHTML: string;
};

export default class ProxyIndicator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      messageInnerHTML: generateMessageInnerHTML(props.employeeName),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.setState({
      messageInnerHTML: generateMessageInnerHTML(nextProps.employeeName),
    });
  }

  renderEmployeeIcon() {
    return (
      <div className={`${ROOT}__employee-icon-container`}>
        <div className={`${ROOT}__employee-icon-bg`}>
          <img
            role="presentation"
            src={this.props.employeePhotoUrl}
            width="41"
            height="41"
            className={`${ROOT}__employee-icon`}
          />
        </div>
      </div>
    );
  }

  renderMessage() {
    /* eslint-disable react/no-danger */
    return (
      <div
        className={`slds-grow slds-p-horizontal--small ${ROOT}__message`}
        dangerouslySetInnerHTML={{
          __html: this.state.messageInnerHTML,
        }}
      />
    );
    /* eslint-enable react/no-danger */
  }

  renderExitButton() {
    return this.props.standalone ? (
      <button
        className={`slds-button slds-button--neutral ${ROOT}__exit-button`}
        onClick={() =>
          /* window.close is only allowed to be called for windows that
           * were opened by a script using the window.open() method.
           *
           * See also https://developer.mozilla.org/en-US/docs/Web/API/Window/close.
           */
          window.close()
        }
      >
        {msg().Com_Btn_Close}
      </button>
    ) : (
      <button
        className={`slds-button slds-button--neutral ${ROOT}__exit-button`}
        onClick={this.props.onClickExitButton}
      >
        {msg().Com_Btn_Exit}
      </button>
    );
  }

  renderButtons() {
    return (
      <div className={`slds-p-right--small ${ROOT}__buttons`}>
        {this.renderExitButton()}
      </div>
    );
  }

  render() {
    return (
      <div
        className={`slds-grid slds-grid--vertical-align-center slds-theme--warning ${ROOT}`}
      >
        {this.renderEmployeeIcon()}
        {this.renderMessage()}
        {this.renderButtons()}
      </div>
    );
  }
}
