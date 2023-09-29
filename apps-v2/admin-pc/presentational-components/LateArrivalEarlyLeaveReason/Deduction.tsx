import * as React from 'react';

import SelectField from '../../../commons/components/fields/SelectField';
import msg from '../../../commons/languages';

import { Config } from '@apps/admin-pc/utils/ConfigUtil';

export const DEDUCTION_STATE = {
  UNSPECIFIED: null,
  DEDUCTED: 'Deducted',
  COMPENSATE_FOR_CONTRACTED_HOURS: 'CompensateForContractedHours',
  DEEMED_BY_CONTRACTED_HOURS: 'DeemedByContractedHours',
} as const;

type Props = {
  config: Config;
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

const Deduction: React.FC<Props> = (props) => {
  const { config, disabled, tmpEditRecord, onChangeDetailItem } = props;

  return (
    <SelectField
      value={tmpEditRecord.deduction ?? null}
      options={[
        {
          text: msg().Com_Lbl_Unspecified,
          value: DEDUCTION_STATE.UNSPECIFIED,
        },
        {
          text: msg().Admin_Lbl_DeductionTypeDeducted,
          value: DEDUCTION_STATE.DEDUCTED,
        },
        {
          text: msg().Admin_Lbl_DeductionTypeCompensateForContractedHours,
          value: DEDUCTION_STATE.COMPENSATE_FOR_CONTRACTED_HOURS,
        },
        {
          text: msg().Admin_Lbl_DeductionTypeDeemedByContractedHours,
          value: DEDUCTION_STATE.DEEMED_BY_CONTRACTED_HOURS,
        },
      ]}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        onChangeDetailItem(config.key, e.currentTarget.value);
      }}
      disabled={disabled}
    />
  );
};

export default Deduction;
