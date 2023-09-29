import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import msg from '../../../../commons/languages';

import { DelegatedApplicant } from '../../../models/DelegatedApplicant';
import {
  DelegatedApprover,
  EmployeeShowObj,
} from '../../../models/DelegatedApprover';

import AssignmentGrid from '../../../components/DelegateAssignment/AssignmentGrid';

type DelegatedAssignments = Array<DelegatedApprover | DelegatedApplicant>;

const ROOT = 'admin-pc-modal-delegate-assignment';

type Props = {
  target: string;
  cancelDA: () => void;
  hasDelegates: boolean;
  isAllRemoved: boolean;
  isTouched: boolean;
  isExtraDA: boolean;
  approverList: EmployeeShowObj[];
  openEmployeeSearchDialog: () => void;
  delegateAssignments: DelegatedAssignments;
  onClickSave: () => void;
  deleteRecord: () => void;
  updateValue: (target: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedIndexes: Array<string>;
  onRowsSelected: (arg0: Array<{ row: EmployeeShowObj }>) => void;
  onRowsDeselected: (arg0: Array<{ row: EmployeeShowObj }>) => void;
};

export default class DelegatedApproverDialog extends React.Component<Props> {
  getLabel = (key: string) => {
    const { target } = this.props;
    const isApproval = target === 'Approver';
    switch (key) {
      case 'title':
        return isApproval
          ? msg().Com_Lbl_DelegateApprover
          : msg().Com_Lbl_DelegatedApplicant;
      case 'expense':
        return isApproval
          ? msg().Com_Lbl_ExpenseApproval
          : msg().Com_Lbl_ExpenseApplication;
      case 'request':
        return isApproval
          ? msg().Com_Lbl_RequestApproval
          : msg().Com_Lbl_RequestApplication;
      case 'maxLimitInfo':
        return isApproval
          ? msg().Com_Lbl_MaxDelegateApproverInfo
          : msg().Com_Lbl_MaxDelegateApplicantInfo;
      default:
        return '';
    }
  };

  render() {
    const {
      target,
      cancelDA,
      hasDelegates,
      isAllRemoved,
      approverList,
      openEmployeeSearchDialog,
      delegateAssignments,
      onClickSave,
      deleteRecord,
      updateValue,
      selectedIndexes,
      onRowsSelected,
      onRowsDeselected,
      isTouched,
      isExtraDA,
    } = this.props;
    const isApproval = target === 'Approver';
    const warningMsg = isApproval
      ? msg().Com_Lbl_MaxDelegateApproverWarning
      : msg().Com_Lbl_MaxDelegateApplicantsWarning;
    return (
      <DialogFrame
        title={this.getLabel('title')}
        className={`${ROOT}__dialog-frame`}
        hide={cancelDA}
        footer={
          <DialogFrame.Footer>
            <Button onClick={cancelDA}>{msg().Com_Btn_Cancel}</Button>
            <Button
              type="primary"
              onClick={onClickSave}
              disabled={
                isExtraDA || !isTouched || !(hasDelegates || isAllRemoved)
              }
            >
              {msg().Com_Btn_Save}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <div className={`${ROOT}__search-area`}>
            <Button
              className={`${ROOT}__select-button`}
              type="default"
              onClick={openEmployeeSearchDialog}
            >
              {msg().Admin_Lbl_SelectEmployee}
            </Button>
            <div className={`${ROOT}__info`}>
              {this.getLabel('maxLimitInfo')}
            </div>
            {hasDelegates && (
              <Button
                className={`${ROOT}__delete`}
                type="destructive"
                onClick={deleteRecord}
                disabled={selectedIndexes.length === 0}
              >
                {msg().Com_Lbl_RemoveDelegate}
              </Button>
            )}
          </div>
          {(hasDelegates || isAllRemoved) && (
            <AssignmentGrid
              target={target}
              // @ts-ignore
              items={approverList.concat(delegateAssignments)}
              updateValue={updateValue}
              selectedIndexes={selectedIndexes}
              onRowsSelected={onRowsSelected}
              onRowsDeselected={onRowsDeselected}
              getLabel={this.getLabel}
            />
          )}
          {isExtraDA && <div className={`${ROOT}__warning`}>{warningMsg}</div>}
        </div>
      </DialogFrame>
    );
  }
}
