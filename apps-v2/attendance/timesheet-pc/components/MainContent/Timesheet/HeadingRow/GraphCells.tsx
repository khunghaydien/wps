import React from 'react';

import msg from '@commons/languages';

import { TIMESHEET_VIEW_TYPE } from '../TimesheetViewType';
import Cell from './Cell';
import ROOT from './root';

const Unit: React.FC = () => {
  const units = [];
  for (let i = 0; i <= 48; i += 2) {
    units.push(<div key={`chartScaleUnit:${i}`}>{i}</div>);
  }
  return <>{units}</>;
};

const GraphCells: React.FC<{
  chartPositionLeft: number;
  setChartAreaRef: (element: HTMLTableHeaderCellElement) => void;
  onDragChartStart: (event: React.MouseEvent) => void;
}> = ({ chartPositionLeft, setChartAreaRef, onDragChartStart }) => {
  return (
    <>
      <Cell
        type={TIMESHEET_VIEW_TYPE.GRAPH}
        key="chart"
        className={`${ROOT}__col-chart`}
        ref={(elm) => setChartAreaRef(elm)}
      >
        <div
          role="button"
          className={`${ROOT}__chart-scale`}
          onMouseDown={onDragChartStart}
          style={{ left: chartPositionLeft }}
        >
          <Unit />
        </div>
      </Cell>
      <Cell
        type={TIMESHEET_VIEW_TYPE.GRAPH}
        key="remarks"
        className={`${ROOT}__col-remarks`}
      >
        {msg().Att_Lbl_Remarks}
      </Cell>
    </>
  );
};

export default GraphCells;
