import moment from 'moment';

export default [
  {
    id: '1',
    title: 'Orientation for new employees',
    start: moment('2019-04-01T10:00:00'),
    end: moment('2019-04-01T12:00:00'),
    isAllDay: false,
    isOrganizer: false,
    isOuting: false,
    location: null,
    remarks: 'SAMPLE REMARKS',
    createdServiceBy: 'WSP',
    externalEventId: 'AAA',
    job: {
      id: '1',
      code: 'A',
      name: 'SAMPLE JOB',
    },
    workCategoryId: '1',
    workCategoryName: 'SAMPLE WORK CATEGORY',
    layout: {
      startMinutesOfDay: 400,
      endMinutesOfDay: 500,
      containsAllDay: false,
    },
  },
  {
    id: '1',
    title: 'Backlog grooming',
    start: moment('2019-04-01T16:00:00'),
    end: moment('2019-04-01T17:00:00'),
    isAllDay: false,
    isOrganizer: false,
    isOuting: false,
    location: null,
    remarks: 'SAMPLE REMARKS',
    createdServiceBy: 'WSP',
    externalEventId: 'AAA',
    job: {
      id: '1',
      code: 'A',
      name: 'SAMPLE JOB',
    },
    workCategoryId: '1',
    workCategoryName: 'SAMPLE WORK CATEGORY',
    layout: {
      startMinutesOfDay: 630,
      endMinutesOfDay: 700,
      containsAllDay: false,
    },
  },
];
