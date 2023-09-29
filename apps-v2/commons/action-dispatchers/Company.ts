import CompanyDetailRepository from '@apps/repositories/organization/company/CompanyDetailRepository';

import { AppDispatch } from '../modules/AppThunk';
import { actions } from '../modules/exp/entities/company';

import { catchApiError, withLoading } from '../actions/app';

const fetchCompanies = () => (dispatch: AppDispatch) => {
  return dispatch(
    withLoading(
      () => CompanyDetailRepository.fetchCompanies(),
      (result) => {
        dispatch(actions.setCompanies(result ? result.records : []));
        return result;
      }
    )
  ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
};

export default { fetchCompanies };
