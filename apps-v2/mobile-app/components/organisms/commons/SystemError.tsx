import * as React from 'react';

import { get } from 'lodash';

import msg from '../../../../commons/languages';
import { ErrorInfo } from '../../../../commons/utils/AppPermissionUtil';
import UrlUtil from '@apps/commons/utils/UrlUtil';
import Dialog from '@mobile/components/molecules/commons/Dialog';

import Button from '@mobile/components/atoms/Button';

import Icon from '../../atoms/Icon';
import PermissionError from './PermissionError';

import './SystemError.scss';
import colors from '../../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-commons-system-error';

const isSessionExpired = (message: string): boolean =>
  message.includes('Error parsing json response:') &&
  message.includes('Unexpected token') &&
  message.includes('Logged in?');

const customMessage = (message: string): string => {
  if (isSessionExpired(message)) {
    return msg().Com_Msg_SessionExpired;
  }
  return message;
};

export type Props = Readonly<{
  message: string;
  solution?: string;
  continue: boolean;
  showError: boolean;

  /*
  this is false positive.
  This value is used through lodash.get
  */
  hasPermissionError?: ErrorInfo | null; // eslint-disable-line react/no-unused-prop-types
  resetError: () => void;
}>;

export default class SystemError extends React.PureComponent<Props> {
  render() {
    if (!this.props.showError) {
      return null;
    }

    if (this.props.continue) {
      return (
        <div className={`${ROOT}__recoverable-error`}>
          <Dialog
            content={
              <div className={`${ROOT}__recoverable-error__content`}>
                {this.props.message}
              </div>
            }
            centerButtonLabel={msg().Com_Btn_Ok}
            onClickCenterButton={this.props.resetError}
            onClickCloseButton={this.props.resetError}
          />
        </div>
      );
    } else {
      return (
        <div className={ROOT}>
          {get(this.props, 'hasPermissionError.message') !== undefined ? (
            <PermissionError
              errorInfo={get(this.props, 'hasPermissionError')}
            />
          ) : (
            <div className={`${ROOT}__container`}>
              <div className={`${ROOT}__icon`}>
                <Icon
                  className={`${ROOT}__error-icon`}
                  type="error"
                  color={colors.alert}
                />
              </div>
              <div className={`${ROOT}__message`}>
                <div className={`${ROOT}__message-body`}>
                  {customMessage(this.props.message)}
                </div>
              </div>
              {UrlUtil.isOpened('timestamp-mobile') && (
                <div className={`${ROOT}__reload`}>
                  <Button
                    type="button"
                    priority="primary"
                    onClick={() => {
                      UrlUtil.navigateTo(
                        'timestamp-mobile',
                        {
                          timestamp: `${new Date().valueOf()}`,
                        },
                        true
                      );
                    }}
                  >
                    {msg().Com_Btn_Reload}
                  </Button>
                </div>
              )}
              {this.props.solution && (
                <div className={`${ROOT}__solution`}>{this.props.solution}</div>
              )}
            </div>
          )}
        </div>
      );
    }
  }
}
