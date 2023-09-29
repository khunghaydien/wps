import { SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING } from '../actions/attendanceFeatureSetting';
import { SEARCH_HISTORY_COST_CENTER } from '../actions/costCenter';
import { SEARCH_HISTORY_DEPARTMENT } from '../actions/department';
import { SEARCH_HISTORY_EMPLOYEE } from '../actions/employee';
import { INITIALIZE_HISTORY } from '../actions/history';
import { SEARCH_LEGAL_AGREEMENT_TYPE } from '../actions/legalAgreement';
import { SEARCH_HISTORY_SHORT_TIME_WORK_SETTING } from '../actions/shortTimeWorkSetting';
import { SEARCH_HISTORY_TAX_TYPE } from '../actions/taxType';
import { SEARCH_HISTORY_TIME_SETTING } from '../actions/timeSetting';
import { SEARCH_HISTORY_WORKING_TYPE } from '../actions/workingType';
import { SEARCH_MILEAGE_RATE_HISTORY } from '@apps/admin-pc-v2/actions/mileageRate';

const initialState = [];

export default function searchCompanyReducer(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_HISTORY:
      return initialState;
    case SEARCH_HISTORY_COST_CENTER:
    case SEARCH_HISTORY_DEPARTMENT:
    case SEARCH_HISTORY_EMPLOYEE:
    case SEARCH_HISTORY_SHORT_TIME_WORK_SETTING:
    case SEARCH_HISTORY_WORKING_TYPE:
    case SEARCH_LEGAL_AGREEMENT_TYPE:
    case SEARCH_HISTORY_TIME_SETTING:
    case SEARCH_HISTORY_TAX_TYPE:
    case SEARCH_MILEAGE_RATE_HISTORY:
    case SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING:
      return action.payload;
    default:
      return state;
  }
}
