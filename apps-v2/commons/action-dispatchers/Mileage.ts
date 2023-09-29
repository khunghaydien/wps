import MileageUtils from '@apps/commons/utils/exp/MileageUtils';
import msg from '@commons/languages';

import {
  getRecentlyUsedDestinations,
  MileageDestinationInfo,
} from '@apps/domain/models/exp/Mileage';

import { AppDispatch } from '../modules/AppThunk';

import { catchApiError } from '../actions/app';

export const getRecentDestinations =
  (employeeId: string, companyId: string) =>
  (dispatch: AppDispatch): Promise<Array<string>> => {
    return getRecentlyUsedDestinations(employeeId, companyId)
      .then((result) => {
        return result.records;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        return [];
      });
  };

export const searchDirections = (
  destinations: Array<MileageDestinationInfo>,
  callback: (
    directionsResult?: google.maps.DirectionsResult,
    distance?: number,
    err?: google.maps.DirectionsStatus | string
  ) => void
) => {
  if (!google || !google.maps || !google.maps.DirectionsService)
    return callback(undefined, undefined, msg().Exp_Lbl_MapUsageLimitExceed);
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(
    MileageUtils.getDirectionConditions(destinations),
    function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        const { routes } = response;
        const legs = routes[0].legs;
        const distance = legs.reduce(
          (dist, leg) => dist + leg.distance.value,
          0
        );
        callback(response, distance);
      } else {
        callback(response, undefined, status);
      }
    }
  );
};
