import moment from 'moment';

import {
  generateOutOfRangeArray,
  getDynamicScheduleColumnHeader,
  processView,
} from '@apps/commons/utils/psa/resourcePlannerUtil';

jest.mock('uuid/v4', () => () => 1);

describe('Testing Resource Planner Util', () => {
  describe('Resource Planner processView() DAY view', () => {
    let availability = [[]];
    let availableHoursResult = [[]];
    const expectedAvailability = {
      availableHours: availableHoursResult,
      endDate: '',
      limit: 12,
      page: 0,
      startDate: '',
      viewType: 'day',
    };

    availability = [
      [
        360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480, 360, 480, 480,
        0, 0, 360, 480, 240, 120, 120, 360, 480,
      ],
      [
        360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480, 360, 480, 480,
        0, 0, 360, 480, 240, 120, 120, 360, 480,
      ],
    ];
    availableHoursResult = [
      [360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480],
      [360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Test availability with 2 resources, day view', () => {
      expect(
        processView(0, availability, 'day', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });

    availability = [[], []];
    availableHoursResult = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Test with Empty Availability, day view', () => {
      expect(
        processView(0, availability, 'day', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });

    availability = [
      [0, 0, 480, 0, 0, 360, 480, 240, 120, 120],
      [360, 480, 480, 0, 0, 360, 480, 240, 120, 120],
    ];
    availableHoursResult = [
      [0, 0, 480, 0, 0, 360, 480, 240, 120, 120, -1, -1],
      [360, 480, 480, 0, 0, 360, 480, 240, 120, 120, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Availability with less than 12 days, day view', () => {
      expect(
        processView(0, availability, 'day', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });
  });

  describe('Resource Planner processView() week view', () => {
    let availability = [[]];
    let availableHoursResult = [[]];
    const expectedAvailability = {
      availableHours: availableHoursResult,
      endDate: '',
      limit: 12,
      page: 0,
      startDate: '',
      viewType: 'week',
    };

    availability = [
      [
        360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480, 360, 480, 480,
        0, 0, 360, 480, 240, 120, 120, 360, 480,
      ],
      [
        360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480, 360, 480, 480,
        0, 0, 360, 480, 240, 120, 120, 360, 480,
      ],
    ];
    availableHoursResult = [
      [3600, 2040, 1680, 960, -1, -1, -1, -1, -1, -1, -1, -1],
      [3600, 2040, 1680, 960, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Test availability with 2 resources, week view', () => {
      expect(
        processView(0, availability, 'week', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });

    availability = [[], []];
    availableHoursResult = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Test with Empty Availability, week view', () => {
      expect(
        processView(0, availability, 'week', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });

    availability = [
      [0, 0, 480, 0, 0, 360, 480, 240, 120, 120],
      [360, 480, 480, 0, 0, 360, 480, 240, 120, 120],
    ];
    availableHoursResult = [
      [1320, 480, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [2160, 480, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Availability with less than 12 days, week view', () => {
      expect(
        processView(0, availability, 'week', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });
  });

  describe('Resource Planner processView() month view', () => {
    let availability = [[]];
    let availableHoursResult = [[]];
    const expectedAvailability = {
      availableHours: availableHoursResult,
      endDate: '',
      limit: 12,
      page: 0,
      startDate: '',
      viewType: 'month',
    };

    availability = [
      [
        360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480, 360, 480, 480,
        0, 0, 360, 480, 240, 120, 120, 360, 480,
      ],
      [
        360, 480, 480, 0, 0, 360, 480, 240, 120, 120, 360, 480, 360, 480, 480,
        0, 0, 360, 480, 240, 120, 120, 360, 480,
      ],
    ];
    availableHoursResult = [
      [16560, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [16560, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Test availability with 2 resources, month view', () => {
      expect(
        processView(0, availability, 'month', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });

    availability = [[], []];
    availableHoursResult = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Test with Empty Availability, month view', () => {
      expect(
        processView(0, availability, 'month', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });

    availability = [
      [0, 0, 480, 0, 0, 360, 480, 240, 120, 120],
      [360, 480, 480, 0, 0, 360, 480, 240, 120, 120],
    ];
    availableHoursResult = [
      [1800, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [2640, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];

    expectedAvailability.availableHours = availableHoursResult;

    test('Availability with less than 12 days, month view', () => {
      expect(
        processView(0, availability, 'month', '', '01/10/2020')
      ).toStrictEqual(expectedAvailability);
    });
  });

  describe('getDynamicScheduleColumnHeader', () => {
    const expectedDayHeader = [
      'Thu 1',
      'Fri 2',
      'Sat 3 sat',
      'Sun 4 sun',
      'Mon 5',
      'Tue 6',
      'Wed 7',
      'Thu 8',
      'Fri 9',
      'Sat 10 sat',
      'Sun 11 sun',
      'Mon 12',
    ];
    const expectedMonthHeaderEn = [
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
    ];
    const expectedWeekHeaderEn = [
      '1 Oct',
      '8 Oct',
      '15 Oct',
      '22 Oct',
      '29 Oct',
      '5 Nov',
      '12 Nov',
      '19 Nov',
      '26 Nov',
      '3 Dec',
      '10 Dec',
      '17 Dec',
    ];
    const expectedMonthHeaderJp = [
      '10',
      '11',
      '12',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
    ];
    const expectedWeekHeaderJp = [
      '10/01',
      '10/08',
      '10/15',
      '10/22',
      '10/29',
      '11/05',
      '11/12',
      '11/19',
      '11/26',
      '12/03',
      '12/10',
      '12/17',
    ];

    test('Get dynamic column header, day view En', () => {
      expect(
        getDynamicScheduleColumnHeader('day', moment('2020/10/01'), false)
      ).toStrictEqual(expectedDayHeader);
    });
    test('Get dynamic column header, day view Jp', () => {
      expect(
        getDynamicScheduleColumnHeader('day', moment('2020/10/01'), true)
      ).toStrictEqual(expectedDayHeader);
    });

    test('Get dynamic column header, week view En', () => {
      expect(
        getDynamicScheduleColumnHeader('week', moment('2020/10/01'), false)
      ).toStrictEqual(expectedWeekHeaderEn);
    });
    test('Get dynamic column header, week view Jp', () => {
      expect(
        getDynamicScheduleColumnHeader('week', moment('2020/10/01'), true)
      ).toStrictEqual(expectedWeekHeaderJp);
    });

    test('Get dynamic column header, month view En', () => {
      expect(
        getDynamicScheduleColumnHeader('month', moment('2020/10/01'), false)
      ).toStrictEqual(expectedMonthHeaderEn);
    });
    test('Get dynamic column header, month view Jp', () => {
      expect(
        getDynamicScheduleColumnHeader('month', moment('2020/10/01'), true)
      ).toStrictEqual(expectedMonthHeaderJp);
    });
  });

  describe('generateOutOfRangeArray', () => {
    const expectedresultDayView = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
    ];
    const expectedresultWeekView = [
      false,
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ];
    const expectedresultMonthView = [
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ];

    test('Generate out of range array with 10 days duration, day view', () => {
      expect(
        generateOutOfRangeArray(
          'day',
          moment('2020/10/01'),
          moment('2020/10/12'),
          moment('2020/10/01'),
          moment('2020/10/10')
        )
      ).toStrictEqual(expectedresultDayView);
    });

    test('Generate out of range array with 10 days duration, week view', () => {
      expect(
        generateOutOfRangeArray(
          'week',
          moment('2020/10/01'),
          moment('2020/10/12'),
          moment('2020/10/01'),
          moment('2020/10/10')
        )
      ).toStrictEqual(expectedresultWeekView);
    });

    test('Generate out of range array with 10 days duration, month view', () => {
      expect(
        generateOutOfRangeArray(
          'month',
          moment('2020/10/01'),
          moment('2021/10/12'),
          moment('2020/10/01'),
          moment('2020/10/10')
        )
      ).toStrictEqual(expectedresultMonthView);
    });
  });
});
