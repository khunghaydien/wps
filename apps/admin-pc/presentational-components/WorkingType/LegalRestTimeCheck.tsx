import * as React from 'react';

import AttTimeField from '../../../commons/components/fields/AttTimeField';
import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import PlaceInTemplate from '../../components/PlaceInTemplate';

import CheckboxField from './Fields/CheckboxField';

import './LegalRestTimeCheck.scss';

const ROOT = 'admin-pc-working-type-legal-rest-time-check';

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

export default class LegalRestTimeCheck extends React.Component<Props> {
  renderCheckbox: () => React.ReactNode;

  renderWorkTime(): React.ReactNode {
    const { childrenKeys, disabled, tmpEditRecord, onChangeDetailItem } =
      this.props;
    const key = childrenKeys.workTime;

    return (
      <AttTimeField
        key={key}
        disabled={disabled}
        onBlur={(value: string | null) => {
          onChangeDetailItem(key, String(TimeUtil.toMinutes(value)));
        }}
        value={TimeUtil.toHHmm(parseIntOrStringNull(tmpEditRecord[key]))}
        required
      />
    );
  }

  renderRestTime(): React.ReactNode {
    const { childrenKeys, disabled, tmpEditRecord, onChangeDetailItem } =
      this.props;
    const key = childrenKeys.restTime;

    return (
      <TextField
        key={key}
        className={`${ROOT}__rest-time`}
        type="number"
        min={1}
        max={2880}
        step={1}
        value={parseIntOrStringNull(tmpEditRecord[key])}
        disabled={disabled}
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
          onChangeDetailItem(
            childrenKeys.restTime,
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

    return (
      <div className={`${ROOT}__body`}>
        <CheckboxField
          value={tmpEditRecord[key] || false}
          label={msg().Admin_Lbl_Use}
          disabled={disabled}
          onChange={(res: boolean) => onChangeDetailItem(key, res)}
          render={({ value: checkboxValue }: { readonly value: boolean }) =>
            checkboxValue && (
              <div className={`${ROOT}__item-value`}>
                <PlaceInTemplate
                  template={msg().Admin_Lbl_IfWorkingForXThenLegalRestTimeIsX}
                >
                  {this.renderWorkTime() as React.ReactNode}
                  {this.renderRestTime() as React.ReactNode}
                </PlaceInTemplate>
              </div>
            )
          }
        />
      </div>
    );
  }
}
