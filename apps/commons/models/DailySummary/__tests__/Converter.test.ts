import moment from 'moment';

import { toViewModel } from '../Converter';
import { plannerEventsGet } from './mocks/Responses';

describe('toViewModel()', () => {
  it('should filter events so that startDateTime and endDateTime of those events include the date when DailySummary is opened', () => {
    // Arrange
    const expected = [
      { id: 'a0Y7F000009TxctUAC', title: '終日 9/30〜10/2' },
      { id: 'a0Y7F000009TxeGUAS', title: '時間 9/30〜10/3' },
      { id: 'a0Y7F000009TxcZUAS', title: '終日 9/30〜10/1' },
      { id: 'a0Y7F000009TxdXUAS', title: '時間 9/30〜10/2' },
      { id: 'a0Y7F000009TxcoUAC', title: '終日 10/1〜10/2' },
      { id: 'a0Y7F000009TxeBUAS', title: '時間 10/1〜10/3' },
      { id: 'a0Y7F000009TxcAUAS', title: '終日 10/1〜10/1' },
      { id: 'a0Y7F000009TxdwUAC', title: '時間 10/1〜10/2' },
      { id: 'a0Y7F000009TxeuUAC', title: '時間 00:00〜00:01' },
      { id: 'a0Y7F000009TxdrUAC', title: '時間 00:00〜00:00' },
    ];

    // Act
    const actual = toViewModel(
      plannerEventsGet.eventList as any,
      moment('2019-10-01')
    );

    // Assert
    expect(actual.map(({ id, title }) => ({ id, title }))).toStrictEqual(
      expected
    );
  });
});
