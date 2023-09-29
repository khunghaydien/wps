import Api from '../../commons/api';

import {
  AttLeave,
  createFromParam,
} from '../../domain/models/attendance/AttLeave';
// import adapter from './adapters';

export type SearchParam = {
  targetDate?: string;
  empId?: string;
  ignoredId?: string;
};

export default {
  /**
   * Execture search for entity with a given query
   */
  search: (param: SearchParam): Promise<AttLeave[]> => {
    return Api.invoke({
      path: '/att/daily-leave/list',
      param: {
        targetDate: param.targetDate || null,
        empId: param.empId || null,
        ignoredId: param.ignoredId || null,
      },
    }).then(({ leaves }) => leaves.map(createFromParam));
  },

  /**
   * Exectue to get an entity
   */

  /*
  fetch: (): Promise<PersonalSetting> => {
  },
  */

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
