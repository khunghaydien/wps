import * as React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import { Button, LinkButton } from '@apps/core';

import { ObjectivelyEventLog } from '@attendance/domain/models/ObjectivelyEventLog';
import { ObjectivelyEventLogSetting } from '@attendance/domain/models/ObjectivelyEventLogSetting';

import {
  Dialog,
  DialogFooter as DialogFooterContainer,
  DialogHeaderContainer,
  Screen,
} from '../Dialog';
import Content from './Content';
import preventDoubleFiring from '@attendance/ui/helpers/events/preventDoubleFiring';
import { EventType as ObjectivelyEventLogEventType } from '@attendance/ui/helpers/objectivelyEventLog/eventType';

type Props = {
  targetDate: string;
  sources: ObjectivelyEventLogSetting[];
  records: ObjectivelyEventLog[];
  onCheckRecord: (id: string) => void;
  onClickAdd: (params: {
    settingCode: string;
    eventType: ObjectivelyEventLogEventType;
    time: number;
  }) => void;
  onClickRemove: (id: string) => void;
  onClickToggleDisplay: () => void;
  onSubmit: () => void;
  onCancel?: () => void;
  expanded: boolean;
  allowedEditLogs: boolean;
  allowedSetToApplied: boolean;
  readOnly: boolean;
  loading: boolean;
};

const Wrapper = styled.div`
  position: relative;
  margin: auto;
  max-height: 80vh;
`;

const Title = styled.div`
  color: #52678c;
  font-size: 18px;
  font-weight: bold;
`;

const SubTitle = styled.div`
  padding-left: 15px;
`;

const About = styled.div`
  color: #52678c;
`;

const TargetDateContainer = styled.div`
  color: #53688c;
  font-size: 14px;
`;

const TargetDate: React.FC<{
  targetDate: Props['targetDate'];
}> = ({ targetDate }) => {
  if (!targetDate) {
    return null;
  }

  const displayYMDd = [
    DateUtil.formatYMD(targetDate),
    `(${DateUtil.formatWeekday(targetDate)})`,
  ].join(' ');

  return (
    <TargetDateContainer>
      <time dateTime={new Date(targetDate).toISOString()}>{displayYMDd}</time>
    </TargetDateContainer>
  );
};

const TitleContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: center;
`;

const DialogHeader: React.FC<{
  targetDate: Props['targetDate'];
  expanded: Props['expanded'];
  onClickToggleDisplay: Props['onClickToggleDisplay'];
}> = ({ expanded, targetDate, onClickToggleDisplay }) => {
  return (
    <DialogHeaderContainer>
      <TitleContainer>
        <Title>{msg().Att_Lbl_DailyObjectivelyEventLogDetailDialogTitle}</Title>
        <SubTitle>
          <About>{msg().Att_Msg_AboutObjectivelyEventList}</About>
          <div>
            <LinkButton onClick={onClickToggleDisplay}>
              {expanded ? msg().Att_Btn_DisplayPart : msg().Att_Btn_DisplayAll}
            </LinkButton>
          </div>
        </SubTitle>
      </TitleContainer>
      <TargetDate targetDate={targetDate} />
    </DialogHeaderContainer>
  );
};

const DialogFooter: React.FC<{
  readOnly: Props['readOnly'];
  loading: Props['loading'];
  allowedSubmit: boolean;
  onSubmit: () => void;
  onCancel: Props['onCancel'];
}> = ({ readOnly, loading, allowedSubmit, onSubmit, onCancel }) => {
  if (readOnly || !allowedSubmit) {
    return (
      <DialogFooterContainer>
        <Button color="default" onClick={onCancel} key="button-cancel">
          {msg().Com_Btn_Close}
        </Button>
      </DialogFooterContainer>
    );
  } else {
    return (
      <DialogFooterContainer>
        {' '}
        <Button color="default" onClick={onCancel} key="button-cancel">
          {' '}
          {msg().Com_Btn_Cancel}
        </Button>
        <Button
          color="primary"
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          key="button-execute"
        >
          {msg().Com_Btn_Ok}
        </Button>
      </DialogFooterContainer>
    );
  }
};

const DailyObjectivelyEventLogDialog: React.FC<Props> = ({
  targetDate,
  expanded,
  readOnly,
  loading,
  allowedEditLogs,
  allowedSetToApplied,
  sources,
  records,
  onCheckRecord,
  onClickAdd,
  onClickRemove,
  onClickToggleDisplay,
  onSubmit: $onSubmit,
  onCancel,
}) => {
  const onSubmit = React.useMemo(
    () => preventDoubleFiring(() => $onSubmit()),
    [$onSubmit]
  );
  return (
    <Screen>
      <Wrapper>
        <Dialog
          isModal={true}
          header={
            <DialogHeader
              {...{
                expanded,
                onClickToggleDisplay,
                targetDate,
              }}
            />
          }
          content={
            <Content
              {...{
                sources,
                records,
                onCheckRecord,
                onClickAdd,
                onClickRemove,
                readOnly,
                loading,
                allowedEditLogs,
                allowedSetToApplied,
              }}
            />
          }
          footer={
            <DialogFooter
              {...{
                readOnly,
                loading,
                onCancel,
                onSubmit,
                allowedSubmit: allowedSetToApplied,
              }}
            />
          }
          onClose={onCancel}
        />
      </Wrapper>
    </Screen>
  );
};

DailyObjectivelyEventLogDialog.defaultProps = {
  onCancel: null,
};

export default DailyObjectivelyEventLogDialog;
