import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { cloneDeep, get } from 'lodash';

import { goBack } from '@mobile/concerns/routingHistory';

import msg from '@commons/languages';
import LookupList from '@mobile/components/pages/expense/commons/LookupList';

import {
  DEFAULT_LIMIT_NUMBER,
  getJctRegistrationNumber,
  Vendor,
} from '@apps/domain/models/exp/Vendor';

import { State } from '../../../modules';
import { actions as formValueReportAction } from '../../../modules/expense/ui/report/formValues';
import { actions as formValueRecordAction } from '@mobile/modules/expense/ui/general/formValues';

import {
  getRecentVendor,
  searchVendor,
} from '../../../action-dispatchers/expense/Vendor';

export const BACK_TYPE = {
  RECORD_VENDOR: 'record_vendor',
  RECORD_MERCHANT: 'record_merchant',
} as const;

type OwnProps = RouteComponentProps & {
  reportId?: string;
  backType?: string;
};

const VendorContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const formValuesReport = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );

  const formValuesRecord = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );

  const userSetting = useSelector((state: State) => state.userSetting);

  const vendorList = useSelector(
    (state: State) => state.expense.entities.vendorList
  );
  const selectedExpType = useSelector(
    (state: State) => state.expense.ui.selectedExpType
  );

  const shouldUpdateJctRegistrationNumber = get(
    selectedExpType,
    'displayJctNumberInput',
    false
  );

  const useJctRegistrationNumber = userSetting.jctInvoiceManagement;

  const vendorOptions = useMemo(
    () =>
      vendorList
        .slice(0, DEFAULT_LIMIT_NUMBER)
        .map(
          ({
            id,
            code,
            name,
            paymentDueDateUsage,
            jctRegistrationNumber,
            isJctQualifiedInvoiceIssuer,
          }) => ({
            id,
            code,
            name,
            paymentDueDateUsage,
            jctRegistrationNumber,
            isJctQualifiedInvoiceIssuer,
            extraRow: useJctRegistrationNumber
              ? `${
                  msg().Exp_Clbl_JctRegistrationNumber
                }: ${getJctRegistrationNumber(
                  jctRegistrationNumber,
                  isJctQualifiedInvoiceIssuer
                )}`
              : null,
          })
        ),
    [vendorList, useJctRegistrationNumber]
  );

  const hasMore = useMemo(
    () => vendorList.length > DEFAULT_LIMIT_NUMBER,
    [vendorList.length]
  );

  useEffect(() => {
    dispatch(getRecentVendor(userSetting.employeeId, userSetting.companyId));
  }, []);

  const onClickBack = () => {
    goBack(ownProps.history);
  };

  const onClickSearchButton = (keyword: string) => {
    dispatch(searchVendor(userSetting.companyId, keyword));
  };

  const onClickRow = useCallback(
    (selectedVendor: Vendor) => {
      const { reportId, backType } = ownProps;
      const isFromRecord =
        backType === BACK_TYPE.RECORD_VENDOR ||
        backType === BACK_TYPE.RECORD_MERCHANT;
      const formValues = isFromRecord ? formValuesRecord : formValuesReport;
      const newFormValues = cloneDeep(formValues);
      if (backType && backType !== 'null') {
        if (backType === BACK_TYPE.RECORD_MERCHANT) {
          newFormValues.items[0].merchant = selectedVendor.name;
        }
        if (backType === BACK_TYPE.RECORD_VENDOR) {
          newFormValues.items[0].vendorName = selectedVendor.name;
          newFormValues.items[0].vendorId = selectedVendor.id;
          newFormValues.items[0].vendorCode = selectedVendor.code;
          newFormValues.items[0].paymentDueDate = null;
          newFormValues.items[0].paymentDueDateUsage =
            selectedVendor.paymentDueDateUsage;
          if (useJctRegistrationNumber) {
            if (
              selectedVendor.jctRegistrationNumber &&
              shouldUpdateJctRegistrationNumber
            ) {
              newFormValues.items[0].jctRegistrationNumber =
                selectedVendor.jctRegistrationNumber;
            }
            newFormValues.items[0].vendorJctRegistrationNumber =
              selectedVendor.jctRegistrationNumber;
            newFormValues.items[0].vendorIsJctQualifiedIssuer =
              selectedVendor.isJctQualifiedInvoiceIssuer;
          }
        }
        dispatch(formValueRecordAction.save(newFormValues));
      } else {
        newFormValues.vendorName = selectedVendor.name;
        newFormValues.vendorId = selectedVendor.id;
        newFormValues.vendorCode = selectedVendor.code;
        newFormValues.paymentDueDate = null;
        newFormValues.paymentDueDateUsage = selectedVendor.paymentDueDateUsage;
        if (useJctRegistrationNumber) {
          newFormValues.vendorJctRegistrationNumber =
            selectedVendor.jctRegistrationNumber;
          newFormValues.vendorIsJctQualifiedIssuer =
            selectedVendor.isJctQualifiedInvoiceIssuer;
        }
        dispatch(formValueReportAction.save(newFormValues));
      }

      // redirect
      let url;
      const recordId = formValuesRecord.recordId;
      if (isFromRecord) {
        url = `/expense/record/detail/${reportId}/${recordId}`;
        if (!recordId) {
          url = '/expense/report/record/new/general';
        }
      } else if (reportId && reportId !== 'null' && backType === 'null') {
        url = `/expense/report/edit/${ownProps.reportId}`;
      } else {
        url = '/expense/report/new';
      }
      ownProps.history.push(url, {
        target: get(ownProps.history, 'location.state.target'),
      });
    },
    [
      useJctRegistrationNumber,
      ownProps.reportId,
      ownProps.backType,
      ownProps.history,
      formValuesRecord,
      formValuesReport,
      dispatch,
    ]
  );

  return (
    <LookupList
      title={msg().Exp_Clbl_Vendor}
      data={{ records: vendorOptions, hasMore }}
      onClickBack={onClickBack}
      onClickSearchButton={onClickSearchButton}
      onClickRow={onClickRow}
    />
  );
};

export default VendorContainer;
