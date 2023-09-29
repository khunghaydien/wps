import React from 'react';

import _ from 'lodash';
import moment from 'moment';

import { AccountingPeriod } from '../../../../../../domain/models/exp/AccountingPeriod';
import {
  CustomRequest,
  RequestType,
  SearchCondition,
  STATUS_LIST,
  STATUS_MAP,
} from '../../../../../../domain/models/exp/CustomRequest';

import TextUtil from '../../../../../utils/TextUtil';

import msg from '../../../../../languages';
import DialogFrame from '../../../../dialogs/DialogFrame';
import { OptionList } from '../../../../fields/CustomDropdown';
import { DateRangeOption } from '../../../../fields/DropdownDateRange';
import Skeleton from '../../../../Skeleton';
import SearchFields, { FILTER_TYPE } from '../../../SearchFields';
import CustomRequestTable, { TableProps } from './Table';

import './index.scss';

const ROOT = 'ts-expenses-modal-custom-request';

export type Props = TableProps & {
  MAX_SEARCH_RESULT: number;
  selectedAccountingPeriod: AccountingPeriod;
  getCustomRequestTypes: () => Promise<RequestType[]>;
  onClickHideDialogButton: () => void;
  searchCustomRequests: (arg0: SearchCondition) => Promise<CustomRequest[]>;
  searchEmployeeOptions: (
    date?: string,
    query?: string,
    loadInBackground?: boolean
  ) => Promise<OptionList>;
};

type State = {
  customRequests: CustomRequest[];
  employeeOptions: OptionList;
  isFetching: boolean;
  requestDateRange: DateRangeOption;
  requestTypeOptions: OptionList;
  selectedEmployees: string[];
  selectedRequestTypes: string[];
  selectedStatus: string[];
  titleInput: string;
};

/**
 * Get initial date range, 1st day of last month - today
 */
const requestDateInitVal = () => {
  const firstDayOfLastMonth = moment(new Date())
    .add(-1, 'months')
    .startOf('months')
    .format('YYYY-MM-DD');
  const today = moment().format('YYYY-MM-DD');
  const resDateRange = {
    startDate: firstDayOfLastMonth,
    endDate: today,
  };
  return resDateRange;
};

const initialStatus = [STATUS_LIST.APPROVED];

/**
 * Remove the element if exist; otherwise add in
 * @param {*} originalArray
 * @param {*} toggleId
 * @returns Updated Array
 */
const toggleSelected = (originalArray, toggleId) => {
  let newArray;
  if (originalArray.includes(toggleId)) {
    newArray = _.without(originalArray, toggleId);
  } else {
    newArray = [...originalArray, toggleId];
  }
  return newArray;
};

export default class CustomRequestDialog extends React.Component<Props, State> {
  state = {
    customRequests: [],
    employeeOptions: [],
    requestTypeOptions: [],
    requestDateRange: requestDateInitVal(),
    selectedStatus: initialStatus,
    titleInput: '',
    selectedEmployees: [],
    selectedRequestTypes: [],
    isFetching: false,
  };

  componentDidMount() {
    const { selectedAccountingPeriod } = this.props;

    let startDate = _.get(selectedAccountingPeriod, 'validDateFrom');
    let endDate = _.get(selectedAccountingPeriod, 'validDateTo');
    // if no accounting period, use initial date range
    if (!startDate || !endDate) {
      endDate = requestDateInitVal().endDate;
      startDate = requestDateInitVal().startDate;
    }
    const requestDateRange = { startDate, endDate };
    const initialSearchCondition = {
      requestDateRange,
      statusList: initialStatus,
    };

    this.setState({ isFetching: true });
    Promise.all([
      this.props.getCustomRequestTypes(),
      this.props.searchEmployeeOptions(startDate, '', true),
      this.props.searchCustomRequests(initialSearchCondition),
    ]).then(([requestTypes, employeeOptions, customRequests]) => {
      const requestTypeOptions = requestTypes.map((type) => ({
        label: type.name,
        value: type.id,
      }));
      this.setState({
        customRequests,
        employeeOptions,
        requestTypeOptions,
        requestDateRange,
        isFetching: false,
      });
    });
  }

  onInputTitle = (titleInput: string) => {
    this.setState({ titleInput });
  };

  onDateChange = (
    requestDateRange: DateRangeOption,
    isStartDateChange: boolean
  ) => {
    this.setState({ requestDateRange });
    if (isStartDateChange) {
      this.props
        .searchEmployeeOptions(requestDateRange.startDate, '', true)
        .then((employeeOptionsRes) => {
          this.setState((prevState) => {
            const { employeeOptions, selectedEmployees } = prevState;
            // keep previous selected options in the list
            const prevSelectedOptions =
              employeeOptions.filter(({ value }) =>
                selectedEmployees.includes(value)
              ) || [];
            const updatedOptions = _.uniqBy(
              prevSelectedOptions.concat(employeeOptionsRes),
              'value'
            );
            return { employeeOptions: updatedOptions };
          });
        });
    }
  };

