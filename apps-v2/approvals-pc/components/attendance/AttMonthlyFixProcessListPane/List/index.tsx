import React from 'react';

import Grid from '../../../../../commons/components/Grid';
import DateFilter from '../../../../../commons/components/Grid/filters/DateFilter';
import DoubleTextFilter from '../../../../../commons/components/Grid/filters/DoubleTextFilter';
import SelectFilter from '../../../../../commons/components/Grid/filters/SelectFilter';
import DateYM from '../../../../../commons/components/Grid/Formatters/DateYM';
import DateYMD from '../../../../../commons/components/Grid/Formatters/DateYMD';
import msg from '../../../../../commons/languages';

import ApprovalType, {
  ApprovalTypeValue,
} from '../../../../../domain/models/approval/ApprovalType';

import { State as FilterTermsType } from '../../../../modules/ui/attMonthly/list/filterTerms';

import ToolBar from '../../../listParts/ToolBar';
import Employee from '../../particles/Grid/Formatters/Employee';
import PhotoUrl from '../../particles/Grid/Formatters/PhotoUrl';
import MaxSelectField from '../../particles/MaxSelectField';

import './index.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-list';

type Props = {
  totalCount: number;
  requestList: Array<any>;
  filterTerms: FilterTermsType;
  existingMonths: Array<string | { text: string; value: any }>;
  selectedIds: Array<string>;
  browseId: string;
  approvalType: ApprovalTypeValue;
  onClickRow: (arg0: string) => void;
  onChangeMaxSelection: (arg0: number) => void;
  onChangeRowSelection: (arg0: { id: string; checked: boolean }) => void;
  onSwitchApprovalType: (arg0: ApprovalTypeValue) => void;
  onUpdateFilterTerm: (arg0: keyof FilterTermsType, arg1: string) => void;
  activeDialog: string;
  listedIds: Array<string>;
  maxSelection: number;
  canBulkApprove: boolean;
  onClickApproveAllButton: () => void;
  overLimit: boolean;
};

export default class List extends React.Component<Props> {
  buildColumnsSetting() {
    const {
      filterTerms,
      onUpdateFilterTerm,
      onChangeMaxSelection,
      maxSelection,
    } = this.props;
    const bindOnUpdateFilterTermByKey =
      (key: keyof FilterTermsType) => (value: string) =>
        onUpdateFilterTerm(key, value);

    const photoUrl = {
      name: null,
      key: ['photoUrl'],
      width: 60,
      formatter: PhotoUrl,
      renderFilter: () => (
        <MaxSelectField value={maxSelection} onChange={onChangeMaxSelection} />
      ),
    };

    const employee = {
      name: `${msg().Appr_Lbl_ApplicantName} / ${
        msg().Appr_Lbl_DepartmentName
      }`,
      key: ['employeeName', 'departmentName'],
      shrink: true,
      grow: true,
      width: 87, // NOTE: ブラウザ幅1024px時の表示から算定した基準値
      formatter: Employee,
      renderFilter: () => (
        <DoubleTextFilter
          firstValue={filterTerms.employeeName}
          secondValue={filterTerms.departmentName}
          onChangeFirstValue={bindOnUpdateFilterTermByKey('employeeName')}
          onChangeSecondValue={bindOnUpdateFilterTermByKey('departmentName')}
        />
      ),
    };

    const approver = {
      name: `${msg().Appr_Lbl_ApproverName} / ${msg().Appr_Lbl_DepartmentName}`,
      key: ['approverPhotoUrl', 'approverName', 'approverDepartmentName'],
      shrink: true,
      grow: true,
      width: 87, // NOTE: ブラウザ幅1024px時の表示から算定した基準値
      formatter: Employee,
      extraProps: {
        keyMap: {
          photoUrl: 'approverPhotoUrl',
          employeeName: 'approverName',
          departmentName: 'approverDepartmentName',
        },
      },
      renderFilter: () => (
        <DoubleTextFilter
          firstValue={filterTerms.approverName}
          secondValue={filterTerms.approverDepartmentName}
          onChangeFirstValue={bindOnUpdateFilterTermByKey('approverName')}
          onChangeSecondValue={bindOnUpdateFilterTermByKey(
            'approverDepartmentName'
          )}
        />
      ),
    };

    const targetMonth = {
      name: msg().Appr_Lbl_Period,
      key: 'targetMonth',
      width: 100,
      shrink: false,
      grow: false,
      formatter: DateYM,
      renderFilter: () => (
        <SelectFilter
          options={this.props.existingMonths}
          value={filterTerms.targetMonth}
          onChange={bindOnUpdateFilterTermByKey('targetMonth')}
        />
      ),
    };

    const requestDate = {
      name: msg().Appr_Lbl_RequestDate,
      key: 'requestDate',
      width: 180,
      shrink: false,
      grow: false,
      formatter: DateYMD,
      renderFilter: () => (
        <DateFilter
          value={filterTerms.requestDate}
          onChange={bindOnUpdateFilterTermByKey('requestDate')}
        />
      ),
    };

    return this.props.approvalType === ApprovalType.ByEmployee
      ? [photoUrl, employee, targetMonth, requestDate]
      : [photoUrl, employee, approver, targetMonth, requestDate];
  }

  render() {
    const isFilterUsing = Object.values(this.props.filterTerms).some(
      (value) => value !== ''
    );
    const { canBulkApprove, onClickApproveAllButton } = this.props;

    return (
      <section className={`${ROOT}`}>
        <header className={`${ROOT}__header`}>
          <h1 className={`${ROOT}__header-body`}>
            {msg().Appr_Lbl_ApprovalList}
          </h1>
        </header>

        <ToolBar
          useApprovalTypeSwitch
          requiredPermissionForDelegate={['approveAttRequestByDelegate']}
          requiredPermissionForBulkApprove={['canBulkApproveAttRequest']}
          approvalType={this.props.approvalType}
          onSwitchApprovalType={this.props.onSwitchApprovalType}
          totalCount={this.props.totalCount}
          selectedCount={this.props.selectedIds.length}
          isFilterUsing={isFilterUsing}
          filterMatchedCount={this.props.requestList.length}
          activeDialog={this.props.activeDialog}
          onClickApproveAllButton={onClickApproveAllButton}
          listedIds={this.props.listedIds}
          overLimit={this.props.overLimit}
        />

        <div className={`${ROOT}__table`}>
          {/* Exception, must use AccessControlContainer, refer to comment in Grid/index.js */}
          <Grid
            data={this.props.requestList}
            idKey="id"
            columns={this.buildColumnsSetting()}
            selected={this.props.selectedIds}
            browseId={this.props.browseId}
            onClickRow={this.props.onClickRow}
            onChangeRowSelection={this.props.onChangeRowSelection}
            useFilter
            showCheckBox={canBulkApprove}
            emptyMessage={msg().Appr_Msg_EmptyRequestList}
            maxSelection={this.props.maxSelection}
          />
        </div>
      </section>
    );
  }
}
