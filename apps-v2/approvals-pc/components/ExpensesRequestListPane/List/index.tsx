import React from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import IconButton from '../../../../commons/components/buttons/IconButton';
import {
  CompanyCountOption,
  CompanySwitch,
} from '../../../../commons/components/exp/CompanySwitch';
import { DateRangeOption } from '../../../../commons/components/fields/DropdownDateRange';
import Grid from '../../../../commons/components/Grid';
import Currency from '../../../../commons/components/Grid/Formatters/Currency';
import DateYMD from '../../../../commons/components/Grid/Formatters/DateYMD';
import Employee from '../../../../commons/components/Grid/Formatters/Employee';
import Request from '../../../../commons/components/Grid/Formatters/Request';
import PagerInfo, {
  Props as PagerInfoProps,
} from '../../../../commons/components/PagerInfo';
import Pagination, {
  Props as PagerProps,
} from '../../../../commons/components/Pagination';
import refreshIcon from '../../../../commons/images/icons/refresh.svg';
import msg from '../../../../commons/languages';
import HeaderActions from '@commons/components/BulkApproval/HeaderActions';
import Vendor from '@commons/components/Grid/Formatters/Vendor';
import Tooltip from '@commons/components/Tooltip';
import ImgIconAttention from '@commons/images/icons/attention.svg';

import {
  ExpRequestIdsInfo,
  ExpRequestList,
  initialSearchCondition,
  SearchConditions,
} from '../../../../domain/models/exp/request/Report';
import { UserSetting } from '../../../../domain/models/UserSetting';
import { ProxyEmployeeInfo } from '../../../models/ProxyEmployee';

import { getStatusText } from '../../../../domain/modules/exp/report';
import { State as ProxyEmpAccess } from '../../../modules/entities/expenses/proxyEmpAccess';
import {
  MAX_PAGE_NUM,
  MAX_SEARCH_RESULT_NUM,
  PAGE_SIZE,
} from '../../../modules/ui/expenses/list/page';
import { ACTIVE_DIALOG_TYPES } from '@apps/approvals-pc/modules/ui/activeDialog';

import BulkApprovalDialogContainer from '@apps/approvals-pc/containers/BulkApprovalRejectExpRequest';

import SearchArea from '../../ExpensesPreApprovalListPane/List/SearchArea';

import './index.scss';

const ROOT = 'approvals-pc-expenses-request-list-pane-list';

const MAX_SELECTION = 20;

type Props = {
  companyCount: number;
  requestList: ExpRequestList;
  selectedIds: Array<string>;
  browseId: string;
  userSetting: UserSetting;
  expIdsInfo: ExpRequestIdsInfo;
  advSearchCondition: SearchConditions;
  proxyEmployeeInfo: ProxyEmployeeInfo;
  companyCountOption: Array<CompanyCountOption>;
  totalCount: number;
  selectedCompanyId: string;
  currencySymbol: string;
  currencyDecimalPlaces: string;
  proxyEmpAccess: ProxyEmpAccess;
  isRequestCountLoading: boolean;
  browseDetail: () => void;
  fetchAllIdsForExpApproval: (
    searchCondition: SearchConditions,
    empId?: string,
    isEmpty?: boolean
  ) => void;
  onClickRefreshButton: (searchCondition: SearchConditions) => void;
  fetchInitialEmployeeList: () => void;
  onClickInputValueSubmitDate: (
    dateRangeOption: DateRangeOption,
    needUpdate: boolean
  ) => void;
  onClickAdvSearchButton: () => void;
  clearSearchCondition: () => void;
  fetchRequestCountByCompany: () => void;
  onChangeCompany: () => void;
  getProxyEmpAccess: (arg0: string) => void;
  onChangeRowSelection?: (arg0: { id: string; checked: boolean }) => void;
  onClickBulkApproval: () => void;
  onClickBulkReject: () => void;
  activeDialog: string;
} & PagerInfoProps &
  PagerProps;

