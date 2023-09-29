import * as React from 'react';

import msg from '../../../../commons/languages';
import TimeSelect from '../commons/Fields/TimeSelect';

export type Props = Readonly<{
  className?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  icon?: boolean;
  testId?: string;
  onChange?: (arg0: string) => void;
}>;

export default (props: Props) => {
  return (
    <TimeSelect
      {...props}
      formatHour={(v: number) => `${String(v)}${msg().Com_Lbl_UnitTimeHours}`}
      formatMinute={(v: number) => `${String(v)}${msg().Com_Lbl_UnitMins}`}
      useTitle
    />
  );
};
