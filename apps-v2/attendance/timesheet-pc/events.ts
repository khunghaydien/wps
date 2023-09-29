import uuid from 'uuid';

import { UserSetting } from '@apps/domain/models/UserSetting';

import { IOutputData } from '@attendance/domain/useCases/timesheet/IFetchUseCase';
import { create } from '@attendance/libraries/Event';

export default {
  initialized: create<{
    fetchedUserSetting: UserSetting;
    fetchedTimesheet: IOutputData;
  }>(`INITIALIZED-${uuid()}`),
  stampedTime: create<void>(`STAMPED_TIME-${uuid()}`),
  updatedDailyRecord: create<void>(`UPDATED_DAILY_RECORD-${uuid()}`),
} as const;
