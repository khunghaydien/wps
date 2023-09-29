// TODO:各メンバは将来的に初期値を空にしておくこと。
const tepApprovalRecordTrainTemplate = {
  recordDate: '2016-12-14',
  recordClass: 'Train',
  trainInfo: {
    departFrom: '',
    arriveAt: '',
    isRoundTrip: true,
    departDateInfo: {
      departOnDate: '2016-12-24',
      departOnTime: '18:30',
      arriveOnDate: '2016-12-25',
      arriveOnTime: '03:30',
    },
    returnDateInfo: {
      departOnDate: '2016-12-26',
      departOnTime: '19:30',
      arriveOnDate: '2016-12-27',
      arriveOnTime: '04:30',
    },
    specialRequests: '',
  },
  tepRecordItemList: [
    {
      amount: 0,
    },
  ],
  amount: 0,
};

export default tepApprovalRecordTrainTemplate;
