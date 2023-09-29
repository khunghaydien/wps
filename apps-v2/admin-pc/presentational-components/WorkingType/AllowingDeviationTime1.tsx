import * as React from 'react';

import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';

import PlaceInTemplate from '../../components/PlaceInTemplate';

import CheckboxField from './Fields/CheckboxField';

import './AllowingDeviationTime.scss';

const ROOT = 'admin-pc-working-type-annual-paid-time-allowing-deviation-time';

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

export default class AllowingDeviationTime1 extends React.Component<Props> {
  renderAllowingDeviationTimeField(): React.ReactNode {
    const { childrenKeys, disabled, tmpEditRecord, onChangeDetailItem } =
      this.props;
    const key = childrenKeys.allowingDeviationTime;

    return (
      <TextField
        key={key}
        className={`${ROOT}__allowing-deviation-time`}
        type="number"
        min={0}
        max={2879}
        step={1}
        value={parseIntOrStringNull(tmpEditRecord[key])}
        disabled={disabled}
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
          onChangeDetailItem(
            childrenKeys.allowingDeviationTime,
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
          label={msg().Admin_Lbl_UseAllowingDeviationTime}
          disabled={disabled}
          onChange={(res: boolean) => onChangeDetailItem(key, res)}
          render={({ value: checkboxValue }: { readonly value: boolean }) =>
            checkboxValue && (
              <div className={`${ROOT}__item-value`}>
                {/* @ts-ignore */}
                <PlaceInTemplate
                  template={msg().Admin_Lbl_AllowingDeviationTime}
                >
                  {this.renderAllowingDeviationTimeField() as React.ReactNode}
                </PlaceInTemplate>
              </div>
            )
          }
        />
      </div>
    );
  }
}