export default class List extends React.Component<Props> {
  componentDidMount() {
    const {
      proxyEmployeeInfo: { id, isProxyMode, expReportRequestCount },
      userSetting,
    } = this.props;
    const isEmpty = isProxyMode && expReportRequestCount === 0;
    const empId = isProxyMode ? id : userSetting.employeeId;
    this.props.fetchRequestCountByCompany();
    this.props.fetchAllIdsForExpApproval(
      initialSearchCondition,
      empId,
      isEmpty
    );
  }

  componentDidUpdate(prevProps: Props) {
    const {
      proxyEmployeeInfo: { id, isProxyMode, expReportRequestCount },
    } = this.props;
    const isEmpty = isProxyMode && expReportRequestCount === 0;
    const empId = isProxyMode ? id : undefined;
    if (isProxyMode !== prevProps.proxyEmployeeInfo.isProxyMode) {
      this.props.fetchRequestCountByCompany();
      this.props.fetchAllIdsForExpApproval(
        initialSearchCondition,
        empId,
        isEmpty
      );
      if (empId) {
        this.props.getProxyEmpAccess(empId);
      }
    }
  }

  statusFormatter =
    (allowBulkApprovalRejectExp?: boolean) =>
    (props: { value: string; data: { [key: string]: string } }) => {
      const iconClassName = `${ROOT}-item-wrapbox-icon`;
      const errorIconImg = (
        <ImgIconAttention className={`${iconClassName}-appear`} />
      );
      const errorObj = props.data.error;
      const tooltip = get(errorObj, 'errors.0.message', '');
      const isShowErrorIcon = allowBulkApprovalRejectExp && errorObj;
      return (
        <>
          {getStatusText(props.value)}
          {isShowErrorIcon && (
            <div className={iconClassName}>
              <Tooltip
                id={ROOT}
                align="top left"
                content={
                  <div className={`${iconClassName}-tooltip-msg`}>
                    {tooltip}
                  </div>
                }
                className={`${iconClassName}-tooltip`}
              >
                {errorIconImg}
              </Tooltip>
            </div>
          )}
        </>
      );
    };

  renderBulkApprovalDialog() {
    if (Object.keys(ACTIVE_DIALOG_TYPES).includes(this.props.activeDialog)) {
      return <BulkApprovalDialogContainer />;
    }
    return null;
  }

