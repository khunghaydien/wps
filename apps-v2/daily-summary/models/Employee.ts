/**
 * [Entity] 従業員
 */
export default class Employee {
  [x: string]: any;

  /**
   * @param {Object} param
   */
  constructor(param) {
    /**
     * 社員名
     * @type {String}
     */
    this.employeeName = param.employeeName;

    /**
     * 部署名
     * @type {String}
     */
    this.departmentName = param.departmentName;

    /**
     * 勤務体系名
     * @type {String}
     */
    this.workingTypeName = param.workingTypeName;
  }

  /**
   * @param {String} employeeName 社員名
   * @param {String} departmentName 部署名
   * @param {String} workingTypeName 勤務体系名
   * @return {Employee}
   */
  static createFromParam({ employeeName, departmentName, workingTypeName }) {
    return new Employee({
      employeeName,
      departmentName,
      workingTypeName,
    });
  }
}
