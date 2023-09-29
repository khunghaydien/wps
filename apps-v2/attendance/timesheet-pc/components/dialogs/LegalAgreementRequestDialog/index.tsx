import React from 'react';

import styled from 'styled-components';

import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import { IAccessControlContainer } from '@apps/commons/components/IAccessControlContainer';
import msg from '@apps/commons/languages';
import { Button } from '@apps/core';

import { ApproverEmployee } from '@apps/domain/models/approval/ApproverEmployee';
import { LegalAgreementRequest } from '@attendance/domain/models/LegalAgreementRequest';
import {
  CODE,
  Code,
} from '@attendance/domain/models/LegalAgreementRequestType';

import { State as Editing } from '../../../modules/ui/legalAgreementRequest/editing';

import FormFrame from './FormFrame';
import Menu from './Menu';

const S = {
  DialogFrame: styled(DialogFrame)`
    width: 800px;
    height: 80vh;
    .commons-dialog-frame__contents {
      display: flex;
    }

    .commons-dialog-frame__footer {
      padding: 13px 20px;
    }
  `,
  Button: styled(Button)`
    padding: 0 17px;
  `,
  Menu: styled.div`
    flex: 0 0 200px;
  `,
  DetailPaneWrapper: styled.div`
    flex: 1;
    background-color: #f8f8f8;
    overflow-y: auto;
  `,
  NoDetail: styled.div`
    height: 100%;
    text-align: center;

    &::before {
      display: inline-block;
      width: 0;
      height: 100%;
      background: red;
      content: '';
      vertical-align: middle;
    }

    > p {
      display: inline-block;
      width: 60%;
      color: #a8a8b1;
      font-size: 24px;
    }
  }
  `,
};

type Props = {
  pageLoading: boolean;
  globalLoading: boolean;
  currentMonth: string;
  editing: Editing;
  requestConditions: {
    isLocked: boolean;
    availableRequestTypes: Record<string, Code>;
    latestRequests: Array<LegalAgreementRequest>;
  };
  targetRequest: LegalAgreementRequest | null;
  approverEmployee: ApproverEmployee | null;
  onClickRequestDetailButton: (target: LegalAgreementRequest) => void;
  onClickRequestEntryButton: (requestType: Code) => void;
  onClose: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSubmitRequest: Function;
  onDisableRequest: () => void;
  onClickOpenApprovalHistoryDialog: () => void;
  onClickOpenApproverEmployeeSettingDialog: () => void;
  FormForMonthlyContainer: React.FC<{
    isReadOnly: boolean;
  }>;
  FormForYearlyContainer: React.FC<{
    isReadOnly: boolean;
  }>;
  AccessControlContainer: IAccessControlContainer;
};

const LegalAgreementRequestDialog: React.FC<Props> = ({
  pageLoading,
  globalLoading,
  currentMonth,
  editing,
  requestConditions,
  targetRequest,
  approverEmployee,
  onClickRequestDetailButton,
  onClickRequestEntryButton,
  onClose,
  onStartEditing,
  onCancelEditing,
  onSubmitRequest,
  onDisableRequest,
  onClickOpenApprovalHistoryDialog,
  onClickOpenApproverEmployeeSettingDialog,
  FormForMonthlyContainer,
  FormForYearlyContainer,
  AccessControlContainer,
}) => {
  const isReadOnly = requestConditions.isLocked || !editing.isEditing;
  const requestType = targetRequest?.requestType;

  return (
    <S.DialogFrame
      title={msg().Att_Lbl_Request}
      headerSub={<time>{currentMonth}</time>}
      footer={
        <S.DialogFrame.Footer>
          <S.Button type="button" color="default" onClick={() => onClose()}>
            {msg().Com_Btn_Cancel}
          </S.Button>
        </S.DialogFrame.Footer>
      }
      hide={onClose}
    >
      <S.Menu>
        <Menu
          loading={pageLoading}
          requestConditions={requestConditions}
          onClickRequestDetailButton={onClickRequestDetailButton}
          onClickRequestEntryButton={onClickRequestEntryButton}
          selectedRequestId={editing.id}
          selectedRequestTypeCode={editing.requestType}
        />
      </S.Menu>

      <S.DetailPaneWrapper>
        {targetRequest ? (
          <FormFrame
            isLoading={globalLoading}
            isEditing={editing.isEditing}
            editAction={editing.editAction}
            disableAction={editing.disableAction}
            isAvailableToModify={!requestConditions.isLocked}
            approverEmployee={approverEmployee}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onSubmit={onSubmitRequest}
            onDisable={onDisableRequest}
            onClickOpenApprovalHistoryDialog={onClickOpenApprovalHistoryDialog}
            onClickOpenApproverEmployeeSettingDialog={
              onClickOpenApproverEmployeeSettingDialog
            }
            AccessControlContainer={AccessControlContainer}
          >
            {requestType === CODE.MONTHLY && (
              <FormForMonthlyContainer isReadOnly={isReadOnly} />
            )}
            {requestType === CODE.YEARLY && (
              <FormForYearlyContainer isReadOnly={isReadOnly} />
            )}
          </FormFrame>
        ) : (
          <S.NoDetail>
            <p>{msg().Att_Msg_SelectRequestTypeFromList}</p>
          </S.NoDetail>
        )}
      </S.DetailPaneWrapper>
    </S.DialogFrame>
  );
};

export default LegalAgreementRequestDialog;
