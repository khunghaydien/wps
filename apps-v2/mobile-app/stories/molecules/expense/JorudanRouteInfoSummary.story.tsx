import React from 'react';

import { withInfo } from '@storybook/addon-info';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import JorudanRouteInfoSummary from '../../../components/molecules/expense/JorudanRouteInfoSummary';

export default {
  title: 'Components/molecules/expense/JorudanRouteInfoSummary',
  decorators: [
    withKnobs,
    withInfo,
    (story: (...args: Array<any>) => any) => <div>{story()}</div>,
  ],
};

export const Basic = () => {
  return (
    <JorudanRouteInfoSummary
      routeInfo={{
        roundTrip: false,
        origin: {
          name: text('orignName', '出発地'),
          category: '',
          company: '',
        },
        arrival: {
          name: text('arrivalName', '目的地'),
          category: '',
          company: '',
        },
        viaList: [],
        selectedRoute: {
          key: '',
          cost: 0,
          roundTripCost: 0,
          existsIcCost: false,
          requiredTime: 0,
          transferNumber: 0,
          pathNumber: 0,
          distance: 0,
          status: {
            isEarliest: boolean('isEarlist', true),
            isCheapest: boolean('isCheapest', true),
            isMinTransfer: boolean('isMinTransfer', true),
          },
          fareMap: {
            key: '',
            fare: 0,
            roundTripFare: 0,
            isRoundDiscount: '',
            isIcFare: false,
            exceptCommuterRoute: false,
          },
          expressMap: {
            key: '',
            fee: 0,
            green: 0,
            sleeping: 0,
            roundTripFee: 0,
            roundTripGreen: 0,
            roundTripSleeping: 0,
            season: 0,
            isConnectionDiscount: 0,
          },
          pathList: [],
          fare1: 0,
          fare3: 0,
          fare6: 0,
        },
      }}
    />
  );
};

Basic.story = {
  parameters: {
    info: {
      text: `
        # Description

        明細一覧リストアイテム内で必要なジョルダンの概要を表示します。
      `,
    },
  },
};
