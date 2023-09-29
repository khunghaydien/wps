import React from 'react';

import { IAccessControlContainer } from '@apps/commons/components/IAccessControlContainer';
import DateUtil from '@apps/commons/utils/DateUtil';
import Grid from '@commons/components/Grid';
import DateFilter from '@commons/components/Grid/filters/DateFilter';
import DoubleTextFilter from '@commons/components/Grid/filters/DoubleTextFilter';
import DateYMD from '@commons/components/Grid/Formatters/DateYMD';
import Icon from '@commons/components/Grid/Formatters/Icon';
import iconStatusMetaReapplying from '@commons/images/iconStatusMetaReapplying.png';
import msg from '@commons/languages';

import ApprovalType, {
  ApprovalTypeValue,
} from '@apps/domain/models/approval/ApprovalType';
import {
  LegalAgreementRequestSummary,
  STATUS,
} from '@attendance/domain/models/approval/LegalAgreementRequest';
import { Code } from '@attendance/domain/models/LegalAgreementRequestType';

import { State as FilterTermsType } from '../../../../modules/ui/attLegalAgreement/list/filterTerms';

import Employee from '../../particles/Grid/Formatters/Employee';
import PhotoUrl from '../../particles/Grid/Formatters/PhotoUrl';
import MaxSelectField from '../../particles/MaxSelectField';
import NoAccessTmpToolBar from './NoAccessTmpToolBar';
import RequestTypeAndPeriodFilter from './RequestTypeAndPeriodFilter';
import TypeAndDuration from './TypeAndDateYM';
import requestType from '@attendance/ui/helpers/legalAgreementRequest/requestType';

import './index.scss';

const ROOT = 'approvals-pc-att-legal-agreement-process-list-pane-list';

const requestTypeOptions = (codes: Code[]) =>
  (codes || []).map((code) => ({
    text: requestType(code),
    value: code,
  }));

const targetMonthOptions = (targetMonths: string[]) =>
  (targetMonths || []).map((m) => ({
    text: DateUtil.formatYM(m),
    value: m,
  }));

type Props = {
  totalCount: number;
  requestList: LegalAgreementRequestSummary[];
  filterTerms: FilterTermsType;
  existingMonths: string[];
  existingRequestTypes: Code[];
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
  onClickApproveAllButton: () => void;
  ApprovalDialogContainer: React.FC<{ allIds: Array<string> }>;
  AccessControlContainer: IAccessControlContainer;
  canBulkApprove: boolean;
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
      key: ['photoUrl', 'employeeName', 'departmentName'],
      shrink: true,
      grow: true,
      width: 77, // NOTE: ブラウザ幅1024px時の表示から算定した基準値
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
      width: 77, // NOTE: ブラウザ幅1024px時の表示から算定した基準値
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

    const requestType = {
      name: `${msg().Appr_Lbl_Period} / ${msg().Appr_Lbl_RequestType}`,
      key: ['targetMonth', 'requestType'],
      width: 200,
      shrink: true,
      grow: false,
      addon: (props: { data: LegalAgreementRequestSummary }) => {
        switch (props.data.originalRequestStatus) {
          case STATUS.REAPPLYING:
            return <Icon src={iconStatusMetaReapplying} align="bottom" />;
          default:
            return null;
        }
      },
      formatter: TypeAndDuration,
      renderFilter: () => (
        <RequestTypeAndPeriodFilter
          targetMonthValue={filterTerms.targetMonth}
          targetMonthOptions={targetMonthOptions(this.props.existingMonths)}
          requestTypeValue={filterTerms.type}
          requestTypeOptions={requestTypeOptions(
            this.props.existingRequestTypes
          )}
          onChangeTargetMonthValue={bindOnUpdateFilterTermByKey('targetMonth')}
          onChangeRequestTypeValue={bindOnUpdateFilterTermByKey('type')}
        />
      ),
    };

    const requestDate = {
      name: `${msg().Appr_Lbl_RequestDate}`,
      key: 'requestDate',
      width: 100,
      shrink: true,
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
      ? [photoUrl, employee, requestType, requestDate]
      : [photoUrl, employee, approver, requestType, requestDate];
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

        <NoAccessTmpToolBar
          useApprovalTypeSwitch
          requiredPermissionForDelegate={[
            'approveAttLegalAgreementRequestByDelegate',
          ]}
          requiredPermissionForBulkApprove={[
            'bulkApprovalAttLegalAgreementRequest',
          ]}
          approvalType={this.props.approvalType}
          onSwitchApprovalType={this.props.onSwitchApprovalType}
          totalCount={this.props.totalCount}
          selectedCount={this.props.selectedIds.length}
          isFilterUsing={isFilterUsing}
          filterMatchedCount={this.props.requestList.length}
          activeDialog={this.props.activeDialog}
          onClickApproveAllButton={onClickApproveAllButton}
          listedIds={this.props.listedIds}
          ApprovalDialogContainer={this.props.ApprovalDialogContainer}
          AccessControlContainer={this.props.AccessControlContainer}
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
