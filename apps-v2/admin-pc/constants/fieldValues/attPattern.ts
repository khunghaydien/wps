import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

import { DEDUCTION_STATE } from '@admin-pc/presentational-components/LateArrivalEarlyLeaveReason/Deduction';

export default {
  workSystem: [
    {
      label: 'Admin_Lbl_JP_Fix',
      value: WORK_SYSTEM_TYPE.JP_Fix,
    },
    {
      label: 'Admin_Lbl_JP_Flex',
      value: WORK_SYSTEM_TYPE.JP_Flex,
    },
    {
      label: 'Admin_Lbl_JP_Modified',
      value: WORK_SYSTEM_TYPE.JP_Modified,
    },
    {
      label: 'Admin_Lbl_JP_Discretion',
      value: WORK_SYSTEM_TYPE.JP_Discretion,
    },
    {
      label: 'Admin_Lbl_JP_Manager',
      value: WORK_SYSTEM_TYPE.JP_Manager,
    },
  ],
  deductionSettingsOptionsForMinWorkHours: [
    {
      label: 'Admin_Lbl_DeductionTypeDeducted',
      value: DEDUCTION_STATE.DEDUCTED,
    },
    {
      label: 'Admin_Lbl_DeductionTypeCompensateForContractedHours',
      value: DEDUCTION_STATE.COMPENSATE_FOR_CONTRACTED_HOURS,
    },
    {
      label: 'Admin_Lbl_DeductionTypeDeemedByContractedHours',
      value: DEDUCTION_STATE.DEEMED_BY_CONTRACTED_HOURS,
    },
  ],
};
