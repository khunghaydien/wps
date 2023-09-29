import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';

import { WorkingType } from '@apps/attendance/domain/models/WorkingType';

import { ROW_TYPE } from '../../../../modules/attendance/timesheet/entities';

import MonthlyListItem from '../../../../components/molecules/attendance/MonthlyList/MonthlyListItem';

export default {
  title: 'Components/molecules/attendance/MonthlyList',
  decorators: [withKnobs, withInfo],
};

const workingType = {
  useFixDailyRequest: false,
} as unknown as WorkingType;

export const _MonthlyListItem = (): React.ReactNode => (
  <React.Fragment>
    <MonthlyListItem
      rowType={text('rowType', ROW_TYPE.WORKDAY)}
      date={text('date', '2018-10-10')}
      startTime={text('startTime', '9:00')}
      endTime={text('endTime', '18:00')}
      workingTypeStartTime={text('workingTypeStartTime', '9:00')}
      workingTypeEndTime={text('workingTypeEndTime', '18:00')}
      onClick={action('click')}
      // @ts-ignore
      requestStatus={text('requestStatus', 'Approval In')}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.WORKDAY}
      date="2010-10-11"
      startTime="9:00"
      endTime="18:00"
      workingTypeStartTime="9:00"
      workingTypeEndTime="18:00"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.WORKDAY}
      date="2010-10-12"
      workingTypeStartTime="9:00"
      workingTypeEndTime="18:00"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.HOLIDAY}
      date="2010-10-13"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.LEGAL_HOLIDAY}
      date="2010-10-14"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.ALL_DAY_PAID_LEAVE}
      date="2010-10-15"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.ALL_DAY_UNPAID_LEAVE}
      date="2010-10-16"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.AM_PAID_LEAVE}
      date="2010-10-17"
      onClick={action('click')}
      startTime="14:00"
      endTime="18:00"
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.PM_PAID_LEAVE}
      date="2010-10-18"
      onClick={action('click')}
      workingTypeStartTime="10:00"
      workingTypeEndTime="14:00"
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.AM_UNPAID_LEAVE}
      date="2010-10-19"
      onClick={action('click')}
      startTime="14:00"
      endTime="18:00"
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.PM_UNPAID_LEAVE}
      date="2010-10-20"
      onClick={action('click')}
      workingTypeStartTime="10:00"
      workingTypeEndTime="14:00"
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.AM_PAID_LEAVE_PM_UNPAID_LEAVE}
      date="2010-10-21"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.AM_UNPAID_LEAVE_PM_PAID_LEAVE}
      date="2010-10-22"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={false}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.WORKDAY}
      date="2010-10-23"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={workingType}
      useFixDailyRequest={true}
    />
    <MonthlyListItem
      rowType={ROW_TYPE.WORKDAY}
      date="2010-10-24"
      onClick={action('click')}
      requestStatus={null}
      attentionMessages={['test']}
      fixDailyRequestStatus="NotRequested"
      workingType={{ ...workingType, useFixDailyRequest: true }}
      useFixDailyRequest={true}
    />
  </React.Fragment>
);

_MonthlyListItem.storyName = 'MonthlyListItem';

_MonthlyListItem.parameters = {
  info: {
    text: `
      # Description

      勤務表のリストアイテムに使われるコンポーネントです。

      # Props

      - \`dayType\`: \`Workday\` | \`Holiday\` | \`LegalHoliday\`
      - \`date\`: string (YYYY-MM-DD)
      - \`startTime\`: string
      - \`endTime\`: string
      - \`workingTypeStartTime\`: string
      - \`workingTypeEndTime\`: string
      - \`onClick\`: Function
      - \`leaveRequests\`: AttDailyRequest[]
      - \`isLeaveOfAbsence\`: boolean
      - \`hasAbsenceRequest\`: boolean

      # Status and Color

      以下の条件で行の色が変化します(上に行くほど優先)

      ※注意※デザインガイドラインにない色を使用しています

      - 休職休業中(isLeaveOfAbsence)
        -> 灰縞

      - 欠勤申請がある(hasAbsenceRequest)
        - [欠勤申請]有給の午後半休がある
          -> 前半が灰縞、後半が橙縞
        - [欠勤申請]有給の午前半休、半日休、時間単位休がある
          -> 前半が橙縞、後半が灰縞
        - [欠勤申請]それ以外
          -> 灰縞

      - 所定休日、法定休日である
        -> 赤(法定休日), 青(所定休日)
        ※振替休暇の場合もここ

      - 全日休がある
      - 有給・無給が同じ午前半休と午後半休がある
      - 有給・無給が同じ半日休が2つある
        -> 橙縞または灰縞
        ※年次有給休暇は有給休暇と同じ、代休は無給休暇と同じ表示とする。以下同様

      - 全日休ではない休暇が1つある
        -> 行の半分が橙縞または灰縞になる(午前半休・半日休・時間単位休は前半部、午後半休は後半部)

      - 午前半休と午後半休があり有給・無給が異なる
        -> 橙縞と灰縞が半分ずつ

      - 午前半休または午後半休と、時間単位休がある
        -> 午前半休または午後半休を優先的に表示

      - 半日休がある
        -> 午前半休が1つある場合と同じ

      - 時間単位休がある
        -> 午前半休が1つある場合と同じ

      - 上記すべてにあてはまらない
        -> 白
    `,
  },
};
