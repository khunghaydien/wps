import { Reducer } from 'redux';

import CurrentRoute from '@apps/domain/models/psa/CurrentRoute';

const initialState = CurrentRoute.Projects;

export default ((state = initialState) => {
  return state;
}) as Reducer<string, any>;
