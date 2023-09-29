import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';

import { pushHistoryWithPrePage } from '@mobile/concerns/routingHistory';

import msg from '@commons/languages';
import { showToast } from '@commons/modules/toast';

import STATUS from '@apps/domain/models/approval/request/Status';
import {
  RECORD_TYPE,
  RECORD_TYPE_CATEGORY,
} from '@apps/domain/models/exp/Record';

import { State } from '@mobile/modules';
import { selectors } from '@mobile/modules/expense/entities/report';
import { getAPOptionList } from '@mobile/modules/expense/selector';
import { actions as recordUpdateInfoActions } from '@mobile/modules/expense/ui/record/recordUpdatedInfo';
import { status } from '@mobile/modules/selector';

import {
  clear,
  clone,
  fetch,
  getApprovalHistory,
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
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const approvalHistory = useSelector(
    (state: State) => state.expense.entities.approvalHistory
  );
  const selectedReportType = useSelector(
    (state: State) => state.expense.entities.selectedReportType
  );
  const recordUpdateInfo = useSelector(
    (state: State) => state.expense.ui.record.recordUpdatedInfo
  );

  const userSetting = useSelector((state: State) => state.userSetting);
  const {
    employeeId,
    currencySymbol,
    currencyDecimalPlaces,
    jctInvoiceManagement,
  } = userSetting;

  const report = useSelector((state: State) => state.expense.entities.report);
  const {
    subject,
    accountingPeriodId,
    customRequestName,
    customRequestId,
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
    scheduledDate,
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
    const isCancelEdit =
      get(ownProps.location, 'state.action') === LOCATION_STATE.CANCEL_EDIT;
    const isApprovedPreRequest =
      get(ownProps.location, 'state.status') === STATUS.ApprovedPreRequest;
    if (!isCancelEdit) {
      dispatch(fetch(ownProps.reportId, isApprovedPreRequest, true));
      const finalRequestId = requestId || ownProps.paramRequestId;
      if (finalRequestId && finalRequestId !== 'null') {
        dispatch(getApprovalHistory(finalRequestId));
      }
    }
  }, []);

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
    const path = `/request/expense-type/list/${RECORD_TYPE_CATEGORY.all}`;
    pushHistoryWithPrePage(history, path, {
      target: 'report',
    });
  };

  const onClickVendorDetail = () => {
    pushHistoryWithPrePage(
      ownProps.history,
      `/request/vendor/detail/${vendorId}`
    );
  };

  const onClickRecord = (recordId: string, recordType: string) => {
    if (recordType === RECORD_TYPE.TransitJorudanJP) {
      // push to jorudan item container
      ownProps.history.push(
        `/request/record/jorudan-detail/${recordId}/${reportId}`,
        { isApprovedPreRequest }
      );
    } else {
      // push to normal item container
      const path = `/request/record/detail/${ownProps.reportId}/${recordId}`;
      pushHistoryWithPrePage(ownProps.history, path, {
        isExpTypeChanged: true,
        isApprovedPreRequest,
      });
    }
  };

  const onClickRecall = () => {
    if (report.status === STATUS.Pending)
      ownProps.history.replace(`/request/report/recall`);
  };

  const onClickSubmit = () => {
    ownProps.history.replace(`/request/report/submit`);
  };

  const onClickReportList = () => {
    dispatch(clear());
    ownProps.history.push(`/request/report/list`);
  };

  const onClickDelete = () => {
    dispatch(remove(ownProps.reportId, true))
      // @ts-ignore
      .then(() => {
        ownProps.history.replace(`/request/report/list`);
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
    ownProps.history.replace(`/request/report/edit/${ownProps.reportId}`);
  };

  const onClickCreateReportFromRequest = () => {};

  const onClickClone = () => {
    dispatch(clone(ownProps.reportId, employeeId, true))
      // @ts-ignore
      .then(([{ reportId }]) => {
        dispatch(fetch(reportId, false, true))
          // @ts-ignore
          .then(() => {
            ownProps.history.replace(`/request/report/edit/${reportId}`);
            dispatch(showToast(`${msg().Exp_Msg_CloneReport}`));
          });
      });
  };

  const openPrintPage = () => {};

  const openReceiptLibrary = () => {
    const path = '/request/receipt-library/list/ocr';
    pushHistoryWithPrePage(ownProps.history, path);
  };

  const Actions = bindActionCreators(
    {
      clearRecordUpdateInfo: recordUpdateInfoActions.reset,
    },
    dispatch
  );

  return (
    <Component
      report={report}
      reportId={reportId}
      requestId={requestId}
      reportNo={''}
      subject={subject}
      status={reportStatus}
      accountingPeriodId={accountingPeriodId}
      accountingDate={scheduledDate}
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
      onClickSearchExpType={onClickSearchExpType}
      onClickCreateICRecord={() => {}}
      onClickCreateCCRecord={() => {}}
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
      isRequest
      onClickVendorDetail={onClickVendorDetail}
      useJctRegistrationNumber={jctInvoiceManagement}
    />
  );
};

export default ReportDetailContainer;
