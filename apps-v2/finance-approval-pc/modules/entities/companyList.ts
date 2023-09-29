import { Dispatch, Reducer } from 'redux';

import { get } from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import { CompanyCountOption } from '../../../commons/components/exp/CompanySwitch';

import { searchCompanyList } from '../../../domain/models/common/Company';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';

import { setCompanyCount } from '../ui/FinanceApproval/companyCount';
import { setCompanyId } from '../ui/FinanceApproval/companySwitch';

type State = Array<CompanyCountOption>;

const ACTIONS = {
  SET: 'MODULES/ENTITIES/COMPANY_LIST/SET',
};

const setCompanyOption = (options: State) => ({
  type: ACTIONS.SET,
  payload: options,
});

export const actions = {
  fetchCompanyList:
    (empId: string, defaultCompanyId: string) =>
    (dispatch: Dispatch<any>): void => {
      dispatch(loadingStart());
      // TODO: search company list should move to commons/modules
      searchCompanyList()
        .then((res) => {
          const count = res.length;
          dispatch(setCompanyCount(count));
          if (count > 1) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            dispatch(setCompanyId(defaultCompanyId));
            dispatch(
              setCompanyOption(
                res.map((com) => ({
                  label: com.name,
                  value: com.id,
                  currencyCode: get(com, 'currencyField.code', ''),
                  currencySymbol: get(com, 'currencyField.symbol', ''),
                  currencyDecimalPlaces: get(
                    com,
                    'currencyField.decimalCount',
                    ''
                  ),
                  expMileageUnit: get(
                    com,
                    'expMileageUnit',
                    MileageUnit.KILOMETER
                  ),
                  alwaysDisplaySettlementAmount: get(
                    com,
                    'alwaysDisplaySettlementAmount',
                    false
                  ),
                  jctInvoiceManagement: get(com, 'jctInvoiceManagement', false),
                }))
              )
            );
          }
        })
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .finally(() => dispatch(loadingEnd()));
    },
};

const initialState: State = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<State, any>;
