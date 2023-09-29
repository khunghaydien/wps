import { Dispatch } from 'redux';

import { searchFeatureSetting } from '../../actions/attendanceFeatureSetting';

export const search =
  (param: { companyId: string; targetDate?: string }) =>
  (dispatch: Dispatch<any>) => {
    dispatch(searchFeatureSetting(param));
  };
