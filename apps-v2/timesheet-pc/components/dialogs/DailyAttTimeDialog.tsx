import * as React from 'react';

import debounce from 'lodash/debounce';

import Button from '../../../commons/components/buttons/Button';
import IconButton from '../../../commons/components/buttons/IconButton';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import DialogListLayout from '../../../commons/components/dialogs/layouts/DialogListLayout';
import AttTimeField from '../../../commons/components/fields/AttTimeField';
import AttTimeRangeField from '../../../commons/components/fields/AttTimeRangeField';
import Label from '../../../commons/components/fields/Label';
import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';

import { DailyAttTime } from '../../../domain/models/attendance/DailyAttTime';
import { MAX_STANDARD_REST_TIME_COUNT } from '@apps/domain/models/attendance/RestTime';

import ImgBtnMinusField from '../../images/btnMinusField.png';
import ImgBtnPlusField from '../../images/btnPlusField.png';

import './DailyAttTimeDialog.scss';

const ROOT = 'timesheet-pc-dialogs-daily-att-time-dialog';

/*
 * TODO: preventDoubleFiringはFormFrame内の処理と全く同じなので、共通化する
 * TIME_FOR_WAITING_TO_SEND_REQUEST
 *
 * ローディングレイヤーが表示されるまでメソッドの二回目の実行を止める時間です。
 * 時間は「API 通信時間 > 待機時間 > ローディングレイヤーが表示される時間」である必要があります。
 * 現在、API 通信時間は本番環境で 4000ms ~ 2000ms でした。
 * 画面の切り替えに500ms以上掛かる場合は体感的にも「遅い」はずで画面の不具合と想定します。
 * したがって、TIME_FOR_WATING_TO_SEND_REQUEST は 500ms としました。
 *
 * The time to stop the second execution of the method until the loading layer is displayed.
 * The time must be "API connection time > waiting time > loading layer display time".
 * Currently, the API connection time is 4000ms ~ 2000ms in the production environment.
 * If it takes more than 500ms to switch screens, it should be "slow" from a physical point of view and we assume that the screen is defective.
 * Therefore, I set TIME_FOR_WATING_TO_SEND_REQUEST to 500ms.
 */
const TIME_FOR_WAITING_TO_SEND_REQUEST = 500;

const preventDoubleFiring = (method: (...args) => void) =>
  debounce(method, TIME_FOR_WAITING_TO_SEND_REQUEST, {
    leading: true,
    trailing: false,
  });

const FieldItem = (props: { label: string; children: React.ReactNode }) => {
  const { label, children } = props;

  return (
    <DialogListLayout.Item>
      <Label labelCols={4} childCols={8} text={label}>
        {children}
      </Label>
    </DialogListLayout.Item>
  );
};

type Duration = {
  start: string;
  end: string;
};

