import React from 'react';

import classNames from 'classnames';

import GlobalHeader from '../../../../commons/components/GlobalHeader';
import msg from '../../../../commons/languages';
import { IAccessControlContainer } from '@apps/commons/components/IAccessControlContainer';

import { UserSetting } from '../../../../domain/models/UserSetting';
import AttRecordModel from '../../models/AttRecord';
import DailyRequestConditionsModel from '../../models/DailyRequestConditions';
import { AttDailyRecordContractedDetail } from '@attendance/domain/models/AttDailyRecord';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import { DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel } from '@attendance/domain/models/DailyActualWorkingTimePeriod';
import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { AttSummary as AttSummaryModel } from '@attendance/domain/models/DeprecatedAttSummary';
import { TimeRange } from '@attendance/domain/models/TimeRange';
import {
  OwnerInfo as OwnerInfoModel,
  Period,
} from '@attendance/domain/models/Timesheet';

import { State } from '@attendance/timesheet-pc/modules/entities/timesheet';

import LegalAgreementRequestButtonContainer from '../../containers/LegalAgreementRequestButtonContainer';
import StampWidgetContainer from '../../containers/StampWidgetContainer';

import ImgPartsIconPunch from '../../images/partsIconPunch.png';
import ImgIconHeader from '../../images/Time&Attendance.svg';
import OwnerInfo from './OwnerInfo';
import Request from './Request';
import SummaryPeriodNav from './SummaryPeriodNav';
import Timesheet from './Timesheet';
import { TimesheetViewType } from './Timesheet/TimesheetViewType';
import Utilities from './Utilities';

import './index.scss';

const ROOT = 'timesheet-pc-main-content';

type Props = {
  viewType: TimesheetViewType;
  today: string;
  attRecordList: AttRecordModel[];
  dailyObjectivelyEventLogList: DailyObjectivelyEventLog[];
  attSummary: AttSummaryModel | null | undefined;
  dailyActualWorkingPeriodListMap: {
    [data: string]: DailyActualWorkingTimePeriodModel[];
  };
  dailyAttentionMessagesMap: Record<string, string[]>;
  dailyContractedDetailMap: { [date: string]: AttDailyRecordContractedDetail };
  dailyRequestConditionsMap: {
    [date: string]: DailyRequestConditionsModel;
  };
  dailyRequestedWorkingHoursMap: {
    [date: string]: TimeRange;
  };
  ownerInfo: OwnerInfoModel;
  isManHoursGraphOpened: boolean;
  isProxyMode: boolean;
  standalone: boolean;
  isStampWidgetOpened: boolean;
  workingType: State['workingType'];
  workingTypes: State['workingTypes'];
  onClickFixSummaryRequestButton: () => void;
  onClickOpenAttRequestHistoryButton: () => void;
  onClickStampWidgetToggle: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onClickTimesheetAttentionsButton: (arg0: Array<string>) => void;
  onClickTimesheetRemarksButton: (arg0: AttRecordModel) => void;
  onClickTimesheetRequestButton: (arg0: DailyRequestConditionsModel) => void;
  onClickTimesheetTimeButton: (arg0: string) => void;
  onChangeCommuteCount: (
    targetDate: string,
    commuteCount: CommuteCount
  ) => void;
  onExitProxyMode: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onPeriodSelected: (arg0: string | null) => void;
  onRequestOpenLeaveWindow: (event: React.MouseEvent) => void;
  onRequestOpenSummaryWindow: (event: React.MouseEvent) => void;
  onStampSuccess: () => void;
  selectedPeriodStartDate: string;
  summaryPeriodList: Period[];
  userSetting: UserSetting;
  loading: boolean;
  Containers: {
    AccessControlContainer: IAccessControlContainer;
    Timesheet: React.ComponentProps<typeof Timesheet>['Containers'];
  };
};

