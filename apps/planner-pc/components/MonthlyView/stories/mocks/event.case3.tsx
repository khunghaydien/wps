import { parse } from 'date-fns';

import { Event } from '../../../../../domain/models/time-management/Event';

import reducer, { actions } from '../../../../modules/entities/events';

const response: {
  isSuccess: boolean;
  result: { messageList: string[]; eventList: Event[] };
} = {
  isSuccess: true,
  result: {
    messageList: [],
    eventList: [
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '34',
        startDateTime: '2020-01-18T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004USLUA2',
        externalEventId: null,
        endDateTime: '2020-01-24T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '17',
        startDateTime: '2020-01-29T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004UQyUAM',
        externalEventId: null,
        endDateTime: '2020-01-30T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '13',
        startDateTime: '2020-01-30T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UQjUAM',
        externalEventId: null,
        endDateTime: '2020-01-30T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '18',
        startDateTime: '2020-01-30T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004UR3UAM',
        externalEventId: null,
        endDateTime: '2020-01-31T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '14',
        startDateTime: '2020-01-31T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UQoUAM',
        externalEventId: null,
        endDateTime: '2020-01-31T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '35',
        startDateTime: '2020-01-31T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004USfUAM',
        externalEventId: null,
        endDateTime: '2020-02-29T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '22',
        startDateTime: '2020-01-31T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004URNUA2',
        externalEventId: null,
        endDateTime: '2020-02-01T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '37',
        startDateTime: '2020-01-31T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004USpUAM',
        externalEventId: null,
        endDateTime: '2020-02-28T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '36',
        startDateTime: '2020-02-01T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004USkUAM',
        externalEventId: null,
        endDateTime: '2020-02-28T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '20',
        startDateTime: '2020-02-01T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004URDUA2',
        externalEventId: null,
        endDateTime: '2020-02-01T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
    ],
  },
};

export default reducer(
  {},
  actions.fetchSuccess(
    response.result.eventList,
    parse('2020-01-25T15:00:00.000Z'),
    parse('2020-02-29T15:00:00.000Z')
  )
);