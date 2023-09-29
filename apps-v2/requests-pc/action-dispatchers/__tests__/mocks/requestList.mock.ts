import { initMockEIs } from './eiLookup.mock';

const requestListRes = {
  reports: [
    {
      ...initMockEIs(),
      vendorNameL: {
        valueL2: null,
        valueL1: null,
        valueL0: null,
      },
      vendorName: null,
      vendorId: null,
      vendorCode: null,
      useFileAttachment: true,
      totalAmount: 3.0,
      subject: 'Copy of with attach',
      status: 'Removed',
      scheduledDate: '2019-07-17',
      requestId: 'a122v00000CNXhWAAX',
      requestDate: '2019-07-17',
      reportNo: 'pre-req00000004',
      reportId: 'a152v000008xsNGAAY',
      remarks: null,
      records: null,
      purpose: 'asdf',
      paymentDueDateUsage: null,
      paymentDueDate: null,
      jobNameL: {
        valueL2: null,
        valueL1: null,
        valueL0: null,
      },
      jobName: null,
      jobId: null,
      jobCode: null,
      isEstimated: false,
      expReportTypeNameL: {
        valueL2: null,
        valueL1: null,
        valueL0: 'Vendor Report^',
      },
      expReportTypeName: 'Vendor Report^',
      expReportTypeId: 'a102v00000S2ED3AAN',
      delegatedApplicantName: null,
      costCenterNameL: {
        valueL2: null,
        valueL1: null,
        valueL0: null,
      },
      costCenterName: null,
      costCenterHistoryId: null,
      costCenterCode: null,
      attachedFileVerId: null,
      attachedFileName: null,
      attachedFileId: null,
      attachedFileDataType: null,
      accountingDate: '2019-07-17',
    },
  ],
};

export default requestListRes;
