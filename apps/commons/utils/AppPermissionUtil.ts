import msg from '../languages';
import TextUtil from './TextUtil';

export type ErrorInfo = {
  message: string;
  description?: string;
};

export default class AppPermissionUtil {
  /**
   * check the user's app permission and return error message if user has permission problem
   * @param isUseExpense whether user has permission to use expense
   * @param employeeId user's employee info(employee id) in system
   * @param currencyId base currency(currency Id) in system
   * @param isApproval whether checking permission comes from approval tab
   * @return {ErrorInfo||null} return error information if user has permission issue. Otherwise returns null
   */
  static checkPermissionError(
    isUseExpense: boolean,
    employeeId: string,
    currencyId: string,
    isApproval?: boolean
  ) {
    if (employeeId === null) {
      return {
        message: TextUtil.template(
          msg().Com_Err_NotFound,
          msg().Com_Lbl_Employee
        ),
      };
    } else if (!isApproval) {
      if (!isUseExpense) {
        return {
          message: msg().Exp_Msg_NoPermissionForExpense,
          description: msg().Exp_Msg_Inquire,
        };
      } else if (currencyId === null) {
        return {
          message: msg().Exp_Msg_NoBaseCurrencyForExpense,
          description: msg().Exp_Msg_NoBaseCurrencyForExpenseSolution,
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
