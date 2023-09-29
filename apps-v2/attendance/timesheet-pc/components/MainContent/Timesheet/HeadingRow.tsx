import React from 'react';

import classNames from 'classnames';

import GraphCells from './HeadingRow/GraphCells';
import ROOT from './HeadingRow/root';
import { TIMESHEET_VIEW_TYPE, TimesheetViewType } from './TimesheetViewType';

import './HeadingRow.scss';

type Props = Readonly<{
  viewType: TimesheetViewType;
  isManHoursGraphOpened?: boolean;
  chartPositionLeft?: number;
  useFixDailyRequest?: boolean;
  setChartAreaRef?: (element: HTMLTableHeaderCellElement) => void;
  onDragChartStart: (event: React.MouseEvent) => void;
  FixedCellsContainer: React.ComponentType;
  TableCellsContainer: React.ComponentType;
}>;

export default class HeadingRow extends React.Component<Props> {
  static defaultProps = {
    isManHoursGraphOpened: false,
    chartPositionLeft: 0,
    setChartAreaRef: () => {},
  };

  render() {
    const {
      onDragChartStart,
      isManHoursGraphOpened,
      chartPositionLeft,
      FixedCellsContainer,
      TableCellsContainer,
    } = this.props;

    const className = classNames(ROOT, {
      [`${ROOT}--man-hours-graph-opened`]: isManHoursGraphOpened,
    });

    return (
      <tr className={className}>
        <FixedCellsContainer />
        {this.props.viewType === TIMESHEET_VIEW_TYPE.GRAPH ? (
          <GraphCells
            setChartAreaRef={this.props.setChartAreaRef}
            chartPositionLeft={chartPositionLeft}
            onDragChartStart={onDragChartStart}
          />
        ) : (
          <TableCellsContainer />
        )}
      </tr>
    );
  }
}
