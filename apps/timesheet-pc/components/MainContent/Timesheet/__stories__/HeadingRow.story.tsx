import React from 'react';

import { action } from '@storybook/addon-actions';

import storeMock from '../../../__stories__/mock-data/storeMock';
import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import HeadingRow from '../HeadingRow';

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
  title: 'timesheet-pc/MainContent/Timesheet/HeadingRow',
  decorators: [withProvider(store)],
};

export const Default = () => (
  <div>
    <p>in thead</p>
    <table style={tableStyle}>
      <thead>
        <HeadingRow
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: false,
          }}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: false,
          }}
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
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: true,
          }}
          useManageCommuteCount={true}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: true,
          }}
          useManageCommuteCount={true}
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
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: true,
          }}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: true,
          }}
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
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: false,
          }}
          useManageCommuteCount={true}
        />
      </thead>
    </table>

    <p style={{ marginTop: 20 }}>in tfoot</p>
    <table style={tableStyle}>
      <tfoot>
        <HeadingRow
          onDragChartStart={action('Drag Started')}
          userSetting={{
            ...storeMock.common.userSetting,
            useWorkTime: false,
          }}
          useManageCommuteCount={true}
        />
      </tfoot>
    </table>
  </div>
);
