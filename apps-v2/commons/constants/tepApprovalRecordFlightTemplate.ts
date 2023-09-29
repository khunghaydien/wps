// TODO:各メンバは将来的に初期値を空にしておくこと。
const tepApprovalRecordFlightTemplate = {
  recordDate: '2016-12-14',
  recordClass: 'Flight',
  flightInfo: {
    departFrom: '',
    arriveAt: '',
    isRoundTrip: true,
    departDateInfo: {
      departOnDate: '2016-12-14',
      departOnTime: '18:30',
      arriveOnDate: '2016-12-15',
      arriveOnTime: '03:30',
    },
    returnDateInfo: {
      departOnDate: '2016-12-16',
      departOnTime: '19:30',
      arriveOnDate: '2016-12-17',
      arriveOnTime: '04:30',
    },
    bookingBasis: 'departure',
    specialRequests: '',
  },
  tepRecordItemList: [
    {
      amount: 0,
    },
  ],
  amount: 0,
};

export default tepApprovalRecordFlightTemplate;
