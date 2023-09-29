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
  constructor(remoting) {
    this.approvalHistoryList = new ApprovalHistoryList(remoting);
    this.costCenterList = new CostCenterList(remoting);
    this.empInfo = new EmpInfo(remoting);
    this.expTypeList = new ExpTypeList(remoting);
    this.jobList = new JobList();
    this.currencyList = new CurrencyList(remoting);
    this.route = new Route(remoting);
    this.workCategoryList = new WorkCategoryList();
  }
}
