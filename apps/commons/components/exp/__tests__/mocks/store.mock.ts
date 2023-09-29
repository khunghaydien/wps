/* eslint-disable @typescript-eslint/naming-convention */

const store = {
  common: {
    exp: {
      ui: {
        reportList: {
          advSearch: {
            requestDateRange: {
              startDate: '2020-07-01',
              endDate: '2020-07-31',
            },
            accountingDateRange: {
              startDate: '2020-07-06',
              endDate: '2020-05-02',
            },
            amountRange: { minAmount: 100, maxAmount: 1000 },
            reportTypeIds: ['a0v0o00000nRe2lAAC'],
            subject: 'Test',
            detail: [],
            reportNo: null,
            vendor: [],
          },
        },
      },
      entities: {},
    },
  },
  userSetting: {
    companyId: 'a0N2v00000VJ1Y8EAL',
    employeeId: 'a0X2v00000M6wOjEAJ',
  },
  ui: {
    expenses: {
      recordListPane: {
        accountingPeriod: [
          {
            validDateTo: '2020-07-30',
            validDateFrom: '2020-07-01',
            recordingDate: '2020-07-31',
            name_L2: null,
            name_L1: null,
            name_L0: '2020/07/01 ~ 2020/07/31',
            name: '2020/07/01 ~ 2020/07/31',
            isNotMaster: null,
            id: 'a0o2v00000TGG1cAAH',
            companyId: 'a0N2v00000VJ1Y8EAL',
            code: 'AC_7-2020:7-2020',
            active: true,
          },
        ],
      },
      selectedExpReport: {
        accountingPeriodId: 'a0o2v00000TGG1cAAH',
      },
      tab: 0,
    },
  },
  entities: {
    exp: {
      costCenter: {
        defaultCostCenter: [],
        list: [],
      },
    },
  },
};

export default store;
