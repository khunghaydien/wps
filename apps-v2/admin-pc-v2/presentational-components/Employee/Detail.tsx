import * as React from 'react';

import classNames from 'classnames';
import { cloneDeep, find } from 'lodash';

import configList from '@admin-pc-v2/constants/configList/employee';
import configListResign from '@admin-pc-v2/constants/configList/employeeResign';
import { FunctionTypeList } from '@admin-pc/constants/functionType';

import msg from '../../../commons/languages';

import { REVISION_TYPE_V2 } from '@apps/repositories/organization/employee/EmployeeDetailRepository';

import { MasterEmployeeBase } from '@apps/domain/models/organization/MasterEmployeeBase';
import { MasterEmployeeHistory } from '@apps/domain/models/organization/MasterEmployeeHistory';

import { MODE } from '@admin-pc/modules/base/detail-pane/ui';

import { Record } from '@admin-pc/utils/RecordUtil';

import DetailPane from '@admin-pc/components/MainContents/DetailPane';

type Props = {
  useExpense: boolean;
  currentHistoryId: string;
  currentRoleId: string;
  searchCompany: Array<any>;
  editRecord: Record;
  editRecordHistory: Record;
  tmpEditRecord: Record;
  tmpEditRecordHistory: Record;
  getOrganizationSetting: any;
  modeBase: string;
  modeHistory: string;
  isShowRevisionDialog: boolean;
  historyRecordList: any;
  historyListUnderRole: any;
  sfObjFieldValues: any;
  useFunction: FunctionTypeList;
  delegateApplicantSettings: any;
  delegateApproverSettings: any;
  isOverallSetting: boolean;
  startEditingCurrentHistory: () => void;
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
  onChangeRole: (string) => void;
  onClickShowRevisionDialogButton: () => void;
  onClickStartEditingHistoryButton: (arg0: {
    targetDate: string;
    comment: string;
  }) => void;
  startAddNewSubRole: () => void;
  onClickSaveNewSubRole: () => void;
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
  currentRoleId,
  editRecord,
  editRecordHistory,
  tmpEditRecord,
  tmpEditRecordHistory,
  getOrganizationSetting,
  modeBase,
  modeHistory,
  isShowRevisionDialog,
  historyRecordList,
  historyListUnderRole,
  sfObjFieldValues,
  useFunction,
  searchCompany,
  delegateApproverSettings,
  delegateApplicantSettings,
  isOverallSetting,
  startEditingCurrentHistory,
  onChangeDetailItem,
  onChangeDetailItemHistory,
  onChangeRole,
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
  startAddNewSubRole,
  onClickSaveNewSubRole,
  onClickNewApproverAssignmentButton,
  onClickNewApplicantAssignmentButton,
}: Props) => {
  let config;
  if (tmpEditRecordHistory.revisionType === REVISION_TYPE_V2.Resignation) {
    config = cloneDeep(configListResign);
  } else {
    config = cloneDeep(configList);
  }

  // render options based on mode and primary
  const isPrimary = tmpEditRecordHistory.primary;
  const configItem = config.history.find(({ key }) => key === 'revisionType');
  let options = configItem.options;
  if (modeHistory === MODE.NEW) {
    // when create new record
    options = options.filter(
      ({ value }) => value !== REVISION_TYPE_V2.Revision
    );
  } else if (!isPrimary) {
    // when add or revise sub role
    options = options.filter(({ value }) => {
      return (
        value !== REVISION_TYPE_V2.NewlyCreated &&
        value !== REVISION_TYPE_V2.Leave
      );
    });
    const resignOption = options.find(
      ({ value }) => value === REVISION_TYPE_V2.Resignation
    );
    resignOption.msgkey = 'Admin_Lbl_EndOfHistory';
  } else if (modeHistory === MODE.REVISION) {
    // when revise primary record
    options = options.filter(
      ({ value }) => value !== REVISION_TYPE_V2.NewlyCreated
    );
  }
  configItem.options = options;

  if (isOverallSetting) {
    // enable company selection for overall setting
    const historyConfig = config.history;
    const affiliationConfig = (
      find(historyConfig, { section: 'Department' }) || {}
    ).configList;
    const companyConfig = find(affiliationConfig, {
      key: 'companyId',
    });
    if (companyConfig) {
      companyConfig.enableMode = [MODE.NEW, MODE.ADD_SUB_ROLE];
    }
  }

  return (
    <div className={ROOT}>
      <DetailPane
        configList={config}
        currentHistory={currentHistoryId}
        currentRoleId={currentRoleId}
        editRecord={editRecord}
        editRecordHistory={editRecordHistory}
        getOrganizationSetting={getOrganizationSetting}
        isShowDialog={isShowRevisionDialog}
        searchCompany={searchCompany}
        modeBase={modeBase}
        modeHistory={modeHistory}
        onChangeDetailItem={onChangeDetailItem}
        onChangeDetailItemHistory={onChangeDetailItemHistory}
        onChangeRole={onChangeRole}
        onChangeHistory={onChangeHistory}
        onClickCancelButton={onClickCloseButton}
        onClickCancelEditButton={onClickCancelEditButton}
        onClickCreateHistoryButton={onClickUpdateHistoryButton}
        onClickSaveNewSubRole={onClickSaveNewSubRole}
        onClickDeleteButton={onClickDeleteButton}
        onClickDeleteHistoryButton={onClickDeleteHistoryButton}
        onClickEditDetailButton={onClickStartEditingBaseButton}
        onClickRevisionButton={onClickShowRevisionDialogButton}
        onClickRevisionStartButton={onClickStartEditingHistoryButton}
        startAddNewSubRole={startAddNewSubRole}
        onClickEditHistoryButton={startEditingCurrentHistory}
        onClickSaveButton={onClickCreateButton}
        onClickUpdateButton={onClickUpdateBaseButton}
        onClickUpdateHistoryButton={onClickUpdateHistoryButton}
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
        searchHistory={historyListUnderRole}
        allHistory={historyRecordList}
        sfObjFieldValues={sfObjFieldValues}
        tmpEditRecord={tmpEditRecord}
        tmpEditRecordHistory={tmpEditRecordHistory}
        useFunction={useFunction}
      />
    </div>
  );
};

export default Detail;
