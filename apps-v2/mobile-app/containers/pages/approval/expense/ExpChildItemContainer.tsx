import React from 'react';
import { useSelector } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { goBack } from '@mobile/concerns/routingHistory';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import { getItemCCJobObj } from '@commons/utils/exp/ItemizationUtil';

import { Record } from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';

import { State } from '@mobile/modules/approval';

import ChildItems from '@mobile/components/pages/approval/expense/Report/Record/ChildItems';

const getRecord = (report: Report, recordId: string) => {
  const recordList = get(report, 'records', []);
  const selectedRecordList = recordList.filter(
    (record: Record) => record.recordId === recordId
  );
  const record = get(selectedRecordList, '0', {});
  return record;
};

const getItem = (record: Record, itemIdx: number) => {
  const itemList = get(record, 'items', []);
  const item = get(itemList, itemIdx, {});
  return item;
};

const ExpChildItemContainer = (props) => {
  const { history, itemIdx, location } = props;

  const currencyDecimalPlaces = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const currencySymbol = useSelector(
    (state: State) => state.userSetting.currencySymbol
  );
  const allowHighlightDiff = useSelector(
    (state: State) => state.userSetting.highlightExpReqRepDiff
  );
  const activeModule = useSelector(
    (state: State) => state.approval.ui.requestModule
  );
  const isRequest = activeModule === EXPENSE_APPROVAL_REQUEST.request;
  const report = useSelector((state: State) =>
    isRequest
      ? state.approval.entities.expense.preRequest
      : state.approval.entities.expense.report
  );

  const recordId = get(location, 'state.recordId', '');
  const preReport = get(report, 'expPreRequest', {});
  const record = getRecord(report, recordId);
  const preRecord = getRecord(preReport, record.expPreRequestRecordId);
  const item = getItem(record, itemIdx);
  const preItem = getItem(preRecord, itemIdx);
  const isNewItem = isEmpty(preItem);

  const ccJobObj = getItemCCJobObj(itemIdx, record, report);
  const preCCJobObj = getItemCCJobObj(itemIdx, preRecord, preReport);

  const onClickBack = () => {
    goBack(history);
  };

  const ownProps = {
    ...props,
    ccJobObj,
    currencyDecimalPlaces,
    currencySymbol,
    isHighlightDiff: allowHighlightDiff && !isNewItem,
    item,
    preCCJobObj,
    preItem,
    preRecord,
    record,
    onClickBack,
  };

  return <ChildItems {...ownProps} />;
};

export default ExpChildItemContainer;
