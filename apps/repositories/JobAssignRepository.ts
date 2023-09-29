import Api from '../commons/api';

import { JobAssignment } from '../domain/models/organization/JobAssignment';

import adapter from './adapters';

type FromRemote = {
  id: string;
  jobId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  validDateFrom: string;
  validDateTo: string;
};

export default {
  /**
   * Execture search for entity with a given query
   */
  search: (query: { jobId: string }): Promise<JobAssignment[]> => {
    return Api.invoke({
      path: '/job-assign/search',
      param: query,
    }).then((result: { records: FromRemote[] }) =>
      result.records.map((record) => adapter.fromRemote(record))
    );
  },

  /**
   * Exectue to get an entity
   */

  /*
  fetch: (id: string): Promise<*> => {
  },
  */

  /**
   * Exectue to update an entity
   */

  /*
  update: (entity: *): Promise<void> => {
  },
  */
  bulkUpdate: (param: {
    ids: string[];
    validDateFrom: string;
    validDateThrough: string;
  }): Promise<void> => {
    return Api.invoke({
      path: '/job-assign/update',
      param: adapter.toRemote({
        ...param,
        validDateThrough: param.validDateThrough || null,
      }),
    });
  },

  /**
   * Exectue to create a new entity
   */
  create: (entity: {
    jobId: string;
    validDateThrough?: string;
    validDateFrom: string;
    employeeIds: string[];
  }): Promise<void> => {
    return Api.invoke({
      path: '/job-assign/create',
      param: adapter.toRemote({
        ...entity,
        validDateThrough: entity.validDateThrough || null,
      }),
    });
  },

  /**
   * Execute to delete an entity
   */

  /*
  delete: (id: string): Promise<void> => {
  },
  */
  bulkDelete: (param: { ids: string[] }): Promise<void> => {
    return Api.invoke({
      path: '/job-assign/delete',
      param: adapter.toRemote(param),
    });
  },
};
