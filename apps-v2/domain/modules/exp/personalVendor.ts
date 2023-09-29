import { Reducer } from 'redux';

import { loadingEnd, loadingStart } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import { showToast } from '@apps/commons/modules/toast';

import {
  defaultValue,
  deleteVendor,
  getVendorDetail,
  PersonalVendorSaveRes,
  saveVendor,
  undoVendorDelete,
  updateVendor,
  Vendor,
  VendorItemList,
} from '@apps/domain/models/exp/Vendor';

import { AppDispatch } from './AppThunk';

export const ACTIONS = {
  SET: 'MODULES/EXP/PERSONAL_VENDOR/SET',
  DELETE: 'MODULES/EXP/PERSONAL_VENDOR/DELETE',
};

const set = (item: Vendor) => ({
  type: ACTIONS.SET,
  payload: item,
});

export const actions = {
  get:
    (id: string, empId?: string) =>
    (dispatch: AppDispatch): Promise<Vendor> =>
      getVendorDetail(id, empId).then((res: VendorItemList) => {
        dispatch(set(res.records[0]));
        return res.records[0];
      }),
  save:
    (item: Vendor, empId: string, subroleId: string) =>
    (dispatch: AppDispatch): Promise<PersonalVendorSaveRes> => {
      dispatch(loadingStart());
      return saveVendor(item, empId, subroleId)
        .then((res) => {
          dispatch(loadingEnd());
          dispatch(showToast(msg().Exp_Msg_VendorSaved, 3000));
          return res;
        })
        .catch((err) => {
          dispatch(loadingEnd());
          throw err;
        });
    },
  delete: (id: string, subroleId?: string) => (): Promise<void> => {
    return deleteVendor(id, subroleId).catch((err) => {
      throw err;
    });
  },
  update:
    (item: Vendor, empId: string, subroleId: string) =>
    (dispatch: AppDispatch): Promise<PersonalVendorSaveRes> => {
      dispatch(loadingStart());
      return updateVendor(item, empId, subroleId)
        .then((res) => {
          dispatch(loadingEnd());
          dispatch(showToast(msg().Exp_Msg_VendorSaved, 3000));
          return res;
        })
        .catch((err) => {
          dispatch(loadingEnd());
          throw err;
        });
    },
  restore: (id: string, empHistoryId?: string) => (): Promise<void> => {
    return undoVendorDelete(id, empHistoryId).catch((err) => {
      throw err;
    });
  },
};

const initialState = defaultValue;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Vendor, any>;
