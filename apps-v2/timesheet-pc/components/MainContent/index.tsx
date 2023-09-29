import React from 'react';

import classNames from 'classnames';

import GlobalHeader from '../../../commons/components/GlobalHeader';
import StampWidgetContainer from '../../../commons/containers/widgets/StampWidgetContainer';
import msg from '../../../commons/languages';

import { AttDailyRecordContractedDetail } from '../../../domain/models/attendance/AttDailyRecord';
import { AttSummary as AttSummaryModel } from '../../../domain/models/attendance/AttSummary';
import { TimeRange } from '../../../domain/models/attendance/TimeRange';
import {
  OwnerInfo as OwnerInfoModel,
  Period,
} from '../../../domain/models/attendance/Timesheet';
import { UserSetting } from '../../../domain/models/UserSetting';
import AttRecordModel from '../../models/AttRecord';
import DailyRequestConditionsModel from '../../models/DailyRequestConditions';
import { DailyActualWorkingTimePeriod as DailyActualWorkingTimePeriodModel } from '@apps/domain/models/attendance/DailyActualWorkingTimePeriod';

import ImgPartsIconPunch from '../../images/partsIconPunch.png';
import ImgIconHeader from '../../images/Time&Attendance.svg';
import OwnerInfo from './OwnerInfo';
import Request from './Request';
import SummaryPeriodNav from './SummaryPeriodNav';
import Timesheet from './Timesheet';
import Utilities from './Utilities';

import './index.scss';

const ROOT = 'timesheet-pc-main-content';

type Props = {
  attRecordList: AttRecordModel[];
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
  useManageCommuteCount: boolean;
  onClickFixSummaryRequestButton: () => void;
  onClickOpenAttRequestHistoryButton: () => void;
  onClickStampWidgetToggle: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onClickTimesheetAttentionsButton: (arg0: Array<string>) => void;
  onClickTimesheetRemarksButton: (arg0: AttRecordModel) => void;
  onClickTimesheetRequestButton: (arg0: DailyRequestConditionsModel) => void;
  onClickTimesheetTimeButton: (arg0: AttRecordModel) => void;
  onChangeCommuteCount: (param: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
    targetDate: string;
  }) => void;
  onExitProxyMode: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onPeriodSelected: (arg0: string | null) => void;
  onRequestOpenLeaveWindow: (event: React.MouseEvent) => void;
  onRequestOpenSummaryWindow: (event: React.MouseEvent) => void;
  onStampSuccess: () => void;
  selectedPeriodStartDate: string;
  summaryPeriodList: Period[];
  userSetting: UserSetting;
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
              />
              <Request
                attSummary={this.props.attSummary}
                onClickRequestButton={this.props.onClickFixSummaryRequestButton}
                onClickOpenRequestHistoryButton={
                  this.props.onClickOpenAttRequestHistoryButton
                }
              />
            </div>
          </div>
        </header>
        <Timesheet
          attRecordList={this.props.attRecordList}
          dailyContractedDetailMap={this.props.dailyContractedDetailMap}
          dailyRequestedWorkingHoursMap={
            this.props.dailyRequestedWorkingHoursMap
          }
          dailyActualWorkingPeriodListMap={
            this.props.dailyActualWorkingPeriodListMap
          }
          dailyRequestConditionsMap={this.props.dailyRequestConditionsMap}
          dailyAttentionMessagesMap={this.props.dailyAttentionMessagesMap}
          useManageCommuteCount={this.props.useManageCommuteCount}
          isManHoursGraphOpened={this.props.isManHoursGraphOpened}
          onClickRequestButton={this.props.onClickTimesheetRequestButton}
          onClickTimeButton={this.props.onClickTimesheetTimeButton}
          onClickRemarksButton={this.props.onClickTimesheetRemarksButton}
          onClickAttentionsButton={this.props.onClickTimesheetAttentionsButton}
          onChangeCommuteCount={this.props.onChangeCommuteCount}
          userSetting={this.props.userSetting}
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
