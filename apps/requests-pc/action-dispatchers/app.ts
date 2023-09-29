import get from 'lodash/get';

import expModuleType from '@apps/commons/constants/expModuleType';

import { catchApiError } from '../../commons/actions/app';
import { getUserSetting } from '../../commons/actions/userSetting';
import UrlUtil from '../../commons/utils/UrlUtil';

import { initialSearchCondition } from '../../domain/models/exp/Report';
import { UserSetting } from '@apps/domain/models/UserSetting';

import { actions as customHintActions } from '../../domain/modules/exp/customHint';
import { list as setdelegateApplicant } from '../../domain/modules/exp/delegateApplicant';
import { AppDispatch } from '../modules/AppThunk';
import { actions as overlapActions } from '../modules/ui/expenses/overlap';
import { actions as viewAction } from '../modules/ui/expenses/view';
import { setUsedIn } from '@apps/domain/modules/exp/usedIn';

import {
  clearSearchConditions,
  fetchExpReport,
  fetchExpReportIdList,
} from './Requests';

// eslint-disable-next-line import/prefer-default-export
export const initialize =
  (empId?: string, currentLanguage?: string, isApproved = false) =>
  (dispatch: AppDispatch) => {
    if (isApproved) {
      dispatch(clearSearchConditions());
    }
    dispatch(setUsedIn(expModuleType.REQUEST));

    const queries = UrlUtil.getUrlQuery();
    const reportId = get(queries, 'id');
    const isCloned = get(queries, 'isCloned') === 'true';
    const isFromFA = get(queries, 'isFromFA') === 'true';

    // fetch the report id list when it's not apex page
    if (!reportId || isCloned) {
      dispatch(
        fetchExpReportIdList(
          isApproved,
          empId,
          initialSearchCondition,
          !isApproved
        )
      );
    }

    // When an empty Array is sent to the API, it will only return the basic information and will not retrieve and populate the details.
    dispatch(getUserSetting({ detailSelectors: [], empId, currentLanguage }))
      .then((result: UserSetting) => {
        if (!empId) {
          dispatch(customHintActions.get(result.companyId, 'Expense'));
          dispatch(setdelegateApplicant(result.employeeId, 'REQUEST'));
        }

        if (reportId) {
          dispatch(viewAction.setDetailView());
          dispatch(overlapActions.overlapReport());
          dispatch(
            fetchExpReport(
              reportId,
              null,
              empId,
              null,
              result.companyId,
              isCloned,
              isFromFA
            )
          );
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false })));
  };

export default initialize;
