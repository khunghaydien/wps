import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction, compose } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { FormikValues, withFormik } from 'formik';
import _ from 'lodash';

import { pushHistoryWithPrePage } from '@mobile/concerns/routingHistory';
import schema from '@mobile/schema/expenses/JorudanRecordNewSchema';

import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';

import STATUS from '@apps/domain/models/approval/request/Status';
import { LatestCostCenter } from '@apps/domain/models/exp/CostCenter';
import { getEIsOnly } from '@apps/domain/models/exp/ExtendedItem';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import {
  newRecord,
  Record,
  RECORD_TYPE,
  RouteInfo,
} from '@apps/domain/models/exp/Record';
import { calculateTax } from '@apps/domain/models/exp/TaxType';

import { actions as routeActions } from '@apps/domain/modules/exp/jorudan/route';
import { State } from '@mobile/modules';
import {
  actions as routeFormActions,
  UI_TYPE,
} from '@mobile/modules/expense/pages/routeFormPage';
import { actions as customHintUIActions } from '@mobile/modules/expense/ui/customHint/list';
import { actions as formValueAction } from '@mobile/modules/expense/ui/general/formValues';
import { actions as readOnlyAction } from '@mobile/modules/expense/ui/general/readOnly';
import { actions as expTypeUiAction } from '@mobile/modules/expense/ui/selectedExpType';

import { getLatestHistoryCostCenter } from '@mobile/action-dispatchers/expense/CostCenter';
import { getExpenseTypeById } from '@mobile/action-dispatchers/expense/ExpenseType';
import {
  cloneRecord,
  createRecord,
  deleteRecord,
} from '@mobile/action-dispatchers/expense/Record';
import { save as saveReport } from '@mobile/action-dispatchers/expense/ReportDetail';
import { getTaxTypeList } from '@mobile/action-dispatchers/expense/TaxType';

import RouteListItemPage from '@mobile/components/pages/expense/Route/List/Item';

const EXISTING_JORUDAN = 'existingJorudan';

type OwnProps = RouteComponentProps & {
  type: string;
  reportId?: string;
  recordId?: string;
  routeNo?: string;
};

