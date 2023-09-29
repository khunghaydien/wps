import React from 'react';

import { action } from '@storybook/addon-actions';

import transportationType from '../constants/transportationType';

import Route from '../components/Route';

const routeList = [
  {
    place: '東京',
    transportationType: transportationType.BULLET_TRAIN,
    transportationName: 'のぞみ49号(自由席)[博多行き]',
    price: 10000,
  },
  {
    place: '新大阪',
    transportationType: transportationType.TRAIN,
    transportationName: '東海道本線(普通)[西有明行き]',
    price: 3600,
  },
  {
    place: '梅田',
    transportationType: transportationType.WALK,
    transportationName: '徒歩',
    price: 0,
  },
  {
    place: '大阪',
  },
];

const attentionIcon = {
  yasui: true,
  hayai: true,
  raku: true,
};

const routeInfo = {
  from: '東京',
  to: '大阪',
  roundTrip: false,
  attentionIcon,
  routeList,
};

const routeInfo2 = {
  from: '東京',
  to: '大阪',
  roundTrip: true,
  attentionIcon,
  routeList,
};

export default {
  title: 'commons/Route',
};

export const Route片道 = () => (
  // @ts-ignore
  <Route
    routeInfo={routeInfo as any}
    onClickRouteFinderButton={action('click onClickRouteFinderButton')}
  />
);

Route片道.storyName = 'Route - 片道';
Route片道.parameters = {
  info: { propTables: [Route], inline: true, source: true },
};

export const Route往復 = () => (
  // @ts-ignore
  <Route
    routeInfo={routeInfo2 as any}
    onClickRouteFinderButton={action('click onClickRouteFinderButton')}
  />
);

Route往復.storyName = 'Route - 往復';
Route往復.parameters = {
  info: { propTables: false, inline: true, source: true },
};
