import { processView } from '../../commons/utils/psa/resourcePlannerUtil';

import { ViewTypes } from '../../domain/models/psa/Resource';

import { AppDispatch } from '../modules/AppThunk';

import { setResourceAvailability } from '../../resource-pc/action-dispatchers/Resource'; // eslint-disable-next-line import/prefer-default-export

export default (dispatch: AppDispatch) => ({
  setView: ({
    page = 0,
    bookedTimePerDay,
    view = ViewTypes.DAY,
    nextStartDate = '',
    roleStartDate = '',
  }: {
    page?: number;
    bookedTimePerDay: Array<Array<number>>;
    view?: string;
    nextStartDate?: string;
    roleStartDate?: string;
  }) =>
    dispatch(
      setResourceAvailability(
        processView(page, bookedTimePerDay, view, nextStartDate, roleStartDate)
      )
    ),
});
