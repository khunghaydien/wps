import React from 'react';

import { DateRangeOption } from '../../../../../commons/components/fields/DropdownDateRange';
import msg from '../../../../../commons/languages';
import ReportListSearchContainer from '@apps/commons/containers/exp/ReportListAdvSearchContainer';
import { KEYS } from '@commons/modules/exp/ui/reportList/advSearch/detail';

import './index.scss';

const ROOT = 'approvals-pc-expenses__search-area';

type Props = {
  isProxyMode: boolean;
  selectedCompanyId: string;
  onClickAdvSearchButton: () => void;
  onClickInputValueSubmitDate: (
    dateRangeOption: DateRangeOption,
    needUpdate: boolean
  ) => void;
  clearSearchCondition: () => void;
  fetchInitialEmployeeList: () => void;
};

class SearchArea extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchInitialEmployeeList();
    this.props.clearSearchCondition();
  }

  componentDidUpdate(prevProps: Props) {
    const { selectedCompanyId } = this.props;
    if (
      prevProps.selectedCompanyId &&
      selectedCompanyId !== prevProps.selectedCompanyId
    ) {
      this.props.fetchInitialEmployeeList();
      this.props.clearSearchCondition();
    }
  }

  render() {
    const baseConditions = [
      KEYS.statusList,
      KEYS.employee,
      KEYS.department,
      KEYS.requestDateRange,
    ];

    if (this.props.isProxyMode) {
      baseConditions.shift();
    }

    return (
      <div className={ROOT}>
        {this.props.isProxyMode && (
          <div className={`${ROOT}-proxy-status`}>
            <span className={`${ROOT}-proxy-status-label`}>
              {msg().Com_Lbl_Status}:
            </span>
            <span className={`${ROOT}-proxy-status-value`}>
              {msg().Com_Status_Pending}
            </span>
          </div>
        )}

        <ReportListSearchContainer
          selectedCompanyId={this.props.selectedCompanyId}
          isApproval
          onClickInputValueSubmitDate={this.props.onClickInputValueSubmitDate}
          onClickAdvSearchButton={this.props.onClickAdvSearchButton}
          baseConditions={baseConditions}
        />
      </div>
    );
  }
}

export default SearchArea;
