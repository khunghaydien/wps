import { Dispatch } from 'redux';

import { searchWorkingType } from '../../actions/workingType';

import { closeDetailPanel } from './panel';

// eslint-disable-next-line import/prefer-default-export
export const search =
  (param: { companyId: string; targetDate?: string }) =>
  (dispatch: Dispatch<any>) => {
    dispatch(closeDetailPanel());
    dispatch(searchWorkingType(param));
  };
