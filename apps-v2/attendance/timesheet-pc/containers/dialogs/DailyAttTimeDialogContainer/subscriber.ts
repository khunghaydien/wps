import { Store } from 'redux';

import { clear as clearRestReasons } from '../../../modules/entities/restTimeReasons';
import { close } from '../../../modules/ui/dailyAttTimeDialog';
import { actions as editingDailyAttTimeActions } from '../../../modules/ui/editingDailyAttTime';

import Events from '../../../events';
import LocalEvents from './events';

export default (store: Store): (() => void) => {
  const { dispatch } = store;

  let updated = false;
  const exit = (result: boolean) => {
    updated = true;
    if (result) {
      dispatch(close());
    }
  };
  const unsubscribers = [];
  unsubscribers.push(
    // 申請ボタンを押したとき
    LocalEvents.submittedRequest.subscribe(exit),
    // 保存ボタンを押したとき
    LocalEvents.saved.subscribe(exit),
    // 承認取り消しをしたとき
    LocalEvents.canceledApprovalRequest.subscribe(
      Events.updatedDailyRecord.publish
    ),
    // 申請取り消しをしたとき
    LocalEvents.canceledSubmittedRequest.subscribe(
      Events.updatedDailyRecord.publish
    )
  );

  return () => {
    unsubscribers.forEach((f) => f());
    dispatch(editingDailyAttTimeActions.unset());
    dispatch(clearRestReasons());
    if (updated) {
      Events.updatedDailyRecord.publish();
    }
  };
};
