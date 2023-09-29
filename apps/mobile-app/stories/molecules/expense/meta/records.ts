import { newRecord, Record } from '../../../../../domain/models/exp/Record';

export const createRecord = (params: {
  recordId?: string;
  recordDate?: string;
  amount?: number;
  routeInfo?: { [key: string]: any };
  expTypeId?: string;
  expTypeName?: string;
  recordType?: string;
  currencyInfo?: {
    code: string;
    name: string;
    decimalPlaces: number;
    symbol: string;
  };
  useForeignCurrency?: boolean;
  item?: any;
  remarks?: string;
}): Record => {
  const {
    expTypeId,
    expTypeName,
    recordType,
    currencyInfo,
    useForeignCurrency,
    item,
    ..._params
  } = params;
  const record = newRecord(
    expTypeId,
    expTypeName,
    recordType,
    useForeignCurrency,
    item,
    true
  );

  if (record.items && record.items[0] && currencyInfo) {
    record.items[0].currencyInfo = currencyInfo;
  }

  return {
    ...record,
    ...params,
  } as Record;
};

export default [
  createRecord({
    recordId: '1',
    recordDate: '2018-01-01',
    amount: 1000,
    expTypeName: '費目１',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: true,
          isCheapest: true,
          isMinTransfer: true,
        },
      },
    },
  }),
  createRecord({
    recordId: '2',
    recordDate: '2018-01-02',
    amount: 20000,
    expTypeName: '費目2',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: true,
          isCheapest: true,
          isMinTransfer: false,
        },
      },
    },
  }),
  createRecord({
    recordId: '3',
    recordDate: '2018-01-01',
    amount: 1000,
    expTypeName: '費目3',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: true,
          isCheapest: false,
          isMinTransfer: true,
        },
      },
    },
  }),
  createRecord({
    recordId: '4',
    recordDate: '2018-01-01',
    amount: 1000,
    expTypeName: '費目4',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: true,
          isCheapest: false,
          isMinTransfer: false,
        },
      },
    },
  }),
  createRecord({
    recordId: '5',
    recordDate: '2018-01-01',
    amount: 1000,
    expTypeName: '費目5',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: false,
          isCheapest: true,
          isMinTransfer: true,
        },
      },
    },
  }),
  createRecord({
    recordId: '6',
    recordDate: '2018-01-01',
    amount: 1000,
    expTypeName: '費目6',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: false,
          isCheapest: true,
          isMinTransfer: false,
        },
      },
    },
  }),
  createRecord({
    recordId: '7',
    recordDate: '2018-01-01',
    amount: 1000,
    expTypeName: '費目7',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: false,
          isCheapest: false,
          isMinTransfer: true,
        },
      },
    },
  }),
  createRecord({
    recordId: '8',
    recordDate: '2018-01-01',
    amount: 1000,
    expTypeName: '費目8',
    routeInfo: {
      origin: {
        name: '出発地',
      },
      arrival: {
        name: '目的地',
      },
      selectedRoute: {
        status: {
          isEarliest: false,
          isCheapest: false,
          isMinTransfer: false,
        },
      },
    },
  }),
  createRecord({
    recordId: '9',
    recordDate: '2018-01-04',
    amount: 300000,
    expTypeName: '費目9',
    remarks: '備考',
  }),
  createRecord({
    recordId: '10',
    recordDate: '2018-01-04',
    amount: 300000,
    expTypeName: '費目10',
    remarks: '',
  }),
];
