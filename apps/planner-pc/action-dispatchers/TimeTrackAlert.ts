import { Dispatch } from 'redux';

import { format, isBefore, isEqual, parse } from 'date-fns';
import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';

import { catchApiError } from '../../commons/actions/app';

import AlertRepository from '../../repositories/time-tracking/AlertRepository';

import { Alert, Alerts } from '../../domain/models/time-tracking/Alert';

import { actions } from '../modules/entities/timeTrackAlert';

interface TimeTrackAlert {
  loadTimeTrackAlerts: (
    period: {
      readonly startDate: Date;
      readonly endDate: Date;
    },
    empId?: string,
    today?: Date
  ) => Promise<void>;
}

export default (dispatch: Dispatch): TimeTrackAlert => {
  return {
    /**
     * Load alerts of time tracking.
     * Alerts occurred after today are ignored because it is useless for users.
     *
     * @param period A period between which alerts are loaded
     * @param empId [optional] Delegated employee id
     * @param today [optional] Date instance representing today. This is for testing.
     */
    loadTimeTrackAlerts: async (
      period: {
        readonly startDate: Date;
        readonly endDate: Date;
      },
      empId?: string,
      today: Date = new Date()
    ): Promise<void> => {
      try {
        const result = await AlertRepository.search({
          startDate: format(period.startDate, 'YYYY-MM-DD'),
          endDate: format(period.endDate, 'YYYY-MM-DD'),
          empId,
        });

        const pastAlerts = fromPairs(
          (toPairs(result) as [string, readonly Alert[]][]).filter(
            ([key, _alerts]: [string, Alert[]]) => {
              const date = parse(key);
              return isBefore(date, today) || isEqual(date, today);
            }
          )
        ) as Alerts;

        dispatch(actions.fetchSuccess(pastAlerts));
      } catch (e) {
        dispatch(catchApiError(e, { isContinuable: true }));
      }
    },
  };
};
