import { addDays, format, parse } from 'date-fns';
import isNil from 'lodash/isNil';

import Api from '../commons/api';

import { Event } from '../domain/models/time-management/Event';
import { EventMessage } from '../domain/models/time-management/EventMessage';

import adapter from './adapters';

const convertFromOffice365 = (event: Event): Event => {
  if (event.createdServiceBy === 'office365' && event.isAllDay) {
    const asUTC = (date) => {
      return parse(
        // @ts-ignore
        format(parse(date, 'YYYY-MM-DD'), 'YYYY-MM-DD')
      ).toISOString();
    };

    return {
      ...event,
      startDateTime: asUTC(event.startDateTime),
      endDateTime: asUTC(event.endDateTime),
    };
  } else {
    return event;
  }
};

const toViewModel = (
  events: ReadonlyArray<
    Event & {
      id: null | string;
    }
  >
): Event[] => {
  if (events.some((event) => isNil(event.id) && isNil(event.externalEventId))) {
    throw new Error('PlannerEventRepository: Unexpected response received');
  }

  return events
    .filter((event) => !isNil(event.id) || !isNil(event.externalEventId))
    .map((event) => {
      if (event.isAllDay) {
        return {
          ...event,
          id: event.id || event.externalEventId,
          endDateTime: addDays(event.endDateTime, 1).toISOString(),
        };
      }
      return { ...event, id: event.id || event.externalEventId };
    });
};

export default {
  /**
   * Execute search for entity with a given query
   */

  /*
  search: (query: *): Promise<*[]> => {
  },
  */

  /**
   * Execute to get an entity
   */
  fetch: async (param: {
    startDate: string;
    endDate: string;
    empId?: string;
  }): Promise<{ events: Event[]; messages: EventMessage[] }> => {
    const { eventList, messageList } = await Api.invoke({
      path: '/planner/event/get',
      param: {
        startDate: param.startDate,
        endDate: param.endDate,
        empId: param.empId,
      },
    });
    const events = (eventList || []).map((event) => adapter.fromRemote(event));
    return {
      events: toViewModel(events.map(convertFromOffice365)),
      messages: (messageList || []).map((message) =>
        adapter.fromRemote(message)
      ),
    };
  },

  /**
   * Execute to update an entity
   */

  /**
  update: async (
  ): Promise<$ReadOnly<{| isSuccess: true, result: null |}>> => {
  },
   */

  /**
   * Execute to create a new entity
   */

  /*
  create: (entity: {||}): Promise<void> => {},
  */

  /**
   * Execute to delete an employee
   */
  delete: async (id: string): Promise<void> => {
    await Api.invoke({
      path: '/planner/event/delete',
      param: {
        id,
      },
    });
  },
};
