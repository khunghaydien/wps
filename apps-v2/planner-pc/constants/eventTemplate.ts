import { CalendarEvent } from '../models/calendar-event/CalendarEvent';

const eventTemplate = {
  id: null,
  start: null,
  end: null,
  title: '',
  location: '',
  isOuting: false,
  remarks: '',
  isAllDay: false,
  calculateCapacity: false,
  isOrganizer: true,
  job: {
    id: '',
    name: '',
  },
  workCategoryId: '',
  workCategoryCode: '',
  workCategoryName: '',
  layout: {},
} as CalendarEvent;

export default eventTemplate;
