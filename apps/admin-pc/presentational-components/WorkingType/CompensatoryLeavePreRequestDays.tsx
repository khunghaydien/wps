import * as React from 'react';

import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';

import { Config } from '../../utils/ConfigUtil';
import { Record } from '../../utils/RecordUtil';

import PlaceInTemplate from '../../components/PlaceInTemplate';

import CheckboxField from './Fields/CheckboxField';

import './CompensatoryLeavePreRequestDays.scss';

const ROOT = 'admin-pc-working-type-compensatory-leave-pre-request-days';

type Props = Readonly<{
  checkboxKey: string;
  min: number;
  max: number;
  config: Config;
  disabled: boolean;
  tmpEditRecord: Record;
  onChangeDetailItem: (
    arg0: string,
    arg1: string | boolean,
    arg2: 'numeric' | void
  ) => void;
}>;

const CompensatoryLeavePreRequestDays = (props: Props) => {
  const {
    checkboxKey,
    min,
    max,
    config,
    disabled,
    tmpEditRecord,
    onChangeDetailItem,
  } = props;
  const key: string = config.key;
  const isRequired = !!config.isRequired;
  const checkboxValue = !!tmpEditRecord[checkboxKey] as boolean;
  const value = tmpEditRecord[key] as number;

  return (
    <CheckboxField
      value={checkboxValue}
      label={msg().Admin_Lbl_Use}
      disabled={disabled}
      onChange={(res: boolean) => onChangeDetailItem(checkboxKey, res)}
      render={() =>
        checkboxValue && (
          // @ts-ignore
          <PlaceInTemplate
            template={msg().Admin_Msg_CompensatoryLeavePreRequestDay}
          >
            <TextField
              className={`${ROOT}__item-value`}
              key={key}
              type="number"
              min={min}
              max={max}
              step={1}
              value={value}
              disabled={disabled}
              isRequired={isRequired}
              onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
                onChangeDetailItem(key, event.currentTarget.value, 'numeric')
              }
            />
          </PlaceInTemplate>
        )
      }
    />
  );
};

export default CompensatoryLeavePreRequestDays;
