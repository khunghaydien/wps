import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import isNil from 'lodash/isNil';

import DailyRequestConditions from '../models/DailyRequestConditions';

import { State } from '../modules';
import * as entitiesSelectors from '../modules/selectors';
import { actions as approvalHistoryActions } from '../modules/ui/approvalHistory';
import { actions as stampWidgetActions } from '../modules/ui/stampWidget';

import * as AppActions from '../action-dispatchers/App';
import * as DailyAttentionsActions from '../action-dispatchers/DailyAttentions';
import * as DailyAttTime from '../action-dispatchers/DailyAttTime';
import * as DailyRemarksActions from '../action-dispatchers/DailyRemarks';
import * as DailyRequest from '../action-dispatchers/DailyRequest';
import * as FixSummaryRequestActions from '../action-dispatchers/FixSummaryRequest';
import * as ManageCommuteCount from '../action-dispatchers/ManageCommuteCount';
import * as TimesheetActions from '../action-dispatchers/Timesheet';

import MainContent from '../components/MainContent';

type OwnProps = Record<string, unknown>;

const mapStateToProps = (state: State) => ({
  language: state.common.userSetting.language,
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  proxyEmployeeId: state.common.proxyEmployeeInfo.id,
  selectedPeriodStartDate: state.client.selectedPeriodStartDate,
  ownerInfo: state.entities.timesheet.ownerInfo,
  summaryPeriodList: state.entities.timesheet.summaryPeriodList,
  dailyContractedDetailMap: state.entities.timesheet.dailyContractedDetailMap,
  dailyRequestedWorkingHoursMap:
    entitiesSelectors.buildDailyRequestedWorkingHoursMap(state),
  dailyActualWorkingPeriodListMap:
    entitiesSelectors.buildDailyActualWorkingPeriodListMap(state),
  dailyRequestConditionsMap:
    entitiesSelectors.buildDailyRequestConditionMap(state),
  dailyAttentionMessagesMap: state.entities.timesheet.dailyAttentionMessagesMap,
  attRecordList: state.entities.timesheet.attRecordList,
  attSummary: state.entities.timesheet.attSummary,
  useManageCommuteCount:
    state.entities?.timesheet?.attWorkingType?.useManageCommuteCount,
  isStampWidgetOpened: state.ui.stampWidget.isOpened,
  isManHoursGraphOpened: state.ui.timesheet.isManHoursGraphOpened,
  userPermission: state.common.accessControl.permission,
  userSetting: state.common.userSetting,
  personalSetting: state.common.personalSetting,
  standalone: state.common.standaloneMode.enabled,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onStampSuccess: AppActions.onStampSuccess,
      onClickStampWidgetToggle: stampWidgetActions.toggle,
      onPeriodSelected: TimesheetActions.onPeriodSelected,
      onClickTimesheetRequestButton: DailyRequest.showManagementDialog,
      onClickTimesheetTimeButton: DailyAttTime.showDialog,
      onClickTimesheetRemarksButton: DailyRemarksActions.showDialog,
      onClickFixSummaryRequestButton:
        FixSummaryRequestActions.manipulateFixRequestAccordingToAttSummary,
      onClickOpenAttRequestHistoryButton: approvalHistoryActions.open,
      onClickTimesheetAttentionsButton:
        DailyAttentionsActions.showDailyAttentionsDialog,
      onChangeCommuteCount: ManageCommuteCount.update,
      onExitProxyMode: TimesheetActions.onExitProxyMode,
      onRequestOpenSummaryWindow: TimesheetActions.openSummaryWindow,
      onRequestOpenLeaveWindow: TimesheetActions.openLeaveWindow,
    },
    dispatch
  );

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
) => ({
  ...stateProps,
  ...dispatchProps,
  onStampSuccess: () => {
    dispatchProps.onStampSuccess(
      stateProps.userPermission,
      stateProps.userSetting
    );
  },
  onPeriodSelected: (periodStartDate) => {
    dispatchProps.onPeriodSelected(
      periodStartDate,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null,
      stateProps.userPermission,
      stateProps.userSetting,
      stateProps.isProxyMode
    );
  },
  onClickTimesheetRequestButton: (
    dailyRequestConditions: DailyRequestConditions
  ) => {
    dispatchProps.onClickTimesheetRequestButton(
      dailyRequestConditions,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null
    );
  },
  onClickFixSummaryRequestButton: () => {
    dispatchProps.onClickFixSummaryRequestButton(
      stateProps.attSummary,
      stateProps.dailyRequestConditionsMap
    );
  },
  onClickOpenAttRequestHistoryButton: () => {
    dispatchProps.onClickOpenAttRequestHistoryButton(
      isNil(stateProps.attSummary) ? '' : stateProps.attSummary.requestId
    );
  },
  onExitProxyMode: () => {
    dispatchProps.onExitProxyMode(
      stateProps.selectedPeriodStartDate,
      stateProps.userPermission,
      stateProps.userSetting
    );
  },
  onRequestOpenSummaryWindow: () => {
    dispatchProps.onRequestOpenSummaryWindow(
      stateProps.selectedPeriodStartDate,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null
    );
  },
  onRequestOpenLeaveWindow: () => {
    dispatchProps.onRequestOpenLeaveWindow(
      stateProps.selectedPeriodStartDate,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null
    );
  },
  onChangeCommuteCount: ({
    commuteForwardCount,
    commuteBackwardCount,
    targetDate,
  }: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
    targetDate: string;
  }): void => {
    dispatchProps.onChangeCommuteCount({
      commuteForwardCount,
      commuteBackwardCount,
      targetDate,
      employeeId: stateProps.isProxyMode
        ? stateProps.proxyEmployeeId
        : undefined,
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(MainContent) as React.ComponentType<OwnProps> as React.ComponentType;