export default class MainContent extends React.Component<Props> {
  renderHeaderContent() {
    return (
      <div>
        <SummaryPeriodNav
          summaryPeriodList={this.props.summaryPeriodList}
          selectedPeriodStartDate={this.props.selectedPeriodStartDate}
          onPeriodSelected={this.props.onPeriodSelected}
        />
        {!this.props.isProxyMode && !this.props.standalone ? (
          <button
            type="button"
            className={classNames({
              'slds-button': true,
              'slds-button--neutral': true,
              [`${ROOT}__toggle-stamp-widget`]: true,
            })}
            onClick={this.props.onClickStampWidgetToggle}
          >
            <img src={ImgPartsIconPunch} alt={msg().Att_Lbl_InputAttendance} />
          </button>
        ) : null}
      </div>
    );
  }

  renderGlobalHeader() {
    return (
      <GlobalHeader
        iconSrc={ImgIconHeader}
        iconSrcType="svg"
        iconAssistiveText={msg().Att_Lbl_TimeAttendance}
        content={this.renderHeaderContent()}
        showPersonalMenuPopoverButton={!this.props.isProxyMode}
        showProxyIndicator={this.props.isProxyMode}
        onClickProxyExitButton={this.props.onExitProxyMode}
      />
    );
  }

  renderMainContent() {
    if (!this.props.attRecordList || !this.props.selectedPeriodStartDate) {
      return null;
    }

    return (
      <main className={`${ROOT}__main`}>
        <header>
          <div className={`${ROOT}__header-operation`}>
            <h1 className={`${ROOT}__header-heading`}>
              {msg().Att_Lbl_TimeAttendance}
            </h1>

            <OwnerInfo ownerInfo={this.props.ownerInfo} />

            <div className={`${ROOT}__header-tools`}>
              <Utilities
                onClickOpenSummaryWindowButton={
                  this.props.onRequestOpenSummaryWindow
                }
                onClickOpenLeaveWindowButton={
                  this.props.onRequestOpenLeaveWindow
                }
                AccessControlContainer={
                  this.props.Containers.AccessControlContainer
                }
              />
              <Request
                attSummary={this.props.attSummary}
                onClickRequestButton={this.props.onClickFixSummaryRequestButton}
                onClickOpenRequestHistoryButton={
                  this.props.onClickOpenAttRequestHistoryButton
                }
              />
              <LegalAgreementRequestButtonContainer />
            </div>
          </div>
        </header>
        <Timesheet
          viewType={this.props.viewType}
          today={this.props.today}
          attRecordList={this.props.attRecordList}
          dailyObjectivelyEventLogList={this.props.dailyObjectivelyEventLogList}
          dailyContractedDetailMap={this.props.dailyContractedDetailMap}
          dailyRequestedWorkingHoursMap={
            this.props.dailyRequestedWorkingHoursMap
          }
          dailyActualWorkingPeriodListMap={
            this.props.dailyActualWorkingPeriodListMap
          }
          dailyRequestConditionsMap={this.props.dailyRequestConditionsMap}
          dailyAttentionMessagesMap={this.props.dailyAttentionMessagesMap}
          workingType={this.props.workingType}
          workingTypes={this.props.workingTypes}
          isManHoursGraphOpened={this.props.isManHoursGraphOpened}
          onClickRequestButton={this.props.onClickTimesheetRequestButton}
          onClickTimeButton={this.props.onClickTimesheetTimeButton}
          onClickRemarksButton={this.props.onClickTimesheetRemarksButton}
          onClickAttentionsButton={this.props.onClickTimesheetAttentionsButton}
          onChangeCommuteCount={this.props.onChangeCommuteCount}
          userSetting={this.props.userSetting}
          loading={this.props.loading}
          Containers={this.props.Containers.Timesheet}
        />
      </main>
    );
  }

  render() {
    const { isStampWidgetOpened, onStampSuccess } = this.props;

    const className = classNames(ROOT, {
      [`${ROOT}--stamp-widget-opened`]: isStampWidgetOpened,
    });

    return (
      <div className={className}>
        {this.renderGlobalHeader()}
        {/*
         * NOTE: 打刻ウィジェットの初期化・同期は、勤務表の更新アクションの内部で実行するため
         * onDidMountを無効化している
         */}
        {!this.props.isProxyMode && !this.props.standalone ? (
          <StampWidgetContainer
            className={`${ROOT}__stamp-widget`}
            withGlobalLoading
            onDidMount={null}
            onStampSuccess={onStampSuccess}
          />
        ) : null}

        {this.renderMainContent()}
      </div>
    );
  }
}
