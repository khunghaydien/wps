import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import _ from 'lodash';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import LookupList from '../../../components/pages/expense/commons/LookupList';

import { CustomEIOption } from '@apps/domain/models/exp/ExtendedItem';

import { State } from '../../../modules';
import { actions as formValueRecordAction } from '../../../modules/expense/ui/general/formValues';
import { actions as itemValuesAction } from '../../../modules/expense/ui/general/itemValues';
import { actions as formValueReportAction } from '../../../modules/expense/ui/report/formValues';

import {
  getCustomExtendItemOptions,
  getRecentlyUsed,
} from '../../../action-dispatchers/expense/CustomExtendedItem';

type OwnProps = RouteComponentProps & {
  customExtendedItemId: string;
  customExtendedItemName: string;
  customExtendedItemLookupId: string;
  index: number;
  reportId: string;
  recordId: string;
  backType: string;
};

const BACK_TYPE = {
  REPORT: 'report',
  RECORD: 'record',
  ITEM: 'item',
  EXISTING_JORUDAN: 'existingJorudan',
} as const;

const CustomExtendedItemContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  useEffect(() => {
    getRecentlyUsedItem(
      ownProps.customExtendedItemId,
      ownProps.customExtendedItemLookupId
    );
  }, []);

  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const formValuesReport = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );
  const formValuesRecord = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );
  const itemValues = useSelector(
    (state: State) => state.expense.ui.general.itemValues
  );
  const eiLookup = useSelector(
    (state: State) => state.expense.entities.customEIOption
  );

  const getRecentlyUsedItem = (eiCustomId: string, eiLookupId: string) =>
    dispatch(getRecentlyUsed(eiCustomId, eiLookupId, employeeId));

  const onClickBack = () => {
    goBack(ownProps.history);
  };

  const onClickSearchButton = (keyword: string) => {
    dispatch(
      getCustomExtendItemOptions(ownProps.customExtendedItemId, keyword)
    );
  };

  const onClickRow = useCallback(
    (selectedCustomExtendedItem: CustomEIOption) => {
      let newFormValues;
      const { backType, index, recordId, reportId } = ownProps;
      if (backType === BACK_TYPE.REPORT) {
        newFormValues = _.cloneDeep(formValuesReport);
        newFormValues[`extendedItemLookup${index}Value`] =
          selectedCustomExtendedItem.code;
        newFormValues[`extendedItemLookup${index}SelectedOptionName`] =
          selectedCustomExtendedItem.name;
        dispatch(formValueReportAction.save(newFormValues));
      } else if (backType === BACK_TYPE.RECORD) {
        newFormValues = _.cloneDeep(formValuesRecord);
        newFormValues.items[0][`extendedItemLookup${index}Value`] =
          selectedCustomExtendedItem.code;
        newFormValues.items[0][`extendedItemLookup${index}SelectedOptionName`] =
          selectedCustomExtendedItem.name;
        dispatch(formValueRecordAction.save(newFormValues));
      } else if (backType === BACK_TYPE.ITEM) {
        const item = _.cloneDeep(itemValues);
        item[`extendedItemLookup${index}Value`] =
          selectedCustomExtendedItem.code;
        item[`extendedItemLookup${index}SelectedOptionName`] =
          selectedCustomExtendedItem.name;
        dispatch(itemValuesAction.save(item));
      } else {
        newFormValues = _.cloneDeep(formValuesRecord);
        newFormValues.items[0][`extendedItemLookup${index}Value`] =
          selectedCustomExtendedItem.code;
        newFormValues.items[0][`extendedItemLookup${index}SelectedOptionName`] =
          selectedCustomExtendedItem.name;
        dispatch(formValueRecordAction.save(newFormValues));
      }

      const hasReportId = reportId && reportId !== 'null';
      const hasRecordId = recordId && recordId !== 'null';
      let url = '';

      if (backType === BACK_TYPE.RECORD) {
        if (hasReportId && hasRecordId) {
          url = `/request/record/detail/${reportId}/${recordId}`;
        }
        if (hasReportId && !hasRecordId) {
          url = `/request/report/record/new/general`;
        }
        if (!hasReportId && hasRecordId) {
          url = `/request/record/detail/${recordId}`;
        }
      } else if (backType === BACK_TYPE.REPORT) {
        if (reportId && reportId !== 'null') {
          url = `/request/report/edit/${reportId}`;
        } else {
          url = '/request/report/new';
        }
      } else if (backType === BACK_TYPE.EXISTING_JORUDAN) {
        if (hasReportId) {
          url = `/request/record/jorudan-detail/${recordId}/${reportId}`;
        }
      } else if (backType === BACK_TYPE.ITEM) {
        goBack(ownProps.history);
        return;
      } else {
        if (hasReportId) {
          url = `/request/report/route/list/item/${backType}`;
        }
      }
      pushHistoryWithPrePage(ownProps.history, url, {
        target: _.get(ownProps.history, 'location.state.target'),
      });
    },
    [formValuesReport, formValuesRecord, itemValues, ownProps, dispatch]
  );

  return (
    <LookupList
      title={ownProps.customExtendedItemName}
      data={eiLookup}
      onClickBack={onClickBack}
      onClickSearchButton={onClickSearchButton}
      onClickRow={onClickRow}
    />
  );
};

export default CustomExtendedItemContainer;
