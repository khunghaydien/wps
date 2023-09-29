import ApprovalHistoryList from './ApprovalHistoryList';
import CostCenterList from './CostCenterList';
import CurrencyList from './CurrencyList';
import EmpInfo from './EmpInfo';
import ExpTypeList from './ExpTypeList';
import JobList from './JobList';
import Route from './Route';
import WorkCategoryList from './WorkCategoryList';

export default class Common {
  approvalHistoryList: any;
  costCenterList: any;
  empInfo: any;
  expTypeList: any;
  jobList: any;
  currencyList: any;
  route: any;
  workCategoryList: any;
  /**
   * Common内にて使用されるAPIを保持する
   */
  constructor() {
    this.approvalHistoryList = new ApprovalHistoryList();
    this.costCenterList = new CostCenterList();
    this.empInfo = new EmpInfo();
    this.expTypeList = new ExpTypeList();
    this.jobList = new JobList();
    this.currencyList = new CurrencyList();
    this.route = new Route();
    this.workCategoryList = new WorkCategoryList();
  }
}
