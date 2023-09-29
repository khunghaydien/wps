import React from 'react';

import withLoadingHOC from '@commons/components/withLoading';
import { updateChildItemCC } from '@commons/utils/exp/ItemizationUtil';

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
  isLoading: boolean;
  readOnly: boolean;
  recordItemIdx?: number;
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
    recordItemIdx,
    isFinanceApproval,
    isHighlight,
    isLoading,
  } = props;
  const recordDate = expRecord.recordDate;
  const parentItem = expRecord.items[0];
  const itemIdx = recordItemIdx || 0;
  const { costCenterHistoryId, costCenterCode, costCenterName } =
    expRecord.items[itemIdx];
  let ccCode = parentItem.costCenterCode || expReport.costCenterCode || '';
  let ccName = parentItem.costCenterName || expReport.costCenterName || '';
  if (costCenterHistoryId) {
    ccCode = costCenterCode;
    ccName = costCenterName;
  }

  const onSelectCostCenter = (x: Option) => {
    const isItemizedParent =
      itemIdx === 0 && isItemizedRecord(expRecord.items.length);

    if (isItemizedParent) {
      const newItemList = updateChildItemCC(
        expRecord.items,
        expReport.costCenterHistoryId
      );
      props.updateReport('items', newItemList, false);
    }

    props.updateReport(`items[${itemIdx}].costCenterHistoryId`, x.id, true);
    props.updateReport(`items[${itemIdx}].costCenterName`, x.name, true);
    props.updateReport(`items[${itemIdx}].costCenterCode`, x.code, true);
  };

  const displayValue = ccCode ? `${ccCode} - ${ccName}` : '';
  const placeHolder = msg().Com_Lbl_PressEnterToSearch;
  const selectedId =
    costCenterHistoryId ||
    parentItem.costCenterHistoryId ||
    expReport.costCenterHistoryId;

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
          selectedId={selectedId}
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
          isHighlight={isHighlight}
          showLoadingIndicator={isLoading}
        />
      </div>
    </>
  );
};

export default withLoadingHOC(RecordCostCenter);
