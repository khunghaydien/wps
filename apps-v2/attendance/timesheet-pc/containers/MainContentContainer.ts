/**
 * 肥大化しすぎているので分割していきたい。
 * まずは Container をバケツリレーして行くようにする。
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import isNil from 'lodash/isNil';

import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';

import DailyRequestConditions from '../models/DailyRequestConditions';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import { LegalAgreementRequest } from '@attendance/domain/models/LegalAgreementRequest';
import { CODE as REQUEST_TYPE_CODE } from '@attendance/domain/models/LegalAgreementRequestType';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import { State } from '../modules';
import * as entitiesSelectors from '../modules/selectors';
import { actions as approvalHistoryActions } from '../modules/ui/approvalHistory';
import { open as openDailyAttTimeDialog } from '../modules/ui/dailyAttTimeDialog';
import { actions as stampWidgetActions } from '../modules/ui/stampWidget';

import * as AppActions from '../action-dispatchers/App';
import * as DailyAttentionsActions from '../action-dispatchers/DailyAttentions';
import * as DailyRemarksActions from '../action-dispatchers/DailyRemarks';
import * as DailyRequest from '../action-dispatchers/DailyRequest';
import * as FixSummaryRequestActions from '../action-dispatchers/FixSummaryRequest';
import * as ManageCommuteCount from '../action-dispatchers/ManageCommuteCount';
import * as TimesheetActions from '../action-dispatchers/Timesheet';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

// Props のバケツリレーが辛すぎるので Container でカプセル化するように修正しました。
import DailyRowTableCellsContainer from '@attendance/timesheet-pc/containers/MainContentContainer/TimesheetContainer/DailyRowContainer/TableCellsContainer';
import HeadingRowFixedCellsContainer from '@attendance/timesheet-pc/containers/MainContentContainer/TimesheetContainer/HeadingRowContainer/FixedCellsContainer';
import HeadingRowTableCellsContainer from '@attendance/timesheet-pc/containers/MainContentContainer/TimesheetContainer/HeadingRowContainer/TableCellsContainer';

import MainContent from '../components/MainContent';
import {
  TIMESHEET_VIEW_TYPE,
  TimesheetViewType,
} from '../components/MainContent/Timesheet/TimesheetViewType';

type OwnProps = Record<string, unknown>;

const getViewType = (state: State): TimesheetViewType => {
  const useViewTable = state.entities?.timesheet?.workingTypes?.some(
    (workType) => workType.attRecordDisplayFieldLayouts?.timesheet
  );
  const catchError = state.ui.dailyRecordDisplayFieldLayout.catchError;
  if (useViewTable && !catchError) {
    return TIMESHEET_VIEW_TYPE.TABLE;
  }
  return TIMESHEET_VIEW_TYPE.GRAPH;
};

const mapStateToProps = (state: State) => ({
  viewType: getViewType(state),
  today: state.entities.stampWidget?.stampOutDate,
  language: state.common.userSetting.language,
  isProxyMode: state.common.proxyEmployeeInfo.isProxyMode,
  proxyEmployeeId: state.common.proxyEmployeeInfo.id,
  selectedPeriodStartDate: state.client.selectedPeriodStartDate,
  ownerInfo: RecordsUtil.getClosest(
    state.entities.stampWidget?.stampOutDate,
    state.entities.timesheet?.ownerInfos
  ),
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
  dailyObjectivelyEventLogList:
    state.entities.timesheet.dailyObjectivelyEventLogs,
  attSummary: state.entities.timesheet.attSummary,
  workingType: state.entities?.timesheet?.workingType,
  workingTypes: state.entities?.timesheet?.workingTypes,
  isStampWidgetOpened: state.ui.stampWidget.isOpened,
  isManHoursGraphOpened: state.ui.timesheet.isManHoursGraphOpened,
  userPermission: state.common.accessControl.permission,
  userSetting: state.common.userSetting,
  personalSetting: state.common.personalSetting,
  standalone: state.common.standaloneMode.enabled,
  legalAgreementRequest: state.ui.legalAgreementRequest.list.requests,
  loading: state.ui.dailyRecordDisplayFieldLayout.isLoading,
  layoutRow: state.ui.dailyRecordDisplayFieldLayout.layoutRow,
  maxRestTimesCount: state.entities.timesheet.dailyRestCountLimit,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onStampSuccess: AppActions.onStampSuccess,
      onClickStampWidgetToggle: stampWidgetActions.toggle,
      onClickTimesheetRequestButton: DailyRequest.showManagementDialog,
      onClickTimesheetTimeButton: openDailyAttTimeDialog,
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

const handleLegalAgreementRequest = (
  legalAgreementRequest: LegalAgreementRequest[],
  workingTypes: WorkingType[]
): LegalAgreementRequest[] => {
  let newLegalAgreementRequest: LegalAgreementRequest[] = legalAgreementRequest;
  if (
    workingTypes?.some(
      (item) =>
        item.useLegalAgreementMonthlyRequest === false &&
        item.useLegalAgreementYearlyRequest === false
    )
  ) {
    newLegalAgreementRequest = [];
  } else if (
    workingTypes?.some((item) => item.useLegalAgreementMonthlyRequest === false)
  ) {
    newLegalAgreementRequest = legalAgreementRequest.filter(
      (item) => item.requestType !== REQUEST_TYPE_CODE.MONTHLY
    );
  } else if (
    workingTypes?.some((item) => item.useLegalAgreementYearlyRequest === false)
  ) {
    newLegalAgreementRequest = legalAgreementRequest.filter(
      (item) => item.requestType !== REQUEST_TYPE_CODE.YEARLY
    );
  }
  return newLegalAgreementRequest;
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>
) => ({
  ...stateProps,
  ...dispatchProps,
  Containers: {
    AccessControlContainer,
    Timesheet: {
      HeadingRowFixedCellsContainer,
      HeadingRowTableCellsContainer,
      DailyRowTableCellsContainer,
    },
  },
  onPeriodSelected: (periodStartDate) => {
    TimesheetActions.onPeriodSelected(
      periodStartDate,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null
    );
  },
  onClickTimesheetRequestButton: (
    dailyRequestConditions: DailyRequestConditions
  ) => {
    dispatchProps.onClickTimesheetRequestButton(
      dailyRequestConditions,
      stateProps.maxRestTimesCount,
      stateProps.isProxyMode ? stateProps.proxyEmployeeId : null
    );
  },
  onClickFixSummaryRequestButton: () => {
    dispatchProps.onClickFixSummaryRequestButton(
      stateProps.attSummary,
      stateProps.dailyRequestConditionsMap,
      handleLegalAgreementRequest(
        stateProps.legalAgreementRequest,
        stateProps.workingTypes
      )
    );
  },
  onClickOpenAttRequestHistoryButton: () => {
    dispatchProps.onClickOpenAttRequestHistoryButton(
      isNil(stateProps.attSummary) ? '' : stateProps.attSummary.requestId
    );
  },
  onExitProxyMode: () => {
    dispatchProps.onExitProxyMode(stateProps.selectedPeriodStartDate);
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
  onChangeCommuteCount: (
    targetDate: string,
    commuteCount: CommuteCount
  ): void => {
    dispatchProps.onChangeCommuteCount({
      targetDate,
      commuteCount,
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
