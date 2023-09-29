import * as React from 'react';

import configList from '../../constants/configList/jobType';
import { FunctionTypeList } from '../../constants/functionType';

import { JobType } from '../../models/job-type/JobType';

import { getHeaderTitle, Record } from '../../utils/RecordUtil';

import DetailPane from '../../components/MainContents/DetailPane';

import WorkCategoryArea, {
  Props as WorkCategoryProps,
} from './WorkCategoryArea';

import './Detail.scss';

type Props = Readonly<
  WorkCategoryProps & {
    editRecord: Record;
    tmpEditRecord: Record;
    getOrganizationSetting: any;
    modeBase: string;
    sfObjFieldValues: any;
    useFunction: FunctionTypeList;
    onChangeDetailItem: (arg0: keyof JobType, arg1: any, arg2: string) => void;
    onClickCloseButton: () => void;
    onClickCancelEditButton: () => void;
    onClickStartEditingBaseButton: () => void;
    onClickCreateButton: () => void;
    onClickUpdateBaseButton: () => void;
    onClickDeleteButton: () => void;
  }
>;

const ROOT = 'admin-pc-job-type-detail';

const Detail = ({
  editRecord,
  tmpEditRecord,
  workCategories,
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
  maxNum,
  onClickSearchWorkCategories,
  linkWorkCategories,
  unlinkWorkCategories,
}: Props) => {
  const extraArea = tmpEditRecord.id ? (
    <WorkCategoryArea
      // @ts-ignore
      workCategories={workCategories}
      onClickSearchWorkCategories={onClickSearchWorkCategories}
      linkWorkCategories={linkWorkCategories}
      unlinkWorkCategories={unlinkWorkCategories}
      maxNum={maxNum}
    />
  ) : null;

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
        onClickUpdateHistoryButton={() => null}
        sfObjFieldValues={sfObjFieldValues}
        tmpEditRecord={tmpEditRecord}
        useFunction={useFunction}
        renderDetailExtraArea={() => extraArea}
      />
    </div>
  );
};

export default Detail;
