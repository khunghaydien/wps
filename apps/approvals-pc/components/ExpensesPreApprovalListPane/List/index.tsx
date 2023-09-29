import React from 'react';

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

import SearchArea from './SearchArea';

import './index.scss';

const ROOT = 'approvals-pc-expenses-pre-approval-list-pane-list';

type Props = {
  companyCount: number;
  requestList: ExpRequestList;
  selectedIds: Array<string>;
  browseId: string;
  userSetting: UserSetting;
  expIdsInfo: ExpRequestIdsInfo;
  proxyEmployeeInfo: ProxyEmployeeInfo;
  companyCountOption: Array<CompanyCountOption>;
  totalCount: number;
  selectedCompanyId: string;
  currencySymbol: string;
  currencyDecimalPlaces: string;
  proxyEmpAccess: ProxyEmpAccess;
  isRequestCountLoading: boolean;
  browseDetail: () => void;
  fetchAllIdsForPreApproval: (
    searchCondition: SearchConditions,
    empId?: string,
    isEmpty?: boolean
  ) => void;
  onClickRefreshButton: () => void;
  onClickInputValueSubmitDate: (
    dateRangeOption: DateRangeOption,
    needUpdate: boolean
  ) => void;
  onClickAdvSearchButton: () => void;
  clearSearchCondition: () => void;
  fetchInitialEmployeeList: () => void;
  fetchRequestCountByCompany: () => void;
  onChangeCompany: () => void;
  getProxyEmpAccess: (arg0: string) => void;
} & PagerInfoProps &
  PagerProps;

export default class List extends React.Component<Props> {
  componentDidMount() {
    const {
      proxyEmployeeInfo: { id, isProxyMode, expPreApprovalRequestCount },
      userSetting,
    } = this.props;
    const isEmpty = isProxyMode && expPreApprovalRequestCount === 0;
    const empId = isProxyMode ? id : userSetting.employeeId;
    this.props.fetchRequestCountByCompany();
    this.props.fetchAllIdsForPreApproval(
      initialSearchCondition,
      empId,
      isEmpty
    );
  }

  componentDidUpdate(prevProps: Props) {
    const {
      proxyEmployeeInfo: { id, isProxyMode, expPreApprovalRequestCount },
    } = this.props;
    const isEmpty = isProxyMode && expPreApprovalRequestCount === 0;
    const empId = isProxyMode ? id : undefined;

    if (isProxyMode !== prevProps.proxyEmployeeInfo.isProxyMode) {
      this.props.fetchAllIdsForPreApproval(
        initialSearchCondition,
        empId,
        isEmpty
      );
      this.props.fetchRequestCountByCompany();
      if (empId) {
        this.props.getProxyEmpAccess(empId);
      }
    }
  }

  statusFormatter(props: { value: string }) {
    return getStatusText(props.value);
  }

  render() {
    const {
      companyCount,
      userSetting: { allowApproveExpInDiffCompany },
      currencySymbol,
      currencyDecimalPlaces,
      proxyEmpAccess,
      proxyEmployeeInfo: { isProxyMode },
      selectedCompanyId,
    } = this.props;
    const baseCurrencySymbol = currencySymbol;
    const baseCurrencyDecimal = currencyDecimalPlaces;
    const isShowCompanySwitch = isProxyMode
      ? proxyEmpAccess.allowApproveExpInDiffCompany
      : allowApproveExpInDiffCompany;

    return (
      <section className={`${ROOT}`}>
        <header className={`${ROOT}__header`}>
          <h1 className={`${ROOT}__header-body`}>
            {msg().Appr_Lbl_ApprovalList}
          </h1>
          {isShowCompanySwitch && companyCount > 1 && (
            <CompanySwitch
              isLoading={this.props.isRequestCountLoading}
              value={selectedCompanyId}
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
          <div className={`${ROOT}__header-page`}>
            <PagerInfo
              className={`${ROOT}__page-info`}
              currentPage={this.props.currentPage}
              totalNum={this.props.expIdsInfo.totalSize}
              pageSize={PAGE_SIZE}
            />
            <div className={`${ROOT}__refresh-btn`}>
              <IconButton
                src={refreshIcon}
                onClick={this.props.onClickRefreshButton}
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
                width: 90,
                shrink: false,
                grow: false,
                formatter: this.statusFormatter,
              },
              {
                name: `${msg().Appr_Lbl_EmployeeName} / ${
                  msg().Appr_Lbl_DepartmentName
                }`,
                key: ['employeeName', 'departmentName'],
                shrink: true,
                grow: true,
                formatter: Employee,
              },
              {
                name: `${msg().Exp_Clbl_RequestTitle}`,
                key: ['subject'],
                width: 180,
                shrink: false,
                grow: false,
                formatter: Request,
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
                name: `${msg().Exp_Clbl_EstimatedAmount}`,
                key: 'totalAmount',
                extraProps: { baseCurrencySymbol, baseCurrencyDecimal },
                width: 110,
                shrink: false,
                grow: false,
                formatter: Currency,
              },
            ]}
            selected={this.props.selectedIds}
            browseId={this.props.browseId}
            onClickRow={this.props.browseDetail}
            onChangeRowSelection={() => {}}
            emptyMessage={msg().Appr_Msg_EmptyRequestList}
          />

          {this.props.currentPage === MAX_PAGE_NUM &&
            this.props.expIdsInfo.totalSize > MAX_SEARCH_RESULT_NUM && (
              <div className={`${ROOT}__too-many-results`}>
                {msg().Com_Lbl_TooManySearchResults}
              </div>
            )}
        </div>
      </section>
    );
  }
}
