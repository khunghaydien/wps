import { processView } from '../../commons/utils/psa/resourcePlannerUtil';

import { AppDispatch } from '../modules/AppThunk';

import { setResourceAvailability } from '../../resource-pc/action-dispatchers/Resource'; // eslint-disable-next-line import/prefer-default-export

type setViewParam = {
  page?: number;
  bookedTimePerDay: Array<Array<number>>;
  view?: string;
  nextStartDate?: string;
  roleStartDate?: string;
};
const setScheduleView = (param: setViewParam) => (dispatch: AppDispatch) =>
  dispatch(
    setResourceAvailability(
      processView(
        param.page,
        param.bookedTimePerDay,
        param.view,
        param.nextStartDate,
        param.roleStartDate
      )
    )
  );

export default setScheduleView;
