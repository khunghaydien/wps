import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';

import { AuthStatus } from '../../../models/planner-setting/PlannerSetting';

import './AuthStatusField.scss';

const ROOT = 'admin-pc-planner-setting-detail-pane__auth-status-field';

type Props = {
  authStatus: AuthStatus | null;
  isEditing: boolean;
  onClickAuthButton: () => void;
  onClickRemoteSiteSettingButton: () => void;
};

export default class AuthStatusField extends React.Component<Props> {
  getAuthStatusMessage() {
    switch (this.props.authStatus) {
      case 'AUTHORIZED':
        return msg().Admin_Lbl_CalendarAccessAuthStatusAuthorized;
      case 'UNAUTHORIZED':
        return msg().Admin_Lbl_CalendarAccessAuthStatusUnauthorized;
      case 'REMOTE_SITE_SETTINGS_INACTIVE':
        return msg().Admin_Lbl_CalendarAccessAuthStatusRemoteSiteInactive;
      case 'API_CONNECTION_FAILED':
        return msg().Admin_Lbl_CalendarAccessAuthStatusApiConnectionFailed;
      default:
        return this.props.isEditing
          ? msg().Admin_Lbl_CalendarAccessAuthStatusUnsaved
          : '';
    }
  }

  renderAuthStatusField() {
    return (
      <span className={`${ROOT}__status-text`}>
        {this.getAuthStatusMessage()}
      </span>
    );
  }

  renderAuthButton() {
    const authButtonLabel =
      this.props.authStatus === 'UNAUTHORIZED'
        ? msg().Admin_Lbl_CalendarAccessAuthButton
        : msg().Admin_Lbl_CalendarAccessAuthButtonReauthorize;

    return (
      <Button
        className={`${ROOT}__button`}
        onClick={this.props.onClickAuthButton}
        disabled={this.props.isEditing}
      >
        {authButtonLabel}
      </Button>
    );
  }

  renderRemoteSiteSettingButton() {
    return (
      <Button
        className={`${ROOT}__button`}
        onClick={this.props.onClickRemoteSiteSettingButton}
        disabled={this.props.isEditing}
      >
        {msg().Admin_Lbl_CalendarAccessAuthOpenRemoteSiteSetting}
      </Button>
    );
  }

  renderButton() {
    if (this.props.authStatus === null) {
      return null;
    }

    if (this.props.authStatus === 'REMOTE_SITE_SETTINGS_INACTIVE') {
      return this.renderRemoteSiteSettingButton();
    }

    return this.renderAuthButton();
  }

  render() {
    return (
      <div className={ROOT}>
        {this.renderAuthStatusField()}
        {this.renderButton()}
      </div>
    );
  }
}
