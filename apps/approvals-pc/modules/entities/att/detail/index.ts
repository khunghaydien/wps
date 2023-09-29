import * as requestConstants from '../../../ui/att/request/constants';
import { FETCH_SUCCESS } from './constants';

import {
  AttDailyDetailForStore,
  convertForStoreFromApi,
} from '../../../../../domain/models/approval/AttDailyDetail';

/**
 * 勤怠日次申請モジュール
 */
type State = AttDailyDetailForStore;

const initialState: State = {
  request: {
    id: '',
    type: '',
    typeLabel: '',
    status: '',
    employeeName: '',
    employeePhotoUrl: '',
    delegatedEmployeeName: '',
    comment: '',
    remarks: '',
  },
  historyList: [],
};

/**
 * reducer
 */
export default (state: State = initialState, action: any): State => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return convertForStoreFromApi(action.payload);
    case requestConstants.APPROVE_SUCCESS:
    case requestConstants.REJECT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
