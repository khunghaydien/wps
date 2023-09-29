import parse from 'date-fns/parse';

export type RequestWithPeriod = Readonly<
  | {
      id: string | null;
      alert: false;
      startDate: Date | null;
      endDate: Date | null;
    }
  | { id: string; alert: true; startDate: Date; endDate: Date }
>;

export type RequestWithPeriodFromRemote = Readonly<{
  request: {
    id: string | null;
    alert: boolean;
    startDate: string | null;
    endDate: string | null;
  };
}>;

export const fromRemote = ({
  request,
}: RequestWithPeriodFromRemote): RequestWithPeriod => {
  return {
    ...request,
    startDate: request.startDate ? parse(request.startDate) : null,
    endDate: request.endDate ? parse(request.endDate) : null,
  };
};

export const defaultRequest: RequestWithPeriod = {
  id: '',
  alert: false,
  startDate: null,
  endDate: null,
};
