import moment from 'moment';

import msg from '../../../commons/languages';

import { validateEvent } from '../index';

describe('validateEvent: OK', () => {
  test('終日でない予定のケース', () => {
    const event = {
      start: moment('2017-03-01 09:00:00Z'),
      end: moment('2017-03-01 10:00:00Z'),
      isOrganizer: true,
    };
    const expected = [];

    expect(validateEvent(event)).toEqual(expected);
  });

  test('終日でない予定のケース: 最大所要時間', () => {
    const event = {
      start: moment('2017-03-01 09:00:00Z'),
      end: moment('2017-03-15 09:00:00Z'),
      isOrganizer: true,
    };
    const expected = [];

    expect(validateEvent(event)).toEqual(expected);
  });

  test('終日予定のケース', () => {
    const event = {
      start: moment('2017-03-01 09:00:00Z'),
      end: moment('2017-03-01 09:00:00Z'),
      isOrganizer: true,
      isAllDay: true,
    };
    const expected = [];

    expect(validateEvent(event)).toEqual(expected);
  });

  test('終日予定のケース: 最大所要時間', () => {
    // 時刻は関係なし
    const event = {
      start: moment('2017-03-01 09:00:00Z'),
      end: moment('2017-03-14 09:00:00Z'),
      isOrganizer: true,
      isAllDay: true,
    };
    const expected = [];

    expect(validateEvent(event)).toEqual(expected);
  });
});

describe('validateEvent: NG', () => {
  test('開始時刻>終了時刻となるケース', () => {
    const event = {
      start: moment('2017-03-01 09:00:00Z'),
      end: moment('2017-03-01 08:00:00Z'),
      isOrganizer: true,
    };
    const expected = [{ message: msg().Cal_Msg_InvalidStartEndTime }];

    expect(validateEvent(event)).toEqual(expected);
  });

  test('招待された予定のケース', () => {
    const event = {
      start: moment('2017-03-01 09:00:00Z'),
      end: moment('2017-03-01 10:00:00Z'),
      isOrganizer: false,
    };
    const expected = [{ message: msg().Cal_Msg_CannotEditInvitedEvent }];

    expect(validateEvent(event)).toEqual(expected);
  });

  test('複数のバリデーションエラーになるケース', () => {
    const event = {
      start: moment('2017-03-01 09:00:00Z'),
      end: moment('2017-03-01 08:00:00Z'),
      isOrganizer: false,
    };
    // FIXME: この書き方だとバリデーションの順番に依存している
    const expected = [
      { message: msg().Cal_Msg_InvalidStartEndTime },
      { message: msg().Cal_Msg_CannotEditInvitedEvent },
    ];

    expect(validateEvent(event)).toEqual(expected);
  });
});
