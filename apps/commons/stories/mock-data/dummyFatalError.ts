import FatalError from '../../errors/FatalError';

export default new FatalError({
  errorCode: 'APEX_ERROR',
  name: 'APEX_ERROR',
  message:
    'System.LimitException: Too many SOQL queries: 101 Class.AttSummaryRepository.searchEntity: line 503, column 1 Class.AttSummaryRepository.getEntityList: line 337, column 1 Class.AttSummaryRepository.getEntity: line 314, column 1 Class.AttSummaryRepository.getEntity: line 301, column 1 Class.AttAttendanceService.createAttSummaryWithCalc: line 588, column 1 Class.AttAttendanceService.getSummary: line 347, column 1 Class.AttAttendanceService.getSummaryList: line 323, column 1 Class.AttDailyRequestService.AbstractRequestProcessor.getRecordEntityList: line 1871, column 1 Class.AttLeaveRequestService.submit: line 65, column 1 Class.AttDailyRequestService.submitRequest: line 2050, column 1 Class.AttRequestResource.SubmitLeaveApi.execute: line 365, column 1 Class.RemoteApiRoute.execute: line 30, column 1 Class.RestProxyPCService.post: line 45, column 1',
  stack:
    'APEX_ERROR: System.LimitException: Too many SOQL queries: 101 Class.AttSummaryRepository.searchEntity: line 503, column 1 Class.AttSummaryRepository.getEntityList: line 337, column 1 Class.AttSummaryRepository.getEntity: line 314, column 1 Class.AttSummaryRepository.getEntity: line 301, column 1 Class.AttAttendanceService.createAttSummaryWithCalc: line 588, column 1 Class.AttAttendanceService.getSummary: line 347, column 1 Class.AttAttendanceService.getSummaryList: line 323, column 1 Class.AttDailyRequestService.AbstractRequestProcessor.getRecordEntityList: line 1871, column 1 Class.AttLeaveRequestService.submit: line 65, column 1 Class.AttDailyRequestService.submitRequest: line 2050, column 1 Class.AttRequestResource.SubmitLeaveApi.execute: line 365, column 1 Class.RemoteApiRoute.execute: line 30, column 1 Class.RestProxyPCService.post: line 45, column 1 at HttpApi.getError (webpack-internal:///./node_modules/jsforce/lib/http-api.js:250:13) at eval (webpack-internal:///./node_modules/jsforce/lib/http-api.js:95:22) at tryCallOne (webpack-internal:///./node_modules/promise/lib/core.js:37:12) at eval (webpack-internal:///./node_modules/promise/lib/core.js:123:15) at MutationObserver.flush (webpack-internal:///./node_modules/asap/browser-raw.js:52:29)',
});