/**
 * 社員オブジェクト
 * Employee
 */
export type Employee = {
  /**
   * 社員ベースレコードID
   * Employee base record ID
   */
  id: string;

  /**
   * 履歴レコードID
   * History Id
   */
  historyId: string;

  /**
   * 社員コード
   * Employee's code
   */
  code: string;

  /**
   * 社員名
   * Employee's name
   */
  name: string;

  /**
   * 姓(L0)
   * Employee's last name (L0)
   */
  lastName_L0: string;

  /**
   * ミドルネーム(L0)
   * Employee's middle name (L0)
   */
  middleName_L0: string;

  /**
   * 名(L0)
   * Employee's first name (L0)
   */
  firstName_L0: string;

  /**
   * 姓(L1)
   * Employee's last name (L1)
   */
  lastName_L1: string;

  /**
   * ミドルネーム(L1)
   * Employee's middle name (L1)
   */
  middleName_L1: string;

  /**
   * 名(L1)
   * Employee's first name (L1)
   */
  firstName_L1: string;

  /**
   * 姓(L2)
   * Employee's last name (L2)
   */
  lastName_L2: string;

  /**
   * ミドルネーム(L2)
   * Employee's middle name (L2)
   */
  middleName_L2: string;

  /**
   * 名(L2)
   * Employee's first name (L2)
   */
  firstName_L2: string;

  /**
   * 表示名
   * Employee's display name
   */
  displayName: string;

  /**
   * 表示名(L0)
   * Employee's display name(L0)
   */
  displayName_L0: string;

  /**
   * 表示名(L1)
   * Employee's display name(L1)
   */
  displayName_L1: string;

  /**
   * 表示名(L2)
   * Employee's display name(L2)
   */
  displayName_L2: string;

  /**
   * 会社レコードID
   */
  companyId: string;

  /**
   * 入社日
   * The date when the employee enters the company
   */
  startDate: string;

  /**
   * 退社日
   * The date when the employee leaves the company
   */
  resignationDate: string;

  /**
   * 所属部署のベースレコードID
   * Department's base record ID
   */
  departmentId: string;

  /**
   * 所属部署
   * Department
   */
  department: {
    /**
     * 所属部署のベースレコードID
     * Department's base record ID
     *
     * TODO
     * Uncomment the following code
     * if Web API would return \`id\` property in department object.
     */

    // id: string,

    /**
     * Department's code
     */
    code: string;

    /**
     * 所属部署名
     * Department's name
     */
    name: string;
  };

  /**
   * 役職
   * Employee's title
   */
  title: string;

  /**
   * 役職(L0)
   * Employee's title(L0)
   */
  title_L0: string;

  /**
   * 役職(L1)
   * Employee's title(L1)
   */
  title_L1: string;

  /**
   * 役職(L2)
   * Employee's title(L2)
   */
  title_L2: string;

  /**
   * 上長(社員ベース)のレコードID
   * ID of Employee's manager
   */
  managerId: string;

  /**
   * 上長(社員ベース)
   * Employee's manager
   */
  manager: {
    /**
     * 上長(社員ベース)のレコードID
     * ID of Employee's manager
     *
     * TODO
     * Uncomment the following code
     * if Web API would return \`id\` property in department object.
     */

    // id: string,

    /**
     * 上長(社員ベース)の名前
     * name of Employee's manager
     */
    name: string;
    code: string;
  };

  /**
   * 承認者01(社員ベース)のレコードID
   * Employee's approver01Id
   */
  approver01Id: string;

  approver01: {
    name: string;
    code: string;
  };

  /**
   * ユーザのレコードID
   * User's record ID
   */
  userId: string;

  /**
   * ユーザ
   * User
   */
  user: {
    /**
     * ユーザのレコードID
     * User's record ID
     *
     * TODO
     * Uncomment the following code
     * if Web API would return \`id\` property in department object.
     */

    // id: string,

    /**
     * ユーザーの顔写真URL
     */
    photoUrl: string;
  };

  /**
   * コメント
   * comment
   */
  comment: string;

  /**
   * 勤務体系ベースID
   * Working Type ID
   */
  workingTypeId: string;

  /**
   * 勤務体系
   * Working Type
   */
  workingType: {
    /**
     * Working Type ID
     *
     * TODO
     * Uncomment the following code
     * if Web API would return \`id\` property in department object.
     */

    // id: string,

    /**
     * 勤務体系名
     * Name of working type
     */
    name: string;
  };

  /**
   * 工数設定ベースID
   * Time Setting ID
   */
  timeSettingId: string;

  /**
   * 工数設定
   * Time Setting
   */
  timeSetting: {
    /**
     * Time Setting ID
     *
     * TODO
     * Uncomment the following code
     * if Web API would return \`id\` property in department object.
     */

    // id: string,

    /**
     * 工数設定名
     * Name of Time Setting
     */
    name: string;
  };

  /**
   * 36協定アラート設定ID
   * ID of Alert Setting for the 36 Agreement
   */
  agreementAlertSettingId: string;

  /**
   * 36協定アラート設定
   * Alert Setting for the 36 Agreement
   */
  agreementAlertSetting: {
    /**
     * 36協定アラート設定ID
     * ID of Alert Setting for The 36 Agreement
     *
     * TODO
     * Uncomment the following code
     * if Web API would return \`id\` property in department object.
     */

    // id: string,

    /**
     * 36協定アラート設定名
     * Name of alert setting for the 36 Agreement
     */
    name: string;
  };

  /**
   * カレンダーレコードID
   * Calendar record ID
   */
  calendarId: string;

  /**
   * 通勤定期有
   * The flag indicates commuter's pass user
   */
  commuterPassAvailable: boolean;

  /**
   * ジョルダン経路情報
   * Jorudan(※) routing information
   *
   * (※) Jorudan is the route searching service via Web API
   */
  jorudanRoute: {
    /**
     * 定期代(１ヶ月)
     * fare (1 month)
     */
    fare1: number;

    /**
     * 定期代(３ヶ月)
     * fare (3 month)
     */
    fare3: number;

    /**
     * 定期代(６ヶ月)
     * fare (6 month)
     */
    fare6: number;

    /**
     * 路線リスト
     * Route list
     */
    pathList: Array<{
      /**
       * 路線：出発地名
       * Station/Location of departure
       */
      fromName: string;

      /**
       * 路線：到着地名
       * Station/Location of destination
       */
      toName: string;

      /**
       * 路線：路線名
       * The line name
       */
      lineName: string;

      /**
       * 路線：路線種別
       * classification of the line
       */
      lineType: string;
    }>;
  };

  /**
   * 権限ID
   * Permission record ID
   */
  permissionId: string;

  /**
   * Employee has active Salesforce User
   */
  isActiveSFUserAcc?: boolean;
};
