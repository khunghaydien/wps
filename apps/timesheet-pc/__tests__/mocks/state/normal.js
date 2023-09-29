import {
  generateAttDailyRequestObjectMap,
  generateAttRecordObjectList,
  generateAttSummaryObject,
  requestTypes,
} from '../../../../repositories/__tests__/mocks/helpers/timesheet';

import * as AttDailyRequest from '../../../../domain/models/attendance/AttDailyRequest';
import AttRecord from '../../../models/AttRecord';

const requests = generateAttDailyRequestObjectMap();
const attDailyRequestTypeMap = Object.keys(requestTypes).reduce((hash, key) => {
  hash[key] = requestTypes[key];
  return hash;
}, {});

export default {
  common: {
    accessControl: {
      permission: {},
    },
    proxyEmployeeInfo: {
      isProxyMode: false,
    },
  },
  entities: {
    timesheet: {
      attSummary: generateAttSummaryObject(),
      attRecordList: generateAttRecordObjectList().map(
        (attRecord) => new AttRecord(attRecord)
      ),
      attDailyRequestTypeMap,
      attDailyRequestMap: Object.keys(requests).reduce((hash, key) => {
        const request = requests[key];
        hash[key] = AttDailyRequest.createFromRemote(
          attDailyRequestTypeMap,
          // @ts-ignore FIXME jsファイルなのでlint-stagedではTypeScriptのチェック外でエラーが発生してない。しかしtsファイルにするとエラーになる。要修正。
          request
        );
        return hash;
      }, {}),
    },
  },
};
