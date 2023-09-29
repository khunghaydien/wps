import React from 'react';

import range from 'lodash/range';
import numeral from 'numeral';

import variables from '../../../../../commons/styles/wsp.scss';
import TimeUtil from '../../../../../commons/utils/TimeUtil';

import DataTable from '../DataTable';

const data = [
  {
    jobName: 'R06(19/07)_WSP_Entire/Design',
    workTimeRatio: 62.0,
    workTime: 5829,
  },
  {
    jobName: 'R06(19/07)_WSP_Entire／Meeting&Others',
    workTimeRatio: 23.0,
    workTime: 2160,
  },
  {
    jobName: '（PD-Common）Others',
    workTimeRatio: 12.3,
    workTime: 990,
  },
  {
    jobName: '（PD-Common）Recruting',
    workTimeRatio: 2.1,
    workTime: 210,
  },
  {
    jobName: '（PD-Common）Meeting/ミーティング他',
    workTimeRatio: 0.1,
    workTime: 30,
  },
];

export default {
  title: 'time-tracking/TrackSummary',
};

// eslint-disable-next-line no-underscore-dangle
export const _DataTable = () => (
  <DataTable
    data={data}
    colors={range(1, 13).map((i) => variables[`graph-color-${i}`])}
    column={{
      'Job/Work Category': ({ jobName }) => <>{jobName}</>,
      'Working Percentage': (row) => (
        <>{`${numeral(row.workTimeRatio).format('0.0')}%`}</>
      ),
      'Working Hours': (row) => <>{TimeUtil.toHHmm(row.workTime)}</>,
    }}
  />
);

_DataTable.storyName = 'DataTable';
