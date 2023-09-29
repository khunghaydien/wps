import msg, { language } from '@apps/commons/languages';

import { DAY_TYPE } from '@apps/admin-pc/models/calendar/CalendarEvent';
import { COMMUTE_STATE } from '@attendance/domain/models/CommuteCount';

import {
  // @ts-ignore
  __get__,
  commuteState,
  date,
  dayType,
  duration,
  durationTotal,
  time,
} from '../record';

let _empInfo;
beforeAll(() => {
  _empInfo = window.empInfo;
  Object.defineProperty(window, 'empInfo', {
    ..._empInfo,
    language: language.EN_US,
    locale: language.EN_US,
  });
});

describe('date()', () => {
  it('should be "Sat, Jan 1" when 1st day', () => {
    expect(date('2022-01-01')).toBe('Sat, Jan 1');
  });
  it('should be "2 Sun" when 2nd day', () => {
    expect(date('2022-01-02')).toBe('2 Sun');
  });
  it('should be "Sun, Jan 2 " if mdw is true', () => {
    expect(date('2022-01-02', true)).toBe('Sun, Jan 2');
  });
});
describe('dayType()', () => {
  it('should do.', () => {
    const dayTypeMap = __get__('dayTypeTranslations');
    Object.keys(DAY_TYPE).forEach((key) => {
      const value = DAY_TYPE[key];
      const result = dayType(value);
      expect(result).toBe(msg()[dayTypeMap[value]]);
    });
  });
});
describe('duration()', () => {
  it('should be "" when null', () => {
    expect(duration(null)).toBe('');
  });
  it('should be 01:00 when 60', () => {
    expect(duration(60)).toBe('01:00');
  });
});

describe('time()', () => {
  it('should be "" when null', () => {
    expect(time(null)).toBe('');
  });
  it('should be 01:00 when 60', () => {
    expect(time(60)).toBe('01:00');
  });
});

describe('durationTotal()', () => {
  it('should be 00:00 when null', () => {
    expect(durationTotal(null)).toBe('00:00');
  });
  it('should be 01:00 when 60', () => {
    expect(durationTotal(60)).toBe('01:00');
  });
});

describe('commuteState()', () => {
  it('should do.', () => {
    const commuteStateMap = __get__('commuteCountTranslations');
    Object.keys(COMMUTE_STATE).forEach((key) => {
      const value = COMMUTE_STATE[key];
      const result = commuteState(value);
      expect(result).toBe(msg()[commuteStateMap[value]]);
      expect(result).toBeTruthy();
    });
  });
  it('should be "" when commuteState is undefined.', () => {
    expect(commuteState(undefined)).toBe('');
  });
});
