import React from 'react';

import { Record } from '../../../../../../domain/models/exp/Record';
import { Report } from '../../../../../../domain/models/exp/Report';

import msg from '../../../../../languages';
import LabelWithHint from '../../../../fields/LabelWithHint';
import QuickSearch, { Option } from '../../QuickSearch';

type Props = {
  expRecord: Record;
  expReport: Report;
  hintMsg?: string;
  isFinanceApproval?: boolean;
  readOnly: boolean;
  recordIdx: number;
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
    recordIdx,
    isFinanceApproval,
  } = props;
  const recordDate = expRecord.recordDate;
  const { jobId, jobCode, jobName } = expRecord.items[0];

  let recordJobCode = expReport.jobCode;
  let recordJobName = expReport.jobName;
  if (jobId) {
    recordJobCode = jobCode;
    recordJobName = jobName;
  }

  const onSelectJob = (x: Option) => {
    props.updateReport(`records[${recordIdx}].items[0].jobId`, x.id, true);
    props.updateReport(`records[${recordIdx}].items[0].jobName`, x.name, true);
    props.updateReport(`records[${recordIdx}].items[0].jobCode`, x.code, true);
  };

  const displayValue = recordJobCode
    ? `${recordJobCode} - ${recordJobName}`
    : '';

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
          hideRemoveIcon
          disabled={readOnly}
          placeholder={msg().Com_Lbl_PressEnterToSearch}
          selectedId={jobId || expReport.jobId}
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
