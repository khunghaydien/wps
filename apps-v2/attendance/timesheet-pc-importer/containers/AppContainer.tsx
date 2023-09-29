import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import msg from '@apps/commons/languages';
import $GlobalContainer from '@commons/containers/GlobalContainer';

import * as actions from '@attendance/timesheet-pc-importer/modules/actions';
import { leggedInEmployee } from '@attendance/timesheet-pc-importer/modules/selectors';
import selectDelegated from '@attendance/timesheet-pc-importer/modules/selectors/delegated';

import Component from '@attendance/timesheet-pc-importer/components/App';

import AppContentContainer from './AppContentContainer';
import HeaderContainer from './AppHeaderContainer';
import createControllers from './controllers';
import NotificationContainer from './NotificationContainer';
import ProxyEmployeeSelectDialogContainer from './ProxyEmployeeSelectDialogContainer';
import * as AccessControlService from '@attendance/application/AccessControlService';
import { AppStore } from '@attendance/timesheet-pc-importer/store/AppStore';

const GlobalContainer = $GlobalContainer as React.ComponentType<
  React.ComponentProps<typeof $GlobalContainer> & {
    children: React.ReactNode;
  }
>;

const AppContainer: React.FC = () => {
  const store = useStore() as AppStore;
  const dispatch = useDispatch();
  const controllers = React.useMemo(() => createControllers(store), [store]);
  const employeeId = useSelector(leggedInEmployee).id;
  const delegated = useSelector(selectDelegated);
  const allowed = AccessControlService.isPermissionSatisfied({
    isByDelegate: delegated,
    requireIfByEmployee: ['useAttTimesheetImport'],
    requireIfByDelegate: [
      'useAttTimesheetImport',
      'viewAttTimeSheetByDelegate',
    ],
  });

  // UseSetting が取得されるまで言語が英語になるので、
  // 一度英語で表示して日本語を再表示するようにしている。
  React.useEffect(() => {
    if (!allowed) {
      // 再起不能のエラーは一度設定すると上書きできないのでクリアしている。
      dispatch(actions.common.app.clearError());
      dispatch(
        actions.common.app.catchBusinessError(
          msg().Com_Err_ErrorTitle,
          msg().Com_Err_ProxyPermissionErrorBody,
          msg().Com_Err_ProxyPermissionErrorSolution,
          { isContinuable: false }
        )
      );
    }
  }, [employeeId]);

  React.useEffect(() => {
    controllers.initialize();
  }, []);

  return (
    <Component
      // Key を設定すると Rerendering を明示的にさせることができる。
      // 副作用として Rerendering が開始されると操作が中止される。
      // しかし、UseSetting が読み終わった後で Rerendering を促さないと
      // Message が翻訳されないので employee.id で実行している。
      key={employeeId}
      GlobalContainer={GlobalContainer}
      HeaderContainer={HeaderContainer}
      ContentContainer={AppContentContainer}
      ProxyEmployeeSelectDialogContainer={ProxyEmployeeSelectDialogContainer}
      NotificationContainer={NotificationContainer}
    />
  );
};

export default AppContainer;
