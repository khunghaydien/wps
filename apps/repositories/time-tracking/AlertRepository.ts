import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';

import Api from '../../commons/api';

import { Alert, Alerts } from '../../domain/models/time-tracking/Alert';

import adapter from '../adapters';

type Response = {
  records: ReadonlyArray<{
    targetDate: string;
    alerts: ReadonlyArray<Alert>;
  }>;
};

const fromResponse = ({ records }: Response): Alerts => {
  const table = keyBy(records, ({ targetDate }) => targetDate);
  return mapValues(table, (value) => value.alerts);
};

export default {
  search: async (param: {
    empId?: string;
    startDate: string;
    endDate: string;
  }): Promise<Alerts> => {
    const result = await Api.invoke({
      path: '/time-track/alert/list',
      param,
    });
    const response = adapter.fromRemote(result) as Response;
    return fromResponse(response);
  },
};
