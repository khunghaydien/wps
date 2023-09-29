// TODO:各メンバは将来的に初期値を空にしておくこと。
//      title,purposeは空文字で保存/申請しようとするとサーバーでエラーになってしまうので、
//      暫定的に半角スペースを入れてある。

import tepApprovalRecordAccommodationTemplate from './tepApprovalRecordAccommodationTemplate';
import tepApprovalRecordAllowanceTemplate from './tepApprovalRecordAllowanceTemplate';
import tepApprovalRecordFlightTemplate from './tepApprovalRecordFlightTemplate';
import tepApprovalRecordRentACarTemplate from './tepApprovalRecordRentACarTemplate';
import tepApprovalRecordTrainTemplate from './tepApprovalRecordTrainTemplate';

const newPreApprReportTravelTemplate = {
  title: ' ',
  purpose: ' ',
  totalAmount: 0,
  travelInfo: {
    startDate: '2016-12-14',
    endDate: '2016-12-25',
    startTime: '12:01',
    endTime: '09:23',
    departureType: 'FromCompany',
    returnType: 'ToHome',
    destinationId: 'domestic',
    destinationName: '',
    destinationAddress: '',
  },
  tepRecordList: [
    tepApprovalRecordAccommodationTemplate,
    tepApprovalRecordTrainTemplate,
    tepApprovalRecordFlightTemplate,
    tepApprovalRecordRentACarTemplate,
    tepApprovalRecordAllowanceTemplate,
  ],
};

export default newPreApprReportTravelTemplate;
