import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';
import isNull from 'lodash/isNull';

import { pushHistoryWithPrePage } from '@mobile/concerns/routingHistory';

import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';

import STATUS from '@apps/domain/models/approval/request/Status';
import { isShowICCCOptionInDropdown } from '@apps/domain/models/exp/PaymentMethod';
import { getFilePreviewMB } from '@apps/domain/models/exp/Receipt';
import {
  RECORD_TYPE,
  RECORD_TYPE_CATEGORY,
} from '@apps/domain/models/exp/Record';

import { actions as selectedIcCardActions } from '../../../modules/expense/ui/icCard/selectedCard';
import { State } from '@mobile/modules';
import { actions as paymentMethodActions } from '@mobile/modules/expense/entities/paymentMethodList';
import { selectors } from '@mobile/modules/expense/entities/report';
import { getAPOptionList } from '@mobile/modules/expense/selector';
import { actions as recordUpdateInfoActions } from '@mobile/modules/expense/ui/record/recordUpdatedInfo';
import { actions as cardNameActions } from '@mobile/modules/expense/ui/transactionAdvSearch/cardName';
import { actions as detailActions } from '@mobile/modules/expense/ui/transactionAdvSearch/detail';
import { actions as requestDateActions } from '@mobile/modules/expense/ui/transactionAdvSearch/requestDateRange';
import { actions as statusActions } from '@mobile/modules/expense/ui/transactionAdvSearch/statusList';
import { status } from '@mobile/modules/selector';

import { getICCardList } from '../../../action-dispatchers/expense/ICCard';
import { getAccountingPeriodList } from '@mobile/action-dispatchers/expense/AccountingPeriod';
import { getSelectedExpReportType } from '@mobile/action-dispatchers/expense/ExpReportType';
import {
  claimReportFromRequest,
  clear,
  clone,
  fetch,
  generatePdfForPrint,
  getApprovalHistory,
  preProcess,
  remove,
} from '@mobile/action-dispatchers/expense/ReportDetail';

import Component from '@mobile/components/pages/expense/Report/Detail';

import { LOCATION_STATE } from '@mobile/routes/expenseRoute';

const getStatus = (history, entitiesStatus) => {
  const paramStatus = get(history, 'location.state.status');
  return paramStatus || entitiesStatus;
};

type OwnProps = RouteComponentProps & {
  type: string;
  reportId: string;
  paramRequestId?: string;
};

const ReportDetailContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const approvalHistory = useSelector(
    (state: State) => state.expense.entities.approvalHistory
  );
  const selectedReportType = useSelector(
    (state: State) => state.expense.entities.selectedReportType
  );
  const recordUpdateInfo = useSelector(
    (state: State) => state.expense.ui.record.recordUpdatedInfo
  );
  const paymentMethodList = useSelector(
    (state: State) => state.expense.entities.paymentMethodList
  );

  const userSetting = useSelector((state: State) => state.userSetting);
  const {
    companyId,
    employeeId,
    currencySymbol,
    currencyDecimalPlaces,
    jctInvoiceManagement,
  } = userSetting;

  const report = useSelector((state: State) => state.expense.entities.report);
  const {
    expReportTypeId,
    reportNo,
    subject,
    accountingPeriodId,
    customRequestName,
    customRequestId,
    accountingDate,
    reportId,
    requestId,
    expReportTypeName,
    costCenterCode,
    costCenterName,
    jobCode,
    jobName,
    vendorCode,
    vendorName,
    vendorId,
    vendorJctRegistrationNumber,
    paymentDueDate,
    purpose,
    remarks,
    useFileAttachment,
    attachedFileList,
    records,
    preRequest,
    empHistoryId,
    preRequestId,
  } = report;

  const extendedItemTexts = selectors.extendedItemTexts(report);
  const extendedItemPicklists = selectors.extendedItemPicklists(report);
  const extendedItemLookup = selectors.extendedItemLookup(report);
  const extendedItemDate = selectors.extendedItemDate(report);
  const totalAmountOfRecords = selectors.totalAmount(report);
  const isApprovedPreRequest =
    !!get(report, 'preRequest.reportId') && !reportId;

  const accountingPeriodList = useSelector((state: State) =>
    getAPOptionList(state.expense)
  );

  const isEditable = [
    STATUS.NotRequested,
    STATUS.Canceled,
    STATUS.Recalled,
    STATUS.Rejected,
  ].includes(report.status);

  const reportStatus = status(getStatus(ownProps.history, report.status));

  useEffect(() => {
    if (isNull(accountingPeriodList)) {
      dispatch(getAccountingPeriodList(companyId));
    }
    const isCancelEdit =
      get(ownProps.location, 'state.action') === LOCATION_STATE.CANCEL_EDIT;
    const isApprovedPreRequest =
      get(ownProps.location, 'state.status') === STATUS.ApprovedPreRequest;
    if (!isCancelEdit) {
      dispatch(fetch(ownProps.reportId, isApprovedPreRequest));
      const finalRequestId = requestId || ownProps.paramRequestId;
      if (finalRequestId && finalRequestId !== 'null') {
        dispatch(getApprovalHistory(finalRequestId));
      }
    }
  }, []);

  useEffect(() => {
    dispatch(getSelectedExpReportType(companyId, expReportTypeId))
      // @ts-ignore
      .then((expReportType: ExpenseReportType) => {
        const paymentMethodIds = get(expReportType, '0.paymentMethodIds');
        if (paymentMethodIds)
          dispatch(
            paymentMethodActions.search(paymentMethodIds, companyId, true)
          );
      });
  }, [dispatch, companyId, expReportTypeId]);

  const onClickSearchExpType = () => {
    const { history } = ownProps;
    history.replace({
      ...history.location,
      state: {
        isExpTypeChanged: false,
        type: ownProps.type,
        target: get(ownProps, 'location.state.target'),
      },
    });
    const path = `/expense/expense-type/list/${RECORD_TYPE_CATEGORY.all}`;
    pushHistoryWithPrePage(history, path, {
      target: 'report',
    });
  };

  const onClickVendorDetail = () => {
    pushHistoryWithPrePage(
      ownProps.history,
      `/expense/vendor/detail/${vendorId}`
    );
  };

  const onClickRecord = (recordId: string, recordType: string) => {
    if (recordType === RECORD_TYPE.TransitJorudanJP) {
      // push to jorudan item container
      ownProps.history.push(
        `/expense/record/jorudan-detail/${recordId}/${reportId}`,
        { isApprovedPreRequest }
      );
    } else {
      // push to normal item container
      const path = `/expense/record/detail/${ownProps.reportId}/${recordId}`;
      pushHistoryWithPrePage(ownProps.history, path, {
        isExpTypeChanged: true,
        isApprovedPreRequest,
      });
    }
  };

  const onClickCreateICRecord = () => {
    const { salesId, customerId, companyId, employeeCode } = userSetting;
    dispatch(cardNameActions.clear());
    dispatch(detailActions.clear());
    dispatch(requestDateActions.clear());
    dispatch(statusActions.clear());

    dispatch(getICCardList(salesId, customerId, companyId, employeeCode))
      // @ts-ignore
      .then((res) => {
        const cards = (res && res[0]) || [];
        dispatch(selectedIcCardActions.set(cards.map(({ cardNo }) => cardNo)));
        dispatch(cardNameActions.set(cards.map(({ cardNo }) => cardNo)));
        pushHistoryWithPrePage(
          ownProps.history,
          '/expense/ic-card/transactions'
        );
      });
  };

  const onClickCreateCCRecord = () => {
    const path = `/expense/credit-card/transactions/${ownProps.reportId}`;
    dispatch(cardNameActions.clear());
    dispatch(detailActions.clear());
    dispatch(requestDateActions.clear());
    dispatch(statusActions.clear());
    pushHistoryWithPrePage(ownProps.history, path);
  };

  const onClickRecall = () => {
    if (report.status === STATUS.Pending)
      ownProps.history.replace(`/expense/report/recall`);
  };

  const onClickSubmit = async () => {
    const preProcessResponse = await Actions.preProcess(ownProps.reportId);
    const result = get(preProcessResponse, '0');
    if (result) {
      const message = get(result, 'message');
      dispatch(showToast(message));
    } else ownProps.history.replace(`/expense/report/submit`);
  };

  const onClickReportList = () => {
    dispatch(clear());
    ownProps.history.push(`/expense/report/list`);
  };

  const onClickDelete = () => {
    dispatch(remove(ownProps.reportId))
      // @ts-ignore
      .then(() => {
        dispatch(clear());
        ownProps.history.replace(`/expense/report/list`);
      })
      .catch((err) => {
        const errMsg =
          (err.message && ` (${err.message})`) ||
          (err.event && ` (${err.event.message})`) ||
          '';
        dispatch(showToast(`${msg().Exp_Lbl_ReportDeleteFailed}${errMsg}`));
      });
  };

  const onClickEdit = () => {
    ownProps.history.replace(`/expense/report/edit/${ownProps.reportId}`);
  };

  const onClickCreateReportFromRequest = (preRequestId: string) => {
    dispatch(
      claimReportFromRequest(preRequestId, employeeId, accountingPeriodList)
    )
      // @ts-ignore
      .then((reportId: string) =>
        ownProps.history.replace(`/expense/report/edit/${reportId}`)
      );
  };

  const onClickClone = () => {
    const isRequestRequired = selectedReportType.requestRequired;
    const reportId = isRequestRequired ? preRequestId : ownProps.reportId;
    const prefixPath = isRequestRequired ? '/request' : '/expense';
    dispatch(clone(reportId, employeeId, isRequestRequired))
      // @ts-ignore
      .then(([{ reportId }]) => {
        dispatch(fetch(reportId, false, isRequestRequired))
          // @ts-ignore
          .then(() => {
            ownProps.history.replace(`${prefixPath}/report/edit/${reportId}`);
            dispatch(showToast(`${msg().Exp_Msg_CloneReport}`));
          });
      });
  };

  const openPrintPage = () => {
    const endDate = '2101-01-01';
    const isRequest = false;
    dispatch(
      generatePdfForPrint(
        employeeId,
        ownProps.reportId,
        expReportTypeId,
        endDate,
        isRequest,
        empHistoryId
      )
    )
      // @ts-ignore
      .then((res: Array<{ fileId: string }>) => {
        const fileId = res[0].fileId;
        const url = getFilePreviewMB(fileId);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'ExpenseReportPrintV2');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  };

  const openReceiptLibrary = () => {
    const path = '/expense/receipt-library/list/ocr';
    pushHistoryWithPrePage(ownProps.history, path);
  };

  const Actions = bindActionCreators(
    {
      clearRecordUpdateInfo: recordUpdateInfoActions.reset,
      preProcess,
    },
    dispatch
  );

  const { isShowCCOption = false, isShowICOption = false } =
    isShowICCCOptionInDropdown(paymentMethodList, selectedReportType);

  return (
    <Component
      report={report}
      reportId={reportId}
      requestId={requestId}
      reportNo={reportNo}
      subject={subject}
      status={reportStatus}
      accountingPeriodId={accountingPeriodId}
      accountingDate={accountingDate}
      useFileAttachment={useFileAttachment}
      attachedFileList={attachedFileList}
      customRequestId={customRequestId}
      customRequestName={customRequestName}
      reportTypeName={expReportTypeName}
      costCenterCode={costCenterCode}
      costCenterName={costCenterName}
      jobCode={jobCode}
      jobName={jobName}
      vendorCode={vendorCode}
      vendorName={vendorName}
      vendorJctRegistrationNumber={vendorJctRegistrationNumber}
      paymentDueDate={paymentDueDate}
      remarks={remarks}
      purpose={purpose}
      extendedItemTexts={extendedItemTexts}
      extendedItemPicklists={extendedItemPicklists}
      extendedItemLookup={extendedItemLookup}
      extendedItemDate={extendedItemDate}
      totalAmountOfRecords={totalAmountOfRecords}
      records={records}
      currencySymbol={currencySymbol}
      currencyDecimalPlaces={currencyDecimalPlaces}
      isEditable={isEditable}
      preRequest={preRequest}
      userSetting={userSetting}
      isApprovedPreRequest={isApprovedPreRequest}
      accountingPeriodList={accountingPeriodList}
      approvalHistory={approvalHistory}
      recordUpdateInfo={recordUpdateInfo}
      selectedReportType={selectedReportType}
      isShowCCOption={isShowCCOption}
      isShowICOption={isShowICOption}
      onClickSearchExpType={onClickSearchExpType}
      onClickCreateICRecord={onClickCreateICRecord}
      onClickCreateCCRecord={onClickCreateCCRecord}
      clearRecordUpdateInfo={Actions.clearRecordUpdateInfo}
      // Navigation
      onClickRecord={onClickRecord}
      onClickRecall={onClickRecall}
      openPrintPage={openPrintPage}
      onClickSubmit={onClickSubmit}
      onClickReportList={onClickReportList}
      onClickDelete={onClickDelete}
      onClickEdit={onClickEdit}
      onClickCreateReportFromRequest={onClickCreateReportFromRequest}
      onClickClone={onClickClone}
      openReceiptLibrary={openReceiptLibrary}
      onClickVendorDetail={onClickVendorDetail}
      useJctRegistrationNumber={jctInvoiceManagement}
    />
  );
};

export default ReportDetailContainer;
