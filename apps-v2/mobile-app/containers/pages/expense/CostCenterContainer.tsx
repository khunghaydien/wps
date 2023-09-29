import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { cloneDeep, find, get } from 'lodash';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import msg from '../../../../commons/languages';
import LevelList from '../../../components/pages/expense/commons/LevelList';

import {
  CostCenter,
  DEFAULT_LIMIT_NUMBER,
} from '../../../../domain/models/exp/CostCenter';

import { State } from '../../../modules';
import { actions as formValueRecordAction } from '../../../modules/expense/ui/general/formValues';
import { actions as formValueItemAction } from '../../../modules/expense/ui/general/itemValues';
import { actions as formValueReportAction } from '../../../modules/expense/ui/report/formValues';

import {
  getCostCenterList,
  searchCostCenter,
  searchDefaultCoastCenter,
} from '../../../action-dispatchers/expense/CostCenter';

type OwnProps = RouteComponentProps & {
  type: string;
  keyword?: string;
  reportId?: string;
  targetDate: string;
  parentId: string;
  backType: string;
  itemIdx: number;
};

const CostCenterContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const formValuesReport = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );
  const formValuesRecord = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );
  const formValuesItem = useSelector(
    (state: State) => state.expense.ui.general.itemValues
  );
  const list = useSelector(
    (state: State) => state.expense.entities.costCenterList
  );
  const userSetting = useSelector((state: State) => state.userSetting);
  const defaultCostCenterList = useSelector(
    (state: State) => state.expense.entities.defaultCostCenterList
  );

  const itemIdx = get(ownProps, 'location.state.itemIdx', 0);

  const title =
    ownProps.backType === 'report'
      ? msg().Exp_Clbl_CostCenterHeader
      : msg().Exp_Clbl_CostCenter;

  const limitNumber = DEFAULT_LIMIT_NUMBER;

  useEffect(() => {
    const { companyId }: { companyId: string } = userSetting;

    const { targetDate, parentId = null, keyword = '' } = ownProps;
    if (ownProps.type === 'list') {
      dispatch(getCostCenterList(companyId, parentId, targetDate, limitNumber));
    } else {
      dispatch(
        searchCostCenter(
          companyId,
          targetDate,
          keyword === 'null' ? '' : decodeURIComponent(keyword),
          limitNumber
        )
      );
    }
  }, []);

  const onClickBack = () => {
    goBack(ownProps.history);
  };

  const onClickSearchButton = (keyword: string | null) => {
    if (keyword === null) {
      return;
    }

    const { targetDate, reportId, backType, history } = ownProps;
    // Special handling of % because it could not be sanitized with react router.
    const sanitizedKeyword = encodeURIComponent(keyword.replace(/%/g, '%25'));
    const url = `/expense/cost-center/search/backType=${backType}/targetDate=${targetDate}/reportId=${
      reportId || 'null'
    }/keyword=${!sanitizedKeyword ? 'null' : sanitizedKeyword}`;
    pushHistoryWithPrePage(history, url, {
      target: get(ownProps.history, 'location.state.target'),
    });
  };

  const onClickRow = useCallback(
    async (selectedCostCenter: CostCenter) => {
      let newFormValues;
      if (ownProps.backType === 'report') {
        newFormValues = cloneDeep(formValuesReport);
        newFormValues.costCenterCode = selectedCostCenter.code;
        newFormValues.costCenterName = selectedCostCenter.name;
        newFormValues.costCenterHistoryId = selectedCostCenter.historyId
          ? selectedCostCenter.historyId
          : selectedCostCenter.id;

        // check if selected cc is dcc
        const existingDefaultCC = find(defaultCostCenterList, [
          'date',
          formValuesReport.accountingDate,
        ]);
        const defaultCC = !existingDefaultCC
          ? (
              await dispatch(
                searchDefaultCoastCenter(
                  userSetting.employeeId,
                  formValuesReport.accountingDate
                )
              )
            )[0]
          : existingDefaultCC.costCenter;
        const isCostCenterChangedManually =
          defaultCC.costCenterCode !== newFormValues.costCenterCode;
        newFormValues.isCostCenterChangedManually = isCostCenterChangedManually;
        dispatch(formValueReportAction.save(newFormValues));
      } else {
        const isChildItem = itemIdx > 0;
        if (isChildItem) {
          const newItemValues = cloneDeep(formValuesItem);
          newItemValues.costCenterCode = selectedCostCenter.code;
          newItemValues.costCenterName = selectedCostCenter.name;
          newItemValues.costCenterHistoryId = selectedCostCenter.historyId
            ? selectedCostCenter.historyId
            : selectedCostCenter.id;
          dispatch(formValueItemAction.save(newItemValues));
        } else {
          newFormValues = cloneDeep(formValuesRecord);
          newFormValues.items[itemIdx].costCenterCode = selectedCostCenter.code;
          newFormValues.items[itemIdx].costCenterName = selectedCostCenter.name;
          newFormValues.items[itemIdx].costCenterHistoryId =
            selectedCostCenter.historyId
              ? selectedCostCenter.historyId
              : selectedCostCenter.id;
          dispatch(formValueRecordAction.save(newFormValues));
        }
      }
      // redirect
      let url;
      const reportId = ownProps.reportId;
      const recordId = formValuesRecord.recordId;
      if (ownProps.backType === 'report') {
        if (ownProps.reportId && ownProps.reportId !== 'null') {
          url = `/expense/report/edit/${ownProps.reportId}`;
        } else {
          url = '/expense/report/new';
        }
      } else if (ownProps.backType === 'record') {
        url = `/expense/record/detail/${reportId}/${recordId}`;
        if (itemIdx > 0) {
          url = `/expense/record/item/${itemIdx}`;
        } else if (!recordId) {
          url = '/expense/report/record/new/general';
        }
      } else if (ownProps.backType === 'existingJorudan') {
        if (reportId && recordId) {
          url = `/expense/record/jorudan-detail/${recordId}/${reportId}`;
        }
      } else {
        url = `/expense/report/route/list/item/${ownProps.backType}`;
      }
      pushHistoryWithPrePage(ownProps.history, url, {
        target: get(ownProps.history, 'location.state.target'),
      });
    },
    [
      formValuesReport,
      formValuesRecord,
      ownProps.backType,
      ownProps.reportId,
      dispatch,
      ownProps.history,
    ]
  );

  const onClickIcon = useCallback(
    (selectedCostCenter: CostCenter) => {
      const costCenterId = selectedCostCenter.baseId || selectedCostCenter.id;
      const url = `/expense/cost-center/list/backType=${
        ownProps.backType
      }/targetDate=${ownProps.targetDate}/reportId=${
        ownProps.reportId || ownProps.reportId === 'null'
          ? ownProps.reportId
          : 'null'
      }/parentId=${costCenterId}`;
      pushHistoryWithPrePage(ownProps.history, url, {
        target: get(ownProps.history, 'location.state.target'),
      });
    },
    [
      ownProps.backType,
      ownProps.reportId,
      ownProps.targetDate,
      ownProps.history,
    ]
  );

  return (
    <LevelList
      list={list}
      keyword={ownProps.keyword || ''}
      title={title}
      limitNumber={limitNumber}
      onClickBack={onClickBack}
      onClickSearchButton={onClickSearchButton}
      onClickRow={onClickRow}
      onClickIcon={onClickIcon}
    />
  );
};

export default CostCenterContainer;
