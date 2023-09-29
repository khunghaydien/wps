import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import TextAreaField from '../../../../commons/components/fields/TextAreaField';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { State as DailyRemarks } from '../../modules/ui/editingDailyRemarks';

import './DailyRemarksDialog.scss';

const ROOT = 'timesheet-pc-dialogs-daily-remarks-dialog';

type Props = {
  onUpdateValue: (arg0: string, arg1: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isReadOnly: boolean;
  dailyRemarks: DailyRemarks | null | undefined;
};

export default class DailyAttTimeDialog extends React.Component<Props> {
  static defaultProps = {
    dailyRemarks: null,
  };

  constructor(props: Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onSubmit();
  }

  renderHeaderSub() {
    const { dailyRemarks } = this.props;

    if (!dailyRemarks) {
      return null;
    }

    const displayYMDd = [
      DateUtil.formatYMD(dailyRemarks.recordDate),
      `(${DateUtil.formatWeekday(dailyRemarks.recordDate)})`,
    ].join(' ');

    return (
      <time
        className={`${ROOT}__date`}
        dateTime={new Date(dailyRemarks.recordDate).toISOString()}
      >
        {displayYMDd}
      </time>
    );
  }

  renderFooter() {
    const { isReadOnly } = this.props;

    // TODO: ロック時（リード・オンリー）の場合に、「キャンセル」ボタンのラベル文言を変更する必要があるか検討する
    const buttons = [
      <Button type="default" onClick={this.props.onCancel} key="button-hide">
        {msg().Com_Btn_Cancel}
      </Button>,
    ];

    if (!isReadOnly) {
      buttons.push(
        <Button submit type="primary" key="button-exec">
          {msg().Com_Btn_Submit}
        </Button>
      );
    }

    return <DialogFrame.Footer>{buttons}</DialogFrame.Footer>;
  }

  render() {
    const { isReadOnly, dailyRemarks, onUpdateValue } = this.props;

    if (!dailyRemarks) {
      return null;
    }

    return (
      <form onSubmit={this.onSubmit} action="/#">
        <DialogFrame
          title={msg().Att_Lbl_Remarks}
          className={ROOT}
          headerSub={this.renderHeaderSub()}
          footer={this.renderFooter()}
          hide={this.props.onCancel}
        >
          <div className={`${ROOT}__inner`}>
            <div className={`${ROOT}__main-remarks`}>
              <TextAreaField
                value={dailyRemarks.remarks}
                maxLength={255}
                onChange={(e) => onUpdateValue('remarks', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </DialogFrame>
      </form>
    );
  }
}
