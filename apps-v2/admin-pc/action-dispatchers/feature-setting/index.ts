import { Dispatch } from 'redux';

import { searchFeatureSetting } from '../../actions/attendanceFeatureSetting';

import { openDetailPanel } from './panel';

export const init =
  (param: { companyId: string; targetDate?: string }) =>
  async (dispatch: Dispatch<any>) => {
    const records = (await dispatch(
      searchFeatureSetting(param)
    )) as unknown as any[];
    dispatch(openDetailPanel(records?.at(0)));
  };