  render() {
    const {
      companyCount,
      userSetting: { allowApproveExpInDiffCompany, allowBulkApprovalRejectExp },
      currencySymbol,
      currencyDecimalPlaces,
      advSearchCondition,
      proxyEmpAccess,
      proxyEmployeeInfo: { isProxyMode },
      selectedCompanyId,
    } = this.props;
    const baseCurrencySymbol = currencySymbol;
    const baseCurrencyDecimal = currencyDecimalPlaces;
    const onIconClick = () => {
      this.props.onClickRefreshButton(advSearchCondition);
    };
    const isShowCompanySwitch = isProxyMode
      ? proxyEmpAccess.allowApproveExpInDiffCompany
      : allowApproveExpInDiffCompany;
    const disableBulkApprovalActions = this.props.selectedIds.length === 0;

    return (
      <>
        {this.renderBulkApprovalDialog()}
        <section className={`${ROOT}`}>
          <header className={`${ROOT}__header`}>
            <h1 className={`${ROOT}__header-body`}>
              {msg().Appr_Lbl_ApprovalList}
            </h1>
            {isShowCompanySwitch && companyCount > 1 && (
              <CompanySwitch
                value={selectedCompanyId}
                isLoading={this.props.isRequestCountLoading}
                totalCount={this.props.totalCount}
                options={this.props.companyCountOption}
                onChange={this.props.onChangeCompany}
              />
            )}
          </header>

          <SearchArea
            isProxyMode={this.props.proxyEmployeeInfo.isProxyMode}
            selectedCompanyId={this.props.selectedCompanyId}
            fetchInitialEmployeeList={this.props.fetchInitialEmployeeList}
            onClickInputValueSubmitDate={this.props.onClickInputValueSubmitDate}
            onClickAdvSearchButton={this.props.onClickAdvSearchButton}
            clearSearchCondition={this.props.clearSearchCondition}
          />

          {this.props.expIdsInfo.totalSize > 0 && (
            <div
              className={classNames(`${ROOT}__header-page`, {
                [`${ROOT}__header-page--bulk-approval`]:
                  allowBulkApprovalRejectExp,
              })}
            >
              <PagerInfo
                className={classNames(`${ROOT}__page-info`, {
                  [`${ROOT}__page-info--bulk-approval`]:
                    allowBulkApprovalRejectExp,
                })}
                currentPage={this.props.currentPage}
                totalNum={this.props.expIdsInfo.totalSize}
                pageSize={PAGE_SIZE}
              />
              <div className={`${ROOT}__refresh-btn`}>
                <IconButton
                  src={refreshIcon}
                  onClick={onIconClick}
                  srcType="svg"
                  alt="refresh"
                />
              </div>
              <Pagination
                className={`${ROOT}__pager`}
                currentPage={this.props.currentPage}
                totalNum={this.props.expIdsInfo.totalSize}
                displayNum={5}
                pageSize={PAGE_SIZE}
                onClickPagerLink={(num) => this.props.onClickPagerLink(num)}
                maxPageNum={MAX_PAGE_NUM}
                havePagerInfo={false}
              />
              <HeaderActions
                allowBulkApproval={allowBulkApprovalRejectExp}
                onClickBulkApproval={this.props.onClickBulkApproval}
                onClickBulkReject={this.props.onClickBulkReject}
                disabled={disableBulkApprovalActions}
                selectedIds={this.props.selectedIds}
              />
            </div>
          )}

          <div className={`${ROOT}__table`}>
            <Grid
              data={this.props.requestList}
              idKey="requestId"
              columns={[
                {
                  name: `${msg().Exp_Lbl_Status}`,
                  key: 'status',
                  width: 60,
                  shrink: false,
                  grow: false,
                  formatter: this.statusFormatter(allowBulkApprovalRejectExp),
                },
                {
                  name: `${msg().Appr_Lbl_EmployeeName} / ${
                    msg().Appr_Lbl_DepartmentName
                  }`,
                  key: ['employeeName', 'departmentName', 'employeeCode'],
                  width: 100,
                  shrink: true,
                  grow: true,
                  formatter: Employee,
                },
                {
                  name: `${msg().Exp_Clbl_ReportTitle}`,
                  key: ['subject'],
                  width: 110,
                  shrink: true,
                  grow: true,
                  formatter: Request,
                },
                {
                  name: `${msg().Exp_Clbl_ReportType}`,
                  key: 'reportType',
                  width: 90,
                  shrink: false,
                  grow: false,
                },
                {
                  name: msg().Appr_Lbl_RequestDate,
                  key: 'requestDate',
                  width: 90,
                  shrink: false,
                  grow: false,
                  formatter: DateYMD,
                },
                {
                  name: msg().Exp_Clbl_Vendor,
                  key: ['reportVendor', 'recordVendor'],
                  width: 140,
                  shrink: true,
                  grow: true,
                  formatter: Vendor,
                },
                {
                  name: `${msg().Exp_Clbl_Amount}`,
                  key: 'totalAmount',
                  extraProps: { baseCurrencySymbol, baseCurrencyDecimal },
                  width: 100,
                  shrink: false,
                  grow: false,
                  formatter: Currency,
                },
              ]}
              selected={this.props.selectedIds}
              browseId={this.props.browseId}
              onClickRow={this.props.browseDetail}
              onChangeRowSelection={this.props.onChangeRowSelection}
              emptyMessage={msg().Appr_Msg_EmptyRequestList}
              showCheckBox={allowBulkApprovalRejectExp}
              maxSelection={MAX_SELECTION}
            />

            {this.props.currentPage === MAX_PAGE_NUM &&
              this.props.expIdsInfo.totalSize > MAX_SEARCH_RESULT_NUM && (
                <div className={`${ROOT}__too-many-results`}>
                  {msg().Com_Lbl_TooManySearchResults}
                </div>
              )}
          </div>
        </section>
      </>
    );
  }
}
