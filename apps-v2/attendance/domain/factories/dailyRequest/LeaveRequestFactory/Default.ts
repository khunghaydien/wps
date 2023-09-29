/**
 * プロパティの更新処理をする Factory です。
 *
 * Factory なのかどうか少し悩んでます。
 * 何か良い思案が修正してください。
 */
import { compose } from '@commons/utils/FnUtil';

import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import setDefaultLeaveCode from './methods/setDefaultLeaveCode';
import setDefaultLeaveDetailCode from './methods/setDefaultLeaveDetailCode';
import setDefaultLeaveRange from './methods/setDefaultLeaveRange';

interface ILeaveRequestFactory extends LeaveRequest.ILeaveRequestFactory {
  create: (request: LeaveRequest.LeaveRequest) => LeaveRequest.LeaveRequest;
  updateByKeyValue: (
    request: LeaveRequest.LeaveRequest,
    key: keyof LeaveRequest.LeaveRequest,
    value: LeaveRequest.LeaveRequest[typeof key]
  ) => LeaveRequest.LeaveRequest;
}

const create = (request: LeaveRequest.LeaveRequest) =>
  compose(
    setDefaultLeaveRange,
    setDefaultLeaveDetailCode,
    setDefaultLeaveCode
  )(request);

export default (): ILeaveRequestFactory => ({
  create,
  updateByKeyValue: (request, key, value) =>
    create({
      ...request,
      [key]: value,
    }),
});
