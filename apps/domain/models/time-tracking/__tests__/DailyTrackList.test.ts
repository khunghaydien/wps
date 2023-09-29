import { convertDailyTrackList } from '../DailyTrackList';

describe('domain/models/time-tracking/DailyTrackList', () => {
  describe('convertDailyTrackList', () => {
    const mockData = {
      records: [
        {
          recordDate: '2017-11-01',
          note: '11/1の作業報告',
          recordItemList: [
            {
              jobId: 'a0K7F000000YmZtUAK',
              jobCode: '001',
              jobName: 'ジョブ1',
              workCategoryId: 'a0e7F000001H1HsQAK',
              workCategoryCode: 'AAA-001',
              workCategoryName: '打合せ・MTG',
              ratio: null,
              taskTime: 300,
              taskNote: 'A社と打合せ',
              order: 1,
            },
          ],
        },
        {
          recordDate: '2017-11-06',
          note: null,
          recordItemList: [
            {
              jobId: 'a0K7F000000YmZtUAK',
              jobCode: '001',
              jobName: 'ジョブ1',
              workCategoryId: 'a0e7F000001H1HsQAK',
              workCategoryCode: 'AAA-001',
              workCategoryName: '打合せ・MTG',
              ratio: null,
              taskTime: 360,
              taskNote: 'B社と打合せ',
              order: 1,
            },
            {
              jobId: 'a0K7F000000YmZyUAK',
              jobCode: '002',
              jobName: '残工数ジョブ',
              workCategoryId: null,
              workCategoryCode: null,
              workCategoryName: null,
              ratio: 100,
              taskTime: 120,
              taskNote: null,
              order: 2,
            },
          ],
        },
        {
          recordDate: '2017-11-07',
          note: '11/07の作業報告',
          recordItemList: [
            {
              jobId: 'a0K7F000000YmZtUAK',
              jobCode: '001',
              jobName: 'ジョブ1',
              workCategoryId: 'a0e7F000001H1HsQAK',
              workCategoryCode: 'AAA-001',
              workCategoryName: '打合せ・MTG',
              ratio: null,
              taskTime: 500,
              taskNote: null,
              order: 1,
            },
            {
              jobId: 'a0K7F000000YmZyUAK',
              jobCode: '002',
              jobName: '残工数ジョブ',
              workCategoryId: null,
              workCategoryCode: null,
              workCategoryName: null,
              ratio: 100,
              taskTime: null,
              taskNote: null,
              order: 2,
            },
          ],
        },
      ],
    };

    const dailyTrackList = convertDailyTrackList(mockData as any);

    test('dailyTrack: 値が正しく格納されていること', () => {
      expect(dailyTrackList['2017-11-01'].recordDate).toBe('2017-11-01');
      expect(dailyTrackList['2017-11-01'].note).toBe('11/1の作業報告');
      expect(dailyTrackList['2017-11-01'].sumTaskTime).toBe(300);
    });

    test('dailyTrack: 工数合計が正しく計算されていること', () => {
      expect(dailyTrackList['2017-11-06'].sumTaskTime).toBe(480);
    });

    test('Task: 値が正しく格納されていること', () => {
      const targetTask1 = dailyTrackList['2017-11-06'].recordItemList[0];

      expect(targetTask1.jobId).toBe('a0K7F000000YmZtUAK');
      expect(targetTask1.jobCode).toBe('001');
      expect(targetTask1.jobName).toBe('ジョブ1');
      expect(targetTask1.workCategoryId).toBe('a0e7F000001H1HsQAK');
      expect(targetTask1.workCategoryCode).toBe('AAA-001');
      expect(targetTask1.workCategoryName).toBe('打合せ・MTG');
      expect(targetTask1.taskTime).toBe(360);
      expect(targetTask1.taskNote).toBe('B社と打合せ');
      expect(targetTask1.id).toBe('a0K7F000000YmZtUAK-a0e7F000001H1HsQAK');

      const targetTask2 = dailyTrackList['2017-11-06'].recordItemList[1];
      expect(targetTask2.ratio).toBe(100);
      expect(targetTask2.id).toBe('a0K7F000000YmZyUAK-');
    });

    test('工数の最大値に対する比率が正しく計算されていること', () => {
      // 工数最大値(2017/11/07における500が最大)に対する割合
      expect(dailyTrackList['2017-11-01'].recordItemList[0].graphRatio).toBe(
        60
      );
      expect(dailyTrackList['2017-11-06'].recordItemList[0].graphRatio).toBe(
        72
      );
      expect(dailyTrackList['2017-11-06'].recordItemList[1].graphRatio).toBe(
        24
      );
      expect(dailyTrackList['2017-11-07'].recordItemList[0].graphRatio).toBe(
        100
      );
    });

    test('工数のないタスクが除外されていること', () => {
      expect(dailyTrackList['2017-11-07'].recordItemList.length).toBe(1);
    });
  });
});
