import React, { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector, useStore } from 'react-redux';

import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';
import { DIALOG_TYPE } from '@apps/commons/modules/approverEmployeeSearch/ui/dialog';
import DateUtil from '@apps/commons/utils/DateUtil';

import { WorkingType } from '@attendance/domain/models/WorkingType';

import { State } from '../../../modules';
import * as requestSelectors from '../../../modules/ui/legalAgreementRequest/selector';

import RequestActions from '@attendance/timesheet-pc/containers/dialogs/LegalAgreementRequestDialogContainer/actions';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import LegalAgreementRequestDialog from '../../../components/dialogs/LegalAgreementRequestDialog';

import FormForMonthlyContainer from './FormForMonthlyContainer';
import FormForYearlyContainer from './FormForYearlyContainer';
import subscriber from './subscriber';
import UseCases from '@attendance/timesheet-pc/UseCases';

const mapStateToProps = (state: State) => ({
  opened: state.ui.legalAgreementRequest.page.opened,
  pageLoading: state.ui.legalAgreementRequest.page.loading,
  globalLoading: !!state.common.app.loadingDepth,
  editing: state.ui.legalAgreementRequest.editing,
  targetRequest: requestSelectors.targetRequest(state.ui.legalAgreementRequest),
  requests: state.ui.legalAgreementRequest.list.requests,
  availableRequestTypes:
    state.ui.legalAgreementRequest.list.availableRequestTypes,
  ownerInfos: state.entities.timesheet.ownerInfos,
  attSummary: state.entities.timesheet.attSummary,
  attRecordList: state.entities.timesheet.attRecordList,
  workingTypes: state.entities.timesheet.workingTypes,
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  proxyEmployeeId: state.common.proxyEmployeeInfo.id,
  submitByEmployee:
    state.common.accessControl.permission
      ?.submitAttLegalAgreementRequestByEmployee,
  submitByDelegate:
    state.common.accessControl.permission
      ?.submitAttLegalAgreementRequestByDelegate,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const requestActions = RequestActions(dispatch);

    return {
      onClickRequestDetailButton: requestActions.showRequestDetailPane,
      onClickRequestEntryButton: requestActions.showEntryRequestPane,
      onStartEditing: requestActions.startEditing,
      onCancelEditing: requestActions.cancelEditing,
      onSubmitRequest: requestActions.submit,
      onDisableRequest: requestActions.disable,
      onClose: requestActions.closeRequest,
      onClickOpenApprovalHistoryDialog:
        requestActions.openApprovalHistoryDialog,
      onClickOpenApproverEmployeeSettingDialog:
        requestActions.openApproverEmployeeSettingDialog,
    };
  }, [dispatch]);
};

