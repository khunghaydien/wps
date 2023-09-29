import { cloneDeep } from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import msg from '../../commons/languages';

import { SearchRouteParam } from '../../domain/models/exp/jorudan/Route';
import {
  searchStation,
  Station,
  StationInfo,
} from '../../domain/models/exp/jorudan/Station';
import { RouteInfo } from '../../domain/models/exp/Record';

import { actions as routeActions } from '../../domain/modules/exp/jorudan/route';
import { AppDispatch } from '../modules/AppThunk';
import { actions as activeDialogActions } from '../modules/ui/expenses/dialog/activeDialog';
import { actions as arrivalActions } from '../modules/ui/expenses/recordItemPane/routeForm/arrival';
import { actions as tmpArrivalActions } from '../modules/ui/expenses/recordItemPane/routeForm/edits/arrival';
import { actions as tmpOriginActions } from '../modules/ui/expenses/recordItemPane/routeForm/edits/origin';
import { actions as tmpViaListActions } from '../modules/ui/expenses/recordItemPane/routeForm/edits/viaList';
import { actions as arrivalErrorActions } from '../modules/ui/expenses/recordItemPane/routeForm/errors/arrival';
import { actions as originErrorActions } from '../modules/ui/expenses/recordItemPane/routeForm/errors/origin';
import { actions as viaListErrorActions } from '../modules/ui/expenses/recordItemPane/routeForm/errors/viaList';
import { actions as originActions } from '../modules/ui/expenses/recordItemPane/routeForm/origin';
import { actions as roundTripActions } from '../modules/ui/expenses/recordItemPane/routeForm/roundTrip';
import { actions as viaListActions } from '../modules/ui/expenses/recordItemPane/routeForm/viaList';

export const searchRoute =
  (
    searchRouteParam: SearchRouteParam,
    tmpOrigin: string,
    tmpArrival: string,
    tmpViaList: Array<string>
  ) =>
  (dispatch: AppDispatch) => {
    const param = cloneDeep(searchRouteParam);
    const searchStationList = [];

    if (!param.origin) {
      if (tmpOrigin) {
        searchStationList.push(
          searchStation(tmpOrigin, param.targetDate, null)
            .then((result: Station) => {
              if (result.num > 0) {
                const station = result.stationList[0];
                (param as any).origin = station;
                dispatch(originActions.set(station));
                dispatch(tmpOriginActions.set(station.name));
                dispatch(originErrorActions.clear());
                return true;
              } else {
                dispatch(originErrorActions.set(msg().Cmn_Lbl_SuggestNoResult));
                return false;
              }
            })
            .catch((err) => {
              dispatch(catchApiError(err, { isContinuable: true }));
              return false;
            })
        );
      } else {
        dispatch(originErrorActions.set(msg().Exp_Err_OriginNotDecided));
      }
    }
    if (!param.arrival) {
      if (tmpArrival) {
        searchStationList.push(
          searchStation(tmpArrival, param.targetDate, null)
            .then((result: Station) => {
              if (result.num > 0) {
                const station = result.stationList[0];
                (param as any).arrival = station;
                dispatch(arrivalActions.set(station));
                dispatch(tmpArrivalActions.set(station.name));
                dispatch(arrivalErrorActions.clear());
                return true;
              } else {
                dispatch(
                  arrivalErrorActions.set(msg().Cmn_Lbl_SuggestNoResult)
                );
                return false;
              }
            })
            .catch((err) => {
              dispatch(catchApiError(err, { isContinuable: true }));
              return false;
            })
        );
      } else {
        dispatch(arrivalErrorActions.set(msg().Exp_Err_ArrivalNotDecided));
      }
    }

    const narrowViaList = [];
    tmpViaList.forEach((tmpVia, idx) => {
      if (!tmpVia && !param.viaList[idx]) {
        narrowViaList.push(idx);
      }
    });
    if (narrowViaList.length > 0) {
      narrowViaList.reverse().forEach((idx) => {
        tmpViaList.splice(idx, 1);
        param.viaList.splice(idx, 1);
      });
      dispatch(tmpViaListActions.initialize(tmpViaList));
      dispatch(viaListActions.initialize(param.viaList));
    }
    tmpViaList.forEach((tmpVia, idx) => {
      if (tmpVia && !param.viaList[idx]) {
        searchStationList.push(
          searchStation(tmpVia, param.targetDate, null)
            .then((result: Station) => {
              if (result.num > 0) {
                const station = result.stationList[0];
                param.viaList[idx] = station;
                dispatch(viaListActions.set(station, idx));
                dispatch(tmpViaListActions.set(station.name, idx));
                dispatch(viaListErrorActions.set('', idx));
                return true;
              } else {
                dispatch(
                  viaListErrorActions.set(msg().Cmn_Lbl_SuggestNoResult, idx)
                );
                return false;
              }
            })
            .catch((err) => {
              dispatch(catchApiError(err, { isContinuable: true }));
              return false;
            })
        );
      }
    });
    if ((param.origin || tmpOrigin) && (param.arrival || tmpArrival)) {
      dispatch(loadingStart());
      Promise.all(searchStationList).then((result) => {
        if (
          param.origin &&
          param.arrival &&
          (result.length === 0 || result.every((value) => value))
        ) {
          param.viaList = param.viaList.filter(Boolean);
          dispatch(routeActions.search(param))
            .then(() => dispatch(activeDialogActions.routeSelect()))
            .catch((err) =>
              dispatch(catchApiError(err, { isContinuable: true }))
            )
            .then(() => {
              dispatch(loadingEnd());
            });
        } else {
          dispatch(loadingEnd());
        }
      });
    }
  };

