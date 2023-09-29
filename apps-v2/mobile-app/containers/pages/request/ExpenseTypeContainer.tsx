import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import _ from 'lodash';

import {
  goBack,
  pushHistoryWithPrePage,
} from '@mobile/concerns/routingHistory';

import {
  isMileageRecord,
  newRecord,
  RECEIPT_TYPE,
  RECORD_TYPE,
  RECORD_TYPE_CATEGORY,
} from '../../../../domain/models/exp/Record';
import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import { isUseJctNo, JCT_NUMBER_INVOICE } from '@apps/domain/models/exp/JCTNo';
import { initialDestinations } from '@apps/domain/models/exp/Mileage';

import { State } from '../../../modules';
import { actions as routeFormPageActions } from '../../../modules/expense/pages/routeFormPage';
import { actions as formValueAction } from '../../../modules/expense/ui/general/formValues';
import { actions as mileageActions } from '@mobile/modules/expense/ui/mileage';

import {
  getExpenseTypeList,
  searchExpenseType,
} from '../../../action-dispatchers/expense/ExpenseType';
import { getPaymentMethodOptionList } from '@mobile/action-dispatchers/expense/PaymentMethod';

import ExpTypeComponent from '../../../components/pages/expense/Record/New/General/ExpenseType';

type OwnProps = RouteComponentProps & {
  type: string;
  recordType?: string;
  parentGroupId?: string;
  parentParentGroupId?: string;
  keyword?: string;
  level?: number;
};

const ExpenseTypeContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const routeFormPage = useSelector(
    (state: State) => state.expense.pages.routeFormPage
  );
  const generalFormValues = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );
  const expenseTypeList = useSelector(
    (state: State) => state.expense.entities.expenseTypeList.records
  );
  const hasMore = useSelector(
    (state: State) => state.expense.entities.expenseTypeList.hasMore
  );
  const accountingDate = useSelector((state: State) => {
    return state.expense.entities.report.scheduledDate;
  });
  const reportId = useSelector(
    (state: State) => state.expense.entities.report.reportId
  );
  const reportTypeId = useSelector(
    (state: State) => state.expense.entities.report.expReportTypeId
  );
  const employeeDetails = useSelector(
    (state: State) => state.common.exp.entities.employeeDetails
  );
  let subroleId = _.get(employeeDetails, 'selectedRole');
  subroleId = subroleId === 'primary' ? undefined : subroleId;

  const useJctRegistrationNumber = useSelector(
    (state: State) => state.userSetting.jctInvoiceManagement
  );

  const recordType =
    ownProps.recordType ||
    _.get(ownProps.history, 'location.state.recordType', '');

  const formValues =
    recordType === RECORD_TYPE.TransitJorudanJP
      ? routeFormPage
      : generalFormValues;

  useEffect(() => {
    const finalReportTypeId = reportTypeId;
    const formDate = accountingDate;

    const targetDate = formDate;
    if (ownProps.type === 'list') {
      const parentGroupId = ownProps.parentGroupId || null;
      dispatch(
        getExpenseTypeList(
          null,
          parentGroupId,
          targetDate,
          recordType,
          finalReportTypeId,
          true,
          subroleId
        )
      );
    } else {
      const keyword = ownProps.keyword || '';
      dispatch(
        searchExpenseType(
          companyId,
          decodeURIComponent(keyword),
          targetDate,
          recordType,
          finalReportTypeId,
          true
        )
      );
    }
  }, []);

  const onSearchClick = (keyword: string) => {
    if (keyword === null) {
      return;
    }
    let level = 2;
    if (ownProps.parentParentGroupId) {
      level = 4;
    } else if (ownProps.parentGroupId) {
      level = 3;
    }

    // Special handling of % because it could not be sanitized with react router.
    const sanitizedKeyword = encodeURIComponent(keyword.replace(/%/g, '%25'));
    const urlPath = `/request/expense-type/search/keyword=${sanitizedKeyword}/${level}`;
    const state = {
      target: _.get(ownProps.history, 'location.state.target'),
      recordType,
      recordId: _.get(ownProps.history, 'location.state.recordId'),
    };
    pushHistoryWithPrePage(ownProps.history, urlPath, state);
  };

  const onRowClick = async (expenseType: ExpenseType) => {
    const { history } = ownProps;
    const target = _.get(history, 'location.state.target');

    const isRowGroup = expenseType.isGroup;
    const isJorudanRecord =
      expenseType.recordType === RECORD_TYPE.TransitJorudanJP;
    const isMileageRec = isMileageRecord(expenseType.recordType);
    const recordId = _.get(history, 'location.state.recordId');

    const initValues = {
      recordDate: accountingDate,
      reportId,
      reportTypeId,
      items: [
        {
          expTypeId: expenseType.id,
          remarks: '',
          currencyId: '',
          taxTypeBaseId: '',
          taxTypeHistoryId: '',
          taxTypeName: '',
        },
      ],
    };
    // Records created through Add Record button in record list and report detail screen
    switch (true) {
      case isRowGroup:
        if (ownProps.recordType === RECORD_TYPE_CATEGORY.all) {
          // @ts-ignore
          dispatch(formValueAction.save(initValues));
        }

        pushHistoryWithPrePage(
          history,
          `${ownProps.history.location.pathname}/${expenseType.id}`,
          { target, recordId }
        );
        break;
      case isJorudanRecord:
        const routeForm = _.cloneDeep(formValues);

        routeForm.expenseType = expenseType.name;
        routeForm.expenseTypeId = expenseType.id;
        dispatch(routeFormPageActions.save(routeForm));

        if (recordId) {
          // existing report record
          history.push(`/request/report/route/edit/${recordId}/${reportId}`);
        } else {
          // new report record
          dispatch(
            // @ts-ignore
            formValueAction.save({
              ..._.cloneDeep(newRecord('', '', expenseType.recordType)),
              ...initValues,
            })
          );
          history.push(`/request/report/route/new`, { target });
        }

        break;
      default: // generate new record if change expense type
        // Initialize record with report header date or today when added through report detail or record list page
        const toForeignCurrency = expenseType.useForeignCurrency;
        const finalFormValues = {
          ...initValues,
          ..._.cloneDeep(formValues),
          ...(isMileageRec
            ? { mileageRouteInfo: { destinations: initialDestinations } }
            : {}),
        };

        if (isMileageRec) dispatch(mileageActions.setIsGeneratedPreview(false));

        const isExpTypeChanged =
          finalFormValues.items[0].expTypeId !== expenseType.id;
        let record = finalFormValues;

        if (isExpTypeChanged) {
          record = newRecord(
            expenseType.id,
            expenseType.name,
            expenseType.recordType,
            expenseType.useForeignCurrency,
            expenseType,
            true,
            expenseType.fileAttachment,
            expenseType.fixedForeignCurrencyId,
            expenseType.foreignCurrencyUsage,
            0,
            finalFormValues.recordDate,
            null,
            null,
            expenseType.merchant
          );
          record.items[0].remarks = finalFormValues.items[0].remarks;
          record.items[0].allowNegativeAmount = expenseType.allowNegativeAmount;

          if (finalFormValues.reportId) {
            record.reportId = finalFormValues.reportId;
          }

          if (toForeignCurrency) {
            // keep selected currency
            record.items[0].currencyId =
              expenseType.fixedForeignCurrencyId ||
              finalFormValues.items[0].currencyId;
          }
          record.recordId = finalFormValues.recordId;
          record.items[0].itemId = finalFormValues.items[0].itemId; // Temporary fix, change RecordItem for multiple items

          // set jct invoice option and clear jct registration number
          if (
            expenseType.jctRegistrationNumberUsage &&
            useJctRegistrationNumber
          ) {
            record.jctRegistrationNumberUsage =
              expenseType.jctRegistrationNumberUsage;
            if (isUseJctNo(expenseType.jctRegistrationNumberUsage)) {
              record.items[0].jctInvoiceOption = JCT_NUMBER_INVOICE.Invoice;
            }
          }

          // copy all previous extended item values on change of expense type
          Object.keys(finalFormValues.items[0]).forEach((x) => {
            if (
              x.includes('extendedItem') ||
              x.includes('costCenter') ||
              x.includes('job')
            ) {
              record.items[0][x] = finalFormValues.items[0][x];
            }
          });

          if (expenseType.fileAttachment !== RECEIPT_TYPE.NotUsed) {
            const { receiptList } = finalFormValues;
            record.receiptList = receiptList;
          }
        }

        if (!isExpTypeChanged) {
          // ocr detail manually input by user
          const amount = 0;

          const targetDate = finalFormValues.recordDate;

          record = newRecord(
            expenseType.id,
            expenseType.name,
            expenseType.recordType,
            expenseType.useForeignCurrency,
            expenseType,
            true,
            expenseType.fileAttachment,
            expenseType.fixedForeignCurrencyId,
            expenseType.foreignCurrencyUsage,
            amount,
            targetDate,
            undefined,
            undefined,
            expenseType.merchant
          );
          record = {
            ...record,
          };
          record.items[0] = {
            ...record.items[0],
            allowNegativeAmount: expenseType.allowNegativeAmount,
          };

          if (finalFormValues.reportId) {
            record.reportId = finalFormValues.reportId;
          }
          if (toForeignCurrency) {
            record.items[0].currencyId = expenseType.fixedForeignCurrencyId;
          }
        }

        if (
          expenseType.jctRegistrationNumberUsage &&
          useJctRegistrationNumber
        ) {
          record.jctRegistrationNumberUsage =
            expenseType.jctRegistrationNumberUsage;
          if (isUseJctNo(expenseType.jctRegistrationNumberUsage)) {
            record.items[0].jctInvoiceOption = JCT_NUMBER_INVOICE.Invoice;
          }
        }

        // get & set payment method option list for new record
        const paymentMethodOptionList = await dispatch(
          getPaymentMethodOptionList(record, isJorudanRecord)
        );
        record.paymentMethodId =
          _.get(paymentMethodOptionList, '0.value') || null;
        dispatch(formValueAction.save(record));
        // redirect
        if (record.recordId) {
          const url = formValues.reportId
            ? `/request/record/detail/${formValues.reportId}/${record.recordId}`
            : `/request/record/detail/${record.recordId}`;
          pushHistoryWithPrePage(ownProps.history, url, {
            isExpTypeChanged,
          });
        } else {
          const targetReport = 'report';
          const path = `/request/report/record/new/general`;
          pushHistoryWithPrePage(ownProps.history, path, {
            isExpTypeChanged,
            target: targetReport,
          });
        }

        break;
    }
  };

  const onBackClick = () => {
    goBack(ownProps.history);
  };

  return (
    <ExpTypeComponent
      keyword={ownProps.keyword}
      hasMore={hasMore}
      expenseTypeList={expenseTypeList}
      selectedCCTransaction={undefined}
      selectedOCRReceipt={undefined}
      onBackClick={onBackClick}
      onSearchClick={onSearchClick}
      onRowClick={onRowClick}
    />
  );
};

export default ExpenseTypeContainer;
