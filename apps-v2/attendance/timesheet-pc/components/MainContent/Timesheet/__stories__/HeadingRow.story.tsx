import React from 'react';

import { action } from '@storybook/addon-actions';

import { withProvider } from '../../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import storeMock from '../../../__stories__/mock-data/storeMock';
import HeadingRow from '../HeadingRow';
import FixedCells from '../HeadingRow/FixedCells';
import { TIMESHEET_VIEW_TYPE } from '../TimesheetViewType';

// @ts-ignore Model統合後、mock更新でエラーが解消される
const store = configureStore(storeMock);

const tableStyle: Pick<
  React.CSSProperties,
  | 'boxSizing'
  | 'position'
  | 'width'
  | 'minWidth'
  | 'borderCollapse'
  | 'transition'
> = {
  boxSizing: 'border-box',
  position: 'relative',
  width: '100%',
  minWidth: '1024px',
  borderCollapse: 'separate',
  transition: 'height 0.3s ease-out',
};

export default {
  title: 'attendance/timesheet-pc/MainContent/Timesheet/HeadingRow',
  decorators: [withProvider(store)],
};

export const Default = () => (
  <div>
    <p>in thead</p>
    <table style={tableStyle}>
      <thead>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: false,
                useWorkTime: false,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: false,
                useWorkTime: false,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </tfoot>
    </table>
  </div>
);

Default.parameters = {
  info: { propTables: [HeadingRow], inline: true, source: true },
};

export const All = () => (
  <div>
    <p>in thead</p>
    <table style={tableStyle}>
      <thead>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          // 本来なら true である。
          // しかし、この変更をした EX-3663 ではグラフ表示が変わらないことが受け入れ条件になっている。
          // そのため Snapshot が false の時のものだったので falseにしている。
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: true,
                useWorkTime: true,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: true,
                useWorkTime: true,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </tfoot>
    </table>
  </div>
);

export const UserTimeTracking = () => (
  <div>
    <p>in thead</p>
    <table style={tableStyle}>
      <thead>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: false,
                useWorkTime: true,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: false,
                useWorkTime: true,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </tfoot>
    </table>
  </div>
);

export const UseManageCommuteCount = () => (
  <div>
    <p>in thead</p>
    <table style={tableStyle}>
      <thead>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: true,
                useWorkTime: false,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          viewType={TIMESHEET_VIEW_TYPE.GRAPH}
          onDragChartStart={action('Drag Started')}
          useFixDailyRequest={false}
          FixedCellsContainer={() => (
            <FixedCells
              {...{
                type: TIMESHEET_VIEW_TYPE.GRAPH,
                useAllowanceManagement: false,
                useFixDailyRequest: false,
                useManageCommuteCount: true,
                useWorkTime: false,
              }}
            />
          )}
          TableCellsContainer={() => null}
        />
      </tfoot>
    </table>
  </div>
);
