import _ from 'lodash';

import msg from '../../../commons/languages';
import { endLoading, startLoading } from '../../modules/commons/loading';

import { SearchRouteParam } from '../../../domain/models/exp/jorudan/Route';
import {
  getSuggestion,
  searchStation,
  Station,
} from '../../../domain/models/exp/jorudan/Station';

import { AppDispatch } from '../../modules/expense/AppThunk';
/**
 * Get suggestion list when search station
 *
 * @param {string} searchString
 * @param {string} targetDate
 * @param {?string} [category=null]
 */
export const getStationSuggestion =
  (searchString: string, targetDate: string, category?: string) =>
  (dispatch: AppDispatch) => {
    const loadingId = dispatch(startLoading());

    return getSuggestion(searchString, targetDate, category).then((result) => {
      dispatch(endLoading(loadingId));
      return result;
    });
  };

export const searchStations =
  (searchRouteParam: SearchRouteParam) =>
  (dispatch: AppDispatch): Promise<{ param: any; errors: any }> => {
    const param: any = { ...searchRouteParam };
    const errors = {};
    const searchStationList = [];

    // helper functions
    const searchStationWithKey = (key: string) =>
      searchStation(_.get(param, `${key}.name`), param.targetDate, null)
        .then((result: Station) => {
          if (result.num > 0) {
            const station = result.stationList[0];
            _.set(param, key, station);
          } else {
            _.set(errors, `${key}.name`, msg().Cmn_Lbl_SuggestNoResult);
          }
        })
        .catch((err) => {
          throw err;
        });

    if (!param.origin.company && param.origin.name) {
      searchStationList.push(searchStationWithKey('origin'));
    }

    if (!param.arrival.company && param.arrival.name) {
      searchStationList.push(searchStationWithKey('arrival'));
    }

    if (param.viaList.length > 0) {
      param.viaList.forEach((viaList, id) => {
        if (!viaList.company && viaList.name) {
          searchStationList.push(searchStationWithKey(`viaList.${id}`));
        }
      });
    }

    const loadingId = dispatch(startLoading());
    return Promise.all(searchStationList).then(() => {
      dispatch(endLoading(loadingId));
      const result = {
        param,
        errors,
      };

      return result;
    });
  };
