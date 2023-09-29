import { defaultValue } from '@attendance/domain/models/__tests__/mocks/DailyObjectivelyEventLog.mock';
import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';

import extractSettingFromDaily from '../extractSettingFromDaily';

it('should do with full', () => {
  const settings = extractSettingFromDaily(defaultValue);
  expect(settings).toHaveLength(3);
  expect(settings[0].id).toBe(defaultValue.logs[0].setting.id);
  expect(settings[0].code).toBe(defaultValue.logs[0].setting.code);
  expect(settings[0].name).toBe(defaultValue.logs[0].setting.name);
});

it('should do with null record', () => {
  const logs: DailyObjectivelyEventLog['logs'] = [
    defaultValue.logs[0],
    null,
    defaultValue.logs[2],
  ];
  const settings = extractSettingFromDaily({
    ...defaultValue,
    logs,
  });
  expect(settings).toHaveLength(2);
  expect(settings[1].id).toBe(logs[2].setting.id);
  expect(settings[1].code).toBe(logs[2].setting.code);
  expect(settings[1].name).toBe(logs[2].setting.name);
});

it('should do with all null record', () => {
  const logs: DailyObjectivelyEventLog['logs'] = [null, null, null];
  const settings = extractSettingFromDaily({
    ...defaultValue,
    logs,
  });
  expect(settings).toHaveLength(0);
});
