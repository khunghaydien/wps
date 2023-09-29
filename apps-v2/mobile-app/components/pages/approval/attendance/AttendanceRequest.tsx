import * as React from 'react';

import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import Alert from '@mobile/components/molecules/commons/Alert';
import Navigation, {
  Props as NavigationProps,
} from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import {
  FixMonthlyRequest,
  SUMMARY_ITEM_NAME,
} from '@attendance/domain/models/approval/FixMonthlyRequest';
import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

import MonthlyListHeader from '@apps/mobile-app/components/molecules/approval/attendance/MonthlyListHeader';
import ApplicantName from '@apps/mobile-app/components/organisms/approval/ApplicantName';
import Wrapper from '@mobile/components/atoms/Wrapper';
import MonthlyListItem from '@mobile/components/molecules/approval/attendance/MonthlyListItem';
import Footer, {
  Props as FooterProps,
} from '@mobile/components/organisms/approval/Footer';
import HistoryList from '@mobile/components/organisms/approval/HistoryList';

import * as recordHelper from '@attendance/ui/helpers/attendanceSummary/record';
import * as summaryItemHelper from '@attendance/ui/helpers/attendanceSummary/summaryItem';
import attentionSummaryMessages from '@attendance/ui/helpers/attentionSummaryMessages';
import * as variables from '@mobile/styles/variables';

const ROOT = 'mobile-app-pages-approval-page-attendance-request';

const Content = styled.div`
  overflow: scroll;
  height: 100vh;
  padding-top: 48px;
  // footer height + wrapper top margin + offset;
  padding-bottom: ${122 + 8 + 24}px;
  -webkit-overflow-scrolling: touch;
`;

const Section = {
  Content: styled.div`
    padding-top: ${variables.unit.mediumSize};
    padding-right: ${variables.unit.smallSize};
    padding-left: ${variables.unit.smallSize};
    &:first-child {
      padding-top: ${variables.unit.smallSize};
    }
  `,
  Title: styled.div`
    margin-bottom: ${variables.unit.smallSize};
    color: ${variables.colors.blue800};
    font-size: ${variables.unit.unit(5)}px;
    font-weight: ${variables.font.emphasis};
    line-height: 1;
  `,
};

const AttentionSummary: React.FC<FixMonthlyRequest['attention']> = (
  summary
) => {
  const messages = attentionSummaryMessages(summary);
  if (!messages) {
    return null;
  }
  return (
    <Alert
      className={`${ROOT}__alert`}
      variant="attention"
      message={messages}
    />
  );
};

const ChildViewItem = styled(ViewItem)`
  &&& {
    padding-left: ${variables.unit.largeSize};
  }
`;

const Summaries: React.FC<{
  items: FixMonthlyRequest['summaries'][number]['items'];
}> = ({ items }) => (
  <>
    {items.map((parent) => {
      switch (parent.name) {
        case SUMMARY_ITEM_NAME.ANNUAL_PAID_LEAVE_DAYS:
          return (
            <ViewItem
              key={parent.name}
              label={`${summaryItemHelper.label(
                parent.name
              )} ${summaryItemHelper.closingDate(parent.closingDate)}`}
            >
              {summaryItemHelper.value(parent)}
            </ViewItem>
          );
        case SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS:
        case SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS:
          return [
            <ViewItem
              key={parent.name}
              label={summaryItemHelper.label(parent.name)}
            >
              {summaryItemHelper.value(parent)}
            </ViewItem>,
            parent.items?.map((child) => (
              <ChildViewItem key={`${child.name}`} label={`${child.name}`}>
                {summaryItemHelper.value(child)}
              </ChildViewItem>
            )),
          ];
        default:
          return (
            <ViewItem
              key={parent.name}
              label={summaryItemHelper.label(parent.name)}
            >
              {summaryItemHelper.value(parent)}
            </ViewItem>
          );
      }
    })}
  </>
);

type Props = {
  request: FixMonthlyRequest | null;
  onClickRow: (targetDate: string) => void;
  onClickBack: NavigationProps['onClickBack'];
} & FooterProps;

const AttendanceRequest: React.FC<Props> = ({
  request,
  onClickRow,
  onClickBack,
  comment,
  onChangeComment,
  onClickApproveButton,
  onClickRejectButton,
}) => {
  if (!request) {
    return null;
  }
  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Appr_Lbl_ApprovalDetail}
        onClickBack={onClickBack}
        backButtonLabel={msg().Com_Lbl_Back}
      />
      <Content>
        <Section.Content>
          <Section.Title>{msg().Appr_Lbl_MonthlyFixRequest}</Section.Title>
          <ApplicantName
            employeeName={request.submitter.employee.name}
            delegatedEmployeeName={request.submitter.delegator.employee.name}
          />
        </Section.Content>
        <Section.Content>
          <AttentionSummary {...request.attention} />
        </Section.Content>
        <Section.Content>
          <MonthlyListHeader />
          {request.records.map(
            ({
              dayType,
              recordDate,
              startTime,
              endTime,
              startTimeModified,
              endTimeModified,
              attentions,
              isHolLegalHoliday,
            }) => (
              <MonthlyListItem
                key={recordDate}
                dayType={
                  isHolLegalHoliday === true ? DAY_TYPE.LegalHoliday : dayType
                }
                date={recordDate}
                startTime={startTime}
                endTime={endTime}
                startTimeModified={startTimeModified}
                endTimeModified={endTimeModified}
                onClick={() => onClickRow(recordDate)}
                attention={!isEmpty(attentions)}
              />
            )
          )}
        </Section.Content>
        <Section.Content>
          <Section.Title>{msg().Att_Lbl_Total}</Section.Title>
          <ViewItem label={msg().$Att_Lbl_CustomRest}>
            {recordHelper.duration(request.recordTotal.restTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_ActualWork}>
            {recordHelper.duration(request.recordTotal.realWorkTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_Overtime}>
            {recordHelper.duration(request.recordTotal.overTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_LateNight}>
            {recordHelper.duration(request.recordTotal.nightTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_DailyVirtualWorkTime}>
            {recordHelper.duration(request.recordTotal.virtualWorkTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_HolidayWorkTime}>
            {recordHelper.duration(request.recordTotal.holidayWorkTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_Deducted}>
            {recordHelper.duration(request.recordTotal.lostTime)}
          </ViewItem>
          {request.summaries.map((summary) => (
            <Summaries key={summary.name} items={summary.items} />
          ))}
        </Section.Content>
        <Section.Content>
          <Section.Title>{msg().Com_Lbl_ApprovalHistory}</Section.Title>
          <HistoryList
            className={`${ROOT}__history-list`}
            historyList={request.historyList}
          />
        </Section.Content>
        <Footer
          comment={comment}
          onChangeComment={onChangeComment}
          onClickApproveButton={onClickApproveButton}
          onClickRejectButton={onClickRejectButton}
        />
      </Content>
    </Wrapper>
  );
};

export default AttendanceRequest;
