import { PersonalSetting } from '@apps/domain/models/PersonalSetting';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import DispatcherMock from '../../../../__tests__/mocks/DispatcherMock';
import reducer, { fetch } from '../personalSetting';

describe('action', () => {
  describe('fetch()', () => {
    ApiMock.setDummyResponse(
      '/personal-setting/get',
      {},
      {
        plannerDefaultView: 'Daily',
        isTimeTrackSummaryOpenByDefault: true,
      }
    );

    const dispatcherMock = new DispatcherMock();

    // Call the Action Dispatcher with spy dispatcher
    fetch()(dispatcherMock.dispatch);

    test('should show spinner', () => {
      expect(dispatcherMock.logged[0]).toEqual({
        type: 'LOADING_START',
      });
    });

    test('should dispatch action to update the Personal Setting', () => {
      expect(dispatcherMock.logged[1]).toEqual({
        type: 'FETCH_PERSONAL_SETTING_SUCCESS',
        payload: {
          plannerDefaultView: 'Daily',
          isTimeTrackSummaryOpenByDefault: true,
        },
      });
    });

    test('should hide spinner', () => {
      expect(dispatcherMock.logged[2]).toEqual({
        type: 'LOADING_END',
      });
    });
  });
});

describe('reducer', () => {
  test('should update the PersonalSetting', () => {
    const prevState: PersonalSetting = {
      plannerDefaultView: 'Weekly',
      isTimeTrackSummaryOpenByDefault: false,
    };
    const nextState = reducer(prevState, {
      type: 'FETCH_PERSONAL_SETTING_SUCCESS',
      payload: {
        plannerDefaultView: 'Daily',
        isTimeTrackSummaryOpenByDefault: true,
      },
    });

    expect(nextState.plannerDefaultView).toBe('Daily');
    expect(nextState.isTimeTrackSummaryOpenByDefault).toBe(true);
  });
});
