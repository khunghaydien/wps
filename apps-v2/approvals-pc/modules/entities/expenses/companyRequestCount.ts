import { Dispatch, Reducer } from 'redux';

import _ from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';
import { CompanyCountOption } from '../../../../commons/components/exp/CompanySwitch';

import RequestRepository from '@apps/repositories/approval/RequestRepository';

import { searchCompanyList } from '../../../../domain/models/common/Company';
import { CountType } from '@apps/domain/models/approval/request/Request';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';

import { setCompanyCount as setCount } from '../../ui/companyCount';
import { actions as companyRequestCountActions } from '../../ui/companyRequestCount';

type State = {
  [key: string]: CompanyCountOption;
};

const ACTIONS = {
  SET_COMPANY_COUNT:
    'MODULES/ENTITIES/EXPENSES/COMPANY_REQUEST_COUNT/SET_COMPANY_COUNT',
};

const setCompanyCount = (countList: State) => ({
  type: ACTIONS.SET_COMPANY_COUNT,
  payload: countList,
});

export const actions = {
  fetch:
    (
      empId: string,
      isProxyMode: boolean,
      defaultCompanyId: string,
      moduleName: string,
      approvalType: CountType
    ) =>
    (dispatch: Dispatch<any>): void => {
      dispatch(loadingStart());
      dispatch(companyRequestCountActions.setRequstCountLoading(true));
      searchCompanyList()
        .then((res) => {
          const count = res.length;
          dispatch(setCount(count));
          if (count > 1) {
            res.sort((a, b) => a.name.localeCompare(b.name));
            dispatch(companyRequestCountActions.setCompanyId(defaultCompanyId));
            const promises = [];
            _.map(res, 'id').forEach((o) => {
              promises.push(
                RequestRepository.fetchCount({
                  employeeId: empId,
                  isDelegated: isProxyMode,
                  filterExpReqByCompanyId: o,
                  type: approvalType,
                })
              );
            });
            Promise.all(promises).then((countRes) => {
              const countObj = countRes.reduce((result, o, idx) => {
                result[`${res[idx].id}`] = {
                  value: `${res[idx].id}`,
                  label: `${res[idx].name}`,
                  count: o[`${moduleName}`],
                  currencyCode: _.get(res[idx], 'currencyField.code', ''),
                  currencySymbol: _.get(res[idx], 'currencyField.symbol') || '',
                  currencyDecimal: _.get(
                    res[idx],
                    'currencyField.decimalCount',
                    ''
                  ),
                  expMileageUnit: _.get(
                    res[idx],
                    'expMileageUnit',
                    MileageUnit.KILOMETER
                  ),
                  jctInvoiceManagement: _.get(
                    res[idx],
                    'jctInvoiceManagement',
                    false
                  ),
                };
                return result;
              }, {});
              dispatch(setCompanyCount(countObj));
              dispatch(
                companyRequestCountActions.setOptions(Object.values(countObj))
              );
              dispatch(companyRequestCountActions.setRequstCountLoading(false));
            });
          }
        })
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .finally(() => dispatch(loadingEnd()));
    },
};

const initialState: State = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_COMPANY_COUNT:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<State, any>;
