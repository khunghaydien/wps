import React from 'react';

import RouteMap from '../components/Route/RouteMap';

const selectedRoute = {
  transferNumber: 1,
  status: {
    isMinTransfer: true,
    isEarliest: true,
    isCheapest: false,
  },
  roundTripCost: 940,
  requiredTime: 43,
  pathNumber: 2,
  pathList: [
    {
      travelTime: 5,
      transfer: false,
      toName: '下北沢',
      seatName: '',
      seatList: [],
      seatCode: '',
      requiredTime: 5,
      lineType: '1',
      lineName: '京王井の頭線',
      key: '1',
      fromName: '渋谷',
      fareKey: 'TK-1',
      expressKey: 'TK-0',
      distance: 3,
      airLine: '',
    },
    {
      travelTime: 0,
      transfer: true,
      toName: '町田',
      seatName: '',
      seatList: [],
      seatCode: '',
      requiredTime: 28,
      lineType: '1',
      lineName: '小田急線',
      key: '2',
      fromName: '下北沢',
      fareKey: 'TK-2',
      expressKey: 'TK-0',
      distance: 25.9,
      airLine: '',
    },
  ],
  key: '2',
  fareMap: {
    'TK-2': {
      roundTripFare: 680,
      key: 'TK-2',
      isRoundDiscount: false,
      isIcFare: false,
      fare: 340,
      exceptCommuterRoute: false,
    },
    'TK-1': {
      roundTripFare: 260,
      key: 'TK-1',
      isRoundDiscount: false,
      isIcFare: false,
      fare: 130,
      exceptCommuterRoute: false,
    },
  },
  expressMap: {
    'TK-0': {
      sleeping: 0,
      season: -1,
      roundTripSleeping: 0,
      roundTripGreen: 0,
      roundTripFee: 0,
      key: 'TK-0',
      isConnectionDiscount: false,
      green: 0,
      fee: 0,
    },
  },
  existsIcCost: false,
  distance: 28.9,
  cost: 470,
};

export default {
  title: 'commons/Route',
};

export const _RouteMap = () => (
  <RouteMap selectedRoute={selectedRoute as any} isEditing={false} />
);

_RouteMap.storyName = 'RouteMap';
_RouteMap.parameters = {
  info: { propTables: [RouteMap], inline: true, source: true },
};