const RouteListItemContainer = (ownProps: OwnProps & FormikValues) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  useEffect(() => {
    const { readOnly, report, values } = ownProps;
    const { recordDate, recordId } = values;
    const { costCenterHistoryId, expTypeId } = values.items[0];

    if (
      ownProps.isUnderApprovedPreRequest ||
      ownProps.reportDiscarded ||
      ownProps.reportClaimed
    ) {
      ownProps.setReadOnly(true);
    }
    Promise.all([
      ownProps.getTaxTypeList(expTypeId, recordDate),
      ownProps.getExpenseTypeById(expTypeId, 'REQUEST'),
    ]).then(() => {
      // get latest revised cc
      const isReadOnly = !!recordId && readOnly;
      if (recordDate && !isReadOnly) {
        const historyId = costCenterHistoryId || report.costCenterHistoryId;
        dispatch(getLatestHistoryCostCenter(historyId, recordDate))
          // @ts-ignore
          .then((latestCostCenter: LatestCostCenter) => {
            const { baseCode, id, name } =
              latestCostCenter[0] || ({} as LatestCostCenter);
            const clonedValues = _.cloneDeep(ownProps.values);
            clonedValues.items[0].costCenterCode = baseCode;
            clonedValues.items[0].costCenterName = name;
            clonedValues.items[0].costCenterHistoryId = id;
            ownProps.saveFormValues(clonedValues);
          });
      }
    });
  }, []);

  return (
    <RouteListItemPage
      language={ownProps.language}
      report={ownProps.report}
      recordId={ownProps.recordId}
      readOnly={ownProps.readOnly}
      isUnderApprovedPreRequest={ownProps.isUnderApprovedPreRequest}
      reportDiscarded={ownProps.reportDiscarded}
      reportClaimed={ownProps.reportClaimed}
      isSubmitted={ownProps.isSubmitted}
      values={ownProps.values}
      errors={ownProps.errors}
      touched={ownProps.touched}
      status={ownProps.status}
      history={ownProps.history}
      onClickChangeRouteBtn={ownProps.onClickChangeRouteBtn}
      setFieldValue={ownProps.setFieldValue}
      setFieldTouched={ownProps.setFieldTouched}
      setValues={ownProps.setValues}
      setTouched={ownProps.setTouched}
      handleSubmit={ownProps.handleSubmit}
      onClickBackButton={ownProps.onClickBackButton}
      onClickDeleteButton={ownProps.onClickDeleteButton}
      onClickEditButton={ownProps.onClickEditButton}
      taxList={ownProps.taxList}
      baseCurrencyDecimal={ownProps.baseCurrencyDecimal}
      baseCurrencySymbol={ownProps.baseCurrencySymbol}
      taxRoundingSetting={ownProps.axRoundingSetting}
      saveFormValues={ownProps.saveFormValues}
      onClickSearchCustomEI={ownProps.onClickSearchCustomEI}
      activeHints={ownProps.activeHints}
      customHints={ownProps.customHints}
      onClickHint={ownProps.onClickHint}
      onClickSearchCostCenter={ownProps.onClickSearchCostCenter}
      onClickSearchJob={ownProps.onClickSearchJob}
      onClickCloneRecord={ownProps.onClickCloneRecord}
      useJctRegistrationNumber={ownProps.useJctRegistrationNumber}
      selectedExpType={ownProps.selectedExpType}
    />
  );
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const report = state.expense.entities.report;
  return {
    ...ownProps,
    report,
    records: state.expense.entities.recordList,
    reportRecords: state.expense.entities.report.records,
    routeFormParams: state.expense.pages.routeFormPage,
    readOnly: state.expense.ui.general.readOnly,
    defaultRouteOptions: state.expense.pages.defaultRouteOptions,
    routeResults: state.expense.entities.routeResults,
    isSubmitted: [STATUS.Pending, STATUS.Approved].includes(
      state.expense.entities.report.status
    ),
    expenseTypeList: state.expense.entities.expenseTypeList.records,
    selectedExpType: state.expense.ui.selectedExpType,
    formValues: state.expense.ui.general.formValues,
    taxList: state.expense.entities.taxType,
    baseCurrencyDecimal: state.userSetting.currencyDecimalPlaces,
    baseCurrencySymbol: state.userSetting.currencySymbol,
    taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
    activeHints: state.expense.ui.customHint.list,
    customHints: state.expense.entities.customHint,
    companyId: state.userSetting.companyId,
    employeeId: state.userSetting.employeeId,
    language: state.userSetting.language,
    isUnderApprovedPreRequest: _.get(
      ownProps.history,
      'location.state.isApprovedPreRequest'
    ),
    reportDiscarded: report.status === STATUS.Discarded,
    reportClaimed: report.status === STATUS.Claimed,
    useJctRegistrationNumber: state.userSetting.jctInvoiceManagement,
  };
};

