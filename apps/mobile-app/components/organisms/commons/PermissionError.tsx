import React from 'react';

import { ErrorInfo } from '../../../../commons/utils/AppPermissionUtil';

import Icon from '../../atoms/Icon';

import './PermissionError.scss';
import colors from '../../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-commons-error-page';

type Props = {
  errorInfo: ErrorInfo;
};

export default class PermissionError extends React.Component<Props> {
  render() {
    const {
      errorInfo: { message, description },
    } = this.props;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__container`}>
          <div className={`${ROOT}__icon`}>
            <Icon
              className={`${ROOT}__lock`}
              type="block"
              color={colors.blue600}
            />
          </div>
          <div className={`${ROOT}__message`}>
            <div className={`${ROOT}__message-body`}>{message}</div>
          </div>
          {description && (
            <div className={`${ROOT}__solution`}>{description}</div>
          )}
        </div>
      </div>
    );
  }
}