export const onClickAddViaButton = () => (dispatch: AppDispatch) => {
  dispatch(viaListActions.add());
  dispatch(tmpViaListActions.add());
};

export const onClickDeleteViaButton =
  (idx: number) => (dispatch: AppDispatch) => {
    dispatch(tmpViaListActions.delete(idx));
    dispatch(viaListActions.delete(idx));
    dispatch(viaListErrorActions.clear(idx));
  };

export const onChangeOrigin =
  (station: StationInfo) => (dispatch: AppDispatch) => {
    dispatch(originActions.set(station));
    dispatch(originErrorActions.clear());
  };

export const onChangeViaList =
  (station: StationInfo, idx: number) => (dispatch: AppDispatch) => {
    dispatch(viaListActions.set(station, idx));
    dispatch(viaListErrorActions.set('', idx));
  };

export const onReverseViaList = () => (dispatch: AppDispatch) => {
  dispatch(viaListActions.reverse());
  dispatch(tmpViaListActions.reverse());
};

export const onChangeArrival =
  (station: StationInfo) => (dispatch: AppDispatch) => {
    dispatch(arrivalActions.set(station));
    dispatch(arrivalErrorActions.clear());
  };

export const onChangeTmpOrigin =
  (value: string, isClear: boolean) => (dispatch: AppDispatch) => {
    dispatch(tmpOriginActions.set(value));
    if (isClear) {
      dispatch(originActions.clear());
    }
  };

export const onChangeTmpViaList =
  (value: string, idx: number, isClear: boolean) => (dispatch: AppDispatch) => {
    dispatch(tmpViaListActions.set(value, idx));
    if (isClear) {
      dispatch(viaListActions.clear(idx));
      dispatch(viaListErrorActions.clear(idx));
    }
  };

export const onChangeTmpArrival =
  (value: string, isClear: boolean) => (dispatch: AppDispatch) => {
    dispatch(tmpArrivalActions.set(value));
    if (isClear) {
      dispatch(arrivalActions.clear());
    }
  };

export const resetRouteForm =
  (routeInfo?: RouteInfo, tmpClear = true) =>
  (dispatch: AppDispatch) => {
    if (routeInfo && routeInfo.selectedRoute) {
      if (routeInfo.origin) {
        dispatch(originActions.set(routeInfo.origin));
        if (routeInfo.origin && routeInfo.origin.name) {
          dispatch(tmpOriginActions.set(routeInfo.origin.name));
        }
      }
      if (routeInfo.viaList) {
        dispatch(viaListActions.initialize(routeInfo.viaList));
        const tmpViaList = [];
        routeInfo.viaList.forEach((via?: StationInfo) => {
          if (via) {
            tmpViaList.push(via.name);
          }
        });
        dispatch(tmpViaListActions.initialize(tmpViaList));
      }
      if (routeInfo.arrival) {
        dispatch(arrivalActions.set(routeInfo.arrival));
        if (routeInfo.arrival && routeInfo.arrival.name) {
          dispatch(tmpArrivalActions.set(routeInfo.arrival.name));
        }
      }
      dispatch(roundTripActions.set(routeInfo.roundTrip));
    } else {
      dispatch(originActions.clear());
      dispatch(viaListActions.allClear());
      dispatch(arrivalActions.clear());
      if (tmpClear) {
        dispatch(tmpOriginActions.clear());
        dispatch(tmpViaListActions.allClear());
        dispatch(tmpArrivalActions.clear());
      }
    }
  };

export const resetRouteSearchResult = () => (dispatch: AppDispatch) => {
  dispatch(routeActions.clear());
};