const mapDispatchToProps = {
  cloneRecord,
  createRecord,
  deleteRecord,
  saveReport,
  setReadOnly: readOnlyAction.set,
  clearRouteFormValues: routeFormActions.clear,
  saveRouteFormValues: routeFormActions.save,
  clearRouteResults: routeActions.clear,
  saveFormValues: formValueAction.save,
  clearFormValues: formValueAction.clear,
  clearSelectedExpType: expTypeUiAction.clear,
  onClickHint: customHintUIActions.set,
  resetCustomHint: customHintUIActions.clear,
  getTaxTypeList,
  showToast,
  getExpenseTypeById,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
) => ({
  ...stateProps,
  ...dispatchProps,
  onClickBackButton: (values: Record) => {
    const { recordId, history } = ownProps;
    if (recordId) {
      dispatchProps.clearFormValues();
      dispatchProps.resetCustomHint();
      dispatchProps.clearSelectedExpType();
      dispatchProps.setReadOnly(true);
    }

    const stateParam = {
      type: ownProps.type,
      target: _.get(ownProps, 'location.state.target'),
    };

    if (ownProps.type === UI_TYPE.ADD) {
      dispatchProps.saveFormValues(values);
      pushHistoryWithPrePage(history, '/request/report/route/list', stateParam);
    } else if (ownProps.type === UI_TYPE.REPORT) {
      ownProps.history.push(`/request/report/detail/${ownProps.reportId}`);
    }
  },
  onClickEditButton: () => {
    dispatchProps.setReadOnly(false);
  },
  onClickChangeRouteBtn: (
    targetDate: string,
    expenseTypeId: string,
    expTypeName: string,
    routeInfo: RouteInfo
  ) => {
    const stateParam = {
      type: ownProps.type,
      target: _.get(ownProps, 'location.state.target'),
    };
    // now only edit existing record supports change route

    ownProps.history.push(
      `/request/report/route/edit/${ownProps.recordId}/${ownProps.reportId}`,
      stateParam
    );

    // carry existing record values to route search page
    const { origin, arrival, viaList } = routeInfo;
    const updatedRouteFormParam = {
      ...stateProps.routeFormParams,
      targetDate,
      arrival,
      origin,
      viaList,
      expenseTypeId,
      expenseType: expTypeName,
    };
    dispatchProps.saveRouteFormValues(updatedRouteFormParam);
  },
  onClickDeleteButton: () => {
    dispatchProps
      .deleteRecord(ownProps.recordId, true)
      // @ts-ignore
      .then(() => {
        if (ownProps.type === UI_TYPE.REPORT) {
          dispatchProps.clearRouteFormValues();
          dispatchProps.resetCustomHint();
          ownProps.history.replace(
            `/request/report/detail/${ownProps.reportId}`
          );
        }
      })
      .catch((err) => {
        const errMsg =
          (err.message && ` (${err.message})`) ||
          (err.event && ` (${err.event.message})`) ||
          '';
        dispatchProps.showToast(`${msg().Exp_Lbl_RecordDeleteFailed}${errMsg}`);
      });
  },
  getValuesWithSelectedRoute: (routeNo: string) => {
    const { formValues, routeFormParams, selectedExpType } = stateProps;

    const record = _.cloneDeep(formValues);
    if (_.isNil(routeNo)) {
      return record;
    }

    const routeLists = _.get(stateProps.routeResults, 'route.routeList');
    const selectedRoute = routeLists[routeNo];
    const oldRouteInfo = _.cloneDeep(record.routeInfo);
    const routeInfo = {
      arrival: routeFormParams.arrival,
      origin: routeFormParams.origin,
      viaList: routeFormParams.viaList,
      selectedRoute,
    };
    const updatedRoute = { ...oldRouteInfo, ...routeInfo };

    record.routeInfo = updatedRoute;

    if (typeof updatedRoute.roundTrip !== 'string') {
      updatedRoute.roundTrip = updatedRoute.roundTrip ? '1' : '0';
    }

    const newAmount =
      updatedRoute.roundTrip === '1'
        ? updatedRoute.selectedRoute.roundTripCost
        : updatedRoute.selectedRoute.cost;

    record.amount = newAmount;
    record.recordDate = routeFormParams.targetDate;
    record.items[0].recordDate = routeFormParams.targetDate;
    record.items[0].amount = newAmount;
    record.items[0].expTypeId = routeFormParams.expenseTypeId;
    record.items[0].expTypeName = routeFormParams.expenseType;

    if (!_.isEmpty(selectedExpType)) {
      const itemData = _.cloneDeep(record.items[0]);
      const updatedEIs = getEIsOnly(selectedExpType, itemData);
      record.items[0] = { ...record.items[0], ...updatedEIs };
    }

    const tax = stateProps.taxList[0];
    const taxRes = calculateTax(
      tax.rate,
      newAmount,
      stateProps.baseCurrencyDecimal,
      stateProps.taxRoundingSetting
    );

    record.withoutTax = taxRes.amountWithoutTax;
    record.items[0].withoutTax = taxRes.amountWithoutTax;
    record.items[0].gstVat = taxRes.gstVat;
    record.items[0].taxTypeHistoryId = stateProps.taxList[0].historyId;

    return record;
  },
  getValuesFromRecords: () => {
    const { recordId, records, reportRecords } = stateProps;

    let values = _.find(records, { recordId });
    if (ownProps.reportId) {
      const reportRecord = _.find(reportRecords, { recordId });
      values = reportRecord;
    }

    if (!values) {
      return false;
    }

    if (typeof values.routeInfo.roundTrip !== 'string') {
      values.routeInfo.roundTrip = values.routeInfo.roundTrip ? '1' : '0';
    }

    return values;
  },
  newRouteRecords: () => {
    if (
      !_.isEmpty(stateProps.formValues) &&
      ![UI_TYPE.ADD].includes(ownProps.type)
    ) {
      return stateProps.formValues;
    }

    const { routeResults, routeFormParams, selectedExpType } = stateProps;

    const record: Record = newRecord(
      routeFormParams.expenseTypeId,
      routeFormParams.expenseType,
      RECORD_TYPE.TransitJorudanJP,
      false,
      selectedExpType,
      true
    );

    if ([UI_TYPE.ADD].includes(ownProps.type)) {
      record.reportId = stateProps.formValues.reportId;
    }

    const routeLists = _.get(routeResults, 'route.routeList');
    const selectedRoute = routeLists[ownProps.routeNo];
    const routeInfo = {
      arrival: routeFormParams.arrival,
      origin: routeFormParams.origin,
      viaList: routeFormParams.viaList,
      roundTrip: false,
      selectedRoute,
    };

    record.routeInfo = routeInfo;
    record.recordDate = routeFormParams.targetDate;
    // init amount as one way cost
    record.items[0].amount = selectedRoute.cost;

    if (!_.isEmpty(stateProps.taxList)) {
      const tax = stateProps.taxList[0];

      const taxRes = calculateTax(
        tax.rate,
        selectedRoute.cost,
        stateProps.baseCurrencyDecimal,
        stateProps.taxRoundingSetting
      );

      record.withoutTax = taxRes.amountWithoutTax;
      record.items[0].withoutTax = taxRes.amountWithoutTax;
      record.items[0].gstVat = taxRes.gstVat;
      record.items[0].taxTypeHistoryId = stateProps.taxList[0].historyId;
    }

    // set jct invoice option and clear jct registration number
    if (selectedExpType.jctRegistrationNumberUsage) {
      record.jctRegistrationNumberUsage =
        selectedExpType.jctRegistrationNumberUsage;
      if (isUseJctNo(selectedExpType.jctRegistrationNumberUsage)) {
        record.items[0].jctInvoiceOption = JCT_NUMBER_INVOICE.Invoice;
      }
    }

    return record;
  },
  onClickSearchCustomEI: (
    customExtendedItemLookupId: string,
    customExtendedItemId: string,
    customExtendedItemName: string,
    index: string,
    isEditExisting
  ) => {
    const reportId = ownProps.reportId || stateProps.report.reportId;
    const recordId = ownProps.recordId || 'null';

    // dispatchProps.saveRouteFormValues();

    let backType = ownProps.routeNo;
    if (isEditExisting) {
      backType = EXISTING_JORUDAN;
    }

    pushHistoryWithPrePage(
      ownProps.history,
      `/request/customExtendedItem/list/backType=${backType}/reportId=${reportId}/recordId=${recordId}/itemIdx=null/index=${index}/customExtendedItemLookupId=${customExtendedItemLookupId}/customExtendedItemId=${customExtendedItemId}/customExtendedItemName=${customExtendedItemName}`,
      {
        type: ownProps.type,
        target: _.get(ownProps, 'location.state.target'),
      }
    );
  },
  onClickSearchCostCenter: (recordDate: string) => {
    const reportId = ownProps.reportId || stateProps.report.reportId;

    let backType = ownProps.routeNo;
    if (ownProps.recordId) {
      backType = EXISTING_JORUDAN;
    }

    pushHistoryWithPrePage(
      ownProps.history,
      `/request/cost-center/list/backType=${backType}/targetDate=${recordDate}/reportId=${reportId}`,
      {
        type: ownProps.type,
        target: _.get(ownProps, 'location.state.target'),
      }
    );
  },
  onClickSearchJob: (recordDate: string) => {
    const reportId = ownProps.reportId || stateProps.report.reportId;

    let backType = ownProps.routeNo;
    if (ownProps.recordId) {
      backType = EXISTING_JORUDAN;
    }

    pushHistoryWithPrePage(
      ownProps.history,
      `/request/job/list/backType=${backType}/targetDate=${recordDate}/reportId=${reportId}`,
      {
        type: ownProps.type,
        target: _.get(ownProps, 'location.state.target'),
      }
    );
  },
  onClickCloneRecord: (numberOfDays?: number, targetDates?: string[]) => {
    const { history } = ownProps;
    const reportId = ownProps.reportId || stateProps.report.reportId;
    const recordId = [ownProps.recordId];
    dispatchProps
      .cloneRecord(
        recordId,
        numberOfDays,
        targetDates || null,
        stateProps.employeeId,
        true
      )
      // @ts-ignore
      .then((_res) => {
        history.replace(`/request/report/detail/${reportId}`);
      });
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withFormik({
    enableReinitialize: true,
    validationSchema: schema,
    mapPropsToValues: (props: ReturnType<typeof mergeProps>) => {
      const { recordId, formValues } = props;

      if (!recordId) {
        const selectedRoute = _.get(formValues, 'routeInfo.selectedRoute');
        // click back and re-edit in the case of new jorudan
        if (!_.isEmpty(selectedRoute)) {
          return props.getValuesWithSelectedRoute(props.routeNo);
        }
        // create new jorudan
        return props.newRouteRecords();
      }
      // view existing jorudan
      if (_.isEmpty(formValues)) {
        return props.getValuesFromRecords();
      } else {
        // edit existing jorudan
        const selectedRouteNo = _.get(props.location.state, 'routeNo');
        if (!_.isNil(selectedRouteNo)) {
          return props.getValuesWithSelectedRoute(selectedRouteNo);
        }

        return formValues;
      }
    },
    handleSubmit: (values, { props, setStatus }) => {
      const result = _.cloneDeep(values);
      if (typeof result.routeInfo.roundTrip === 'string') {
        result.routeInfo.roundTrip = result.routeInfo.roundTrip !== '0';
      }
      if (props.type === UI_TYPE.REPORT || props.type === UI_TYPE.ADD) {
        result.reportId = props.report.reportId;
      }
      const {
        costCenterHistoryId: reportCCId,
        jobId: reportJobId,
        reportId,
        expReportTypeId,
      } = props.report;
      if (reportCCId && result.items[0].costCenterHistoryId === reportCCId) {
        result.items[0].costCenterHistoryId = null;
        result.items[0].costCenterCode = '';
        result.items[0].costCenterName = '';
      }
      if (reportJobId && result.items[0].jobId === reportJobId) {
        result.items[0].jobId = null;
        result.items[0].jobName = '';
        result.items[0].jobCode = '';
      }
      // reset jct values if invoice option is not Invoice
      if (
        result.items[0].jctInvoiceOption &&
        result.items[0].jctInvoiceOption !== JCT_NUMBER_INVOICE.Invoice &&
        result.items[0].jctRegistrationNumber
      ) {
        result.items[0].jctRegistrationNumber = null;
      }
      props
        .createRecord(result, reportId, expReportTypeId, props.employeeId, true)
        // @ts-ignore
        .then(() => {
          props.setReadOnly(true);
          props.clearFormValues();
          if (props.type === UI_TYPE.ADD) {
            props.history.push(`/request/report/detail/${values.reportId}`);
            props.showToast(msg().Exp_Lbl_ItemIsSaved);
          } else {
            setStatus({
              isRecordSaved: true,
            });
            props.resetCustomHint();
          }
        })
        .catch((err) => {
          const errMsg =
            (err.message && ` (${err.message})`) ||
            (err.event && ` (${err.event.message})`) ||
            '';
          props.showToast(`${msg().Exp_Msg_RecordSaveFailed}${errMsg}`);
        });
    },
  })
)(RouteListItemContainer) as React.ComponentType;
