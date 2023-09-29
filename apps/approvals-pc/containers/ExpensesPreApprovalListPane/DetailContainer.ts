import React from 'react';
import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { actions as commentActions } from '../../modules/ui/expenses/detail/comment';
import { actions as openNowListActions } from '../../modules/ui/expenses/detail/recordsArea/openNowList';
import { actions as selectedRecordActions } from '../../modules/ui/expenses/detail/recordsArea/selectedRecord';
import { actions as sideFileActions } from '../../modules/ui/expenses/detail/sideFilePreview';

import {
  approvalForPreApproval,
  approveSingle,
  openRecordItemsConfirmDialog,
  rejectForPreApproval,
  rejectSingle,
  searchVendorDetail,
} from '../../action-dispatchers/Expenses';

import Detail from '../../components/ExpensesPreApprovalListPane/Detail/index';

import RecordItemsDialogContainer from '../ExpensesCommon/RecordItemsDialogContainer';

export const RecordItemsDialog = () =>
  React.createElement(RecordItemsDialogContainer, { isPreApproval: true });

const mapStateToProps = (state) => {
  const companyCountOption = state.ui.companyRequestCount.countOptions;

  const selectedCompanyId =
    state.ui.companyRequestCount.selectedComId || state.userSetting.companyId;
  const selectedComIndex = companyCountOption.findIndex(
    ({ value }) => value === selectedCompanyId
  );
  const {
    currencyCode,
    currencySymbol,
    currencyDecimal,
    jctInvoiceManagement,
  }: any = selectedComIndex > -1 ? companyCountOption[selectedComIndex] : {};
  const companyJCTSetting = isNil(jctInvoiceManagement)
    ? state.userSetting.jctInvoiceManagement
    : jctInvoiceManagement;

  return {
    selectedCompanyId,
    baseCurrencyCode: currencyCode || state.userSetting.currencyCode,
    baseCurrencySymbol: currencySymbol || state.userSetting.currencySymbol,
    baseCurrencyDecimal:
      currencyDecimal || state.userSetting.currencyDecimalPlaces,
    useImageQualityCheck: state.userSetting.useImageQualityCheck,
    expRequest: state.entities.exp.request.preRequest.expRequest,
    fileMetadata: state.exp.entities.fileMetadata,
    userPhotoUrl: state.userSetting.photoUrl,
    comment: state.ui.expenses.detail.comment,
    openNowList: state.ui.expenses.detail.recordsArea.openNowList,
    expTaxTypeList: state.common.expTaxTypeList.list,
    requestList: state.entities.exp.request.preRequest.expRequestList,
    pageNum: state.ui.expenses.list.page,
    expIdsInfo: state.entities.exp.request.preRequest.expIdsInfo,
    proxyEmployeeId: state.common.proxyEmployeeInfo.id,
    userSetting: state.userSetting,
    isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
    isApexView: state.ui.isApexView,
    showLoading: state.common.app.loadingDepth > 0,
    isShowSidePanel: !isEmpty(state.ui.expenses.detail.sideFilePreview),
    jctInvoiceManagement: companyJCTSetting,
  };
};

const mapDispatchToProps = {
  approveSingle,
  rejectSingle,
  onChangeComment: commentActions.set,
  openNowListInitialize: (toggleList: { [key: string]: boolean }) =>
    openNowListActions.initialize(toggleList),
  onClickRecordOpenButton: (item: { [key: string]: boolean }) =>
    openNowListActions.set(item),
  openNowListSet: (item: { [key: string]: boolean }) =>
    openNowListActions.set(item),
  approvalForPreApproval,
  rejectForPreApproval,
  searchVendorDetail,
  openRecordItemsConfirmDialog,
  setSelectedRecord: (recordIdx) => selectedRecordActions.set(recordIdx),
  setSideFile: sideFileActions.set,
  hideSideFile: sideFileActions.clear,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  RecordItemsDialog,
  onClickApproveButton: () => {
    const { proxyEmployeeId, isProxyMode, userSetting } = stateProps;
    const empId = isProxyMode ? proxyEmployeeId : userSetting.employeeId;
    if (stateProps.isApexView) {
      // Detail screen opened from email link
      dispatchProps.approveSingle(
        [stateProps.expRequest.requestId],
        stateProps.comment,
        true,
        empId
      );
    } else {
      dispatchProps.approvalForPreApproval(
        [stateProps.expRequest.requestId],
        stateProps.comment,
        stateProps.expIdsInfo.requestIdList,
        stateProps.pageNum,
        stateProps.requestList,
        empId,
        stateProps.selectedCompanyId
      );
    }
  },
  onClickRejectButton: () => {
    const { proxyEmployeeId, isProxyMode, userSetting } = stateProps;
    const empId = isProxyMode ? proxyEmployeeId : userSetting.employeeId;
    if (stateProps.isApexView) {
      // Detail screen opened from email link
      dispatchProps.rejectSingle(
        [stateProps.expRequest.requestId],
        stateProps.comment,
        true,
        empId
      );
    } else {
      dispatchProps.rejectForPreApproval(
        [stateProps.expRequest.requestId],
        stateProps.comment,
        stateProps.expIdsInfo.requestIdList,
        stateProps.pageNum,
        stateProps.requestList,
        empId,
        stateProps.selectedCompanyId
      );
    }
  },
  openNowListInitialize: () => {
    const openNowList = stateProps.expRequest.records.reduce((ret, record) => {
      ret[record.recordId] = false;
      return ret;
    }, {});
    dispatchProps.openNowListInitialize(openNowList);
  },
  onClickAllOpenRecordButton: () => {
    const openNowList = stateProps.expRequest.records.reduce((ret, record) => {
      ret[record.recordId] = true;
      return ret;
    }, {});
    dispatchProps.openNowListInitialize(openNowList);
  },
  onClickAllCloseRecordButton: () => {
    const openNowList = stateProps.expRequest.records.reduce((ret, record) => {
      ret[record.recordId] = false;
      return ret;
    }, {});
    dispatchProps.openNowListInitialize(openNowList);
  },
  onClickRecordOpenButton: (recordId: string) =>
    dispatchProps.openNowListSet({
      [recordId]: !stateProps.openNowList[recordId],
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Detail) as React.ComponentType<Record<string, any>>;
