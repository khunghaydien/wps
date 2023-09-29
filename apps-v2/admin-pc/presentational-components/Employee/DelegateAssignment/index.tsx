import * as React from 'react';

import get from 'lodash/get';
import values from 'lodash/values';

import { DelegatedApplicant } from '../../../models/DelegatedApplicant';
import {
  DelegatedApprover,
  EmployeeShowObj,
} from '../../../models/DelegatedApprover';

import ApplicantSearchDialog from '../../../containers/DelegateApplicant/EmployeesSearchDialogContainer';
import ApproverSearchDialog from '../../../containers/DelegateApprover/EmployeesSearchDialogContainer';

import { GRID_KEY } from '../../../components/DelegateAssignment/AssignmentGrid';

import DelegateAssignmentDialog from './DelegateAssignmentDialog';

import './index.scss';

type DelegatedAssignment = DelegatedApprover | DelegatedApplicant;
type DelegatedAssignments = Array<DelegatedApprover | DelegatedApplicant>;

type Props = {
  target: string;
  openEmployeeSearchDialog: () => void;
  listDA: () => void;
  cancelDA: () => void;
  select: (arg0: EmployeeShowObj[]) => void;
  saveDA: (arg0: DelegatedApprover[]) => void;
  removeDA: (arg0: EmployeeShowObj[]) => void;
  isEmployeeSelection: boolean;
  isNewAssignment: boolean;
  selectedEmployees: EmployeeShowObj[];
  delegateAssignments: DelegatedAssignments;
  removeFromExcludedEmployees: (arg0: string[]) => void;
};

type State = {
  delegateAssignmentMap: {
    empId?: string | null;
    setting?: DelegatedAssignment;
  };
  selectedIndexes: Array<string>;
  isAllRemoved: boolean;
  isTouched: boolean;
};

export default class DelegateAssignment extends React.Component<Props, State> {
  state = {
    selectedIndexes: [],
    delegateAssignmentMap:
      (this.props.delegateAssignments &&
        this.props.delegateAssignments.reduce((obj, item) => {
          const id =
            this.props.target === GRID_KEY.APPROVER
              ? get(item, 'delegatedApproverId')
              : get(item, 'delegatee.id');
          obj[id] = item;
          return obj;
        }, {})) ||
      {},
    isAllRemoved: false,
    isTouched: false,
  };

  componentDidMount() {
    this.props.listDA();
  }

  onRowsSelected = (rows: Array<{ row: EmployeeShowObj }>) => {
    this.setState((prevState) => {
      const selectedIndexes = prevState.selectedIndexes.concat(
        rows.map((r) => r.row.id)
      );
      return { selectedIndexes };
    });
  };

  onRowsDeselected = (rows: Array<{ row: EmployeeShowObj }>) => {
    this.setState((prevState) => {
      const rowIndexes = rows.map((r) => r.row.id);
      const selectedIndexes = prevState.selectedIndexes.filter(
        (i) => rowIndexes.indexOf(i) === -1
      );
      return { selectedIndexes };
    });
  };

  onClickSave = () => {
    const { saveDA } = this.props;
    const { delegateAssignmentMap } = this.state;
    this.setState({ isTouched: false });
    const delegateAssignments = values(delegateAssignmentMap);
    // @ts-ignore
    saveDA(delegateAssignments);
  };

  isDelegateApplicant = () => this.props.target === GRID_KEY.APPLICANT;

  isDelegateApprover = () => this.props.target === GRID_KEY.APPROVER;

  addEmployeeList = () => {
    const { selectedEmployees, removeDA } = this.props;
    this.setState((prevState) => {
      const prevMap = prevState.delegateAssignmentMap;
      const setApproverObj = (obj, employee) => {
        obj.settingId = null;
        obj.delegatedApproverId = employee.id;
        obj.delegatedApproverCode = employee.code;
        obj.delegatedApproverName = employee.name;
        obj.delegatedApproverPhotoUrl = employee.photoUrl;
        obj.canApproveExpenseRequestByDelegate = false;
        obj.canApproveExpenseReportByDelegate = false;
        obj.isActiveSFUserAcc = employee.isActiveSFUserAcc;
      };
      const setApplicantObj = (obj, employee) => {
        obj.settingId = null;
        obj.delegateeId = employee.id;
        obj.delegatee = {
          id: employee.id,
          code: employee.code,
          name: employee.name,
          photoUrl: employee.photoUrl,
        };
        obj.delegatedFor = {
          expense: false,
          request: false,
        };
        obj.isActiveSFUserAcc = employee.isActiveSFUserAcc;
      };
      selectedEmployees.forEach((employee) => {
        const updateObj = {};
        if (this.isDelegateApprover()) {
          setApproverObj(updateObj, employee);
        } else if (this.isDelegateApplicant()) {
          setApplicantObj(updateObj, employee);
        }
        prevMap[employee.id] = updateObj;
      });
      removeDA(selectedEmployees);
      return { delegateAssignmentMap: prevMap, isTouched: true };
    });
  };

