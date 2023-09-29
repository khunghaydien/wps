import React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import ButtonGroups from '@apps/commons/components/buttons/ButtonGroups';
import IconStampClockInOff from '@apps/commons/images/iconStampClockInOff.png';
import IconStampClockInOn from '@apps/commons/images/iconStampClockInOn.png';
import IconStampClockOutOff from '@apps/commons/images/iconStampClockOutOff.png';
import IconStampClockOutOn from '@apps/commons/images/iconStampClockOutOn.png';
import IconStampTime from '@apps/commons/images/iconStampTime.png';
import msg from '@apps/commons/languages';
import { Button as CoreButton } from '@apps/core';

import { MODE_TYPE, ModeType } from '@attendance/domain/models/DailyStampTime';

import './StampWidget.scss';

const ROOT = 'commons-widgets-stamp-widget';

export type Props = {
  onClickModeButton: (arg0: ModeType) => void;
  onClickStampButton: () => void;
  onChangeMessage: (arg0: string) => void;
  onClickSubmitFixDaily: () => void;
  mode?: ModeType;
  message: string;
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  enabledSubmitFixDailyRequest: boolean;
  className: string;
  onDidMount: () => void;
};

type State = {
  currentTime: moment.Moment;
};

export default class StampWidget extends React.Component<Props, State> {
  clockTickTimer?: number;

  constructor(props: Props) {
    super(props);

    // TODO: momentライブラリに依存しない（または、自前のユーティリティを経由する）ようにできれば、より良い
    this.state = {
      currentTime: moment(),
    };

    this.clockTickTimer = null;
  }

  componentDidMount(): void {
    this.startClockTicking();
    if (this.props.onDidMount) {
      this.props.onDidMount();
    }
  }

  componentWillUnmount(): void {
    this.stopClockTicking();
  }

  startClockTicking(): void {
    const ONE_MINUTE = 60 * 1000;
    const currentTime = moment();

    // クライアント環境における次に00秒から、分毎の時刻更新を開始する
    setTimeout(() => {
      this.setState({ currentTime: moment() });

      this.clockTickTimer = window.setInterval(
        () => this.setState({ currentTime: moment() }),
        ONE_MINUTE
      );
    }, ONE_MINUTE - currentTime.seconds() * 1000 - currentTime.milliseconds());
  }

  stopClockTicking(): void {
    if (this.clockTickTimer !== null && this.clockTickTimer !== undefined) {
      clearInterval(this.clockTickTimer);
    }
  }

  render(): React.ReactNode {
    const {
      mode,
      className,
      onClickModeButton,
      onClickStampButton,
      onClickSubmitFixDaily,
      onChangeMessage,
      enabledSubmitFixDailyRequest,
      isEnableStartStamp,
      isEnableEndStamp,
      isEnableRestartStamp,
      message,
    } = this.props;

    const { currentTime } = this.state;

    const rootClassName = classNames(ROOT, className);
    const allowCommentInput = mode !== null && mode !== MODE_TYPE.CLOCK_REIN;

    const disabled =
      !isEnableStartStamp && !isEnableEndStamp && !isEnableRestartStamp;

    return (
      <div className={rootClassName}>
        <div className={`${ROOT}__clock`}>
          <span className={`${ROOT}__date`}>{currentTime.format('M/D')}</span>
          <span className={`${ROOT}__time`}>
            {currentTime.format('HH')}
            <span>:</span>
            {currentTime.format('mm')}
          </span>
        </div>

        <ButtonGroups className={`${ROOT}__mode`}>
          <Button
            type={
              mode === MODE_TYPE.CLOCK_IN || mode === MODE_TYPE.CLOCK_REIN
                ? 'primary'
                : null
            }
            iconSrc={
              mode === MODE_TYPE.CLOCK_IN || mode === MODE_TYPE.CLOCK_REIN
                ? IconStampClockInOn
                : IconStampClockInOff
            }
            onClick={() =>
              onClickModeButton(
                isEnableStartStamp ? MODE_TYPE.CLOCK_IN : MODE_TYPE.CLOCK_REIN
              )
            }
            disabled={!isEnableStartStamp && !isEnableRestartStamp}
          >
            {isEnableRestartStamp
              ? msg().Com_Btn_ClockRein
              : msg().Com_Btn_ClockIn}
          </Button>
          <Button
            type={mode === MODE_TYPE.CLOCK_OUT ? 'primary' : null}
            iconSrc={
              mode === MODE_TYPE.CLOCK_OUT
                ? IconStampClockOutOn
                : IconStampClockOutOff
            }
            onClick={() => onClickModeButton(MODE_TYPE.CLOCK_OUT)}
            disabled={!isEnableEndStamp}
          >
            {msg().Com_Btn_ClockOut}
          </Button>
        </ButtonGroups>

        <div
          className={classNames([
            `${ROOT}__message`,
            {
              [`${ROOT}__message--disabled`]: !allowCommentInput,
            },
          ])}
        >
          <span className={`${ROOT}__message-field-wrap`}>
            <input
              type="text"
              className={`${ROOT}__message-field slds-input`}
              onChange={(e) => onChangeMessage(e.target.value)}
              disabled={!allowCommentInput}
              value={message}
            />
          </span>
        </div>

        <div className={`${ROOT}__submit`}>
          <Button
            type="primary"
            iconSrc={IconStampTime}
            onClick={() => onClickStampButton()}
            disabled={disabled}
          >
            {msg().Com_Btn_Stamp}
          </Button>
        </div>

        {enabledSubmitFixDailyRequest && !disabled ? (
          <div className={`${ROOT}__submit-fix-daily`}>
            <CoreButton
              type="button"
              color="primary"
              onClick={() => onClickSubmitFixDaily()}
            >
              {isEnableEndStamp
                ? msg().Att_Btn_ClockOutAndSubmitFixDailyRequest
                : msg().Att_Btn_SubmitFixDailyRequest}
            </CoreButton>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
