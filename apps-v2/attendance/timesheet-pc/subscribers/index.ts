import { Store } from 'redux';

import Events from '../events';
import createBehaviors from './behaviors';
import UseCases from '@attendance/timesheet-pc/UseCases';

export default (store: Store): void => {
  const behaviors = createBehaviors(store);

  // 初期化後
  let initialized = false;
  Events.initialized.subscribe(({ fetchedTimesheet }) => {
    // 工数は UserSetting を見ているのでこの時に初期化するしかない
    behaviors.reloadTimeTrack(fetchedTimesheet);
    if (initialized) {
      return;
    }
    // 初期化が終わった後は UserSetting を常に持っているので reloadTimesheet で読み込んで問題ない
    UseCases().fetchTimesheet.subscribe(behaviors.reloadTimeTrack);
    initialized = true;
  });

  // 勤怠明細が更新された後
  Events.updatedDailyRecord.subscribe(() => {
    behaviors.reloadTimesheet();
    behaviors.reloadStampTime();
  });

  // 打刻された後
  Events.stampedTime.subscribe(behaviors.resetTimesheet);

  // 勤務表読み込み後
  UseCases().fetchTimesheet.subscribe(
    behaviors.reloadDailyObjectivelyEventLogs
  );

  // 勤務表読み込み後
  UseCases().fetchTimesheet.subscribe(behaviors.reloadDailyAllowanceRecords);

  // 勤務表読み込み後
  UseCases().fetchTimesheet.subscribe(
    behaviors.reloadListLegalAgreementRequest
  );

  // 勤務表読み込み後
  UseCases().fetchTimesheet.subscribe(behaviors.fetchDailyFieldLayoutTable);
};
