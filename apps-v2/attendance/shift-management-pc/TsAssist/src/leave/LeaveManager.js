import {Remoting}            from "../_common/Remoting.js?v=XVERSIONX";
import {Util}                from "../_common/Util.js?v=XVERSIONX";
import {Emp}                 from "./obj/Emp.js?v=XVERSIONX";
import {HolidayGroup}        from "./obj/HolidayGroup.js?v=XVERSIONX";
/**
 * 休暇管理マネージャクラス
 */
export class LeaveManager {
    constructor(){
        this.holidayGroups = [];
        this.emps = [];
        // 社員休暇管理データ（EmpLeaveManage__c）の項目
        this.empLeaveManageFields = [
            'Id',
            'CreatedDate',
            'LastModifiedDate',
            'EmpId__c',
            'HolidayGroupId__c',
            'HolidayGroupId__r.Name',
            'HolidayGroupId__r.Type__c',
            'PcType__c',
            'ProvideDays__c',
            'ProvideTime__c',
            'ConsumeDays__c',
            'ConsumeTime__c',
            'StartDate__c',
            'EndDate__c',
            'ExcludeDate__c',
            'Periodic__c',
            'NotObligatoryFlag__c',
            'OldNextProvideDate__c',
            'RealProvideDays__c',
            'HourlyPaidLeaveFlag__c',
            'PlannedHolidayFlag__c',
            'AdjustTargetId__c',
            'AdjustTargetId__r.ProvideDays__c',
            'AdjustTargetId__r.ProvideTime__c',
            'AdjustTargetId__r.StartDate__c',
            'AdjustTargetId__r.EndDate__c',
            'AdjustYear__c',
            'AdjustYearSubNo__c',
            'BatchInsertKey__c',
            'BatchConvertKey__c',
            'MigrationKey__c',
            'DayType__c',
            'WorkRealTime__c',
            'Description__c',
            'EmpApplyId__c',
            'EmpApplyId__r.Name',
            'EmpApplyId__r.Status__c',
            'EmpApplyId__r.HolidayId__r.Name',
            'EmpApplyId__r.HolidayId__r.Type__c',
            'EmpApplyId__r.HolidayId__r.Range__c',
            '(select Id from AdjustTarget__r limit 2)'
        ];
        // 月次休暇残高データ（MonthlyLeaveBalance__c）の項目
        this.monthlyLeaveBalanceFields = [
            'Id',
            'CreatedDate',
            'LastModifiedDate',
            'EmpId__c',
            'HolidayGroupId__c',
            'HolidayGroupId__r.Name',
            'HolidayGroupId__r.Type__c',
            'EmpMonthId__c',
            'EmpMonthId__r.EmpApplyId__r.Status__c',
            'YearMonthS__c',
            'YearMonth__c',
            'SubNo__c',
            'MonthStartDate__c',
            'MonthEndDate__c',
            'BaseTime__c',
            'PcType__c',
            'ProvideDays__c',
            'ProvideTime__c',
            'ConsumeDays__c',
            'ConsumeTime__c',
            'RemainDays__c',
            'RemainTime__c',
            'OvertakeDays__c',
            'OvertakeTime__c',
            'ViolateTime__c',
            'StartDate__c',
            'EndDate__c',
            'Expired__c',
            'OrderCode__c',
            'EmpLeaveManageId__c',
            'EmpLeaveManageId__r.EmpApplyId__c',
            'EmpLeaveManageId__r.EmpApplyId__r.Name',
            'EmpLeaveManageId__r.EmpApplyId__r.Status__c',
            'EmpLeaveManageId__r.EmpApplyId__r.HolidayId__r.Name',
            'EmpLeaveManageId__r.EmpApplyId__r.HolidayId__r.Type__c',
            'EmpLeaveManageId__r.EmpApplyId__r.HolidayId__r.Range__c',
            'EmpLeaveManageId__r.Description__c',
            'EmpLeaveManageId__r.HourlyPaidLeaveFlag__c'
        ];
    }
    /**
     * 初期データ採取（休暇グループと勤怠社員）
     * @param {string} empId 
     * @returns {Promise}
     */
    ready(empId){
        return new Promise((resolve, reject) => {
            this.fetchHolidayGroups().then(() => {
                this.fetchEmps(empId, resolve, reject);
            }, (errobj) => {
                reject(errobj);
            });
        });
    }
    /**
     * URLを解析して retURL 引数を取得
     * @returns {Array.<string>}
     */
    parseRetURLs(){
        const retURLs = [];
        this.getRetURLFromArgs(location.search.split(/[?&]/), retURLs);
        return retURLs.reverse(); // retURLの配列を大元から順にソート
    }
    /**
     * URLの引数から retURL を配列にして返す（再帰関数）
     * @param {Array.<string>} args 
     * @param {Array.<string>} retURLs 
     */
    getRetURLFromArgs(args, retURLs){
        let path = null;
        for(let i = 0 ; i < args.length ; i++){
            const p = args[i].split(/=/);
            if(p[0] == 'retURL'){
                path = decodeURIComponent(p[1]);
                break;
            }
        }
        if(path){
            retURLs.push(path);
            this.getRetURLFromArgs(path.split(/&/), retURLs);
        }
    }
    /**
     * 休暇グループの配列を返す
     * @returns {Array.<HolidayGroup>}
     */
    getHolidayGroups(){
        return this.holidayGroups;
    }
    /**
     * 日数管理の休暇グループの配列を返す
     * @param flag trueの場合は時間単位有休制限を除いた配列を返す
     * @returns {Array.<HolidayGroup>}
     */
    getManageGroups(flag){
        return this.holidayGroups.filter((group) => { return group.isDaysManage() && (!flag || !group.isTypeH()); });
    }
    /**
     * 勤怠社員の配列を返す
     * @returns {Array.<Emp>}
     */
    getEmps(){
        return this.emps;
    }
    /**
     * メンバ変数の勤怠社員配列と引数の勤怠社員配列をマージ、社員コード＞社員名となるようにソート
     * @param {Array.<Emp>} emps 
     */
    mergeEmps(emps){
        const mp = {};
        this.emps.forEach((emp) => {
            mp[emp.getId()] = emp;
        });
        emps.forEach((emp) => {
            mp[emp.getId()] = emp;
        });
        this.emps = Object.keys(mp).map((empId) => { return mp[empId]; }).sort((a, b) => {
            if(a.getCode() == b.getCode()){
                if(a.getName() == b.getName()){
                    return (a.getId() < b.getId() ? -1 : 1);
                }else{
                    return (a.getName() < b.getName() ? -1 : 1);
                }
            }else{
                return (a.getCode() < b.getCode() ? -1 : 1);
            }
        });
    }
    /**
     * 社員IDから勤怠社員を返す
     * @param {string} empId 
     * @returns {Emp|null}
     */
    getEmpById(empId){
        if(!empId){
            return null;
        }
        const emps = this.emps.filter(emp => (emp.getId() == empId));
        return emps.length ? emps[0] : null;
    }
    /**
     * 休暇グループIDから休暇グループを返す
     * @param {string} holidayGroupId 
     * @returns {HolidayGroup|null}
     */
    getHolidayGroupById(holidayGroupId){
        if(!holidayGroupId){
            return null;
        }
        const holidayGroups = this.holidayGroups.filter(holidayGroup => (holidayGroup.getId() == holidayGroupId));
        return holidayGroups.length ? holidayGroups[0] : null;
    }
    getHolidayGroupTypeH(){
        const holidayGroups = this.holidayGroups.filter(holidayGroup => (holidayGroup.getType() == 'H'));
        return holidayGroups.length ? holidayGroups[0] : null;
    }
    /**
     * 休暇グループを読み込む
     * @returns {Promise}
     */
    fetchHolidayGroups(){
        return new Promise((resolve, reject) => {
            if(this.holidayGroups.length){
                resolve();
                return;
            }
            this.holidayGroups = [];
            const req = {
                soql: `select Id,Name,Type__c,DaysManage__c from HolidayGroup__c order by Order__c`,
                offset: 0,
                limit: 5000
            };
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    Util.excludeNameSpace(result);
                    result.records.forEach((record) => {
                        this.holidayGroups.push(new HolidayGroup(record));
                    });
                    resolve();
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * 勤怠社員を読み込む
     * @param {string} empId 
     * @param {Function} resolve 
     * @param {Function} reject 
     */
    fetchEmps(empId, resolve, reject){
        const emp = this.getEmpById(empId);
        if(emp){
            resolve();
            return;
        }
        const req = {
            soql: `select Id, Name, EmpCode__c, NextYuqProvideDate__c, EmpTypeId__c, EntryDate__c, EndDate__c from AtkEmp__c` + (empId ? ` where Id = '${empId}'` : ''),
            offset: 0,
            limit: 5000
        };
        Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
            (result) => {
                Util.excludeNameSpace(result);
                const emps = [];
                result.records.forEach((record) => {
                    emps.push(new Emp(record));
                });
                this.mergeEmps(emps);
                resolve();
            },
            (event) => {
                reject(event);
            }
        );
    }
    /**
     * EmpLeaveManage__c 読み込み
     * @param {string} empId
     * @param {string} fromDate
     * @param {string} toDate
     */
    fetchEmpLeaveManage(empId, fromDate, toDate){
        return new Promise((resolve, reject) => {
            let soql = `select ${this.empLeaveManageFields.join(',')} from EmpLeaveManage__c where EmpId__c = '${empId}'`;
            if(fromDate){ soql += ` and EndDate__c >= ${fromDate}`; }
            if(toDate  ){ soql += ` and StartDate__c <= ${toDate}`; }
            soql += ' order by StartDate__c,EndDate__c,Id';
            const req = {
                soql: Util.shapeStr(soql),
                offset: 0,
                limit: 5000
            };
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    Util.excludeNameSpace(result);
                    resolve(result.records);
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * MonthlyLeaveBalance__c 読み込み
     * @param {string} empId
     * @param {string} fromDate
     * @param {string} toDate
     */
     fetchMonthlyLeaveBalances(empId, fromDate, toDate){
        return new Promise((resolve, reject) => {
            let soql = `select ${this.monthlyLeaveBalanceFields.join(',')} from MonthlyLeaveBalance__c where EmpId__c = '${empId}'`;
            if(fromDate){ soql += ` and MonthEndDate__c >= ${fromDate}`; }
            if(toDate  ){ soql += ` and MonthStartDate__c <= ${toDate}`; }
            soql += ' order by MonthStartDate__c,OrderCode__c';
            const req = {
                soql: Util.shapeStr(soql),
                offset: 0,
                limit: 5000
            };
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    Util.excludeNameSpace(result);
                    resolve(result.records);
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * 社員休暇管理データを保存
     * @param {Object} req 
     * @returns {Promise}
     */
    saveEmpLeaveManage(req){
        return new Promise((resolve, reject) => {
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    console.log(result);
                    resolve();
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * 月次休暇残高を構築
     * @param {社員ID}} empId 
     * @param {対象日} targetDate 
     * @returns 
     */
     getMonthlyLeaveValues(empId, targetDate){
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'getMonthlyLeaveValues',
            empId: empId,
            targetDate: targetDate
        };
        return new Promise((resolve, reject) => {
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    resolve(result.remains);
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * 月次休暇残高の整合性検査
     * @param {string} empId 
     * @returns {Promise}
     */
    inspectMonthlyLeaveBalance(empId){
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'inspectMonthlyLeaveBalance',
            empId: empId
        };
        return new Promise((resolve, reject) => {
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    resolve(result.inspectResult);
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * 月次休暇残高を構築
     * @param {社員ID}} empId 
     * @param {更新開始日} fromDate 
     * @returns 
     */
    buildMonthlyLeaveBalance(empId, fromDate){
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'buildMonthlyLeaveBalance',
            empId: empId,
            fromDate: fromDate
        };
        return new Promise((resolve, reject) => {
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    resolve(result.inspectResult);
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * 時間単位有休用の年度・期間を得る
     * @param {string} empId 
     * @returns {Promise}
     */
    getHourlyPaidLeavePeriods(empId){
        return new Promise((resolve, reject) => {
            const req = {
                action: 'operateEmpLeaveManage',
                operateType: 'getHourlyPaidLeavePeriods',
                empId: empId,
                yearToDraw: 1,
                yearToAdd: 4
            };
            Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                (result) => {
                    resolve(result.ranges);
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
}