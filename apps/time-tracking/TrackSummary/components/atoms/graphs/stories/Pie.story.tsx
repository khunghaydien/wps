import React from 'react';

import styled from 'styled-components';

import Pie from '../Pie';

const data = [
  {
    id: 'R06(19/07)_WSP_Entire／Design',
    label: 'R06(19/07)_WSP_Entire／Design',
    value: 62.0,
  },
  {
    id: 'R06(19/07)_WSP_Entire／Meeting&Others',
    label: 'R06(19/07)_WSP_Entire／Meeting&Others',
    value: 23.0,
  },
  {
    id: '（PD-Common）Others',
    label: '（PD-Common）Others',
    value: 12.3,
  },
  {
    id: '（PD-Common）Recruiting',
    label: '（PD-Common）Recruiting',
    value: 2.1,
  },
  {
    id: '（PD-Common）Meeting／ミーティング他',
    label: '（PD-Common）Meeting／ミーティング他',
    value: 0.1,
  },
];

const data2 = [
  { id: '1', label: '#76a7df', value: 5 },
  { id: '2', label: '#9357ea', value: 5 },
  { id: '3', label: '#54a9a3', value: 5 },
  { id: '4', label: '#eba861', value: 5 },
  { id: '5', label: '#2e6ecb', value: 5 },
  { id: '6', label: '#d36763', value: 5 },
  { id: '7', label: '#3ec0c9', value: 5 },
  { id: '8', label: '#d195db', value: 5 },
  { id: '9', label: '#71c274', value: 5 },
  { id: '10', label: '#d0cb4f', value: 5 },
  { id: '11', label: '#4d9ed8', value: 5 },
  { id: '12', label: '#d98a69', value: 5 },
  { id: '13', label: '#76a7df', value: 5 },
  { id: '14', label: '#9357ea', value: 5 },
  { id: '15', label: '#54a9a3', value: 5 },
  { id: '16', label: '#eba861', value: 5 },
  { id: '17', label: '#2e6ecb', value: 5 },
];

export default {
  title: 'time-tracking/TrackSummary/Graphs',

  decorators: [
    (story: Function) => {
      const Container = styled.div`
        height: 72px;
        width: 72px;
      `;
      return <Container>{story()}</Container>;
    },
  ],
};

export const _Pie = () => <Pie data={data} />;
export const PieColors = () => <Pie data={data2} />;

PieColors.storyName = 'Pie/Colors';
