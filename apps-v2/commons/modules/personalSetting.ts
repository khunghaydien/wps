import PersonalSettingRepository from '@apps/repositories/PersonalSettingRepository';

import { PersonalSetting } from '@apps/domain/models/PersonalSetting';

import { catchApiError, loadingEnd, loadingStart } from '../actions/app';

import { AppDispatch } from './AppThunk';

type ResponseBody = PersonalSetting;

type FetchSuccessAction = {
  type: 'FETCH_PERSONAL_SETTING_SUCCESS';
  payload: PersonalSetting;
};

/**
 * Creates an action to update the Personal Setting
 * @param {PersonalSetting} result The response from backend API
 */
export const fetchSuccess = (result: ResponseBody): FetchSuccessAction => ({
  type: 'FETCH_PERSONAL_SETTING_SUCCESS',
  payload: result,
});

/**
 * Fetches the Personal Setting.
 * @see https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/518291840/personal-setting+get
 * @see {@link fetchSuccess}
 */
export const fetch =
  (empId?: string) =>
  (dispatch: AppDispatch): Promise<PersonalSetting> => {
    dispatch(loadingStart());

    return PersonalSettingRepository.fetch({ empId })
      .then((result: ResponseBody) => {
        dispatch(fetchSuccess(result));
        return result;
      })
      .catch((error: Error) => catchApiError(error, { isContinuable: false }))
      .then((result) => {
        dispatch(loadingEnd());
        return result;
      });
  };

type State = PersonalSetting;

const initialState: PersonalSetting = {
  plannerDefaultView: 'Weekly',
  isTimeTrackSummaryOpenByDefault: false,
};

type Action = FetchSuccessAction;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'FETCH_PERSONAL_SETTING_SUCCESS':
      return (action as FetchSuccessAction).payload;

    default:
      return state;
  }
};
