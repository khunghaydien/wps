import * as React from 'react';

import msg from '../../../../commons/languages';
import { parseIntOrNull } from '../../../../commons/utils/NumberUtil';
import TimeUtil from '../../../../commons/utils/TimeUtil';
import TimeSelect from '../commons/Fields/TimeSelect';

export type Props = Readonly<{
  className?: string;
  value?: number | null;
  defaultValue?: number | null;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  icon?: boolean;
  testId?: string;
  onChange?: (arg0: number | null) => void;
}>;

export default (props: Props) => {
  const { value, defaultValue, onChange, ...timeSelectProps } = props;

  return (
    <TimeSelect
      {...timeSelectProps}
      value={TimeUtil.toHHmm(value)}
      defaultValue={TimeUtil.toHHmm(defaultValue)}
      onChange={(v: string) =>
        onChange && onChange(parseIntOrNull(TimeUtil.toMinutes(v)))
      }
      maxValue="47:59"
      formatHour={(v: number) =>
        `${String(v).padStart(2, '0')}${msg().Com_Lbl_UnitHours}`
      }
      formatMinute={(v: number) =>
        `${String(v).padStart(2, '0')}${msg().Com_Lbl_UnitMins}`
      }
      useTitle
    />
  );
};
