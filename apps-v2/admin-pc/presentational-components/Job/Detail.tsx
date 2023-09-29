import * as React from 'react';

import configList from '../../constants/configList/job';
import { FunctionTypeList } from '../../constants/functionType';

import { Job } from '../../../domain/models/organization/Job';
import { JobHistory } from '../../../domain/models/organization/JobHistory';

import { getHeaderTitle, Record } from '../../utils/RecordUtil';

import ChangePeriodDialog from '../../containers/JobContainer/JobAssignment/ChangePeriodDialogContainer';
import JobAssignmentDialog from '../../containers/JobContainer/JobAssignment/JobAssignmentDialogContainer';
import JobAssignmentTargetEmployeesSearchDialog from '../../containers/JobContainer/JobAssignment/TargetEmployeesSearchDialogContainer';

import DetailPane from '../../components/MainContents/DetailPane';

import JobAssignment, { JobAssignmentAsListItem } from './JobAssignment';

import './Detail.scss';

type Props = {
  currentHistoryId: string;
  editRecord: Record;
  editRecordHistory: JobHistory;
  tmpEditRecord: Record;
  tmpEditRecordHistory: JobHistory;
  historyRecordList: JobHistory[];
  getOrganizationSetting: any;
  modeBase: string;
  modeHistory: string;
  sfObjFieldValues: any;
  useFunction: FunctionTypeList;
  onChangeDetailItem: (arg0: keyof Job, arg1: any, arg2: string) => void;
  onChangeDetailItemHistory: (
    arg0: keyof JobHistory,
    arg1: any,
    arg2: string
  ) => void;
  onChangeHistory: (value: string) => void;

  onClickCloseButton: () => void;
  onClickCancelEditButton: () => void;
  onClickStartEditingBaseButton: () => void;
  onClickCreateButton: () => void;
  onClickUpdateBaseButton: () => void;
  onClickDeleteButton: () => void;
  onClickDeleteHistoryButton: () => void;
  onClickNewAssignmentButton: () => void;
  onClickUpdateHistoryButton: () => void;

  // Job Assignment
  canExecModifyAssignment: boolean;
  canOperateAssignment: boolean;
  jobAssignmentList: JobAssignmentAsListItem[];
  showAssignmentArea: boolean;
  onAssignmentListRowsSelected: (arg0: string[]) => void;
  onAssignmentListRowsDeselected: (arg0: string[]) => void;
  openChangeValidPeriod: () => void;
  deleteAssignment: () => void;
  onAssignmentListRowClick: (arg0: string) => void;
  onAssignmentListFilterChange: () => void;
  onClickShowRevisionDialogButton: () => void;
  onClickStartEditingHistoryButton: (arg0: {
    targetDate: string;
    comment: string;
  }) => void;
  isShowRevisionDialog: boolean;

  // Job Asignment Dialog
  isOpeningNewAssignment: boolean;
  isOpeningEmployeeSelection: boolean;
  isOpeningChangePeriod: boolean;
};

const ROOT = 'admin-pc-job-detail';

const renderDialog = ({
  isOpeningEmployeeSelection,
  isOpeningNewAssignment,
  isOpeningChangePeriod,
}) => {
  if (isOpeningEmployeeSelection) {
    return <JobAssignmentTargetEmployeesSearchDialog />;
  } else if (isOpeningNewAssignment) {
    return <JobAssignmentDialog />;
  } else if (isOpeningChangePeriod) {
    return <ChangePeriodDialog />;
  } else {
    return null;
  }
};

const Detail = ({
  currentHistoryId,
  editRecord,
  editRecordHistory,
  tmpEditRecord,
  tmpEditRecordHistory,
  getOrganizationSetting,
  modeBase,
  modeHistory,
  historyRecordList,
  sfObjFieldValues,
  useFunction,
  onChangeDetailItem,
  onChangeDetailItemHistory,
  onChangeHistory,
  onClickCloseButton,
  onClickCancelEditButton,
  onClickStartEditingBaseButton,
  onClickCreateButton,
  onClickUpdateBaseButton,
  onClickUpdateHistoryButton,
  onClickDeleteButton,
  onClickDeleteHistoryButton,
  canExecModifyAssignment,
  canOperateAssignment,
  jobAssignmentList,
  showAssignmentArea,
  openChangeValidPeriod,
  deleteAssignment,
  onAssignmentListRowsSelected,
  onAssignmentListRowsDeselected,
  onAssignmentListRowClick,
  onAssignmentListFilterChange,
  onClickNewAssignmentButton,
  onClickShowRevisionDialogButton,
  onClickStartEditingHistoryButton,
  isOpeningEmployeeSelection,
  isOpeningNewAssignment,
  isOpeningChangePeriod,
  isShowRevisionDialog,
}: Props) => {
  return (
    <div className={ROOT}>
      <DetailPane
        title={getHeaderTitle(editRecord.id)}
        configList={configList}
        currentHistory={currentHistoryId}
        editRecord={editRecord}
        editRecordHistory={editRecordHistory}
        getOrganizationSetting={getOrganizationSetting}
        modeBase={modeBase}
        modeHistory={modeHistory}
        onChangeDetailItem={onChangeDetailItem}
        onChangeDetailItemHistory={onChangeDetailItemHistory}
        onChangeHistory={onChangeHistory}
        onClickCancelButton={onClickCloseButton}
        onClickCancelEditButton={onClickCancelEditButton}
        onClickDeleteButton={onClickDeleteButton}
        onClickDeleteHistoryButton={onClickDeleteHistoryButton}
        onClickEditDetailButton={onClickStartEditingBaseButton}
        onClickSaveButton={onClickCreateButton}
        onClickCreateHistoryButton={onClickUpdateHistoryButton}
        onClickUpdateButton={onClickUpdateBaseButton}
        onClickUpdateHistoryButton={() => null}
        onClickRevisionButton={onClickShowRevisionDialogButton}
        onClickRevisionStartButton={onClickStartEditingHistoryButton}
        sfObjFieldValues={sfObjFieldValues}
        tmpEditRecord={tmpEditRecord}
        tmpEditRecordHistory={tmpEditRecordHistory}
        useFunction={useFunction}
        searchHistory={historyRecordList}
        isShowDialog={isShowRevisionDialog}
        renderDetailExtraArea={() =>
          showAssignmentArea ? (
            <JobAssignment
              jobAssignmentList={jobAssignmentList}
              canOperateAssignment={canOperateAssignment}
              canExecModifyAssignment={canExecModifyAssignment}
              openNewAssignment={onClickNewAssignmentButton}
              openChangeValidPeriod={openChangeValidPeriod}
              deleteAssignment={deleteAssignment}
              onAssignmentListRowsSelected={onAssignmentListRowsSelected}
              onAssignmentListRowsDeselected={onAssignmentListRowsDeselected}
              onAssignmentListRowClick={onAssignmentListRowClick}
              onAssignmentListFilterChange={onAssignmentListFilterChange}
            />
          ) : null
        }
      />
      {renderDialog({
        isOpeningEmployeeSelection,
        isOpeningNewAssignment,
        isOpeningChangePeriod,
      })}
    </div>
  );
};

export default Detail;
