import React from 'react';

import styled from 'styled-components';

import AccessControl from '@apps/commons/containers/AccessControlContainer';
import MonthlyHeader from '@mobile/components/molecules/commons/Headers/MonthlyHeader';

import { FixDailyRequest } from '@apps/attendance/domain/models/FixDailyRequest';
import { WorkingType } from '@apps/attendance/domain/models/WorkingType';
import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';
import { ApprovalHistory } from '@apps/domain/models/approval/request/History';
import { Status } from '@attendance/domain/models/AttDailyRequest';
import {
  ACTIONS_FOR_FIX,
  ActionsForFix,
  AttFixSummaryRequest,
} from '@attendance/domain/models/AttFixSummaryRequest';

import AttendanceRequestIgnoreWarningConfirm from '@mobile/containers/organisms/attendance/AttendanceRequestIgnoreWarningConfirmContainer';

import AttendanceRequestStatus from '@mobile/components/molecules/attendance/AttendanceRequestStatus';
import HistoryList from '@mobile/components/organisms/approval/HistoryList';
import $MonthlyList from '@mobile/components/organisms/attendance/MonthlyList';
import Footer from '@mobile/components/organisms/attendance/MonthlyList/Footer';
import MonthlyListHeader from '@mobile/components/organisms/attendance/MonthlyList/MonthlyListHeader';

import unit from '@mobile/styles/variables/_unit.scss';
import zindex from '@mobile/styles/variables/_zindex.scss';

type Props = {
  currentDate: string;
  yearMonthOptions: Array<{
    value: string;
    label: string;
  }>;
  disabledPrevDate?: boolean;
  disabledNextDate?: boolean;
  records: Array<{
    rowType: string;
    recordDate: string;
    startTime: number | null;
    endTime: number | null;
    contractedDetail: {
      startTime: number | null;
      endTime: number | null;
    };
    remarkableRequestStatus: {
      count: number;
      status: Status;
    } | null;
    attentionMessages: string[] | null;
    fixDailyRequest: FixDailyRequest;
  }>;
  attendanceRequest: AttFixSummaryRequest;
  historyList: ApprovalHistory[];
  workingTypes: WorkingType[];
  useFixDailyRequest: boolean;
  onClickMonthlyListItem: (arg0: string) => void;
  onChangeMonth: (arg0: string) => void;
  onClickRefresh: (arg0: React.SyntheticEvent<Element>) => void;
  onClickPrevMonth?: () => void;
  onClickNextMonth?: () => void;
  onClickSendAttendanceRequest: () => void;
  onChangeAttendanceRequestComment: (arg0: string) => void;
};

const getPermissionTestConditions = (
  performableActionForFix: ActionsForFix
): DynamicTestConditions => {
  switch (performableActionForFix) {
    case ACTIONS_FOR_FIX.Submit:
      return {
        allowIfByEmployee: true,
        requireIfByDelegate: ['submitAttRequestByDelegate'],
      };
    case ACTIONS_FOR_FIX.CancelRequest:
      return {
        allowIfByEmployee: true,
        requireIfByDelegate: ['cancelAttRequestByDelegate'],
      };
    case ACTIONS_FOR_FIX.CancelApproval:
      return {
        requireIfByEmployee: ['cancelAttApprovalByEmployee'],
        requireIfByDelegate: ['cancelAttApprovalByDelegate'],
      };
    case ACTIONS_FOR_FIX.None:
      return {
        allowIfByEmployee: true,
      };
    default:
      return {};
  }
};

const Header = styled(MonthlyHeader)`
  &&& {
    .mobile-app-molecules-commons-navigation__title {
      overflow: visible;
    }
    .mobile-app-organisms-attendance-monthly-list-header {
      position: fixed;
      z-index: ${zindex.header};
      top: ${48 + 48}px;
    }
  }
`;

const ScrollArea = styled.div<{ hasFooter: boolean }>`
  overflow: scroll;
  height: 100vh;
  padding-top: ${48 + 48 + 32}px;
  padding-bottom: ${(props) => (props.hasFooter ? 64 * 2 + 2 : 32)}px;
  -webkit-overflow-scrolling: touch;
`;

const MonthlyList = styled($MonthlyList)`
  &&& {
    padding-bottom: ${unit.largeSize};
  }
`;

const TimesheetDailyPage: React.FC<Props> = (props) => {
  const hasFooter =
    props.attendanceRequest.performableActionForFix !== ACTIONS_FOR_FIX.None;

  return (
    <div>
      <Header
        title={
          <AttendanceRequestStatus status={props.attendanceRequest.status} />
        }
        currentYearMonth={props.currentDate}
        yearMonthOptions={props.yearMonthOptions}
        disabledPrevDate={
          props.disabledPrevDate ? props.disabledPrevDate : false
        }
        disabledNextDate={props.disabledNextDate}
        onChangeMonth={(event: React.SyntheticEvent<HTMLSelectElement>) => {
          props.onChangeMonth(event.currentTarget.value);
        }}
        onClickRefresh={props.onClickRefresh}
        onClickPrevMonth={props.onClickPrevMonth}
        onClickNextMonth={props.onClickNextMonth}
      >
        <MonthlyListHeader />
      </Header>
      <ScrollArea hasFooter={hasFooter}>
        <MonthlyList
          key={props.currentDate}
          items={props.records}
          onClickItem={props.onClickMonthlyListItem}
          workingTypes={props.workingTypes}
          useFixDailyRequest={props.useFixDailyRequest}
        />
        <HistoryList historyList={props.historyList} />
      </ScrollArea>
      <AccessControl
        conditions={getPermissionTestConditions(
          props.attendanceRequest.performableActionForFix
        )}
      >
        {hasFooter && (
          <Footer
            comment={props.attendanceRequest.comment}
            performableActionForFix={
              props.attendanceRequest.performableActionForFix
            }
            onClickSendAttendanceRequest={props.onClickSendAttendanceRequest}
            onChangeComment={props.onChangeAttendanceRequestComment}
          />
        )}
      </AccessControl>
      <AttendanceRequestIgnoreWarningConfirm />
    </div>
  );
};

TimesheetDailyPage.defaultProps = {
  disabledPrevDate: false,
  disabledNextDate: false,
  onClickPrevMonth: undefined,
  onClickNextMonth: undefined,
};

export default TimesheetDailyPage;
