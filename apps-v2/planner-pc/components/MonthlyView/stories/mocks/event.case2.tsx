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
        title: '21',
        startDateTime: '2019-12-27T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004URIUA2',
        externalEventId: null,
        endDateTime: '2019-12-28T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '19',
        startDateTime: '2019-12-28T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UR8UAM',
        externalEventId: null,
        endDateTime: '2019-12-28T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '15',
        startDateTime: '2019-12-30T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004UPrUAM',
        externalEventId: null,
        endDateTime: '2019-12-31T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '11',
        startDateTime: '2019-12-31T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UQZUA2',
        externalEventId: null,
        endDateTime: '2019-12-31T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '16',
        startDateTime: '2019-12-31T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004UQtUAM',
        externalEventId: null,
        endDateTime: '2020-01-01T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '1',
        startDateTime: '2019-12-31T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UP2UAM',
        externalEventId: null,
        endDateTime: '2019-12-31T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '12',
        startDateTime: '2020-01-01T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UQeUAM',
        externalEventId: null,
        endDateTime: '2020-01-01T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '2',
        startDateTime: '2020-01-01T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UP7UAM',
        externalEventId: null,
        endDateTime: '2020-01-01T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '3',
        startDateTime: '2020-01-02T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UPCUA2',
        externalEventId: null,
        endDateTime: '2020-01-02T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '23',
        startDateTime: '2020-01-03T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004URSUA2',
        externalEventId: null,
        endDateTime: '2020-01-03T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '4',
        startDateTime: '2020-01-03T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UPHUA2',
        externalEventId: null,
        endDateTime: '2020-01-04T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '24',
        startDateTime: '2020-01-04T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004URXUA2',
        externalEventId: null,
        endDateTime: '2020-01-04T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '5',
        startDateTime: '2020-01-04T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UPMUA2',
        externalEventId: null,
        endDateTime: '2020-01-05T14:59:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '33',
        startDateTime: '2020-01-05T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004USGUA2',
        externalEventId: null,
        endDateTime: '2020-01-10T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '25',
        startDateTime: '2020-01-05T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004URcUAM',
        externalEventId: null,
        endDateTime: '2020-01-05T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '6',
        startDateTime: '2020-01-05T15:01:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UPRUA2',
        externalEventId: null,
        endDateTime: '2020-01-06T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '7',
        startDateTime: '2020-01-06T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004UPWUA2',
        externalEventId: null,
        endDateTime: '2020-01-06T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '9',
        startDateTime: '2020-01-08T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UPgUAM',
        externalEventId: null,
        endDateTime: '2020-01-08T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '8',
        startDateTime: '2020-01-08T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UPbUAM',
        externalEventId: null,
        endDateTime: '2020-01-08T14:59:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '5',
        startDateTime: '2020-01-08T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UQAUA2',
        externalEventId: null,
        endDateTime: '2020-01-08T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '6',
        startDateTime: '2020-01-09T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UQFUA2',
        externalEventId: null,
        endDateTime: '2020-01-09T14:59:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '26',
        startDateTime: '2020-01-09T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004URhUAM',
        externalEventId: null,
        endDateTime: '2020-01-10T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '10',
        startDateTime: '2020-01-09T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004UQPUA2',
        externalEventId: null,
        endDateTime: '2020-01-09T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '27',
        startDateTime: '2020-01-10T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004URmUAM',
        externalEventId: null,
        endDateTime: '2020-01-11T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '28',
        startDateTime: '2020-01-11T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: true,
        id: 'a1G4T0000004URrUAM',
        externalEventId: null,
        endDateTime: '2020-01-12T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '32',
        startDateTime: '2020-01-11T15:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004USBUA2',
        externalEventId: null,
        endDateTime: '2020-01-17T15:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '29',
        startDateTime: '2020-01-15T14:59:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004URwUAM',
        externalEventId: null,
        endDateTime: '2020-01-15T15:01:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '30',
        startDateTime: '2020-01-17T00:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004US1UAM',
        externalEventId: null,
        endDateTime: '2020-01-17T23:59:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
      {
        workCategoryName: null,
        workCategoryId: null,
        workCategoryCode: null,
        title: '31',
        startDateTime: '2020-01-18T00:00:00.000Z',
        ownerId: '0054T000000LPNwQAO',
        location: null,
        jobName: null,
        jobId: null,
        jobCode: null,
        isOuting: false,
        calculateCapacity: false,
        isOrganizer: true,
        isAllDay: false,
        id: 'a1G4T0000004US6UAM',
        externalEventId: null,
        endDateTime: '2020-01-19T00:00:00.000Z',
        description: null,
        createdServiceBy: 'teamspirit',
        contactName: null,
        contactId: null,
      },
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
    parse('2019-12-28T15:00:00.000Z'),
    parse('2020-02-01T15:00:00.000Z')
  )
);