const Container: React.FC = () => {
  const store = useStore();
  const {
    pageLoading,
    globalLoading,
    editing,
    targetRequest,
    requests,
    availableRequestTypes,
    ownerInfos,
    attSummary,
    attRecordList,
    workingTypes,
    isProxyMode,
    proxyEmployeeId,
    submitByEmployee,
    submitByDelegate,
  } = useSelector(mapStateToProps, shallowEqual);

  const endDate = useMemo(() => ownerInfos?.at(-1)?.endDate, [ownerInfos]);

  const currentMonth = useMemo(() => DateUtil.formatYM(endDate), [endDate]);

  const summaryId = useMemo(() => attSummary?.id, [attSummary]);

  const isLocked = useMemo(() => attSummary?.isLocked, [attSummary]);

  const requestConditions = useMemo(() => {
    const $availableRequestTypes = availableRequestTypes
      ? Object.fromEntries(availableRequestTypes.map((item) => [item, item]))
      : null;
    return {
      isLocked: isLocked === undefined ? true : isLocked,
      availableRequestTypes: isProxyMode
        ? submitByDelegate
          ? $availableRequestTypes
          : null
        : submitByEmployee
        ? $availableRequestTypes
        : null,
      latestRequests: requests,
    };
  }, [
    availableRequestTypes,
    isLocked,
    isProxyMode,
    requests,
    submitByDelegate,
    submitByEmployee,
  ]);

  const attRecord = useMemo(
    () =>
      endDate && attRecordList
        ? attRecordList.find((attRecord) => attRecord.recordDate === endDate)
        : null,
    [attRecordList, endDate]
  );

  const approverEmployee = useMemo(() => {
    if (!editing.isEditing && editing.id && targetRequest) {
      return {
        id: '',
        employeeName: targetRequest.approver01Name,
      };
    } else if (attRecord) {
      return {
        id: '',
        employeeName: attRecord.approver01Name,
      };
    } else {
      return null;
    }
  }, [attRecord, editing, targetRequest]);

  const canEditApproverEmployee = useMemo(() => {
    const workingType = RecordsUtil.getWithinRange(
      endDate,
      workingTypes as WorkingType[]
    );
    return (
      workingType &&
      workingType.allowToChangeApproverSelf &&
      !isProxyMode &&
      editing.isEditing
    );
  }, [editing.isEditing, endDate, isProxyMode, workingTypes]);

  const dispatchProps = useMapDispatchToProps();

  const onStartEditing = () => {
    dispatchProps.onStartEditing(targetRequest);
  };

  const onCancelEditing = () => {
    const { id } = editing;
    const requestMap = Object.fromEntries(
      requests.map((item) => [item.id, item])
    );

    if (!id || !requestMap[id]) {
      return;
    }

    dispatchProps.onCancelEditing(requestMap[id]);
  };

  const onSubmitRequest = async () => {
    await dispatchProps.onSubmitRequest(
      { ...targetRequest, summaryId },
      editing.editAction
    );
    dispatchProps.onClose();
  };

  const onDisableRequest = () => {
    dispatchProps.onDisableRequest(editing.disableAction, editing.id);
  };

  const onClickOpenApprovalHistoryDialog = () => {
    dispatchProps.onClickOpenApprovalHistoryDialog(editing.id);
  };

  const onClickOpenApproverEmployeeSettingDialog = () => {
    dispatchProps.onClickOpenApproverEmployeeSettingDialog(
      approverEmployee,
      endDate,
      !canEditApproverEmployee,
      DIALOG_TYPE.LegalAgreementRequest
    );
  };

  // 画面初期化時に実行される
  useEffect(() => {
    UseCases().fetchOvertimeLegalAgreement({
      employeeId: proxyEmployeeId || null,
      targetDate: endDate,
    });
    return subscriber(store);
  }, []);

  // 36協定申請一覧が取得された後、初回ダイアログ表示時に実行される
  useEffect(() => {
    if (!pageLoading) {
      const selectedRequest = requests?.find(
        (item) => item?.id === editing?.id
      );
      const currentRequestType = selectedRequest || (requests && requests[0]);
      currentRequestType &&
        dispatchProps.onClickRequestDetailButton(currentRequestType);
    }
  }, [pageLoading]);

  return (
    <LegalAgreementRequestDialog
      pageLoading={pageLoading}
      currentMonth={currentMonth}
      editing={editing}
      requestConditions={requestConditions}
      targetRequest={targetRequest}
      globalLoading={globalLoading}
      approverEmployee={approverEmployee}
      onClickRequestDetailButton={dispatchProps.onClickRequestDetailButton}
      onClickRequestEntryButton={dispatchProps.onClickRequestEntryButton}
      onClose={dispatchProps.onClose}
      onStartEditing={onStartEditing}
      onCancelEditing={onCancelEditing}
      onSubmitRequest={onSubmitRequest}
      onDisableRequest={onDisableRequest}
      onClickOpenApprovalHistoryDialog={onClickOpenApprovalHistoryDialog}
      onClickOpenApproverEmployeeSettingDialog={
        onClickOpenApproverEmployeeSettingDialog
      }
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

const LegalAgreementRequestDialogContainer: React.FC = () => {
  const opened = useSelector(
    (state: State) => state.ui.legalAgreementRequest.page.opened
  );

  if (!opened) {
    return null;
  }

  return <Container />;
};

export default LegalAgreementRequestDialogContainer;
