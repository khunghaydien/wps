import { Reducer } from 'redux';

import { uniqBy } from 'lodash';

import {
  getVendorList,
  VendorItem,
  VendorItemList,
} from '../../../../domain/models/exp/Vendor';

import { catchApiError, loadingEnd, loadingStart } from '../../../actions/app';

import { OptionList } from '../../../components/fields/CustomDropdown';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'COMMONS/EXP/ENTITIES/VENDOR/LIST_SUCCESS',
  UPDATE_SUCCESS: 'COMMONS/EXP/ENTITIES/VENDOR/UPDATE_SUCCESS',
};

const listSuccess = (
  vendorList: VendorItem[],
  prevSelectedOptions?: OptionList
) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: { vendorList, prevSelectedOptions },
});

const updateSuccess = (vendorOptions: OptionList) => ({
  type: ACTIONS.UPDATE_SUCCESS,
  payload: vendorOptions,
});

export const actions = {
  updateData:
    (options: OptionList) =>
    (dispatch: AppDispatch): void => {
      const data = uniqBy(options, 'value');
      dispatch(updateSuccess(data));
    },
  list:
    (companyId: string, prevSelectedOptions?: OptionList, idList?: string[]) =>
    (
      dispatch: AppDispatch
    ): Promise<{
      payload: { prevSelectedOptions: any; vendorList: VendorItem[] };
      type: string;
    } | void> => {
      return getVendorList(companyId, undefined, undefined, idList)
        .then((res: VendorItemList) =>
          dispatch(listSuccess(res.records, prevSelectedOptions))
        )
        .catch((err) => {
          dispatch(listSuccess([]));
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  fetchByQuery:
    (companyId: string, searchQuery?: string) =>
    (dispatch: AppDispatch): Promise<VendorItem[]> => {
      dispatch(loadingStart());
      return getVendorList(companyId, searchQuery)
        .then((res: VendorItemList) => {
          dispatch(loadingEnd());
          return res.records;
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        });
    },
};

const convertStyle = ({
  vendorList,
  prevSelectedOptions = [],
}: Record<string, any>) => {
  const options = prevSelectedOptions.concat(
    vendorList.map((vendor) => {
      const vendorOption = {
        label: vendor.name,
        value: vendor.id,
      };
      return vendorOption;
    })
  );
  return uniqBy(options, 'value');
};

const initialState: OptionList = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return convertStyle(action.payload);
    case ACTIONS.UPDATE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<OptionList, any>;
