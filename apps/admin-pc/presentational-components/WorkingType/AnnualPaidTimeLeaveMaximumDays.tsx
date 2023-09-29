import * as React from 'react';

import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';

import PlaceInTemplate from '../../components/PlaceInTemplate';

import CheckboxField from './Fields/CheckboxField';

import './AnnualPaidTimeLeaveMaximumDays.scss';

const ROOT = 'admin-pc-working-type-annual-paid-time-leave-maximum-days';

type Props = {
  config: {
    key: string;
  };
  childrenKeys: {
    [key: string]: string;
  };
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

export default class AnnualPaidTimeLeaveMaximumDays extends React.Component<Props> {
  renderMaximumDaysField(): React.ReactNode {
    const { childrenKeys, disabled, tmpEditRecord, onChangeDetailItem } =
      this.props;
    const key = childrenKeys.maximumDays;

    return (
      <TextField
        key={key}
        className={`${ROOT}__maximum-days`}
        type="number"
        min={1}
        max={5}
        step={1}
        value={parseIntOrStringNull(tmpEditRecord[key])}
        disabled={disabled}
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
          onChangeDetailItem(
            childrenKeys.maximumDays,
            String(parseIntOrStringNull(e.currentTarget.value))
          )
        }
        isRequired
      />
    );
  }

  render() {
    const { config, disabled, tmpEditRecord, onChangeDetailItem } = this.props;
    const { key } = config;
    const value = !!tmpEditRecord[key];

    return (
      <div className={`${ROOT}__body`}>
        <CheckboxField
          value={value}
          label={msg().Admin_Lbl_Use}
          disabled={disabled}
          onChange={(res: boolean) => onChangeDetailItem(key, res)}
          render={(checkboxProps) =>
            checkboxProps.value && (
              <div className={`${ROOT}__item-value`}>
                {/* @ts-ignore */}
                <PlaceInTemplate
                  template={msg().Admin_Lbl_AnnualPaidTimeLeaveMaximumDays}
                >
                  {this.renderMaximumDaysField()}
                </PlaceInTemplate>
              </div>
            )
          }
        />
      </div>
    );
  }
}
