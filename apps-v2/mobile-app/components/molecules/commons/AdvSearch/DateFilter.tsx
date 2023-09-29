import React, { FunctionComponent, useState } from 'react';

import DateUtil from '../../../../../commons/utils/DateUtil';
import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';
import CheckIcon from '@apps/commons/images/icons/CheckIcon.svg';

import { RequestDateEnum } from '@apps/mobile-app/modules/approval/ui/expense/advSearch/requestDateRange';

import LinkListItem from '@apps/mobile-app/components/atoms/LinkListItem';

import SFDateField from '../Fields/SFDateField';
import SelectionFilter from './SelectionFilter';

import './DateFilter.scss';

const ROOT = 'mobile-app-components-molecules-commons-advsearch-date-filter';

type Props = {
  options: Array<Option>;
  selected: string;
  onClickOption: (selectedOption: string) => void;
};

const DateFilter: FunctionComponent<Props> = (props) => {
  const { options, selected, onClickOption } = props;
  const [isShowDateField, setIsShowDateField] = useState(false);

  const optionList = options.filter(
    ({ value }) => value !== RequestDateEnum.MANUAL
  );
  const manualOption = options.find(
    ({ value }) => value === RequestDateEnum.MANUAL
  );
  const isManualOptionSelected = !Object.values(RequestDateEnum).includes(
    selected as RequestDateEnum
  );

  const onChangeOption = (selectedOption: string) => {
    onClickOption(selectedOption);
    setIsShowDateField(false);
  };

  const onClickManualOption = () => {
    setIsShowDateField(true);
  };

  const onSelectDate = (_e: React.SyntheticEvent<HTMLElement>, { date }) => {
    const selectedDate = DateUtil.fromDate(date);
    onChangeOption(selectedDate);
  };

  return (
    <>
      <SelectionFilter
        options={optionList}
        selectedList={[selected]}
        onClickOption={onChangeOption}
        isSingleSelect
      />
      <LinkListItem
        key={manualOption.label}
        className={`${ROOT}__option-item`}
        noIcon={true}
        onClick={onClickManualOption}
      >
        {manualOption.label}
        {isManualOptionSelected && (
          <span className={`${ROOT}__select-date`}>
            <span>{DateUtil.formatYMD(selected)}</span>
            <CheckIcon
              className={`${ROOT}__select-date-check-icon`}
              aria-hidden="true"
            />
          </span>
        )}
      </LinkListItem>
      {isShowDateField && (
        <SFDateField
          onChange={onSelectDate}
          value={DateUtil.isValid(selected) ? selected : null}
        />
      )}
    </>
  );
};

export default DateFilter;
