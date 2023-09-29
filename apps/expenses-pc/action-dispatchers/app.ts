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
import { actions as accountingPeriodActions } from '../modules/ui/expenses/recordListPane/accountingPeriod';
import { actions as viewAction } from '../modules/ui/expenses/view';
import { setUsedIn } from '@apps/domain/modules/exp/usedIn';

import {
  clearSearchConditions,
  fetchExpReport,
  fetchExpReportIdList,
} from './Expenses';

/** Define actions */

// eslint-disable-next-line import/prefer-default-export
export const initialize =
  (empId?: string, currentLanguage?: string, isApproved = false) =>
  (dispatch: AppDispatch) => {
    if (isApproved) {
      dispatch(clearSearchConditions());
    }
    dispatch(setUsedIn(expModuleType.REPORT));

    const _ = undefined;
    dispatch(
      fetchExpReportIdList(
        isApproved,
        empId,
        _,
        _,
        initialSearchCondition,
        !isApproved
      )
    );

    dispatch(getUserSetting({ detailSelectors: [], empId, currentLanguage }))
      .then((result: UserSetting) => {
        if (!empId) {
          dispatch(customHintActions.get(result.companyId, 'Expense'));
          dispatch(accountingPeriodActions.search(result.companyId));
          dispatch(setdelegateApplicant(result.employeeId, 'EXPENSE'));
        }

        const queries = UrlUtil.getUrlQuery();
        const reportId = get(queries, 'id');

        if (reportId) {
          dispatch(viewAction.setDetailView());
          dispatch(overlapActions.overlapReport());
          const _ = null;
          dispatch(
            fetchExpReport(_, reportId, _, empId, _, result.companyId, _)
          );
        }
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false })));
  };

export default initialize;
