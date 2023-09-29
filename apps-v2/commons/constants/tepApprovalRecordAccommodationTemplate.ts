// TODO:各メンバは将来的に初期値を空にしておくこと。
const tepApprovalRecordAccommodationTemplate = {
  recordDate: '2016-12-14',
  recordClass: 'Accommodation',
  accommodationInfo: {
    city: '',
    hotel: '',
    checkInDate: '2016-12-02',
    checkOutDate: '2016-12-03',
    withBreakfast: true,
    withDinner: false,
    noSmoking: true,
    specialRequests: '',
  },
  tepRecordItemList: [
    {
      amount: 0,
    },
  ],
  amount: 0,
};

export default tepApprovalRecordAccommodationTemplate;
