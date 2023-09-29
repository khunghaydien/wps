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
  getRecentCostCenters: () => Promise<Option[]>;
  handleClickCostCenterBtn: (arg0: string) => void;
  searchCostCenters: (keyword?: string) => Promise<Option[]>;
  updateReport: (arg0: string, arg1: any, arg2: boolean) => void;
};

const ROOT = 'ts-expenses-requests__record_cost-center';
const RecordCostCenter = (props: Props) => {
  const {
    expReport,
    expRecord,
    readOnly,
    handleClickCostCenterBtn,
    hintMsg,
    recordIdx,
    isFinanceApproval,
  } = props;
  const recordDate = expRecord.recordDate;
  const { costCenterHistoryId, costCenterCode, costCenterName } =
    expRecord.items[0];
  let ccCode = expReport.costCenterCode || '';
  let ccName = expReport.costCenterName || '';
  if (costCenterHistoryId) {
    ccCode = costCenterCode;
    ccName = costCenterName;
  }

  const onSelectCostCenter = (x: Option) => {
    props.updateReport(
      `records[${recordIdx}].items[0].costCenterHistoryId`,
      x.id,
      true
    );
    props.updateReport(
      `records[${recordIdx}].items[0].costCenterName`,
      x.name,
      true
    );
    props.updateReport(
      `records[${recordIdx}].items[0].costCenterCode`,
      x.code,
      true
    );
  };

  const displayValue = ccCode ? `${ccCode} - ${ccName}` : '';
  const placeHolder = msg().Com_Lbl_PressEnterToSearch;

  return (
    <>
      <div className={`${ROOT} ts-text-field-container`}>
        <LabelWithHint
          text={msg().Exp_Clbl_CostCenter}
          hintMsg={(!readOnly && hintMsg) || ''}
          isRequired
        />
        <QuickSearch
          isSkipRecentlyUsed={isFinanceApproval}
          ROOT={ROOT}
          hideRemoveIcon
          disabled={readOnly}
          placeholder={placeHolder}
          selectedId={costCenterHistoryId || expReport.costCenterHistoryId}
          targetDate={
            recordDate ||
            expReport.scheduledDate ||
            expReport.accountingDate ||
            ''
          }
          displayValue={displayValue}
          onSelect={onSelectCostCenter}
          getRecentlyUsedItems={props.getRecentCostCenters}
          getSearchResult={props.searchCostCenters}
          openSearchDialog={() => handleClickCostCenterBtn(recordDate)}
        />
      </div>
    </>
  );
};

export default RecordCostCenter;
