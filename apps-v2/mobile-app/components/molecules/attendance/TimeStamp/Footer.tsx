import * as React from 'react';

import msg from '../../../../../commons/languages';

import { CLOCK_TYPE } from '@apps/attendance/domain/models/DailyStampTime';
import {
  CommuteCount,
  CommuteState,
  toCommuteCount,
  toCommuteState,
} from '@attendance/domain/models/CommuteCount';
import { ACTIONS_FOR_FIX } from '@attendance/domain/models/FixDailyRequest';

import RadioButtonGroup from '@apps/mobile-app/components/atoms/RadioButtonGroup';

import Button from '../../../atoms/Button';
import Errors from '../../../atoms/Errors';
import TextArea from '../../../atoms/Fields/TextArea';
import * as commuteCountHelper from '@attendance/ui/helpers/dailyRecord/commuteCount';

import './Footer.scss';

const ROOT = 'mobile-app-components-molecules-attendance-time-stamp-footer';
type FixDailyRequest = {
  requestId?: string;
  status?: string;
  performableActionForFix?: string;
};
type Record = {
  recordId?: string;
  fixDailyRequest: FixDailyRequest;
};
export type Props = {
  onClickStartStampButton: () => void;
  onClickEndStampButton: () => void;
  onChangeCommentField: (comment: string) => void;
  onChangeCommuteCount: (param: CommuteCount) => void;
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  isCommentRequired: boolean;
  canStamp: boolean;
  disabled?: boolean;
  defaultAction: 'in' | 'out' | 'rein';
  comment: string;
  useManageCommuteCount: boolean;
  commuteCount: CommuteCount;
  useDailyFixRequest: boolean;
  isPossibleFixDailyRequest: boolean;
  allowedActionForFixDailyRequest: boolean;
  record: Record;
  onClickSubmitFixDaily: () => void;
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

type ClockDailyButtonProps = {
  isPossibleFixDailyRequest: boolean;
  defaultAction: 'in' | 'out' | 'rein';
  performableActionForFix: string;
  useDailyFixRequest: boolean;
  onClickSubmitFixDaily: () => void;
  disabled?: boolean;
};
const testId = `${ROOT}_send_attendance_request`;
const DailyFixRequestButton = (props: ClockDailyButtonProps) => {
  if (!props.isPossibleFixDailyRequest || !props.useDailyFixRequest) {
    return null;
  }

  switch (props.performableActionForFix) {
    case ACTIONS_FOR_FIX.Submit:
      if (props.defaultAction === CLOCK_TYPE.OUT) {
        return (
          <Button
            testId={testId}
            variant="add"
            priority="primary"
            onClick={props.onClickSubmitFixDaily}
            disabled={props.disabled}
          >
            {msg().Att_Btn_ClockOutAndSubmitFixDailyRequest}
          </Button>
        );
      } else {
        return (
          <Button
            testId={testId}
            variant="add"
            priority="primary"
            onClick={props.onClickSubmitFixDaily}
          >
            {msg().Appr_Lbl_DailyFixRequest}
          </Button>
        );
      }
    case ACTIONS_FOR_FIX.CancelRequest:
      return (
        <Button
          testId={testId}
          variant="alert"
          priority="primary"
          onClick={props.onClickSubmitFixDaily}
        >
          {msg().Att_Lbl_CancelFixDailyRequest}
        </Button>
      );
    case ACTIONS_FOR_FIX.CancelApproval:
      return (
        <Button
          testId={testId}
          variant="alert"
          priority="primary"
          onClick={props.onClickSubmitFixDaily}
        >
          {msg().Att_Lbl_CancelApprovedFixDailyRequest}
        </Button>
      );

    default:
      return null;
  }
};

const Footer = (props: Props) => {
  const performableActionForFix =
    props.record != null && props.record.fixDailyRequest != null
      ? props.record.fixDailyRequest.performableActionForFix
      : '';

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
            value={toCommuteState(props.commuteCount)}
            options={commuteCountHelper.options()}
            label={{ label: '' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              const commuteCount = toCommuteCount(value as CommuteState);
              props.onChangeCommuteCount(commuteCount);
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
      {props.allowedActionForFixDailyRequest && (
        <div className={`${ROOT}__daily_button-area`}>
          <DailyFixRequestButton
            isPossibleFixDailyRequest={props.isPossibleFixDailyRequest}
            performableActionForFix={performableActionForFix}
            onClickSubmitFixDaily={props.onClickSubmitFixDaily}
            defaultAction={props.defaultAction}
            useDailyFixRequest={props.useDailyFixRequest}
            disabled={props.disabled}
          />
        </div>
      )}
    </section>
  );
};

export default Footer;