  onClickSearchBtn = () => {
    const {
      selectedRequestTypes,
      titleInput,
      selectedEmployees,
      selectedStatus,
      requestDateRange,
    } = this.state;
    const advSearchCondition = {
      recordTypeIds: selectedRequestTypes,
      title: titleInput,
      empBaseIds: selectedEmployees,
      statusList: selectedStatus,
      requestDateRange,
    };
    this.setState({ isFetching: true });
    this.props
      .searchCustomRequests(advSearchCondition)
      .then((customRequests) => {
        this.setState({ customRequests, isFetching: false });
      });
  };

  searchEmployeesByKeyword = (query: string) => {
    return this.props.searchEmployeeOptions(
      this.state.requestDateRange.startDate,
      query
    );
  };

  toggleSelectedStatus = (status: string) => {
    this.setState((prevState) => {
      const updated = toggleSelected(prevState.selectedStatus, status);
      return { selectedStatus: updated };
    });
  };

  toggleSelectedRequestType = (toggleId: string) => {
    this.setState((prevState) => {
      const updated = toggleSelected(prevState.selectedRequestTypes, toggleId);
      return { selectedRequestTypes: updated };
    });
  };

  toggleSelectedEmp = (empId: string, selectedEmp: Record<string, any>) => {
    this.setState((prevState) => {
      const updatedIds = toggleSelected(prevState.selectedEmployees, empId);
      const isExistingOption = _.find(prevState.employeeOptions, {
        value: selectedEmp.value,
      });
      let employeeOptions = prevState.employeeOptions;
      if (!isExistingOption) {
        employeeOptions = [selectedEmp].concat(prevState.employeeOptions);
      }
      return { selectedEmployees: updatedIds, employeeOptions };
    });
  };

  statusOptions: OptionList = Object.keys(STATUS_MAP).map((key) => {
    const msgKey = STATUS_MAP[key];
    const label = msg()[msgKey];
    const option = { value: key, label };
    return option;
  });

  render() {
    return (
      <DialogFrame
        title={msg().Exp_Lbl_CustomRequestSearch}
        hide={this.props.onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
      >
        <div className={`${ROOT}__inner`}>
          <SearchFields
            className={`${ROOT}__search-area`}
            isSearchBtnPrimary
            searchBtnType="icon"
            onClickSearch={this.onClickSearchBtn}
            filters={[
              {
                type: FILTER_TYPE.SELECTION,
                appendedClass: 'status',
                label: msg().Exp_Btn_SearchConditionStatus,
                placeHolder: msg().Exp_Btn_SearchConditionStatus,
                selectedStringValues: this.state.selectedStatus,
                data: this.statusOptions,
                onSelectInput: this.toggleSelectedStatus,
              },
              {
                type: FILTER_TYPE.SELECTION,
                appendedClass: 'request-type',
                label: msg().Exp_Lbl_RequestType,
                placeHolder: TextUtil.template(
                  msg().Exp_Lbl_SearchConditionPlaceholder,
                  msg().Exp_Lbl_RequestType
                ),
                selectedStringValues: this.state.selectedRequestTypes,
                data: this.state.requestTypeOptions,
                onSelectInput: this.toggleSelectedRequestType,
              },
              {
                type: FILTER_TYPE.TEXT_INPUT,
                appendedClass: 'title',
                label: msg().Exp_Lbl_Title,
                inputValue: this.state.titleInput,
                onInput: this.onInputTitle,
              },
              {
                type: FILTER_TYPE.SELECTION,
                appendedClass: 'employee',
                label: msg().Exp_Btn_SearchConditionEmployee,
                placeHolder: msg().Exp_Lbl_SearchConditionPlaceholderEmployee,
                selectedStringValues: this.state.selectedEmployees,
                data: this.state.employeeOptions,
                onSelectInput: this.toggleSelectedEmp,
                optionLimit: 100,
                onSearchByFetching: this.searchEmployeesByKeyword,
              },
              {
                type: FILTER_TYPE.DATE_DROPDOWN,
                appendedClass: 'date',
                label: msg().Exp_Lbl_RequestedDate,
                selectedDateRangeValues: this.state.requestDateRange,
                onClickUpdateDate: this.onDateChange,
              },
            ]}
          />

          {this.state.isFetching ? (
            <Skeleton
              noOfRow={6}
              colWidth="100%"
              className={`${ROOT}__skeleton`}
              rowHeight="25px"
              margin="30px"
            />
          ) : (
            <CustomRequestTable
              customRequests={this.state.customRequests}
              statusOptions={this.statusOptions}
              onClickCustomRequest={this.props.onClickCustomRequest}
            />
          )}

          {this.state.customRequests.length > this.props.MAX_SEARCH_RESULT && (
            <div className={`${ROOT}__too-many-results`}>
              {msg().Com_Lbl_TooManySearchResults}
            </div>
          )}
        </div>
      </DialogFrame>
    );
  }
}
