import * as React from 'react';

import AttTimeRangeField from '../../../commons/components/fields/AttTimeRangeField';
import msg from '../../../commons/languages';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import CheckboxField from './Fields/CheckboxField';

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
export default class AvailableTimeLeaveRangeForHourlyLeave extends React.Component<Props> {
  renderCheckbox: () => React.ReactNode;
  renderRangeTime(): React.ReactNode {
    const { childrenKeys, disabled, tmpEditRecord, onChangeDetailItem } =
      this.props;
    const startOfTimeLeave = childrenKeys.startOfTimeLeave;
    const endOfTimeLeave = childrenKeys.endOfTimeLeave;
    return (
      <AttTimeRangeField
        key={startOfTimeLeave}
        onBlurAtStart={(value) => {
          onChangeDetailItem(startOfTimeLeave, TimeUtil.parseMinutes(value));
        }}
        onBlurAtEnd={(value) => {
          onChangeDetailItem(endOfTimeLeave, TimeUtil.parseMinutes(value));
        }}
        startTime={TimeUtil.toHHmm(
          parseIntOrStringNull(tmpEditRecord[startOfTimeLeave])
        )}
        endTime={TimeUtil.toHHmm(
          parseIntOrStringNull(tmpEditRecord[endOfTimeLeave])
        )}
        disabled={disabled}
      />
    );
  }

  render() {
    const { config, disabled, tmpEditRecord, onChangeDetailItem } = this.props;
    const { key } = config;
    return (
      <div>
        <CheckboxField
          value={tmpEditRecord[key] || false}
          label={msg().Admin_Lbl_Restrict}
          disabled={disabled}
          onChange={(res: boolean) => onChangeDetailItem(key, res)}
          render={({ value: checkboxValue }: { readonly value: boolean }) =>
            checkboxValue && <div>{this.renderRangeTime()}</div>
          }
        />
      </div>
    );
  }
}