  updateValue = (target: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const empId = e.target.value;
    const updateObj = {};

    const setApproverObj = (obj, setting) => {
      obj.settingId = (setting && setting.settingId) || null;
      obj.delegatedApproverId = empId;
      obj.delegatedApproverCode = setting.delegatedApproverCode;
      obj.delegatedApproverName = setting.delegatedApproverName;
      obj.delegatedApproverPhotoUrl = setting.delegatedApproverPhotoUrl;
      obj.canApproveExpenseRequestByDelegate =
        target === 'REQUEST'
          ? checked
          : setting.canApproveExpenseRequestByDelegate;
      obj.canApproveExpenseReportByDelegate =
        target === 'EXPENSE'
          ? checked
          : setting.canApproveExpenseReportByDelegate;
      obj.isActiveSFUserAcc = true;
    };

    const setApplicantObj = (obj, setting) => {
      obj.settingId = get(setting, 'settingId', null);
      obj.delegateeId = get(setting, 'delegatee.id', null);
      obj.delegatee = {
        id: get(setting, 'delegatee.id', ''),
        code: get(setting, 'delegatee.code', ''),
        name: get(setting, 'delegatee.name', ''),
        photoUrl: get(setting, 'delegatee.photoUrl', ''),
      };
      obj.delegatedFor = {
        expense:
          target === 'EXPENSE'
            ? checked
            : get(setting, 'delegatedFor.expense', null),
        request:
          target === 'REQUEST'
            ? checked
            : get(setting, 'delegatedFor.request', null),
      };
      obj.isActiveSFUserAcc = true;
    };

    this.setState((prevState) => {
      const prevMap = prevState.delegateAssignmentMap;
      const setting = prevMap[empId];
      if (this.isDelegateApprover()) {
        setApproverObj(updateObj, setting);
      } else if (this.isDelegateApplicant()) {
        setApplicantObj(updateObj, setting);
      }
      prevMap[empId] = updateObj;
      return { delegateAssignmentMap: prevMap, isTouched: true };
    });
  };

  deleteRecord = () => {
    const { selectedIndexes } = this.state;
    const isAllRemoved =
      selectedIndexes.length ===
      values(this.state.delegateAssignmentMap).length;
    this.setState((prevState) => {
      const selectedIds = prevState.selectedIndexes;
      this.props.removeFromExcludedEmployees(selectedIds);
      let delegateAssignmentMap = {};
      const prevMap = prevState.delegateAssignmentMap;
      selectedIds.forEach((i) => {
        delete prevMap[i];
      });
      delegateAssignmentMap = prevMap;
      return {
        delegateAssignmentMap,
        selectedIndexes: [],
        isAllRemoved,
        isTouched: true,
      };
    });
  };

  renderEmployeeSearchDialog() {
    const { selectedEmployees, isEmployeeSelection } = this.props;
    if (selectedEmployees.length > 0) {
      this.addEmployeeList();
    }
    let EmployeeDialog = null;
    if (isEmployeeSelection) {
      if (this.isDelegateApprover()) {
        EmployeeDialog = <ApproverSearchDialog select={this.props.select} />;
      } else if (this.isDelegateApplicant()) {
        EmployeeDialog = <ApplicantSearchDialog select={this.props.select} />;
      }
    }
    return EmployeeDialog;
  }

  renderDelegateAssignDialog() {
    const { delegateAssignmentMap, selectedIndexes, isAllRemoved } = this.state;
    const {
      target,
      selectedEmployees,
      cancelDA,
      openEmployeeSearchDialog,
      isNewAssignment,
    } = this.props;
    const delegateAssignments = values(delegateAssignmentMap);
    const approverList = selectedEmployees || [];
    const hasDelegates =
      approverList.length > 0 || delegateAssignments.length > 0;
    const maxLimit = this.isDelegateApprover() ? 10 : 100;
    const isExtraDA =
      values(this.state.delegateAssignmentMap).length > maxLimit;
    if (isNewAssignment) {
      return (
        <DelegateAssignmentDialog
          target={target}
          cancelDA={cancelDA}
          hasDelegates={hasDelegates}
          isAllRemoved={isAllRemoved}
          approverList={approverList}
          isExtraDA={isExtraDA}
          openEmployeeSearchDialog={openEmployeeSearchDialog}
          // @ts-ignore
          delegateAssignments={delegateAssignments}
          selectedIndexes={selectedIndexes}
          onClickSave={this.onClickSave}
          deleteRecord={this.deleteRecord}
          updateValue={this.updateValue}
          onRowsSelected={this.onRowsSelected}
          onRowsDeselected={this.onRowsDeselected}
          isTouched={this.state.isTouched}
        />
      );
    } else {
      return null;
    }
  }

  renderDelegateInfo() {
    return (
      <React.Fragment>
        {this.renderDelegateAssignDialog()}
        {this.renderEmployeeSearchDialog()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="delegate-assignment">{this.renderDelegateInfo()}</div>
    );
  }
}
