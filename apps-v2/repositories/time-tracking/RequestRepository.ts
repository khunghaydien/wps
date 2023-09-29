import Api from '../../commons/api';

import { RequestSummary } from '../../domain/models/time-tracking/RequestSummary';
import {
  fromRemote,
  RequestWithPeriod,
  RequestWithPeriodFromRemote,
} from '../../domain/models/time-tracking/RequestWithPeriod';

import adapter from '../adapters';

export default {
  fetchAlert: async (param: {
    targetDate: string;
    empId?: string;
  }): Promise<RequestWithPeriod> => {
    const result = (await Api.invoke({
      path: '/time-track/request-alert/get',
      param,
    })) as RequestWithPeriodFromRemote;

    return fromRemote(result);
  },
  /**
   * Fetch time track summary of the specified request.
   * @param param - The request parameter.
   * @param param.requestId - Id of the specified request.
   * @return {Promise<RequestSummary>} Promise object represents time track summary
   */
  fetchSummary: async (param: {
    requestId: string;
  }): Promise<RequestSummary> => {
    const result = await Api.invoke({
      path: '/time-track/request/summary/get',
      param,
    });
    const entity = adapter.fromRemote<RequestSummary>(result);
    return entity;
  },

  /**
   * Submit the request.
   * @param param - The request parameter.
   * @param param.comment - Comment for the request
   * @param param.targetDate - The string represents date when users submit the request. e.g. 2019-01-01
   * @param param.empId - Employee ID of the delegatee.
   * @return {Promise<void>}
   */
  submit: async (param: {
    comment: string;
    targetDate: string;
    empId?: string;
  }): Promise<void> => {
    await Api.invoke({ path: '/time-track/monthly/apply', param });
  },

  /**
   * Recall the submitted request.
   * @param param - The request parameter.
   * @param param.requestId - Id of the request to be recalled.
   * @param param.comment - Comment for the request.
   * @param param.empId - Employee ID of the delegatee.
   * @return {Promise<void>}
   */
  recall: async (param: {
    requestId: string;
    comment: string;
    empId?: string;
  }): Promise<void> => {
    await Api.invoke({ path: '/time/request/cancel-request', param });
  },

  /**
   * Cancel the approved request.
   * @param param - The request parameter.
   * @param param.requestId - Id of the request to be cancelled.
   * @param param.comment - Comment for the request.
   * @param param.empId - Employee ID of the delegatee.
   * @return {Promise<void>}
   */
  cancel: async (param: {
    requestId: string;
    comment: string;
    empId?: string;
  }): Promise<void> => {
    await Api.invoke({ path: '/time/request/cancel-approval', param });
  },
};
