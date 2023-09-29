import EmployeeRepository, {
  SearchQuery,
} from '../../repositories/EmployeeRepository';

import Employee from '../../../widgets/dialogs/ProxyEmployeeSelectDialog/models/Employee';
import SearchStrategy, {
  SearchStrategyType,
} from '../../../widgets/dialogs/ProxyEmployeeSelectDialog/models/SearchStrategy';

import { actions as ApproverEmployeeSearchEntitiesActions } from '../modules/approverEmployeeSearch/entities';
import {
  actions as ApproverEmployeeSearchUiDialogActions,
  DialogType,
} from '../modules/approverEmployeeSearch/ui/dialog';
import { actions as ApproverEmployeeSearchUiOperationActions } from '../modules/approverEmployeeSearch/ui/operation';
import { actions as ApproverEmployeeSettingEntitiesAction } from '../modules/approverEmployeeSetting/entities';
import { AppDispatch } from '../modules/AppThunk';

import { catchApiError, withLoading } from '../actions/app';

import { LIMIT_NUM } from '../../../widgets/dialogs/ProxyEmployeeSelectDialog/components/ProxyEmployeeSelectDialog';

const searchByRepositoryRequest =
  (param: SearchQuery) => (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(
        () => EmployeeRepository.searchBySettingLimit(param, LIMIT_NUM),
        (result) => {
          dispatch(
            ApproverEmployeeSearchEntitiesActions.setByRepositoryResponseData(
              result.records
            )
          );
          dispatch(
            ApproverEmployeeSearchUiOperationActions.overLimit(
              result.isOverLimit
            )
          );
        }
      )
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

export const switchSearchStrategy =
  (
    searchStrategy: SearchStrategyType,
    targetDate: string,
    targetCompanyId: string,
    targetDepartmentId = ''
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(ApproverEmployeeSearchEntitiesActions.clear());
    dispatch(
      ApproverEmployeeSearchUiOperationActions.switchSearchStrategy(
        searchStrategy
      )
    );

    if (searchStrategy === SearchStrategy.SHOW_EMPLOYEES_IN_SAME_DEPARTMENT) {
      dispatch(
        searchByRepositoryRequest({
          companyId: targetCompanyId,
          departmentId: targetDepartmentId,
          targetDate: targetDate || undefined,
          approvalAuthority01: true,
        })
      );
    }
  };

export const searchByTargetDateAndCompanyIdAndInputValue =
  (
    targetDate: string,
    targetCompanyId: string,
    query: {
      departmentCode: string;
      departmentName: string;
      employeeCode: string;
      employeeName: string;
      title: string;
    }
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      searchByRepositoryRequest({
        companyId: targetCompanyId,
        departmentCode: query.departmentCode,
        departmentName: query.departmentName,
        code: query.employeeCode,
        name: query.employeeName,
        title: query.title,
        targetDate: targetDate || undefined,
        approvalAuthority01: true,
      })
    );

export const showDialog =
  (
    targetDate: string,
    targetCompanyId: string,
    targetDepartmentId = '',
    dialogType: DialogType = ''
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(ApproverEmployeeSearchUiDialogActions.open(dialogType));
    dispatch(
      ApproverEmployeeSearchUiOperationActions.setTargetDate(targetDate)
    );
    dispatch(
      searchByRepositoryRequest({
        targetDate: targetDate || undefined,
        companyId: targetCompanyId,
        departmentId: targetDepartmentId,
        approvalAuthority01: true,
      })
    );
  };

export const decide =
  (selectedEmployee: Employee) => (dispatch: AppDispatch) => {
    dispatch(
      ApproverEmployeeSettingEntitiesAction.set({
        id: selectedEmployee.id,
        employeeName: selectedEmployee.employeeName,
      })
    );
    dispatch(ApproverEmployeeSearchUiDialogActions.close());
    dispatch(ApproverEmployeeSearchUiOperationActions.clear());
    dispatch(ApproverEmployeeSearchEntitiesActions.clear());
  };

export const cancel = () => (dispatch: AppDispatch) => {
  dispatch(ApproverEmployeeSearchUiDialogActions.close());
  dispatch(ApproverEmployeeSearchUiOperationActions.clear());
  dispatch(ApproverEmployeeSearchEntitiesActions.clear());
};
