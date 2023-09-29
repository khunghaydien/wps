import * as React from 'react';

import styled from 'styled-components';

import { IAccessControlContainer } from '@apps/commons/components/IAccessControlContainer';
import msg from '@apps/commons/languages';
import { Button, LinkButton } from '@apps/core';

import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';
import { ApproverEmployee } from '@apps/domain/models/approval/ApproverEmployee';
import {
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
} from '@attendance/domain/models/LegalAgreementRequest';

import FormRow from './FormRow';
import preventDoubleFiring from '@attendance/ui/helpers/events/preventDoubleFiring';

const S = {
  Wrapper: styled.div`
    height: 100%;
    padding: 20px 20px 0px 20px;
  `,
  Form: styled.form`
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
  `,
  Button: styled(Button)`
    padding: 0 17px;
    margin-left: 20px;
  `,
  Content: styled.div`
    width: 100%;

    .ts-horizontal-layout:not(:first-child) {
      margin-top: 15px;
    }

    .ts-textarea-field {
      max-width: 100%;
    }

    // FIXME: リード・オンリー時の表示を統一したい
    input:disabled,
    select:disabled,
    textarea:disabled {
      border-color: #d9d9d9;
      background: #eee;
    }
  `,
  ApproverEmployee: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  ApproverEmployeeName: styled.div`
    display: flex;
    align-items: center;
    max-width: 230px;
    word-wrap: break-word;
  `,
  ApproverStep: styled.div`
    display: flex;
    height: 20px;
    align-items: center;
  `,
  Operators: styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    justify-content: space-between;
    width: 100%;
    margin-top: 26px;
    padding-bottom: 20px;
  `,
  Modify: styled.div`
    flex: 1 0 auto;
    display: flex;
  `,
  Submit: styled.div`
    flex: 0 0 auto;
  `,
};

type Props = {
  isLoading: boolean;
  isEditing: boolean;
  editAction: EditAction;
  disableAction: DisableAction;
  isAvailableToModify: boolean;
  children: React.ReactNode;
  approverEmployee: ApproverEmployee | null;
  onSubmit: Function;
  onDisable: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onClickOpenApprovalHistoryDialog: () => void;
  onClickOpenApproverEmployeeSettingDialog: () => void;
  AccessControlContainer: IAccessControlContainer;
};

const FormFrame: React.FC<Props> = ({
  isEditing,
  editAction,
  disableAction,
  isLoading,
  isAvailableToModify,
  children,
  approverEmployee,
  onSubmit,
  onClickOpenApprovalHistoryDialog,
  onDisable,
  onStartEditing,
  onCancelEditing,
  onClickOpenApproverEmployeeSettingDialog,
  AccessControlContainer,
}) => {
  const disableLabel = React.useMemo(() => {
    return {
      [DISABLE_ACTION.CANCEL_REQUEST]: msg().Att_Btn_CancelRequest,
      [DISABLE_ACTION.CANCEL_APPROVAL]: msg().Att_Btn_CancelApproval,
      [DISABLE_ACTION.REMOVE]: msg().Att_Btn_RemoveRequest,
    }[disableAction];
  }, [disableAction]);

  const editLabel = React.useMemo(() => {
    return {
      [EDIT_ACTION.MODIFY]: msg().Att_Btn_ModifyRequest,
      [EDIT_ACTION.REAPPLY]: msg().Att_Btn_ChangeRequest,
    }[editAction];
  }, [editAction]);

  const submitLabel = React.useMemo(() => {
    return {
      [EDIT_ACTION.CREATE]: msg().Att_Btn_Request,
      [EDIT_ACTION.MODIFY]: msg().Att_Btn_RequestAgain,
      [EDIT_ACTION.REAPPLY]: msg().Att_Btn_Reapply,
    }[editAction];
  }, [editAction]);

  const permissionTestConditions = React.useMemo(() => {
    return {
      [DISABLE_ACTION.CANCEL_REQUEST]: {
        requireIfByEmployee: ['submitAttLegalAgreementRequestByEmployee'],
        requireIfByDelegate: ['cancelAttLegalAgreementRequestByDelegate'],
      } as DynamicTestConditions,
      [DISABLE_ACTION.CANCEL_APPROVAL]: {
        requireIfByEmployee: [
          'cancelAttLegalAgreementRequestApprovalByEmployee',
        ],
        requireIfByDelegate: [
          'cancelAttLegalAgreementRequestApprovalByDelegate',
        ],
      } as DynamicTestConditions,
      [DISABLE_ACTION.REMOVE]: {
        requireIfByEmployee: ['submitAttLegalAgreementRequestByEmployee'],
        requireIfByDelegate: ['submitAttLegalAgreementRequestByDelegate'],
      } as DynamicTestConditions,
    }[disableAction];
  }, [disableAction]);

  const $onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.form && e.currentTarget.form.reportValidity()) {
      onSubmit();
    }
  };

  return (
    <S.Wrapper>
      <S.Form onSubmit={$onSubmit} noValidate action="/#">
        <S.Content>
          {children}
          <AccessControlContainer
            requireIfByEmployee={['viewNextApproverByEmployee']}
            requireIfByDelegate={['viewNextApproverByDelegate']}
          >
            <FormRow labelText={msg().Att_Lbl_NextApproverEmployee}>
              <S.ApproverEmployee>
                <S.ApproverEmployeeName>
                  {approverEmployee?.employeeName || msg().Com_Lbl_Unspecified}
                </S.ApproverEmployeeName>
                <S.ApproverStep>
                  <LinkButton
                    onClick={onClickOpenApproverEmployeeSettingDialog}
                    size="large"
                  >
                    {msg().Att_Lbl_DisplayApprovalSteps}
                  </LinkButton>
                </S.ApproverStep>
              </S.ApproverEmployee>
            </FormRow>
          </AccessControlContainer>
        </S.Content>
        <S.Operators>
          <S.Modify>
            {editAction !== EDIT_ACTION.CREATE ? (
              <>
                <LinkButton
                  key="to-show-approval-history"
                  size="large"
                  onClick={() => onClickOpenApprovalHistoryDialog()}
                >
                  {msg().Com_Btn_ApprovalHistory}
                </LinkButton>
                {isAvailableToModify && disableLabel && (
                  <AccessControlContainer
                    conditions={permissionTestConditions}
                    key="to-disable-request"
                  >
                    <S.Button
                      color={
                        disableAction === DISABLE_ACTION.REMOVE
                          ? 'danger'
                          : 'default'
                      }
                      disabled={isEditing || isLoading}
                      onClick={preventDoubleFiring(onDisable)}
                    >
                      {disableLabel}
                    </S.Button>
                  </AccessControlContainer>
                )}
                {isAvailableToModify &&
                  editAction !== EDIT_ACTION.NONE &&
                  isEditing && (
                    <S.Button
                      key="to-cancel-editing"
                      onClick={() => onCancelEditing()}
                    >
                      {msg().Com_Btn_Cancel}
                    </S.Button>
                  )}
                {isAvailableToModify && editLabel && !isEditing && (
                  <AccessControlContainer
                    requireIfByEmployee={[
                      'submitAttLegalAgreementRequestByEmployee',
                    ]}
                    requireIfByDelegate={[
                      'submitAttLegalAgreementRequestByDelegate',
                    ]}
                    key="to-start-editing"
                  >
                    <S.Button onClick={onStartEditing}>{editLabel}</S.Button>
                  </AccessControlContainer>
                )}
              </>
            ) : null}
          </S.Modify>
          <S.Submit>
            {isEditing && submitLabel && (
              <S.Button
                type="button"
                color="primary"
                disabled={isLoading}
                onClick={
                  preventDoubleFiring(
                    $onSubmit
                  ) as unknown as React.ComponentProps<typeof Button>['onClick']
                }
              >
                {submitLabel}
              </S.Button>
            )}
          </S.Submit>
        </S.Operators>
      </S.Form>
    </S.Wrapper>
  );
};

export default FormFrame;
