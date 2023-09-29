import { ObjectivelyEventLog } from '../../ObjectivelyEventLog';
import { EVENT_TYPE } from '../../ObjectivelyEventLogRecord';
import { time } from '@apps/attendance/__tests__/helpers';

export const setting: ObjectivelyEventLog['setting'][] = [
  {
    id: 'S0001',
    code: 'CODE_0001',
    name: 'Setting Name 1',
  },
  {
    id: 'S0002',
    code: 'CODE_0002',
    name: 'Setting Name 2 LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText LongText',
  },
  {
    id: 'S0003',
    code: 'CODE_0003',
    name: 'Setting Name 3',
  },
];

const id = (() => {
  let i = 0;
  return () => `R${String(`${i++}`).padStart(4, '0')}`;
})();

export const defaultValue: ObjectivelyEventLog[] = [
  {
    setting: setting[0],
    id: id(),
    eventType: EVENT_TYPE.ENTERING,
    time: time(7, 5),
    linked: '2022-02-22 07:05:00',
    isApplied: true,
  },
  {
    setting: setting[0],
    id: id(),
    eventType: EVENT_TYPE.LEAVING,
    time: time(18, 5),
    linked: '2022-02-22 18:05:00',
    isApplied: false,
  },
  {
    setting: setting[0],
    id: id(),
    eventType: EVENT_TYPE.ENTERING,
    time: time(7, 5),
    linked: '2022-02-22 07:05:00',
    isApplied: false,
  },
  {
    setting: setting[0],
    id: id(),
    eventType: EVENT_TYPE.LEAVING,
    time: time(18, 5),
    linked: '2022-02-22 18:05:00',
    isApplied: true,
  },
  {
    setting: setting[1],
    id: id(),
    eventType: EVENT_TYPE.ENTERING,
    time: time(7, 5),
    linked: '2022-02-22 07:05:00',
    isApplied: false,
  },
  {
    setting: setting[1],
    id: id(),
    eventType: EVENT_TYPE.LEAVING,
    time: time(18, 5),
    linked: '2022-02-22 18:05:00',
    isApplied: false,
  },
  {
    setting: setting[2],
    id: id(),
    eventType: EVENT_TYPE.ENTERING,
    time: time(7, 5),
    linked: '2022-02-22 07:05:00',
    isApplied: false,
  },
  {
    setting: setting[2],
    id: id(),
    eventType: EVENT_TYPE.LEAVING,
    time: time(18, 5),
    linked: '2022-02-22 18:05:00',
    isApplied: false,
  },
];
