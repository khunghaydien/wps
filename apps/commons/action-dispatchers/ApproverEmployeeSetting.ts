import PersonalSettingRepository from '../../repositories/PersonalSettingRepository';

import { ApproverEmployee } from '../../domain/models/approval/ApproverEmployee';

import { DialogType } from '../modules/approverEmployeeSearch/ui/dialog';
import { actions as ApproverEmployeeSettingEntitiesActions } from '../modules/approverEmployeeSetting/entities';
import { actions as ApproverEmployeeSettingUiDialogActions } from '../modules/approverEmployeeSetting/ui/dialog';
import { actions as ApproverEmployeeSettingUiStatusActions } from '../modules/approverEmployeeSetting/ui/status';
import { AppDispatch } from '../modules/AppThunk';

import { catchApiError, withLoading } from '../actions/app';
import { getUserSetting } from '../actions/userSetting';

/**
 * ダイアログを閉じます。
 */
export const hideDialog = () => (dispatch: AppDispatch) => {
  dispatch(ApproverEmployeeSettingUiDialogActions.close());
};

/**
 * 承認者を変更します。
 */
export const setApproverEmployee =
  (setting: ApproverEmployee) => (dispatch: AppDispatch) => {
    dispatch(ApproverEmployeeSettingEntitiesActions.set(setting));
  };

/**
 * 読み込みのみかどうかを指定します。
 */
export const setReadOnly = (isReadOnly: boolean) => (dispatch: AppDispatch) => {
  dispatch(ApproverEmployeeSettingUiStatusActions.setReadOnly(isReadOnly));
};

/**
 * 保存できるようにします。
 */
export const save =
  (setting: ApproverEmployee, onSuccess: () => any) =>
  (dispatch: AppDispatch): Promise<any> => {
    return dispatch(
      withLoading(
        () =>
          PersonalSettingRepository.updateApprover({
            approverBase01Id: setting.id,
          }),
        () => dispatch(getUserSetting())
      )
    )
      .then(() => dispatch(hideDialog()))
      .then(onSuccess)
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
  };

/**
 * ダイアログを開きます。
 */
export const showDialog =
  (
    setting: ApproverEmployee,
    targetDate: string,
    isReadOnly: boolean,
    dialogType: DialogType = ''
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(setApproverEmployee(setting));
    dispatch(ApproverEmployeeSettingUiStatusActions.setTargetDate(targetDate));
    dispatch(setReadOnly(isReadOnly));
    dispatch(ApproverEmployeeSettingUiDialogActions.open(dialogType));
  };
