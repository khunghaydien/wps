import * as React from 'react';

import classNames from 'classnames';

import Header from '../../atoms/Header';
import BackButton from './Buttons/BackButton';

import './Navigation.scss';

const ROOT = 'mobile-app-molecules-commons-navigation';

export type Props = Readonly<{
  /**
   * className
   */
  className?: string;

  /**
   * page title
   */
  title: React.ReactNode;

  /**
   * a label for backward button.
   */
  backButtonLabel?: string;

  /**
   * event handler on backward button clicked.
   */
  onClickBack?: (arg0: React.SyntheticEvent<Element>) => void;

  /**
   * flag whether go back button is disabled
   */
  isBackDisabled?: boolean;

  /**
   * extra actions.
   * an element of `actions` should IconButton or TextButton.
   * otherwise, Navgigation vaiolate design guidline.
   */
  actions?: React.ReactElement<any>[];
}>;

export default class Navigation extends React.Component<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <Header className={className}>
        <div className={`${ROOT}__container`}>
          <div className={`${ROOT}__backward`}>
            {!this.props.onClickBack ? null : (
              <BackButton
                text={this.props.backButtonLabel || ''}
                onClick={this.props.onClickBack}
                disabled={this.props.isBackDisabled}
              />
            )}
          </div>
          <div className={`${ROOT}__title heading-3`}>{this.props.title}</div>
          <div className={`${ROOT}__actions`}>
            {(this.props.actions || []).map((action, idx) => (
              <div key={idx} className={`${ROOT}__actions-item`}>
                {action}
              </div>
            ))}
          </div>
        </div>
      </Header>
    );
  }
}
