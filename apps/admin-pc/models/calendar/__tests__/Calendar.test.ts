import { byDisplayOrder, filterBySelectable } from '../Calendar';

function shuffle(array: Array<any>): Array<any> {
  const clone = [...array];
  let n = clone.length;
  let t;
  let i;

  while (n) {
    n -= 1;
    i = Math.floor(Math.random() * n);
    t = clone[n];
    clone[n] = clone[i];
    clone[i] = t;
  }

  return clone;
}

describe('byDisplayOrder()', () => {
  const expected = [
    {
      code: '20',
      isDefault: true,
    },
    {
      code: '3',
      isDefault: true,
    },
    {
      code: '40',
      isDefault: true,
    },
    {
      code: '1',
      isDefault: false,
    },
    {
      code: '5',
      isDefault: false,
    },
    {
      code: '80',
      isDefault: false,
    },
  ];

  let actual;
  beforeAll(() => {
    actual = shuffle(expected).sort(byDisplayOrder);
  });

  test('Primary sort key: isDefault', () => {
    expect(actual).toEqual(expected);
  });

  test('Secondary sort key: code', () => {
    expect(actual).toEqual(expected);
  });
});

describe('filterBySelectable', () => {
  const data = [
    {
      code: '20',
      isDefault: true,
      type: 'Attendance',
    },
    {
      code: '3',
      isDefault: true,
      type: 'Attendance',
    },
    {
      code: '40',
      isDefault: true,
      type: 'Expense',
    },
    {
      code: '1',
      isDefault: false,
      type: 'Expense',
    },
    {
      code: '5',
      isDefault: false,
      type: 'Attendance',
    },
    {
      code: '80',
      isDefault: false,
      type: 'Attendance',
    },
  ];

  const expected = [
    {
      code: '20',
      isDefault: true,
      type: 'Attendance',
    },
    {
      code: '3',
      isDefault: true,
      type: 'Attendance',
    },
    {
      code: '5',
      isDefault: false,
      type: 'Attendance',
    },
    {
      code: '80',
      isDefault: false,
      type: 'Attendance',
    },
  ];

  test('選択肢として妥当なものだけになる', () => {
    // @ts-ignore
    const actual = filterBySelectable(data);

    expect(actual).toEqual(expected);
  });
});
