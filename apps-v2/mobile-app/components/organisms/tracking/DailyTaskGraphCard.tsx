import * as React from 'react';

import msg from '../../../../commons/languages';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import Card from '../../atoms/Card';
import HorizontalBarGraph from '../../atoms/HorizontalBarGraph';

import './DailyTaskGraphCard.scss';
import colors from '../../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-organisms-tracking-daily-task-graph-card';

type Props = Readonly<{
  realWorkTime: null | number;
  taskTimes: Array<{
    color: string;
    value: number;
  }>;
}>;

export default class DailyTaskGraphCard extends React.Component<Props> {
  render() {
    const actualWorkTime = this.props.taskTimes.reduce(
      (acc, t) => acc + t.value,
      0
    );
    const restWorkTime = (this.props.realWorkTime || 0) - actualWorkTime;
    const taskTimes = [
      ...this.props.taskTimes.map((taskTime) => ({
        ...taskTime,
        label: TimeUtil.toHmm(taskTime.value),
      })),
      {
        color: colors.gray100,
        value: restWorkTime,
        label: TimeUtil.toHmm(this.props.realWorkTime),
        labelColor: colors.textBase,
        labelAlign: 'right',
      },
    ];

    const isOvertime = actualWorkTime > (this.props.realWorkTime || 0);
    const displayActulaWorkTime =
      this.props.realWorkTime === null ? '* *' : TimeUtil.toHmm(actualWorkTime);
    const data = isOvertime
      ? [
          {
            color: colors.alert,
            value: actualWorkTime,
            label: `${displayActulaWorkTime}(+ ${TimeUtil.toHmm(
              -restWorkTime
            )})`,
          },
        ]
      : taskTimes;

    return (
      <Card className={ROOT} flat>
        {/* @ts-ignore */}
        <HorizontalBarGraph data={data} />
        <div className={`${ROOT}__footer`}>
          <div>{msg().Trac_Lbl_Tracked}</div>
          <div>{msg().Trac_Lbl_RealWorkTime}</div>
        </div>
      </Card>
    );
  }
}
