import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from '@apps/planner-pc/modules/';

import UnsubmittedAlert from '../index';

export default {
  title: 'planner-pc/UnsubmittedAlert',
};

export const Alert = () => {
  return (
    <Provider
      store={createStore(reducer, {
        entities: {
          requestAlert: {
            startDate: new Date(2021, 2, 1),
            endDate: new Date(2021, 2, 31),
            alert: true,
            id: 'id',
          },
        },
      })}
    >
      <UnsubmittedAlert />
    </Provider>
  );
};
