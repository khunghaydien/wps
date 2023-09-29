import * as React from 'react';

import styled, { css } from 'styled-components';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import Alert from '@mobile/components/molecules/commons/Alert';
import Navigation, {
  Props as NavigationProps,
} from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import {
  DailyRecord,
  FixMonthlyRequest,
} from '@attendance/domain/models/approval/FixMonthlyRequest';

import Wrapper from '@mobile/components/atoms/Wrapper';
import Footer, {
  Props as FooterProps,
} from '@mobile/components/organisms/approval/Footer';

import * as recordHelper from '@attendance/ui/helpers/attendanceSummary/record';
import * as attentionHelper from '@attendance/ui/helpers/attentionDailyMessages';
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
    padding-top: ${variables.unit.smallSize};
    padding-right: ${variables.unit.smallSize};
    padding-left: ${variables.unit.smallSize};
  `,
  Title: styled.div`
    margin-bottom: ${variables.unit.smallSize};
    color: ${variables.colors.blue800};
    font-size: ${variables.unit.unit(5)}px;
    font-weight: ${variables.font.emphasis};
    line-height: 1;
  `,
};

const Modified = styled.span<{
  isModified: boolean;
}>`
  ${(props) =>
    props.isModified
      ? css`
          text-decoration: underline;
        `
      : ''}
`;

const Attention: React.FC<{
  attentions: DailyRecord['attentions'];
}> = ({ attentions }) => {
  const messages = attentionHelper.alert(attentions);
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

type Props = {
  record: DailyRecord | null;
  workingType: FixMonthlyRequest['workingType'];
  onClickBack: NavigationProps['onClickBack'];
} & FooterProps;

const AttendanceRequest: React.FC<Props> = ({
  record,
  workingType,
  onClickBack,
  comment,
  onChangeComment,
  onClickApproveButton,
  onClickRejectButton,
}) => {
  if (!record) {
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
          <Attention attentions={record.attentions} />
        </Section.Content>
        <Section.Content>
          <Section.Title>{DateUtil.formatYMD(record.recordDate)}</Section.Title>
          <ViewItem label={msg().Att_Lbl_DayType}>
            {recordHelper.dayType(record.dayType)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_RequestAndEvent}>
            {record.event}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_ShiftAndShortTimeWork}>
            {record.shift}
          </ViewItem>
          {workingType.useManageCommuteCount ? (
            <ViewItem label={msg().Att_Lbl_CommuteCountCommute}>
              {recordHelper.commuteState(record.commuteState)}
            </ViewItem>
          ) : (
            ''
          )}
          <ViewItem label={msg().Att_Lbl_TimeIn}>
            <Modified isModified={record.startTimeModified}>
              {recordHelper.time(record.startTime)}
            </Modified>
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_TimeOut}>
            <Modified isModified={record.endTimeModified}>
              {recordHelper.time(record.endTime)}
            </Modified>
          </ViewItem>
          <ViewItem label={msg().$Att_Lbl_CustomRest}>
            {recordHelper.duration(record.restTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_ActualWork}>
            {recordHelper.duration(record.realWorkTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_Overtime}>
            {recordHelper.duration(record.overTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_LateNight}>
            {recordHelper.duration(record.nightTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_DailyVirtualWorkTime}>
            {recordHelper.duration(record.virtualWorkTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_HolidayWorkTime}>
            {recordHelper.duration(record.holidayWorkTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_Deducted}>
            {recordHelper.duration(record.lostTime)}
          </ViewItem>
          <ViewItem label={msg().Att_Lbl_Remarks}>{record.remarks}</ViewItem>
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
