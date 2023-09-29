import React from 'react';

import { updateChildItemJob } from '@commons/utils/exp/ItemizationUtil';

import {
  isItemizedRecord,
  Record,
} from '../../../../../../domain/models/exp/Record';
import { Report } from '../../../../../../domain/models/exp/Report';

import msg from '../../../../../languages';
import LabelWithHint from '../../../../fields/LabelWithHint';
import QuickSearch, { Option } from '../../QuickSearch';

type Props = {
  expRecord: Record;
  expReport: Report;
  hintMsg?: string;
  isFinanceApproval?: boolean;
  isHighlight?: boolean;
  readOnly: boolean;
  recordItemIdx?: number;
  getRecentJobs: () => Promise<Option[]>;
  handleClickJobBtn: (arg0: string) => void;
  searchJobs: (keyword?: string) => Promise<Option[]>;
  updateReport: (arg0: string, arg1: any, arg2: boolean) => void;
};

const ROOT = 'ts-expenses-requests__record_job';

const RecordJob = (props: Props) => {
  const {
    expReport,
    expRecord,
    readOnly,
    handleClickJobBtn,
    hintMsg,
    recordItemIdx,
    isHighlight,
    isFinanceApproval,
  } = props;
  const recordDate = expRecord.recordDate;
  const parentItem = expRecord.items[0];
  const itemIdx = recordItemIdx || 0;
  const { jobId, jobCode, jobName } = expRecord.items[itemIdx];

  let recordJobCode = parentItem.jobCode || expReport.jobCode;
  let recordJobName = parentItem.jobName || expReport.jobName;
  if (jobId) {
    recordJobCode = jobCode;
    recordJobName = jobName;
  }

  const onSelectJob = (x: Option) => {
    const isItemizedParent =
      itemIdx === 0 && isItemizedRecord(expRecord.items.length);

    if (isItemizedParent) {
      const newItemList = updateChildItemJob(expRecord.items, expReport.jobId);
      props.updateReport('items', newItemList, false);
    }

    props.updateReport(`items[${itemIdx}].jobId`, x.id, true);
    props.updateReport(`items[${itemIdx}].jobName`, x.name, true);
    props.updateReport(`items[${itemIdx}].jobCode`, x.code, true);
  };

  const displayValue = recordJobCode
    ? `${recordJobCode} - ${recordJobName}`
    : '';
  const selectedId = jobId || parentItem.jobId || expReport.jobId;

  return (
    <>
      <div className={`${ROOT} ts-text-field-container`}>
        <LabelWithHint
          text={msg().Exp_Lbl_Job}
          hintMsg={(!readOnly && hintMsg) || ''}
          isRequired
        />
        <QuickSearch
          isSkipRecentlyUsed={isFinanceApproval}
          ROOT={ROOT}
          isHighlight={isHighlight}
          hideRemoveIcon
          disabled={readOnly}
          placeholder={msg().Com_Lbl_PressEnterToSearch}
          selectedId={selectedId}
          targetDate={expReport.scheduledDate || expReport.accountingDate || ''}
          displayValue={displayValue}
          onSelect={onSelectJob}
          getRecentlyUsedItems={props.getRecentJobs}
          getSearchResult={props.searchJobs}
          openSearchDialog={() => handleClickJobBtn(recordDate)}
        />
      </div>
    </>
  );
};
export default RecordJob;
