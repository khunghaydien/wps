import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';

import {
  DelegatedApprover,
  EmployeeShowObj,
} from '../../models/DelegatedApprover';

import ApproverGrid from './ApproverGrid';

const ROOT = 'admin-pc-modal-delegate-approver';

type Props = {
  cancelDA: () => void;
  hasDelegates: boolean;
  isAllRemoved: boolean;
  isTouched: boolean;
  isExtraDA: boolean;
  approverList: EmployeeShowObj[];
  openEmployeeSearchDialog: () => void;
  delegatedApprovers: DelegatedApprover[];
  onClickSave: () => void;
  deleteRecord: () => void;
  updateValue: (target: string, e: React.FormEvent<HTMLInputElement>) => void;
  selectedIndexes: Array<string>;
  onRowsSelected: (arg0: Array<{ row: EmployeeShowObj }>) => void;
  onRowsDeselected: (arg0: Array<{ row: EmployeeShowObj }>) => void;
};

export default class DelegatedApproverDialog extends React.Component<Props> {
  render() {
    const {
      cancelDA,
      hasDelegates,
      isAllRemoved,
      approverList,
      openEmployeeSearchDialog,
      delegatedApprovers,
      onClickSave,
      deleteRecord,
      updateValue,
      selectedIndexes,
      onRowsSelected,
      onRowsDeselected,
      isTouched,
      isExtraDA,
    } = this.props;
    return (
      <DialogFrame
        title={msg().Com_Lbl_DelegateApprover}
        className={`${ROOT}__dialog-frame`}
        hide={cancelDA}
        footer={
          <DialogFrame.Footer>
            <Button onClick={cancelDA}>{msg().Com_Btn_Close}</Button>
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
              {msg().Com_Lbl_MaxDelegateApproverInfo}
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
            <ApproverGrid
              items={approverList.concat(delegatedApprovers as any)}
              updateValue={updateValue}
              selectedIndexes={selectedIndexes}
              onRowsSelected={onRowsSelected}
              onRowsDeselected={onRowsDeselected}
            />
          )}
          {isExtraDA && (
            <div className={`${ROOT}__warning`}>
              {msg().Com_Lbl_MaxDelegateApproverWarning}
            </div>
          )}
        </div>
      </DialogFrame>
    );
  }
}
