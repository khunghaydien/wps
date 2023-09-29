import snapshotDiff from 'snapshot-diff';

import reducer, { actions, FETCH_SUCCESS, toKey, UPDATE } from '../events';

describe('reducer()', () => {
  describe(`${FETCH_SUCCESS}`, () => {
    test('it should return empty object for empty events', () => {
      // Arrange
      const initialState = {};
      const startDate = new Date('2019-06-20T00:00:00Z');
      const endDate = new Date('2019-08-03T00:00:00Z');
      const action = actions.fetchSuccess([], startDate, endDate);
      const expected = {};

      // Run
      const actual = reducer(initialState, action);

      // Assert
      expect(actual).toEqual(expected);
    });

    test('it should return event map', () => {
      // Arrange
      const initialState = {};
      const startDate = new Date('2019-06-29T15:00:00Z');
      const endDate = new Date('2019-08-02T15:00:00Z');
      const action = actions.fetchSuccess(
        [
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: '最優先イベント',
            startDateTime: '2019-06-28T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: true,
            id: 'a172v00000ccakEAAQ',
            externalEventId: null,
            endDateTime: '2019-07-10T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: '4日まで入ってるはず',
            startDateTime: '2019-06-30T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: true,
            id: 'a172v00000ccaYWAAY',
            externalEventId: null,
            endDateTime: '2019-07-03T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'aaaaaa',
            startDateTime: '2019-06-30T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccakxAAA',
            externalEventId: null,
            endDateTime: '2019-06-30T16:30:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'テスト',
            startDateTime: '2019-06-30T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccaYbAAI',
            externalEventId: null,
            endDateTime: '2019-07-03T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'ふが',
            startDateTime: '2019-07-01T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: true,
            id: 'a172v00000ccalCAAQ',
            externalEventId: null,
            endDateTime: '2019-07-06T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'デイリーサマリー',
            startDateTime: '2019-07-03T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccaYqAAI',
            externalEventId: null,
            endDateTime: '2019-07-04T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: null,
            startDateTime: '2019-07-04T14:30:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccaZUAAY',
            externalEventId: null,
            endDateTime: '2019-07-04T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: '外出',
            startDateTime: '2019-07-09T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: true,
            calculateCapacity: true,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccad7AAA',
            externalEventId: null,
            endDateTime: '2019-07-09T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: '外出',
            startDateTime: '2019-07-09T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: true,
            calculateCapacity: true,
            isOrganizer: true,
            isAllDay: true,
            id: 'a172v00000ccaeXAAQ',
            externalEventId: null,
            endDateTime: '2019-07-09T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: null,
            startDateTime: '2019-07-22T00:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: '7',
            jobId: 'a0h2v00000Xa3gRAAR',
            jobCode: '7',
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccanXAAQ',
            externalEventId: null,
            endDateTime: '2019-07-22T01:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'でちゃダメパターン',
            startDateTime: '2019-07-22T14:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccaewAAA',
            externalEventId: null,
            endDateTime: '2019-07-22T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'test',
            startDateTime: '2019-07-22T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccYl5AAE',
            externalEventId: null,
            endDateTime: '2019-07-24T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: null,
            startDateTime: '2019-07-22T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: true,
            id: 'a172v00000ccYnTAAU',
            externalEventId: null,
            endDateTime: '2019-07-23T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'TEST',
            startDateTime: '2019-07-22T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccYn8AAE',
            externalEventId: null,
            endDateTime: '2019-07-22T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'GMT2',
            startDateTime: '2019-07-22T22:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccbhCAAQ',
            externalEventId: null,
            endDateTime: '2019-07-23T01:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'GMT',
            startDateTime: '2019-07-22T23:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccbfuAAA',
            externalEventId: null,
            endDateTime: '2019-07-23T11:30:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'テスト',
            startDateTime: '2019-07-23T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccBhPAAU',
            externalEventId: null,
            endDateTime: '2019-07-24T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'テスト2',
            startDateTime: '2019-07-24T15:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccabBAAQ',
            externalEventId: null,
            endDateTime: '2019-07-26T15:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'テスト',
            startDateTime: '2019-07-25T02:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccab1AAA',
            externalEventId: null,
            endDateTime: '2019-07-27T02:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspirit',
            contactName: null,
            contactId: null,
          },
          {
            workCategoryCode: null,
            workCategoryName: null,
            workCategoryId: null,
            title: 'PSA Project',
            startDateTime: '2019-07-28T00:00:00.000Z',
            ownerId: '0052v00000WEgZvAAL',
            location: null,
            jobName: null,
            jobId: null,
            jobCode: null,
            isOuting: false,
            calculateCapacity: false,
            isOrganizer: true,
            isAllDay: false,
            id: 'a172v00000ccab1AAB',
            externalEventId: null,
            endDateTime: '2019-07-30T00:00:00.000Z',
            description: null,
            createdServiceBy: 'teamspiritPSA',
            contactName: null,
            contactId: null,
          },
        ],
        startDate,
        endDate
      );

      // Run
      const next = reducer(initialState, action);

      // Assert
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
  describe(`${UPDATE}`, () => {
    test('it should update isCreating to true', () => {
      // Arrange
      const initialState = {
        [toKey(new Date(2019, 4, 17))]: [
          {
            id: '1',
            isCreating: false,
          },
          {
            id: '2',
            isCreating: false,
          },
        ],
      };

      const action = actions.update('1', 'isCreating', true);

      // Run
      // @ts-ignore
      const next = reducer(initialState, action);

      // Assert
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
    test('it should update isEditing to true', () => {
      // Arrange
      const initialState = {
        [toKey(new Date(2019, 4, 17))]: [
          {
            id: '1',
            isEditing: false,
          },
          {
            id: '2',
            isEditing: false,
          },
        ],
      };

      const action = actions.update('1', 'isEditing', true);

      // Run
      // @ts-ignore
      const next = reducer(initialState, action);

      // Assert
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
});
