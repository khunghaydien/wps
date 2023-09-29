import { ORDER_OF_COMMUTE_STATE } from '@attendance/domain/models/CommuteCount';

import label from './label';

export default () =>
  ORDER_OF_COMMUTE_STATE.map((state) => ({
    label: label(state),
    value: state,
  }));
