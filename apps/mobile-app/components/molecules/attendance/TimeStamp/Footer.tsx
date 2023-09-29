import * as React from 'react';

import msg from '../../../../../commons/languages';

import {
  COMMUTE_STATE,
  CommuteState,
  toCommuteCount,
  toCommuteState,
} from '@apps/domain/models/attendance/CommuteCount';

import RadioButtonGroup from '@apps/mobile-app/components/atoms/RadioButtonGroup';

import Button from '../../../atoms/Button';
import Errors from '../../../atoms/Errors';
import TextArea from '../../../atoms/Fields/TextArea';

import './Footer.scss';

const ROOT = 'mobile-app-components-molecules-attendance-time-stamp-footer';

export type Props = {
  onClickStartStampButton: () => void;
  onClickEndStampButton: () => void;
  onChangeCommentField: (comment: string) => void;
  onChangeCommuteCount: (param: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
  }) => void;
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  isCommentRequired: boolean;
  canStamp: boolean;
  disabled?: boolean;
  defaultAction: 'in' | 'out' | 'rein';
  comment: string;
  useManageCommuteCount: boolean;
  commuteForwardCount: number;
  commuteBackwardCount: number;
};

type ClockInButtonProps = {
  defaultAction: 'in' | 'out' | 'rein';
  disabled?: boolean;
  isEnableStartStamp: boolean;
  isEnableRestartStamp: boolean;
  onClickStartStampButton: () => void;
};

const ClockInButton = (props: ClockInButtonProps) => {
  return (
    <Button
      testId={`${ROOT}__stamp_button`}
      className={`${ROOT}__stamp_button`}
      variant="neutral"
      priority={props.defaultAction !== 'out' ? 'primary' : 'secondary'}
      disabled={
        props.disabled ||
        !(props.isEnableStartStamp || props.isEnableRestartStamp)
      }
      onClick={props.onClickStartStampButton}
    >
      {props.isEnableRestartStamp
        ? msg().Com_Btn_ClockRein
        : msg().Com_Btn_ClockIn}
    </Button>
  );
};

type ClockOutButtonProps = {
  defaultAction: 'in' | 'out' | 'rein';
  disabled?: boolean;
  isEnableEndStamp: boolean;
  onClickEndStampButton: () => void;
};

const ClockOutButton = (props: ClockOutButtonProps) => {
  return (
    <Button
      testId={`${ROOT}__stamp_button`}
      className={`${ROOT}__stamp_button`}
      variant="neutral"
      priority={props.defaultAction === 'out' ? 'primary' : 'secondary'}
      disabled={props.disabled || !props.isEnableEndStamp}
      onClick={props.onClickEndStampButton}
    >
      {msg().Com_Btn_ClockOut}
    </Button>
  );
};

const Footer = (props: Props) => {
  const [isCommentFocused, setIsCommentFocused] = React.useState(false);
  const onChangeCommentField = React.useCallback(
    (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      props.onChangeCommentField(event.currentTarget.value || '');
    },
    [props.onChangeCommentField]
  );
  const hasError = props.canStamp && props.isCommentRequired && !props.comment;
  return (
    <section className={ROOT}>
      <div className={`${ROOT}__commute-count-area`}>
        {props.useManageCommuteCount ? (
          <RadioButtonGroup
            value={toCommuteState(
              props.commuteForwardCount,
              props.commuteBackwardCount
            )}
            options={[
              {
                value: COMMUTE_STATE.UNENTERED,
                label: msg().Att_Lbl_CommuteCountUnentered,
              },
              {
                value: COMMUTE_STATE.NONE,
                label: msg().Att_Lbl_CommuteCountNone,
              },
              {
                value: COMMUTE_STATE.BOTH_WAYS,
                label: msg().Att_Lbl_CommuteCountBothWays,
              },
              {
                value: COMMUTE_STATE.FORWARD,
                label: msg().Att_Lbl_CommuteCountForward,
              },
              {
                value: COMMUTE_STATE.BACKWARD,
                label: msg().Att_Lbl_CommuteCountBackward,
              },
            ]}
            label={{ label: '' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              const [commuteForwardCount, commuteBackwardCount] =
                toCommuteCount(value as CommuteState);
              props.onChangeCommuteCount({
                commuteForwardCount,
                commuteBackwardCount,
              });
            }}
            disabled={
              !(
                props.isEnableStartStamp ||
                props.isEnableRestartStamp ||
                props.isEnableEndStamp
              )
            }
          />
        ) : null}
      </div>
      <div className={`${ROOT}__comment-area`}>
        <TextArea
          className={`${ROOT}__comment`}
          placeholder={msg().Att_Lbl_Comment}
          rows={isCommentFocused ? 2 : 1}
          value={props.comment}
          error={hasError}
          required={props.isCommentRequired}
          onChange={onChangeCommentField}
          onFocus={() => setIsCommentFocused(true)}
          onBlur={() => setIsCommentFocused(false)}
        />
      </div>
      {hasError ? (
        <Errors messages={[msg().Att_Err_RequireCommentWithoutLocation]} />
      ) : null}
      <div className={`${ROOT}__button-area`}>
        <ClockInButton
          defaultAction={props.defaultAction}
          disabled={props.disabled}
          isEnableStartStamp={props.isEnableStartStamp}
          isEnableRestartStamp={props.isEnableRestartStamp}
          onClickStartStampButton={props.onClickStartStampButton}
        />
        <ClockOutButton
          defaultAction={props.defaultAction}
          disabled={props.disabled}
          isEnableEndStamp={props.isEnableEndStamp}
          onClickEndStampButton={props.onClickEndStampButton}
        />
      </div>
    </section>
  );
};

export default Footer;
