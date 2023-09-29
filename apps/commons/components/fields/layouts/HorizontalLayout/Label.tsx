import React from 'react';

import classNames from 'classnames';

import Tooltip from '../../../Tooltip';

const ROOT = 'ts-horizontal-layout__label';

type Props = {
  children: React.ReactNode;
  className?: string;
  cols: number | string;
  helpMsg: string;
  required: boolean;
};
/**
 * Label Layout
 * HorizontalLayoutを必ず親とする
 */
export default class Label extends React.Component<Props> {
  static get defaultProps() {
    return {
      cols: 3,
      helpMsg: '',
      required: false,
    };
  }

  renderRequired() {
    if (this.props.required) {
      return (
        <span className={`${ROOT}-symbol ${ROOT}-symbol--required`}>*</span>
      );
    } else {
      return null;
    }
  }

  renderHelp() {
    if (this.props.helpMsg) {
      return (
        <Tooltip
          align="top right"
          content={this.props.helpMsg}
          className={`${ROOT}-icon_help`}
        >
          <div aria-label={this.props.helpMsg}>&nbsp;</div>
        </Tooltip>
      );
    } else {
      return null;
    }
  }

  render() {
    const labelClass = classNames(
      `slds-size--${this.props.cols}-of-12`,
      ROOT,
      { [`${ROOT}--has-help-msg`]: this.props.helpMsg },
      this.props.className
    );

    return (
      <div className={labelClass}>
        <div className={`${ROOT}-inner`}>
          {this.renderRequired()}
          {this.props.children}
          {this.renderHelp()}
        </div>
      </div>
    );
  }
}
