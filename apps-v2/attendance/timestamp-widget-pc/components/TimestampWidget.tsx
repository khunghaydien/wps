import React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import TextField from '../../../core/elements/TextField';
import { Font } from '../../../core/styles';

import StampClockContainer from '../containers/StampClockContainer';
import TimestampWidgetWrapperContainer from '../containers/TimestampWidgetWrapperContainer';

import ConfirmModal from './ConfirmModal';
import StampButtons from './StampButtons';

import './TimestampWidget.scss';

export type Props = {
  onClickStartStampButton: () => void;
  onClickEndStampButton: () => void;
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;

  comment: string;
  onChange: (arg0: string) => void;

  onClickCancelButton: () => void;
  onClickSubmitButton: () => void;
  insufficientRestTime: number;
  isShowModal: boolean;
};

const CommentLabel = styled.p`
  font-size: ${Font.size.L};
  margin-bottom: 4px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  max-height: 54px;
  min-height: 54px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const TimestampWidgetTitle = styled.div`
  font-size: ${Font.size.XL};
  font-weight: bold;
`;

const WidgetContainer = styled.div`
  position: relative;
  min-height: 300px;
  width: 100%;
  background-color: #fff;
`;

const TimestampWidget = (props: Props) => (
  <TimestampWidgetWrapperContainer>
    <WidgetContainer>
      {props.isShowModal && (
        <ConfirmModal
          onClickCancelButton={props.onClickCancelButton}
          onClickSubmitButton={props.onClickSubmitButton}
          insufficientRestTime={props.insufficientRestTime}
        />
      )}
      <TimestampWidgetTitle>
        {msg().Att_Title_TimeStampWidgetInHome}
      </TimestampWidgetTitle>
      <StampClockContainer />
      <CommentLabel>{msg().Att_Lbl_Comment}</CommentLabel>
      <StyledTextField
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          props.onChange(e.target.value)
        }
        value={props.comment}
      />
      <StampButtons
        onClickStartStampButton={props.onClickStartStampButton}
        onClickEndStampButton={props.onClickEndStampButton}
        isEnableStartStamp={props.isEnableStartStamp}
        isEnableEndStamp={props.isEnableEndStamp}
        isEnableRestartStamp={props.isEnableRestartStamp}
      />
    </WidgetContainer>
  </TimestampWidgetWrapperContainer>
);

export default TimestampWidget;
