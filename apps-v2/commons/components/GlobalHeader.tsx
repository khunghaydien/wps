import React from 'react';

import classNames from 'classnames';

import PersonalMenuPopoverButtonContainer from '../containers/PersonalMenuPopoverButtonContainer';
import ProxyIndicatorContainer from '../containers/ProxyIndicatorContainer';

import './GlobalHeader.scss';

const ROOT = 'commons-global-header';

export type Props = {
  iconSrc: string;

  // png is default for backward compatibility
  iconSrcType?: 'svg' | 'png';

  iconAssistiveText: string;
  content?: React.ReactNode;
  showPersonalMenuPopoverButton: boolean;
  showProxyIndicator: boolean;
  onClickProxyExitButton: (
    arg0: React.SyntheticEvent<HTMLButtonElement>
  ) => void;
};

export default class GlobalHeader extends React.Component<Props> {
  static defaultProps = {
    content: null,
    iconSrcType: 'png',
    onClickProxyExitButton: null,
  };

  renderIcon() {
    const Icon = this.props.iconSrc;
    return (
      <div className={`${ROOT}__icon-container`}>
        {this.props.iconSrcType === 'svg' ? (
          <div className={`${ROOT}__icon`}>
            <Icon />
          </div>
        ) : (
          <img
            src={this.props.iconSrc}
            height="44"
            alt={this.props.iconAssistiveText}
            className={`${ROOT}__icon`}
          />
        )}
      </div>
    );
  }

  renderContent() {
    return (
      <div className={`${ROOT}__content slds-grow`}>{this.props.content}</div>
    );
  }

  renderButtons() {
    return (
      <div
        className={classNames({
          'slds-grid': true,
          'slds-grid--align-end': true,
          'slds-p-horizontal--medium': true,
          [`${ROOT}__buttons`]: true,
        })}
      >
        {this.props.showPersonalMenuPopoverButton ? (
          <PersonalMenuPopoverButtonContainer />
        ) : null}
      </div>
    );
  }

  renderProxyIndicator() {
    return (
      <div
        className={classNames({
          'slds-grid': true,
          'slds-grid--align-end': true,
          'slds-p-left--medium': true,
          [`${ROOT}__proxy-indicator-container`]: true,
        })}
      >
        <ProxyIndicatorContainer
          onClickExitButton={this.props.onClickProxyExitButton}
        />
      </div>
    );
  }

  render() {
    return (
      <nav
        className={classNames({
          'slds-grid': true,
          'slds-grid--vertical-align-center': true,
          [ROOT]: true,
          [`${ROOT}--show-proxy-indicator`]: this.props.showProxyIndicator,
        })}
      >
        {this.renderIcon()}
        {this.renderContent()}
        {this.renderButtons()}
        {this.props.showProxyIndicator ? this.renderProxyIndicator() : null}
      </nav>
    );
  }
}
