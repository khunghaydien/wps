import Api from '../commons/api';

import { Department } from '../domain/models/organization/Department';

import adapter from './adapters';

export type SearchParam = {
  /**
   * Retrieve departments whose base ID matches `id`.
   * この値を指定した場合、ベースレコードIDが一致するレコードを検索します。
   */
  id?: string;

  /**
   * Retrieve departments whose company ID maches `companyId`.
   * この値を指定した場合、会社レコードIDが一致するレコードを検索します。
   */
  companyId?: string;

  /**
   * Retrieve departments whose parent ID maches `parentId`.
   * この値を指定した場合、親部署 (ベース) レコードIDが一致するレコードを検索します。
   */
  parentId?: string;

  /**
   * Retrieve valid departmnets on targetDate.
   * 履歴管理項目について、指定した日付時点の履歴データから取得します。
   */
  targetDate?: string;
};

export default {
  /**
   * Execture search for entity with a given query
   */
  search: (param: SearchParam): Promise<Department[]> => {
    return Api.invoke({
      path: '/department/search',
      param: {
        id: param.id || null,
        companyId: param.companyId || null,
        parentId: param.parentId || null,
        targetDate: param.targetDate || null,
      },
    }).then(({ records }) => adapter.fromRemote(records));
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
