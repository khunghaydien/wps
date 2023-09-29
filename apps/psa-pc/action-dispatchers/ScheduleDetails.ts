import { actions as siteRouteActions } from '@psa/modules/ui/siteRoute';

import { AppDispatch } from './AppThunk';

const showScheduleDetails = () => (dispatch: AppDispatch) => {
  dispatch(siteRouteActions.showScheduleDetails());
};

export default showScheduleDetails;
