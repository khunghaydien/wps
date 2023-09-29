import moment from 'moment-timezone';

import { toViewModel } from '../Converter';
import { eventsFromRemote } from './mocks/eventsFromRemote';

jest.mock('moment-timezone', () => {
  const mockMoment = jest.requireActual('moment-timezone');
  mockMoment.tz.setDefault('UTC');
  return mockMoment;
});

describe('DailySummaryEvent', () => {
  describe('toViewModel', () => {
    const convertedEvents = toViewModel(
      eventsFromRemote as any,
      moment('2018-05-11')
    );

    test('イベントの並び順は、[開始日時が早い順] > [期間が長い順]であること', () => {
      // 前日からの予定 > 終日イベント > 特定時刻のイベント の順
      expect(convertedEvents.length).toBe(7);
      expect(convertedEvents[0].title).toBe(
        '日跨ぎイベント 05/10 22:00-05/11 10:00'
      );
      expect(convertedEvents[1].title).toBe('終日イベント 05/11-05/12');
      expect(convertedEvents[2].title).toBe('終日イベント 05/11');
    });

    test('各値が正しく格納されていること', () => {
      const targetEvent = convertedEvents[2];
      expect(targetEvent.title).toBe('終日イベント 05/11');
      expect(targetEvent.start.format()).toBe('2018-05-11T00:00:00Z');
      expect(targetEvent.end.format()).toBe('2018-05-11T00:00:00Z');
      expect(targetEvent.isAllDay).toBe(true);
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
      const targetEvent = convertedEvents[1];
      expect(targetEvent.layout.startMinutesOfDay).toBe(0);
      expect(targetEvent.layout.endMinutesOfDay).toBe(0);
      expect(targetEvent.layout.containsAllDay).toBe(true);
    });

    test('非終日予定: レイアウト情報が正しく格納されること', () => {
      const targetEvent = convertedEvents[2];
      expect(targetEvent.layout.startMinutesOfDay).toBe(0); // カレンダー表示の3分の2
      expect(targetEvent.layout.endMinutesOfDay).toBe(0);
      expect(targetEvent.layout.containsAllDay).toBe(true);
    });

    test('日跨ぎ予定: レイアウト情報が正しく格納されること', () => {
      const targetEvent = convertedEvents[0];
      expect(targetEvent.layout.startMinutesOfDay).toBe(0);
      expect(targetEvent.layout.endMinutesOfDay).toBe(500);
      expect(targetEvent.layout.containsAllDay).toBe(false);
    });
  });
});
