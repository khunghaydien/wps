import { shallowEqual, useSelector } from 'react-redux';

import { RequestWithPeriod } from '@apps/domain/models/time-tracking/RequestWithPeriod';

import { State } from '../modules';

export const useRequestAlert = (): RequestWithPeriod => {
  const requestAlert = useSelector(
    (state: State) => state.entities.requestAlert,
    shallowEqual
  );

  return requestAlert;
};
