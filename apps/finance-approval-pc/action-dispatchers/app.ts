import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import {
  EmployeeDetailSelector,
  getUserSetting,
} from '../../commons/actions/userSetting';
import msg, { getMsgByBrowserLang } from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { UserSetting } from '@apps/domain/models/UserSetting';

import { actions as customHintActions } from '../../domain/modules/exp/customHint';
import { actions as expenseReportTypeActions } from '../../domain/modules/exp/expense-report-type/list';
import { AppDispatch } from '../modules/AppThunk';

import { fetchFinanceApprovalIdList } from '../action-dispatchers/FinanceApproval';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  return (dispatch: AppDispatch) => {
    const loadingHint = TextUtil.template(
      getMsgByBrowserLang().Exp_Lbl_LoadingActive,
      getMsgByBrowserLang().Exp_Lbl_Report
    );
    dispatch(loadingStart({ loadingHint }));
    const _ = undefined;
    dispatch(fetchFinanceApprovalIdList(_, _, _, _, true));

    // When an empty Array is sent to the API, it will only return the basic information and will not retrieve and populate the details.
    dispatch(
      getUserSetting({
        detailSelectors: [EmployeeDetailSelector.EXP_APPR_DIFF_COM_PERMISSION],
      })
    )
      .then((result: UserSetting) => {
        if (result.employeeId === '') {
          dispatch(
            catchApiError(
              {
                errorCode: '',
                message: msg().Exp_Lbl_InitEmpSettingNotCompleted,
                stackTrace: null,
              },
              { isContinuable: false }
            )
          );
        }
        return result;
      })
      .then((result) => {
        dispatch(
          expenseReportTypeActions.list(result.companyId, 'REPORT', undefined)
        );
        dispatch(customHintActions.get(result.companyId, 'Expense'));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false })))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
};

export default initialize;
