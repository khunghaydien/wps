import { isBefore, isEqual, parse } from 'date-fns';
import fromPairs from 'lodash/fromPairs';
import toPairs from 'lodash/toPairs';

import { catchApiError } from '../../../commons/actions/app';

import AlertRepository from '../../../repositories/time-tracking/AlertRepository';

import { Alerts } from '../../../domain/models/time-tracking/Alert';

import { actions } from '../modules/entities/timeTrackAlert';

import { AppDispatch } from './AppThunk';

// eslint-disable-next-line import/prefer-default-export
export const loadTimeTrackAlerts =
  (
    period: { readonly startDate: string; readonly endDate: string },
    empId?: string,
    today = new Date()
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const result = await AlertRepository.search({
        startDate: period.startDate,
        endDate: period.endDate,
        empId,
      });

      const pastAlerts = fromPairs(
        toPairs(result).filter(([key, _alerts]) => {
          const date = parse(key);
          return isBefore(date, today) || isEqual(date, today);
        })
      ) as Alerts;

      dispatch(actions.fetchSuccess(pastAlerts));
    } catch (e) {
      dispatch(catchApiError(e, { isContinuable: true }));
    }
  };
