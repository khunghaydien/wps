import { Dispatch, Reducer } from 'redux';

import _ from 'lodash';
import { createSelector } from 'reselect';

import configList from '../../../constants/configList/exchangeRate';

import {
  catchApiError,
  catchBusinessError,
  confirm,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { SELECT_TAB } from '../../../../commons/actions/tab';
import msg from '../../../../commons/languages';

import {
  create,
  del,
  ExchangeRate,
  save,
  update,
} from '../../../models/exchange-rate/ExchangeRate';

import { Record } from '../../../utils/RecordUtil';

import { MODE, setModeBase, showDetailPane } from '../../base/detail-pane/ui';
import { CHANGE_COMPANY, SELECT_MENU_ITEM } from '../../base/menu-pane/ui';
import { actions as exchangeRateListActions } from '../entities/exchangeRateList';

type State = {
  selectedId: string | null | undefined;
  editingRecord: ExchangeRate | null | undefined;
};

const initialState: State = {
  selectedId: '',
  editingRecord: create(),
};

const KEY = 'MODULES/EXCHANGE_RATE/UI/EDITING_EXCHANGE_RATE';

const ACTIONS = {
  SAVE: `${KEY}/SAVE`,
  UPDATE_VALUE: `${KEY}/UPDATE_VALUE`,
  SELECT: `${KEY}/SELECT`,
  DESELECT: `${KEY}/DESELECT`,
  CLEAR: `${KEY}/CLEAR`,
  START_EDITING: `${KEY}/START_EDITING`,
  CANCEL_EDITING: `${KEY}/CANCEL_EDITING`,
};

export const actions = {
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),

  initialize:
    (companyId: string, currencyCode: string, currencyName: string) =>
    (dispatch: Dispatch<any>) => {
      dispatch(actions.clear());
      dispatch(setModeBase(''));
      dispatch(showDetailPane(false));
      dispatch(exchangeRateListActions.clear());
      return dispatch(
        exchangeRateListActions.fetch(companyId, currencyCode, currencyName)
      );
    },

  select: (exchangeRate: ExchangeRate) => (dispatch: Dispatch<any>) => {
    if (!exchangeRate) {
      return;
    }
    dispatch({
      type: ACTIONS.SELECT,
      payload: exchangeRate,
    });
    dispatch(setModeBase(''));
    dispatch(showDetailPane(true));
  },

  deselect: () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.DESELECT,
    });
    dispatch(setModeBase(''));
    dispatch(showDetailPane(false));
  },

  startEditingNew:
    (companyId: string, baseCurrencyCode: string, baseCurrencyName: string) =>
    (dispatch: Dispatch<any>) => {
      if (!baseCurrencyCode) {
        dispatch(
          catchBusinessError(
            msg().Admin_Lbl_ValidationCheck,
            msg().Exp_Msg_NoBaseCurrencyForExchangeRate,
            null
          )
        );
        return;
      }
      dispatch({
        type: ACTIONS.START_EDITING,
        payload: {
          ...create(),
          companyId,
          baseCurrencyCode,
          baseCurrencyName,
          id: null,
          rate: '',
        },
      });
      dispatch(setModeBase(MODE.NEW));
      dispatch(showDetailPane(true));
    },

  startEditingClone: (values: Record) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.START_EDITING,
      payload: {
        ...values,
        id: null,
        code: '',
        rate: '',
        validDateFrom: '',
        validDateTo: '',
      },
    });
    dispatch(setModeBase(MODE.CLONE));
    dispatch(showDetailPane(true));
  },

  startEditing: (exchangeRate: ExchangeRate) => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.START_EDITING,
      payload: exchangeRate,
    });
    dispatch(setModeBase('edit'));
    dispatch(showDetailPane(true));
  },

  cancelEditing: () => (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTIONS.CANCEL_EDITING,
    });
    dispatch(setModeBase(''));
  },

  update:
    (key: string, value: string, charType: string) =>
    (dispatch: Dispatch<any>) => {
      if (charType === 'numeric') {
        // @ts-ignore
        if (value !== '0' && !isFinite(value)) {
          return;
        }
      }
      dispatch({
        type: ACTIONS.UPDATE_VALUE,
        payload: { key, value },
      });
    },

  save: (exchangeRate: ExchangeRate) => (dispatch: Dispatch<any>) => {
    let result = true;
    configList.base.forEach((config) => {
      if (config.isRequired && _.isEmpty(String(exchangeRate[config.key]))) {
        dispatch(
          catchBusinessError(
            msg().Admin_Lbl_ValidationCheck,
            msg()[config.msgkey || ''],
            msg().Admin_Msg_EmptyItem
          )
        );
        result = false;
      }
    });
    if (!result) {
      return Promise.resolve();
    }
    dispatch(loadingStart());
    return !exchangeRate.id
      ? save(exchangeRate)
          .then(() =>
            dispatch(
              actions.initialize(
                exchangeRate.companyId,
                exchangeRate.baseCurrencyCode,
                exchangeRate.baseCurrencyName
              )
            )
          )
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => dispatch(loadingEnd()))
      : update(exchangeRate)
          .then(() =>
            dispatch(
              actions.initialize(
                exchangeRate.companyId,
                exchangeRate.baseCurrencyCode,
                exchangeRate.baseCurrencyName
              )
            )
          )
          .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
          .then(() => dispatch(loadingEnd()));
  },

  confirmAndDelete:
    (exchangeRate: ExchangeRate) => (dispatch: Dispatch<any>) => {
      dispatch(
        confirm(msg().Exp_Msg_ConfirmDelete, (yes) => {
          if (yes) {
            dispatch(actions.delete(exchangeRate));
          }
        })
      );
    },

  delete: (exchangeRate: ExchangeRate) => (dispatch: Dispatch<any>) => {
    dispatch(loadingStart());
    return (
      del(exchangeRate)
        .then(() =>
          dispatch(
            actions.initialize(
              exchangeRate.companyId,
              exchangeRate.baseCurrencyCode,
              exchangeRate.baseCurrencyName
            )
          )
        )
        // @ts-ignore
        .then(dispatch(actions.deselect()))
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .then(() => dispatch(loadingEnd()))
    );
  },
};

const exchangeRateList = (state) =>
  state.exchangeRate.entities.exchangeRateList;
const selectedExchangeRateId = (state) =>
  state.exchangeRate.ui.editingExchangeRate.selectedId;

export const selectors = {
  selectedExchangeRate: createSelector(
    exchangeRateList,
    selectedExchangeRateId,
    (recordList, selectedId) =>
      recordList.filter((rec) => rec.id === selectedId)[0]
  ),
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SELECT:
      return {
        selectedId: action.payload.id,
        editingRecord: action.payload,
      };

    case ACTIONS.DESELECT:
      return initialState;

    case ACTIONS.START_EDITING:
      return {
        ...state,
        editingRecord: action.payload,
      };

    case ACTIONS.CANCEL_EDITING:
      return {
        ...state,
        editingRecord: null,
      };

    case ACTIONS.UPDATE_VALUE:
      return {
        ...state,
        editingRecord: {
          ...state.editingRecord,
          [action.payload.key]: action.payload.value,
        },
      };

    case SELECT_TAB:
    case CHANGE_COMPANY:
    case SELECT_MENU_ITEM:
    case ACTIONS.CLEAR:
      return initialState;

    default:
      return state;
  }
}) as Reducer<State, any>;
