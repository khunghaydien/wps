import { MileageRate } from '@apps/domain/models/exp/Mileage';

import { SEARCH_MILEAGE_RATE } from '@apps/admin-pc-v2/actions/mileageRate';

const initialState: Array<MileageRate> = [];

export default function mileageRateReducer(
  state = initialState,
  action
): Array<MileageRate> {
  switch (action.type) {
    case SEARCH_MILEAGE_RATE:
      return action.payload;
    default:
      return state;
  }
}
