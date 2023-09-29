import React from 'react';

import msg from '../../languages';
import Button from '../buttons/Button';
import DialogFrame from './DialogFrame';

import './ApproverEmployeeSettingDialog.scss';

const ROOT = 'commons-dialogs-approver-user-setting-dialog';

type Props = {
  isHide: boolean;
  isReadOnly: boolean;
  isEdited: boolean;
  approverEmployeeName: string;
  handleCancel: () => void;
  handleSave?: () => void;
  handleChangeEmployee?: () => void;
};

export default function ApproverEmployeeSettingDialog(props: Props) {
  const {
    isHide,
    isReadOnly,
    isEdited,
    approverEmployeeName,
    handleCancel,
    handleSave,
    handleChangeEmployee,
  } = props;

  if (isHide) {
    return null;
  }

  return (
    <DialogFrame
      title={msg().Att_Lbl_ApprovalSteps}
      className={ROOT}
      footer={
        <DialogFrame.Footer>
          <Button
            id={`${ROOT}__cancel-button`}
            type="default"
            onClick={handleCancel}
          >
            {isReadOnly ? msg().Com_Btn_Close : msg().Com_Btn_Cancel}
          </Button>
          {!isReadOnly && (
            <Button
              id={`${ROOT}__save-button`}
              type="primary"
              disabled={!isEdited}
              onClick={handleSave}
            >
              {msg().Com_Btn_Save}
            </Button>
          )}
        </DialogFrame.Footer>
      }
      hide={handleCancel}
      initialFocus={`${ROOT}__cancel-button`}
    >
      <div className={`${ROOT}__body`}>
        <div className={`${ROOT}__step`}>
          <div className={`${ROOT}__title`}>{`${msg().Appr_Lbl_Step} 1`}</div>
          <div className={`${ROOT}__content`}>
            <div className={`${ROOT}__user`}>
              <div>{approverEmployeeName || msg().Com_Lbl_Unspecified}</div>
              <div>
                {!isReadOnly && (
                  <Button type="primary" onClick={handleChangeEmployee}>
                    {msg().Com_Btn_Change}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogFrame>
  );
}
