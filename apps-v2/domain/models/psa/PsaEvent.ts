import Api from '../../../commons/api';

export type PsaEvent = {
  bookedEffort: number;
  endDate: string;
  eventId: string;
  projectManagerName: string;
  projectName: string;
  roleTitle: string;
  scheduledTimePerDay: number;
  startDate: string;
};

export type GetPsaEventResponse = {
  event: PsaEvent;
};

export const initialState = null;

export const getPsaEvent = (eventId: string): Promise<PsaEvent> => {
  return Api.invoke({
    path: '/psa/event/get',
    param: { eventId },
  }).then((response: GetPsaEventResponse) => response.event);
};
