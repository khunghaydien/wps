import * as React from 'react';

import configList from '../../constants/configList/expenseType';
import { FunctionTypeList } from '../../constants/functionType';

import { ExpenseType } from '../../../domain/models/exp/ExpenseType';

import { getHeaderTitle, Record } from '../../utils/RecordUtil';

import DetailPane from '../../components/MainContents/DetailPane';

import './Detail.scss';

type Props = Readonly<{
  editRecord: Record;
  tmpEditRecord: Record;
  getOrganizationSetting: any;
  modeBase: string;
  sfObjFieldValues: any;
  useFunction: FunctionTypeList;
  onChangeDetailItem: (
    arg0: keyof ExpenseType,
    arg1: any,
    arg2: string
  ) => void;

  onClickCloseButton: () => void;
  onClickCancelEditButton: () => void;
  onClickStartEditingBaseButton: () => void;
  onClickCreateButton: () => void;
  onClickUpdateBaseButton: () => void;
  onClickDeleteButton: () => void;
  onClickCloneButton: () => void;
}>;

const ROOT = 'admin-pc-expense-type-detail';

const Detail = ({
  editRecord,
  tmpEditRecord,
  getOrganizationSetting,
  modeBase,
  sfObjFieldValues,
  useFunction,
  onChangeDetailItem,
  onClickCloseButton,
  onClickCancelEditButton,
  onClickStartEditingBaseButton,
  onClickCreateButton,
  onClickUpdateBaseButton,
  onClickDeleteButton,
  onClickCloneButton,
}: Props) => {
  return (
    <div className={ROOT}>
      <DetailPane
        title={getHeaderTitle(editRecord.id)}
        configList={configList}
        editRecord={editRecord}
        getOrganizationSetting={getOrganizationSetting}
        modeBase={modeBase}
        onChangeDetailItem={onChangeDetailItem}
        onClickCancelButton={onClickCloseButton}
        onClickCancelEditButton={onClickCancelEditButton}
        onClickDeleteButton={onClickDeleteButton}
        onClickEditDetailButton={onClickStartEditingBaseButton}
        onClickSaveButton={onClickCreateButton}
        onClickUpdateButton={onClickUpdateBaseButton}
        onClickCloneButton={onClickCloneButton}
        onClickUpdateHistoryButton={() => null}
        sfObjFieldValues={sfObjFieldValues}
        tmpEditRecord={tmpEditRecord}
        useFunction={useFunction}
        showCloneButton
      />
    </div>
  );
};

export default Detail;
