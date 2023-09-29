import React from 'react';

import DateUtil from '../../utils/DateUtil';

// import msg from '../../../commons/languages';
// import Button from '../buttons/Button';
import DateRangeField from './DateRangeField';

import './DropdownDateRange.scss';

const ROOT = 'commons-fields-dropdown-date';

export type DateRangeOption = {
  startDate?: string;
  endDate?: string;
};

type Props = {
  updateParentState: (newState: any) => void;
  onClickUpdateDate: (
    dateRangeOption: DateRangeOption,
    needUpdate: boolean
  ) => void;
  // hasDisplayValue?: boolean,
  dateRange: DateRangeOption;
  needStartDate?: boolean;

  // TODO remove if unnecessary
  values?: any;
};

type State = {
  startDate?: string;
  endDate?: string;
  error: string;
};

class DropdownDateRange extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { startDate, endDate } = this.props.dateRange;

    this.state = {
      startDate,
      endDate,
      error: '',
    };
  }

  updateStartDate = (value: string | null) => {
    if (this.props.needStartDate && value === '') {
      const updateDate: DateRangeOption = {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      };
      this.props.onClickUpdateDate(updateDate, false);
    } else {
      this.setState({
        startDate: value,
      });
      const updateDate: DateRangeOption = {
        startDate: value,
        endDate: this.state.endDate,
      };
      if (this.props.onClickUpdateDate) {
        this.props.onClickUpdateDate(updateDate, true);
      }
    }
  };

  updateEndDate = (value: string | null) => {
    this.setState({
      endDate: value,
    });
    const updateDate: DateRangeOption = {
      startDate: this.state.startDate,
      endDate: value,
    };
    if (this.props.onClickUpdateDate) {
      this.props.onClickUpdateDate(updateDate, false);
    }
  };

  clearError = () => {
    this.setState({
      error: '',
    });
  };

  formatDate = (value?: string) => DateUtil.formatYMD(value);

  // updateResult = () => {
  //   const { startDate, endDate } = this.state;

  //   if (startDate || endDate) {
  //     let displayValue;
  //     const formattedStartDate = this.formatDate(startDate);
  //     const formattedEndDate = this.formatDate(endDate);

  //     if (this.props.hasDisplayValue) {
  //       if (startDate && endDate) {
  //         displayValue = `${formattedStartDate} - ${formattedEndDate}`;
  //       } else if (startDate) {
  //         displayValue = formattedStartDate;
  //       } else if (endDate) {
  //         displayValue = formattedEndDate;
  //       }
  //     } else {
  //       displayValue = '';
  //     }
  //     this.clearError();

  //     this.props.updateParentState({
  //       values: [startDate, endDate],
  //       displayValue,
  //     });

  //     const updateDate: DateRangeOption = {
  //       startDate,
  //       endDate,
  //     };
  //     if (this.props.onClickUpdateDate) {
  //       this.props.onClickUpdateDate(updateDate);
  //     }

  //     this.closeDropdown();
  //   } else {
  //     this.setState({
  //       error: msg().Com_Err_InvalidDate,
  //     });
  //   }
  // };

  closeDropdown = () => {
    this.props.updateParentState({
      isOpen: false,
    });
  };

  render() {
    const { error } = this.state;
    const { startDate, endDate } = this.props.dateRange;

    return (
      <div className={`${ROOT}`}>
        <DateRangeField
          className="hasError"
          startDateFieldProps={{
            value: startDate,
            onChange: this.updateStartDate,
          }}
          endDateFieldProps={{
            value: endDate,
            onChange: this.updateEndDate,
          }}
        />

        {error && <p className={`${ROOT}__error`}>{error}</p>}

        {/* <div className={`${ROOT}__date-buttons`}>
         <Button onClick={this.updateResult}>{msg().Com_Btn_Update}</Button>
         <Button onClick={this.closeDropdown} type="outline-default">
           {msg().Com_Btn_Close}
         </Button>
        </div> */}
      </div>
    );
  }
}

export default DropdownDateRange;
