import expModuleType from '@commons/constants/expModuleType';

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
import { State } from '../modules';
import { AppDispatch } from '../modules/AppThunk';
import { TABS } from '../modules/ui/FinanceApproval/tabs';

import {
  fetchExpRequest,
  fetchFinanceApprovalIdList,
  fetchPreRequestReport,
} from '../action-dispatchers/FinanceApproval';

import { getApexViewParams } from '../utils/ApexViewUtils';

const dispatchDetailAction =
  (selectedTab, requestId, companyId) =>
  (dispatch: AppDispatch, getState: () => State) => {
    const state = getState();
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    const _ = undefined;

    switch (selectedTab) {
      case TABS.EXPENSES:
        dispatch(fetchExpRequest(requestId, _, true, reportTypeList));
        break;
      case TABS.REQUESTS:
        dispatch(
          fetchPreRequestReport(requestId, companyId, _, reportTypeList)
        );
        break;
      default:
        break;
    }
  };

// eslint-disable-next-line import/prefer-default-export
export const initialize = (isApexViewWithParams?: boolean) => {
  return (dispatch: AppDispatch) => {
    const loadingHint = TextUtil.template(
      getMsgByBrowserLang().Exp_Lbl_LoadingActive,
      getMsgByBrowserLang().Exp_Lbl_Report
    );
    const _ = undefined;
    const loadingHintObj = isApexViewWithParams ? _ : { loadingHint };
    dispatch(loadingStart(loadingHintObj));

    // When an empty Array is sent to the API, it will only return the basic information and will not retrieve and populate the details.
    dispatch(
      getUserSetting({
        detailSelectors: [EmployeeDetailSelector.EXP_APPR_DIFF_COM_PERMISSION],
      })
    )
      .then((result: UserSetting) => {
        dispatch(
          fetchFinanceApprovalIdList(
            result.companyId,
            _,
            _,
            _,
            !isApexViewWithParams
          )
        );
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
        const { tab, requestId } = getApexViewParams();
        dispatch(
          expenseReportTypeActions.list(
            result.companyId,
            isApexViewWithParams && tab === TABS.REQUESTS
              ? expModuleType.REQUEST
              : expModuleType.REPORT,
            undefined
          )
        ).then(() => {
          if (isApexViewWithParams) {
            dispatch(dispatchDetailAction(tab, requestId, result.companyId));
          }
        });
        dispatch(customHintActions.get(result.companyId, 'Expense'));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false })))
      .then(() => {
        dispatch(loadingEnd());
      });
  };
};

export default initialize;
