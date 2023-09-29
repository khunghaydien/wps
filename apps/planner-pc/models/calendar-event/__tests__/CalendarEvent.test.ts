import moment from 'moment-timezone';

import { eventsFromRemote } from '../../../__tests__/mocks/eventsFromRemote';
import { convertEventsFromRemote } from '../CalendarEvent';

jest.mock('moment-timezone', () => {
  const mockMoment = jest.requireActual('moment-timezone');
  mockMoment.tz.setDefault('UTC');
  return mockMoment;
});

describe('CalendarEvent', () => {
  moment().locale('ja');

  const startDayOfTheWeek = 0;

  describe('convertEventsFromRemote', () => {
    const convertedEvents = convertEventsFromRemote(
      eventsFromRemote,
      startDayOfTheWeek
    );

    test('イベントの並び順は、[開始日時が早い順] > [期間が長い順]であること', () => {
      expect(convertedEvents['20180510'][0].title).toBe(
        '終日イベント 05/10-05/11'
      );
      expect(convertedEvents['20180510'][1].title).toBe(
        '日跨ぎイベント 05/10 22:00-05/11 10:00'
      );

      // 前日からの日跨ぎ予定 > 終日イベント > 特定時刻のイベント の順
      expect(convertedEvents['20180511'][0].title).toBe(
        '日跨ぎイベント 05/10 22:00-05/11 10:00'
      );
      expect(convertedEvents['20180511'][1].title).toBe(
        '終日イベント 05/11-05/12'
      );
      expect(convertedEvents['20180511'][2].title).toBe('終日イベント 05/11');
      expect(convertedEvents['20180511'][3].title).toBe('イベント 09:00-12:00');
      expect(convertedEvents['20180511'][4].title).toBe('イベント 09:00-10:00');
      expect(convertedEvents['20180511'][5].title).toBe('イベント 11:00-12:00');
      expect(convertedEvents['20180511'][6].title).toBe(
        '日跨ぎイベント 05/11 22:00-05/12 10:00'
      );

      expect(convertedEvents['20180512'][0].title).toBe(
        '日跨ぎイベント 05/11 22:00-05/12 10:00'
      );
    });

    test('各値が正しく格納されていること', () => {
      const targetEvent = convertedEvents['20180511'][3];
      expect(targetEvent.title).toBe('イベント 09:00-12:00');
      expect(targetEvent.start.format()).toBe('2018-05-11T09:00:00Z');
      expect(targetEvent.end.format()).toBe('2018-05-11T12:00:00Z');
      expect(targetEvent.isAllDay).toBe(false);
      expect(targetEvent.isOrganizer).toBe(eventsFromRemote[0].isOrganizer);
      expect(targetEvent.location).toBe(eventsFromRemote[0].location);
      expect(targetEvent.isOuting).toBe(eventsFromRemote[0].isOuting);
      expect(targetEvent.createdServiceBy).toBe(
        eventsFromRemote[0].createdServiceBy
      );
      expect(targetEvent.job.id).toBe(eventsFromRemote[0].jobId);
      expect(targetEvent.job.code).toBe(eventsFromRemote[0].jobCode);
      expect(targetEvent.job.name).toBe(eventsFromRemote[0].jobName);
      expect(targetEvent.workCategoryId).toBe(
        eventsFromRemote[0].workCategoryId
      );
      expect(targetEvent.workCategoryName).toBe(
        eventsFromRemote[0].workCategoryName
      );
    });

    test('終日予定: レイアウト情報が正しく格納されること', () => {
      const targetEvent = convertedEvents['20180510'][0];
      expect(targetEvent.layout.startMinutesOfDay).toBe(0);
      expect(targetEvent.layout.endMinutesOfDay).toBe(0);
      expect(targetEvent.layout.colIndex).toBe(4); // 5/10は木曜日
      expect(targetEvent.layout.colSpan).toBe(1); // 1日間
      expect(targetEvent.layout.containsAllDay).toBe(true);
      expect(targetEvent.layout.visibleInMonthlyView).toBe(true);
    });

    test('非終日予定: レイアウト情報が正しく格納されること', () => {
      const targetEvent = convertedEvents['20180511'][3];
      expect(targetEvent.layout.startMinutesOfDay).toBe(9 * 60 + 0);
      expect(targetEvent.layout.endMinutesOfDay).toBe(12 * 60 + 0);
      expect(targetEvent.layout.colIndex).toBe(5); // 5/11は金曜日
      expect(targetEvent.layout.colSpan).toBe(1);
      expect(targetEvent.layout.containsAllDay).toBe(false);
      expect(targetEvent.layout.visibleInMonthlyView).toBe(true);
    });

    test('日跨ぎ予定: レイアウト情報が正しく格納されること', () => {
      const targetEvent = convertedEvents['20180510'][1];
      expect(targetEvent.layout.startMinutesOfDay).toBe(22 * 60);
      expect(targetEvent.layout.endMinutesOfDay).toBe(24 * 60);
      expect(targetEvent.layout.colIndex).toBe(4); // 5/10は木曜日
      expect(targetEvent.layout.colSpan).toBe(1); // 1日間
      expect(targetEvent.layout.visibleInMonthlyView).toBe(true);
    });

    test('日跨ぎ予定の後半部分は月ビューで表示されないこと', () => {
      const targetEvent = convertedEvents['20180511'][0];
      expect(targetEvent.layout.visibleInMonthlyView).toBe(false);
    });
  });
});
