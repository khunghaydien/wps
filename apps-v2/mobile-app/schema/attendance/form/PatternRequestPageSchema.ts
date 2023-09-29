import * as yup from 'yup'; // for everything

import msg from '../../../../commons/languages';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import { WORK_SYSTEM_TYPE } from '@attendance/domain/models/WorkingType';

const timeValidator = () =>
  yup.mixed().when(['requestDayType', 'workSystem', 'withoutCoreTime'], {
    is: (requestDayType, workSystem, withoutCoreTime) => {
      if (requestDayType === DAY_TYPE.Holiday) {
        return true;
      } else {
        switch (workSystem) {
          case WORK_SYSTEM_TYPE.JP_Flex:
            return withoutCoreTime;
          case WORK_SYSTEM_TYPE.JP_Discretion:
            return true;
          default:
            return false;
        }
      }
    },
    then: yup.number().nullable(),
    otherwise: yup.number().nullable().required(msg().Common_Err_Required),
  });

export default () =>
  yup.object().shape({
    startDate: yup.string().nullable().required(msg().Common_Err_Required),
    endDate: yup.string().nullable(),
    startTime: timeValidator(),
    endTime: timeValidator(),
    patternCode: yup.string().nullable(),
    remarks: yup.string().nullable(),
  });
