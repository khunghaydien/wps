import * as React from 'react';

import values from 'lodash/values';

import {
  DelegatedApprover,
  EmployeeShowObj,
} from '../../models/DelegatedApprover';

import TargetEmployeesSearchDialog from '../../containers/DelegateApprover/EmployeesSearchDialogContainer';

import DelegatedApproverDialog from './DelegatedApproverDialog';

import './DelegateAssignment.scss';

type Props = Readonly<{
  openEmployeeSearchDialog: () => void;
  listDA: () => void;
  cancelDA: () => void;
  saveDA: (arg0: DelegatedApprover[]) => void;
  removeDA: (arg0: EmployeeShowObj[]) => void;
  isEmployeeSelection: boolean;
  isShowDADialog: boolean;
  selectedEmployees: EmployeeShowObj[];
  delegateAssignments: DelegatedApprover[];
  removeFromExcludedEmployees: (arg0: string[]) => void;
}>;

type State = {
  delegatedApprovalMap: {
    empId?: string | null;
    setting?: DelegatedApprover;
  };
  selectedIndexes: Array<string>;
  isAllRemoved: boolean;
  isTouched: boolean;
};

export default class DelegateAssignment extends React.Component<Props, State> {
  state = {
    selectedIndexes: [],
    delegatedApprovalMap:
      (this.props.delegateAssignments &&
        this.props.delegateAssignments.reduce((obj, item) => {
          obj[item.delegatedApproverId] = item;
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
    const { delegatedApprovalMap } = this.state;
    this.setState({ isTouched: false });
    const delegateAssignments = values(delegatedApprovalMap);
    // @ts-ignore
    saveDA(delegateAssignments);
  };

  addEmployeeList = () => {
    const { selectedEmployees, removeDA } = this.props;
    this.setState((prevState) => {
      const prevMap = prevState.delegatedApprovalMap;
      selectedEmployees.forEach((employee) => {
        const newObj = {
          settingId: null,
          delegatedApproverId: employee.id,
          delegatedApproverCode: employee.code,
          delegatedApproverName: employee.name,
          delegatedApproverPhotoUrl: employee.photoUrl,
          canApproveExpenseRequestByDelegate: false,
          canApproveExpenseReportByDelegate: false,
          isActiveSFUserAcc: employee.isActiveSFUserAcc,
        };
        prevMap[employee.id] = newObj;
      });
      // @ts-ignore
      removeDA(selectedEmployees);
      return { delegatedApprovalMap: prevMap, isTouched: true };
    });
  };

  updateValue = (target: string, e) => {
    const checked = e.target.checked;
    const empId = e.target.value;
    this.setState((prevState) => {
      // setting for particular delegated approver
      const prevMap = prevState.delegatedApprovalMap;
      const setting = prevMap[empId];
      const newObj = {
        settingId: (setting && setting.id) || null,
        delegatedApproverId: empId,
        delegatedApproverCode: setting.delegatedApproverCode,
        delegatedApproverName: setting.delegatedApproverName,
        delegatedApproverPhotoUrl: setting.delegatedApproverPhotoUrl,
        canApproveExpenseRequestByDelegate:
          target === 'REQUEST'
            ? checked
            : setting.canApproveExpenseRequestByDelegate,
        canApproveExpenseReportByDelegate:
          target === 'EXPENSE'
            ? checked
            : setting.canApproveExpenseReportByDelegate,
        isActiveSFUserAcc: true,
      };
      prevMap[empId] = newObj;
      return { delegatedApprovalMap: prevMap, isTouched: true };
    });
  };

  deleteRecord = () => {
    const { selectedIndexes } = this.state;
    const isAllRemoved =
      selectedIndexes.length === values(this.state.delegatedApprovalMap).length;
    this.setState((prevState) => {
      const selectedIds = prevState.selectedIndexes;
      this.props.removeFromExcludedEmployees(selectedIds);
      let delegatedApprovalMap = {};
      const prevMap = prevState.delegatedApprovalMap;
      selectedIds.forEach((i) => {
        delete prevMap[i];
      });
      delegatedApprovalMap = prevMap;
      return {
        delegatedApprovalMap,
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
    // @ts-ignore
    return isEmployeeSelection ? <TargetEmployeesSearchDialog /> : null;
  }

  renderDelegateAssignDialog() {
    const { delegatedApprovalMap, selectedIndexes, isAllRemoved } = this.state;
    const {
      selectedEmployees,
      cancelDA,
      openEmployeeSearchDialog,
      isShowDADialog,
    } = this.props;
    const delegatedApprovers = values(
      delegatedApprovalMap
    ) as DelegatedApprover[];
    const approverList = selectedEmployees || [];
    const hasDelegates =
      approverList.length > 0 || delegatedApprovers.length > 0;
    const isExtraDA = values(this.state.delegatedApprovalMap).length > 10;
    if (isShowDADialog) {
      // @ts-ignore
      return (
        <DelegatedApproverDialog
          cancelDA={cancelDA}
          hasDelegates={hasDelegates}
          isAllRemoved={isAllRemoved}
          approverList={approverList}
          isExtraDA={isExtraDA}
          openEmployeeSearchDialog={openEmployeeSearchDialog}
          delegatedApprovers={delegatedApprovers}
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
    return <div className="delegate-approver">{this.renderDelegateInfo()}</div>;
  }
}
