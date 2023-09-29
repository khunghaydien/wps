import MileageUtils from '@apps/commons/utils/exp/MileageUtils';
import { AppDispatch } from '@apps/mobile-app/modules/commons/AppThunk';
import { withLoading } from '@apps/mobile-app/modules/commons/loading';

import { MileageDestinationInfo } from '@apps/domain/models/exp/Mileage';

import { actions as mileageRateActions } from '@mobile/modules/expense/entities/mileageRates';
import { actions as mileageActions } from '@mobile/modules/expense/ui/mileage';

export const setIsGeneratedPreview =
  (isGeneratedPreview?: boolean) => (dispatch: AppDispatch) => {
    return dispatch(mileageActions.setIsGeneratedPreview(isGeneratedPreview));
  };

/**
 * Search Mileage Rates
 *
 * @param {string} companyId
 * @param {string} targetDate
 * @returns
 */
export const searchMileageRates =
  (companyId: string, targetDate?: string) => (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(mileageRateActions.search(companyId, targetDate))
    );
  };

export const searchMileageRoute =
  (destinations: Array<MileageDestinationInfo>) => () => {
    const directionsService = new google.maps.DirectionsService();
    const conditions = MileageUtils.getDirectionConditions(destinations);
    return directionsService
      .route(conditions, function (response, status) {
        return { response, status };
      })
      .catch((err) => err);
  };
