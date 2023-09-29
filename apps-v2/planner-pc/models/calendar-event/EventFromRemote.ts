import { Job } from '../../../domain/models/time-tracking/Job';

export type EventParam = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  job: Job | undefined | null;
  workCategoryId: string | null;
  calculateCapacity: boolean;
  isAllDay: boolean;
  isOuting: boolean;
  isOrganizer: boolean;
  location: string;
  description?: string;
  remarks: string;
};
