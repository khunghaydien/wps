/*
 * Department
 * 部署
 */
export type Department = {
  /**
   * Department's base record ID
   * 部署ベースレコードID
   */
  id: string;

  /**
   * Departmnet's history record ID that targetDate is between validDateTo and validDateFrom
   * targetDateに有効期間がマッチする部署履歴レコードID
   */
  historyId: string;

  /**
   * Name
   * 部署名
   */
  name: string;

  /**
   * Name (language 0)
   * 部署名 (言語0)
   */
  name_L0: string;

  /**
   * Name (language 1)
   * 部署名 (言語1)
   */
  name_L1: string;

  /**
   * Name (language 2)
   * 部署名 (言語2)
   */
  name_L2: string;

  /**
   * Department code
   * 部署コード
   */
  code: string;

  /**
   * Company ID
   * 会社レコードID
   */
  companyId: string;

  /**
   * Employee record ID of manager
   * 部署管理者の社員レコードID
   */
  managerId: string;

  /**
   * Manager
   */
  manager: {
    /**
     * Name of managerg
     * 部署管理者の社員名
     */
    name: string;
    code: string;
  };

  /**
   * Parent department base record ID
   * 親部署ベースレコードID
   */
  parentId: string;

  /**
   * Parent department
   * 親部署
   */
  parent: {
    /**
     * Name of parent department
     * 親部署名
     */
    name: string;
  };

  /**
   * Remarks
   * 備考
   */
  remarks: string;

  /**
   * 有効開始日
   */
  validDateFrom: string;

  /**
   * A flag indicating that department child departments
   */
  hasChildren: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export const defaultValue: Department = {
  id: '',
  historyId: '',
  name: '',
  name_L0: '',
  name_L1: '',
  name_L2: '',
  code: '',
  companyId: '',
  managerId: '',
  manager: {
    name: '',
    code: '',
  },
  parentId: '',
  parent: {
    name: '',
  },
  remarks: '',
  validDateFrom: '',
  hasChildren: false,
};
