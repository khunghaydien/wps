// TODO:各メンバは将来的に初期値を空にしておくこと。
const tepApprovalRecordRentACarTemplate = {
  recordDate: '2016-12-14',
  recordClass: 'Rent-a-car',
  rentCarInfo: {
    departPlace: '',
    returnPlace: '',
    isSamePlace: false,
    departDate: '2016-12-19',
    departTime: '12:34',
    returnDate: '2016-12-20',
    returnTime: '23:45',
    carType: '',
    specialRequests: '',
  },
  tepRecordItemList: [
    {
      amount: 0,
    },
  ],
  amount: 0,
};

export default tepApprovalRecordRentACarTemplate;
