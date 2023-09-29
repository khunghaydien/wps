import React from 'react';

import classNames from 'classnames';

import Icon from '../../atoms/Icon';
import AlertIcon from './AlertIcon';

import './Alert.scss';
import colors from '../../../styles/variables/_colors.scss';

export type Variant = 'attention' | 'warning';

const ROOT = 'mobile-app-molecules-commons-alert';

export type Props = {
  className?: string;
  variant: Variant;
  message: string[];
};

export default class Alert extends React.PureComponent<Props> {
  renderAlertIcon() {
    const { variant } = this.props;
    switch (variant) {
      case 'warning':
        return (
          <Icon
            className={`${ROOT}__icon`}
            type="warning"
            size="medium"
            color={colors.textreverse}
          />
        );
      case 'attention':
        return <AlertIcon className={`${ROOT}__icon`} variant="attention" />;
      default:
        return null;
    }
  }

  render() {
    const { message, variant } = this.props;
    const containersName = classNames(
      `${ROOT}__container`,
      `${ROOT}__container--${variant}`
    );
    const contentsName = classNames(`${ROOT}__contents`);
    const messagesName = classNames(
      `${ROOT}__message`,
      `${ROOT}__message--${variant}`
    );
    const alertJSX = message.map((item, index) => {
      return (
        <li className={contentsName} key={index}>
          {this.renderAlertIcon()}
          <span className={messagesName}>{item}</span>
        </li>
      );
    });
    return (
      <div className={classNames(ROOT, this.props.className)}>
        <div className={containersName}>
          <ul>{alertJSX}</ul>
        </div>
      </div>
    );
  }
}
