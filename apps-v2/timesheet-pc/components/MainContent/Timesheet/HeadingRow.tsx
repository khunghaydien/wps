import React from 'react';

import classNames from 'classnames';

import AccessControl from '../../../../commons/containers/AccessControlContainer';
import msg from '../../../../commons/languages';

import './HeadingRow.scss';

const ROOT = 'timesheet-pc-main-content-timesheet-heading-row';

type Props = Readonly<{
  onDragChartStart: (event: React.MouseEvent) => void;
  isManHoursGraphOpened?: boolean;
  chartPositionLeft?: number;
  setChartAreaRef?: (element: HTMLTableHeaderCellElement) => void;
  useManageCommuteCount?: boolean;
  userSetting: {
    useWorkTime: boolean;
  };
}>;

export default class HeadingRow extends React.Component<Props> {
  static defaultProps = {
    isManHoursGraphOpened: false,
    chartPositionLeft: 0,
    setChartAreaRef: () => {},
  };

  renderChartScaleUnit() {
    const units = [];
    for (let i = 0; i <= 48; i += 2) {
      units.push(<div key={`chartScaleUnit:${i}`}>{i}</div>);
    }
    return units;
  }

  render() {
    const { onDragChartStart, isManHoursGraphOpened, chartPositionLeft } =
      this.props;

    const className = classNames(ROOT, {
      [`${ROOT}--man-hours-graph-opened`]: isManHoursGraphOpened,
    });

    return (
      <tr className={className}>
        <th key="status" className={`${ROOT}__col-status`} />
        <th key="application" className={`${ROOT}__col-application`}>
          {msg().Att_Lbl_Request}
        </th>
        <th key="date" className={`${ROOT}__col-date`}>
          {msg().Att_Lbl_Date}
        </th>
        <th key="start-time" className={`${ROOT}__col-start-time`}>
          {msg().Att_Lbl_TimeIn}
        </th>
        <th key="end-time" className={`${ROOT}__col-end-time`}>
          {msg().Att_Lbl_TimeOut}
        </th>
        {this.props.useManageCommuteCount && (
          <th key="commute-count" className={`${ROOT}__col-commute-count`}>
            {msg().Att_Lbl_CommuteCountCommute}
          </th>
        )}
        <AccessControl
          allowIfByEmployee
          requireIfByDelegate={['viewTimeTrackByDelegate']}
        >
          {this.props.userSetting.useWorkTime && (
            <th className={`${ROOT}__col-time-tracking`}>
              {msg().Att_Lbl_TimeTrack}
            </th>
          )}
        </AccessControl>
        <th
          key="chart"
          className={`${ROOT}__col-chart`}
          ref={(elm) => this.props.setChartAreaRef(elm)}
        >
          <div
            className={`${ROOT}__chart-scale`}
            onMouseDown={onDragChartStart}
            style={{ left: chartPositionLeft }}
          >
            {this.renderChartScaleUnit()}
          </div>
        </th>
        <th key="remarks" className={`${ROOT}__col-remarks`}>
          {msg().Att_Lbl_Remarks}
        </th>
      </tr>
    );
  }
}
