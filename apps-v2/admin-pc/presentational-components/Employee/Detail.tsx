import * as React from 'react';

import classNames from 'classnames';

import configList from '../../constants/configList/employee';
import { FunctionTypeList } from '../../constants/functionType';

import msg from '../../../commons/languages';

import { MasterEmployeeBase } from '../../../domain/models/organization/MasterEmployeeBase';
import { MasterEmployeeHistory } from '../../../domain/models/organization/MasterEmployeeHistory';

import { MODE } from '../../modules/base/detail-pane/ui';

import { Record } from '../../utils/RecordUtil';

import DetailPane from '../../components/MainContents/DetailPane';

import './Detail.scss';

type Props = {
  useExpense: boolean;
  currentHistoryId: string;
  editRecord: Record;
  editRecordHistory: Record;
  tmpEditRecord: Record;
  tmpEditRecordHistory: Record;
  getOrganizationSetting: any;
  modeBase: string;
  modeHistory: string;
  isShowRevisionDialog: boolean;
  historyRecordList: any;
  sfObjFieldValues: any;
  useFunction: FunctionTypeList;
  delegateApplicantSettings: any;
  delegateApproverSettings: any;
  onChangeDetailItem: (
    arg0: keyof MasterEmployeeBase,
    arg1: any,
    arg2: string
  ) => void;
  onChangeDetailItemHistory: (
    arg0: keyof MasterEmployeeHistory,
    arg1: any,
    arg2: string
  ) => void;
  onClickCloseButton: () => void;
  onClickCancelEditButton: () => void;
  onClickStartEditingBaseButton: () => void;
  onClickCreateButton: () => void;
  onClickUpdateBaseButton: () => void;
  onClickUpdateHistoryButton: () => void;
  onClickDeleteButton: () => void;
  onClickDeleteHistoryButton: () => void;
  onChangeHistory: (arg0: string) => void;
  onClickShowRevisionDialogButton: () => void;
  onClickStartEditingHistoryButton: (arg0: {
    targetDate: string;
    comment: string;
  }) => void;
  onClickNewApproverAssignmentButton: () => void;
  onClickNewApplicantAssignmentButton: () => void;
};

const ROOT = 'admin-pc-employee-detail';

const DelegateArea = ({
  useExpense,
  modeBase,
  modeHistory,
  delegateApplicantSettings,
  delegateApproverSettings,
  onClickApprover,
  onClickApplicant,
}: {
  useExpense: boolean;
  modeBase: string;
  modeHistory: string;
  delegateApplicantSettings: any;
  delegateApproverSettings: any;
  onClickApprover: () => void;
  onClickApplicant: () => void;
}) => (
  <div
    className={classNames(`${ROOT}__extra-area`, {
      [`${ROOT}__extra-area-new`]: modeBase === MODE.NEW,
      [`${ROOT}__extra-area-edit`]:
        modeBase ||
        modeHistory === MODE.REVISION ||
        modeHistory === MODE.EDIT ||
        modeHistory === MODE.ADD_SUB_ROLE,
    })}
  >
    {useExpense && (
      <>
        <span
          onClick={onClickApplicant}
          className={`${ROOT}__delegate-applicant`}
        >
          <b>
            {msg().Com_Lbl_DelegatedApplicant}(
            {delegateApplicantSettings.length})
          </b>
        </span>
        <span
          onClick={onClickApprover}
          className={`${ROOT}__delegate-approver`}
        >
          <b>
            {msg().Com_Lbl_DelegateApprover}({delegateApproverSettings.length})
          </b>
        </span>
      </>
    )}
  </div>
);

const Detail = ({
  useExpense,
  currentHistoryId,
  editRecord,
  editRecordHistory,
  tmpEditRecord,
  tmpEditRecordHistory,
  getOrganizationSetting,
  modeBase,
  modeHistory,
  isShowRevisionDialog,
  historyRecordList,
  sfObjFieldValues,
  useFunction,
  delegateApproverSettings,
  delegateApplicantSettings,
  onChangeDetailItem,
  onChangeDetailItemHistory,
  onClickCloseButton,
  onClickCancelEditButton,
  onClickStartEditingBaseButton,
  onClickCreateButton,
  onClickUpdateBaseButton,
  onClickUpdateHistoryButton,
  onClickDeleteButton,
  onClickDeleteHistoryButton,
  onChangeHistory,
  onClickShowRevisionDialogButton,
  onClickStartEditingHistoryButton,
  onClickNewApproverAssignmentButton,
  onClickNewApplicantAssignmentButton,
}: Props) => {
  return (
    <div className={ROOT}>
      <DetailPane
        configList={configList}
        currentHistory={currentHistoryId}
        editRecord={editRecord}
        editRecordHistory={editRecordHistory}
        getOrganizationSetting={getOrganizationSetting}
        isShowDialog={isShowRevisionDialog}
        modeBase={modeBase}
        modeHistory={modeHistory}
        onChangeDetailItem={onChangeDetailItem}
        onChangeDetailItemHistory={onChangeDetailItemHistory}
        onChangeHistory={onChangeHistory}
        onClickCancelButton={onClickCloseButton}
        onClickCancelEditButton={onClickCancelEditButton}
        onClickCreateHistoryButton={onClickUpdateHistoryButton}
        onClickDeleteButton={onClickDeleteButton}
        onClickDeleteHistoryButton={onClickDeleteHistoryButton}
        onClickEditDetailButton={onClickStartEditingBaseButton}
        onClickRevisionButton={onClickShowRevisionDialogButton}
        onClickRevisionStartButton={onClickStartEditingHistoryButton}
        onClickSaveButton={onClickCreateButton}
        onClickUpdateButton={onClickUpdateBaseButton}
        onClickUpdateHistoryButton={() => null}
        renderDetailExtraArea={() => (
          <DelegateArea
            useExpense={useExpense}
            modeBase={modeBase}
            modeHistory={modeHistory}
            onClickApprover={onClickNewApproverAssignmentButton}
            onClickApplicant={onClickNewApplicantAssignmentButton}
            // @ts-ignore
            delegateApproverSettings={delegateApproverSettings}
            // @ts-ignore
            delegateApplicantSettings={delegateApplicantSettings}
          />
        )}
        searchHistory={historyRecordList}
        sfObjFieldValues={sfObjFieldValues}
        tmpEditRecord={tmpEditRecord}
        tmpEditRecordHistory={tmpEditRecordHistory}
        useFunction={useFunction}
      />
    </div>
  );
};

export default Detail;
