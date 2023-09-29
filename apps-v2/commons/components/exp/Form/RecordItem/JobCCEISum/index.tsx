import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { Option } from '@commons/components/exp/Form/QuickSearch';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import { EISearchObj } from '@apps/domain/models/exp/ExtendedItem';
import { Record, RecordItem } from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';

import { RecordErrors, Touched } from '..';
import RecordCostCenter from '../CostCenter';
import ExtendedItems from '../ExtendedItem';
import RecordJob from '../Job';
import Summary from '../Summary';

export type ContainerProps = {
  customHint: CustomHint;
  errors: RecordErrors;
  expPreRequest?: Report;
  expRecord: Record;
  expReport: Report;
  isFinanceApproval: boolean;
  isHighlightDiff: boolean;
  isHighlightNewRecord: boolean;
  isShowParentItemSummary?: boolean;
  preRecordItem: RecordItem;
  readOnly: boolean;
  recordIdx: number;
  recordItemIdx: number;
  targetRecord: string;
  touched: Touched;
  onChangeEditingExpReport: (
    key: string,
    value: boolean | number | string | RecordItem,
    touched?: Touched | boolean,
    shouldValidate?: boolean
  ) => void;
};

type Props = ContainerProps & {
  isLoading: boolean;
  loadingAreas: string[];
  getRecentCostCenters: (recordDate?: string) => Promise<Option[]>;
  getRecentJobs: (recordDate?: string) => Promise<Option[]>;
  onClickCostCenterBtn: (recordDate: string) => void;
  onClickJobBtn: (recordDate: string) => void;
  onClickLookupEISearch: (item: EISearchObj) => void;
  searchCostCenters: (keyword: string) => Promise<Option[]>;
  searchJobs: (keyword: string) => Promise<Option[]>;
  updateReport: (
    key: string,
    value: string,
    isRecalc?: boolean,
    isTouched?: boolean
  ) => void;
};

const JobCCEISum = ({
  customHint,
  errors,
  expPreRequest,
  expRecord,
  expReport,
  isFinanceApproval,
  isHighlightDiff,
  isHighlightNewRecord,
  isLoading,
  isShowParentItemSummary,
  loadingAreas,
  preRecordItem,
  readOnly,
  recordIdx,
  recordItemIdx = 0,
  touched,
  updateReport,
  getRecentCostCenters,
  getRecentJobs,
  onClickCostCenterBtn,
  onClickJobBtn,
  onClickLookupEISearch,
  searchCostCenters,
  searchJobs,
}: Props) => {
  const recordItem = get(expRecord, `items.${recordItemIdx}`, {});

  const isHighlightCCJob = (key: string) => {
    const recordPath = `records.${recordIdx}`;
    const reportValue = get(expReport, `${key}`);
    const parentItemValue = get(expReport, `${recordPath}.items.0.${key}`);

    const preReportValue = get(expPreRequest, key);
    const expPreRequestRecordId = get(
      expReport,
      `${recordPath}.expPreRequestRecordId`
    );
    const preRecordList = get(expPreRequest, 'records', []);
    const preRecord = preRecordList.find(
      (record: Record) => record.recordId === expPreRequestRecordId
    );
    const preParentItemValue = get(preRecord, `items.0.${key}`);

    const preValue = preRecordItem[key]
      ? preRecordItem[key]
      : preParentItemValue || preReportValue;
    const value = recordItem[key]
      ? recordItem[key]
      : parentItemValue || reportValue;

    return isHighlightNewRecord || (isHighlightDiff && preValue !== value);
  };

  const itemPath = `items.${recordItemIdx}`;
  const isParentItem = recordItemIdx === 0;
  const isShowJob = expReport.jobId;
  const isShowCostCenter = expReport.costCenterHistoryId;
  const isShowSummary = isShowParentItemSummary || recordItemIdx > 0;

  const isSummaryHighlight =
    isHighlightNewRecord ||
    (isHighlightDiff && recordItem.remarks !== preRecordItem.remarks);

  return (
    <>
      {isShowJob && (
        <RecordJob
          isFinanceApproval={isFinanceApproval}
          recordItemIdx={recordItemIdx}
          expReport={expReport}
          expRecord={expRecord}
          isHighlight={isHighlightCCJob('jobId')}
          readOnly={readOnly}
          hintMsg={customHint.recordJob}
          handleClickJobBtn={onClickJobBtn}
          getRecentJobs={getRecentJobs}
          searchJobs={searchJobs}
          updateReport={updateReport}
        />
      )}
      {isShowCostCenter && (
        <RecordCostCenter
          isFinanceApproval={isFinanceApproval}
          recordItemIdx={recordItemIdx}
          expReport={expReport}
          expRecord={expRecord}
          isHighlight={isHighlightCCJob('costCenterHistoryId')}
          readOnly={readOnly}
          hintMsg={customHint.recordCostCenter}
          handleClickCostCenterBtn={onClickCostCenterBtn}
          getRecentCostCenters={getRecentCostCenters}
          searchCostCenters={searchCostCenters}
          updateReport={updateReport}
          isLoading={isLoading}
          loadingAreas={loadingAreas}
          isLoaderOverride={false}
        />
      )}
      <ExtendedItems
        recordItem={expRecord.items[recordItemIdx]}
        preRecordItem={isEmpty(preRecordItem) ? null : preRecordItem}
        isHighlightNewRecord={isHighlightNewRecord}
        isHighlightDiff={isHighlightDiff}
        isParentItem={isParentItem}
        onClickLookupEISearch={onClickLookupEISearch}
        onChangeEditingExpReport={updateReport}
        readOnly={readOnly}
        targetRecordItem={itemPath}
        errors={errors}
        touched={touched}
      />
      {isShowSummary && (
        <Summary
          className={classNames({
            'highlight-bg': isSummaryHighlight,
          })}
          value={expRecord.items[recordItemIdx].remarks}
          hintMsg={customHint.recordSummary}
          onChangeEditingExpReport={updateReport}
          readOnly={readOnly}
          targetRecord={itemPath}
        />
      )}
    </>
  );
};

export default JobCCEISum;
