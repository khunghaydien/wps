import React, { FunctionComponent } from 'react';

import DateUtil from '../../../../../commons/utils/DateUtil';
import { DateRangeOption } from '@apps/commons/components/fields/DropdownDateRange';

import DateRangeField from '../Fields/DateRangeField';

import './DateRangeFilter.scss';

const ROOT =
  'mobile-app-components-molecules-commons-advsearch-date-range-filter';

type Props = {
  selected: DateRangeOption;
  onClickOption: (selectedOption: DateRangeOption) => void;
};

const DateRangeFilter: FunctionComponent<Props> = (props) => {
  const { selected, onClickOption } = props;

  const onSelectDate =
    (dateType: string) =>
    (_e: React.SyntheticEvent<HTMLElement>, { date }) => {
      onClickOption({
        ...selected,
        [dateType]: DateUtil.fromDate(date),
      });
    };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__field`}>
        <DateRangeField
          start={{
            value: selected.startDate,
            onChange: onSelectDate('startDate'),
          }}
          end={{ value: selected.endDate, onChange: onSelectDate('endDate') }}
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
