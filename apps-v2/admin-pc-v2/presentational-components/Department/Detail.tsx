import * as React from 'react';

import configList from '@admin-pc-v2/constants/configList/department';
import { FunctionTypeList } from '@admin-pc/constants/functionType';

import { MasterDepartmentBase } from '@apps/domain/models/organization/MasterDepartmentBase';
import { MasterDepartmentHistory } from '@apps/domain/models/organization/MasterDepartmentHistory';

import { Record } from '@admin-pc/utils/RecordUtil';

import DetailPane from '@admin-pc/components/MainContents/DetailPane';

import './Detail.scss';

type Props = {
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
  onChangeDetailItem: (
    arg0: keyof MasterDepartmentBase,
    arg1: any,
    arg2: string
  ) => void;
  onChangeDetailItemHistory: (
    arg0: keyof MasterDepartmentHistory,
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
  startEditingCurrentHistory: () => void;
};

const ROOT = 'admin-pc-department-detail';

const Detail = ({
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
  startEditingCurrentHistory,
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
        onClickEditHistoryButton={startEditingCurrentHistory}
        onClickSaveButton={onClickCreateButton}
        onClickUpdateButton={onClickUpdateBaseButton}
        onClickUpdateHistoryButton={onClickUpdateHistoryButton}
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
