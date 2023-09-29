import { Reducer } from 'redux';

import CurrentRoute from '@apps/domain/models/psa/CurrentRoute';

const initialState = CurrentRoute.Resource;

export default ((state = initialState) => {
  return state;
}) as Reducer<string, any>;
