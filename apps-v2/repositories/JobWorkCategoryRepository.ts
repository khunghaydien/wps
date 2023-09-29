import Api from '../commons/api';

import { Job } from '../domain/models/time-tracking/Job';

import adapter from './adapters';

export default {
  /**
   * Execture search for entity with a given query
   *
   * TODO:
   * Add a model representing Job
   */

  /*
  search: (param: Object): Promise<Object> => {
  },
  */

  /**
   * Exectue to get an entity
   */
  fetch: (param: {
    empId: null | string;
    jobId: null | string;
    targetDate: string;
  }): Promise<Job[]> => {
    return Api.invoke({
      path: '/time/job-workcategory/get',
      param,
    }).then((result) => adapter.fromRemote(result.jobs));
  },

  /**
   * Exectue to update an entity
   */

  /*
  update: (entity: *): Promise<void> => {
  },
  */

  /**
   * Exectue to create a new entity
   */

  /*
  create: (entity: {||}): Promise<void> => {},
  */

  /**
   * Exectue to delete an employee
   */

  /*
  delete: (id: string): Promise<void> => {
  },
  */
};
