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

import {
  getRecentVendor,
  searchVendor,
} from '../../../action-dispatchers/expense/Vendor';

type OwnProps = RouteComponentProps & {
  reportId?: string;
};

const VendorContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const formValuesReport = useSelector(
    (state: State) => state.expense.ui.report.formValues
  );

  const userSetting = useSelector((state: State) => state.userSetting);

  const vendorList = useSelector(
    (state: State) => state.expense.entities.vendorList
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
    dispatch(getRecentVendor(userSetting.employeeId));
  }, []);

  const onClickBack = () => {
    goBack(ownProps.history);
  };

  const onClickSearchButton = (keyword: string) => {
    dispatch(searchVendor(userSetting.companyId, keyword));
  };

  const onClickRow = useCallback(
    (selectedVendor: Vendor) => {
      const newFormValues = cloneDeep(formValuesReport);
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

      // redirect
      let url;
      const reportId = ownProps.reportId;
      if (reportId && reportId !== 'null') {
        url = `/expense/report/edit/${ownProps.reportId}`;
      } else {
        url = '/expense/report/new';
      }
      ownProps.history.push(url, {
        target: get(ownProps.history, 'location.state.target'),
      });
    },
    [formValuesReport, ownProps.reportId, dispatch, ownProps.history]
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
