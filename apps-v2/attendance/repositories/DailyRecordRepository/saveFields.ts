import Api from '@apps/commons/api';

import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';

const saveFields: IDailyRecordRepository['saveFields'] = async ({
  recordId,
  values,
}): Promise<void> => {
  return await Api.invoke({
    path: '/att/record-field/save',
    param: {
      attRecordId: recordId,
      valueList: values,
    },
  });
};

export default saveFields;
