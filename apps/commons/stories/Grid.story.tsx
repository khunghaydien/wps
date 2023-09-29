import React from 'react';

import { action } from '@storybook/addon-actions';

import Grid from '../components/Grid';
import DateYM from '../components/Grid/Formatters/DateYM';
import Icon from '../components/Grid/Formatters/Icon';
import TypeAndDuration from '../components/Grid/Formatters/TypeAndDuration';

import iconStatusMetaReapplying from '../images/iconStatusMetaReapplying.png';

export default {
  title: 'commons',
};

export const _Grid = () => (
  <Grid
    onChangeRowSelection={action('change')}
    onClickRow={action('click')}
    columns={[
      {
        name: 'column1',
        key: 'column1',
        width: 100,
        shrink: true,
        grow: false,
      },
      {
        name: 'column2',
        key: 'column2',
        width: 200,
        shrink: true,
        grow: true,
      },
    ]}
    data={[
      { id: 'id1', column1: 'aa', column2: 'long long long long long' },
      { id: 'id2', column1: 'aa1', column2: 'bb1' },
    ]}
    idKey="id"
    browseId="id1"
    selected={['id2']}
  />
);

_Grid.parameters = { info: { propTables: [Grid], inline: true, source: true } };

export const GridEllipsis = () => (
  // @ts-ignore
  <Grid
    ellipsis
    columns={[
      {
        name: 'column1',
        key: 'column1',
        width: 100,
        shrink: true,
        grow: false,
      },
      {
        name: 'column2',
        key: 'column2',
        width: 200,
        shrink: true,
        grow: true,
      },
    ]}
    data={[
      { id: 'id1', column1: 'aa', column2: 'long long long long long' },
      { id: 'id2', column1: 'aa1', column2: 'bb1' },
    ]}
    idKey="id"
    selected={[]}
  />
);

GridEllipsis.storyName = 'Grid - ellipsis';
GridEllipsis.parameters = {
  info: { propTables: [Grid], inline: true, source: true },
};

export const GridFormatter = () => (
  // @ts-ignore
  <Grid
    ellipsis
    columns={[
      {
        name: 'column1',
        key: 'column1',
        width: 100,
        shrink: true,
        grow: false,
        formatter: DateYM,
      },
      {
        name: 'column2',
        key: 'column2',
        width: 200,
        shrink: true,
        grow: true,
      },
      {
        name: 'column3',
        key: 'column3',
        width: 200,
        shrink: true,
        grow: true,
        addon: (props) => {
          return props.data.column3.type === 'FOOBAR' ? (
            <Icon {...props} src={iconStatusMetaReapplying} align="bottom" />
          ) : (
            <Icon {...props} src={iconStatusMetaReapplying} align="top" />
          );
        },
        formatter: TypeAndDuration,
      },
      {
        name: 'column4',
        key: 'column4',
        width: 200,
        shrink: true,
        grow: true,
        addon: (props) => {
          return props.data.id === 'id3' ? (
            <Icon {...props} src={iconStatusMetaReapplying} align="middle" />
          ) : null;
        },
        formatter: TypeAndDuration,
      },
      {
        name: 'column5',
        key: 'column5',
        width: 200,
        shrink: true,
        grow: true,
        addon: (props) => {
          return props.data.id === 'id2' ? (
            <Icon {...props} src={iconStatusMetaReapplying} align="top" />
          ) : null;
        },
        formatter: TypeAndDuration,
      },
    ]}
    data={[
      {
        id: 'id1',
        column1: '1999/1',
        column2: 'long long long long long',
        column3: {
          startDate: '2019-09-09',
          type: 'FOOBAR',
        },
        column4: {
          startDate: '2019-09-09',
          type: 'FOOBAR',
        },
        column5: {
          startDate: '2019-09-09',
          type: 'FOOBAR',
        },
      },
      {
        id: 'id2',
        column1: '1999/5',
        column2: 'bb1',
        column3: { startDate: '2019-09-09', type: 'HOGE' },
        column4: { startDate: '2019-09-09', type: 'HOGE' },
        column5: { startDate: '2019-09-09', type: 'HOGE' },
      },
      {
        id: 'id3',
        column1: '1999/5',
        column2: 'bb1',
        column3: { startDate: '2019-09-09', type: 'ホゲホゲ申請' },
        column4: { startDate: '2019-09-09', type: 'ホゲホゲ申請' },
        column5: { startDate: '2019-09-09', type: 'ホゲホゲ申請' },
      },
    ]}
    idKey="id"
    selected={[]}
  />
);

GridFormatter.storyName = 'Grid - Formatter';

GridFormatter.parameters = {
  info: {
    text: `
Formatterは日付や時刻など、値を変換してカスタマイズされた表示を作ることができます。
columns[].formatterに指定します。
`,
    propTables: [Grid],
    inline: true,
    source: true,
  },
};
