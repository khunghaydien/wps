import {
  generateAttDailyRequestObjectMap,
  generateAttRecordObjectList,
  generateAttSummaryObject,
  requestTypes,
} from '@attendance/repositories/__tests__/mocks/helpers/timesheet';

import AttRecord from '../../../models/AttRecord';
import * as AttDailyRequest from '@attendance/domain/models/AttDailyRequest';

const requests = generateAttDailyRequestObjectMap();
const attDailyRequestTypeMap = Object.keys(requestTypes).reduce((hash, key) => {
  hash[key] = requestTypes[key];
  return hash;
}, {});
const timesheetInfo = {
  attDailyRequestTypeMap,
  records: generateAttRecordObjectList().map(
    (attRecord) => new AttRecord(attRecord)
  ),
}

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
          request,
          timesheetInfo
        );
        return hash;
      }, {}),
    },
  },
};