type Props = {
  isLoading: boolean;
  isReadOnly: boolean;
  onUpdateClockTime: (arg0: string, arg1: any) => void;
  onUpdateRestTime: (arg0: number, arg1: string, arg2: any) => void;
  onAddRestTime: () => void;
  onDeleteRestTime: (arg0: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  dailyAttTime: DailyAttTime | null | undefined;
};

export default class DailyAttTimeDialog extends React.Component<Props> {
  static defaultProps = {
    dailyAttTime: null,
  };

  constructor(props: Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderRestItem = this.renderRestItem.bind(this);
    this.renderOtherRestTimeInput = this.renderOtherRestTimeInput.bind(this);
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onSubmit();
  }

  renderHeaderSub() {
    const { dailyAttTime } = this.props;

    if (!dailyAttTime) {
      return null;
    }

    const displayYMDd = [
      DateUtil.formatYMD(dailyAttTime.recordDate),
      `(${DateUtil.formatWeekday(dailyAttTime.recordDate)})`,
    ].join(' ');

    return (
      <time
        className={`${ROOT}__date`}
        dateTime={new Date(dailyAttTime.recordDate).toISOString()}
      >
        {displayYMDd}
      </time>
    );
  }

  renderFooter() {
    const { isReadOnly, isLoading } = this.props;

    // TODO: ロック時（リード・オンリー）の場合に、「キャンセル」ボタンのラベル文言を変更する必要があるか検討する
    const buttons = [
      <Button type="default" onClick={this.props.onCancel} key="button-hide">
        {msg().Com_Btn_Cancel}
      </Button>,
    ];

    if (!isReadOnly) {
      buttons.push(
        <Button
          submit
          onClick={preventDoubleFiring(this.onSubmit)}
          disabled={isLoading}
          type="primary"
          key="button-exec"
        >
          {msg().Com_Btn_Submit}
        </Button>
      );
    }

    return <DialogFrame.Footer>{buttons}</DialogFrame.Footer>;
  }

  renderRestItem(
    restItem: Duration,
    index: number,
    restItemList: any[]
  ): React.ReactNode {
    const { isReadOnly, onUpdateRestTime, onAddRestTime, onDeleteRestTime } =
      this.props;

    const plusButton =
      index === restItemList.length - 1 &&
      index + 1 < MAX_STANDARD_REST_TIME_COUNT &&
      !isReadOnly ? (
        <IconButton
          className={`${ROOT}__date-range-button`}
          src={ImgBtnPlusField}
          alt={msg().Att_Btn_AddItem}
          onClick={() => onAddRestTime()}
          key="icon-add"
        />
      ) : null;

    const minusButton =
      restItemList.length > 1 && !isReadOnly ? (
        <IconButton
          className={`${ROOT}__date-range-button ${ROOT}__date-range-button--minus`}
          src={ImgBtnMinusField}
          alt={msg().Att_Btn_RemoveItem}
          onClick={() => onDeleteRestTime(index)}
          key="icon-remove"
        />
      ) : null;

    return (
      <FieldItem
        label={`${msg().Att_Lbl_Rest} ${index + 1}`}
        key={`rest-${index}`}
      >
        <AttTimeRangeField
          className={`${ROOT}__date-range`}
          startTime={restItem.start}
          endTime={restItem.end}
          onBlurAtStart={(value) => onUpdateRestTime(index, 'start', value)}
          onBlurAtEnd={(value) => onUpdateRestTime(index, 'end', value)}
          disabled={isReadOnly}
        />
        {[plusButton, minusButton]}
      </FieldItem>
    );
  }

  renderOtherRestTimeInput() {
    const { isReadOnly, dailyAttTime, onUpdateClockTime } = this.props;

    if (!dailyAttTime || !dailyAttTime.hasRestTime) {
      return null;
    }

    return (
      <FieldItem label={`${msg().Att_Lbl_OtherRestTime}`} key="other-rest">
        <TextField
          className={`${ROOT}__other-rest-time`}
          type="number"
          min={0}
          max={2880}
          step={1}
          value={parseIntOrStringNull(dailyAttTime.restHours)}
          onChange={(e) => {
            onUpdateClockTime(
              'restHours',
              parseIntOrStringNull(e.target.value)
            );
          }}
          disabled={isReadOnly}
        />{' '}
        {msg().Com_Lbl_Mins}
      </FieldItem>
    );
  }

  render() {
    const { dailyAttTime, isReadOnly, onUpdateClockTime } = this.props;

    if (!dailyAttTime) {
      return null;
    }

    // TODO: ロック時（リード・オンリー）の場合に、ダイアログのタイトルを変更する必要があるか検討する
    return (
      <form onSubmit={this.onSubmit} action="/#">
        <DialogFrame
          title={msg().Att_Lbl_WorkTimeInput}
          className={ROOT}
          headerSub={this.renderHeaderSub()}
          footer={this.renderFooter()}
          hide={this.props.onCancel}
        >
          <div className={`${ROOT}__list`}>
            <DialogListLayout>
              <FieldItem label={msg().Att_Lbl_TimeIn} key="clock-in">
                <AttTimeField
                  value={dailyAttTime.startTime}
                  onBlur={(value) => onUpdateClockTime('startTime', value)}
                  disabled={isReadOnly}
                />
              </FieldItem>

              <FieldItem label={msg().Att_Lbl_TimeOut} key="clock-out">
                <AttTimeField
                  value={dailyAttTime.endTime}
                  onBlur={(value) => onUpdateClockTime('endTime', value)}
                  disabled={isReadOnly}
                />
              </FieldItem>

              {dailyAttTime.restTimes.map(this.renderRestItem)}

              {this.renderOtherRestTimeInput()}
            </DialogListLayout>
          </div>
        </DialogFrame>
      </form>
    );
  }
}
