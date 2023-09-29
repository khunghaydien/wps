// TODO:各メンバは将来的に初期値を空にしておくこと。
const tepApprovalRecordEntertainmentTemplate = {
  recordDate: '2016-10-28',
  recordClass: 'Entertainment',
  entertainmentInfo: {
    withDrink: true,
    insideAttendeeList: [
      {
        name: '自社一郎',
        dept: '第一営業部',
        title: '部長',
      },
      {
        name: '自社二郎',
        dept: '第一開発部',
        title: '次長',
      },
    ],
    insideOthersCount: 2,
    outsideAttendeeList: [
      {
        name: '取引先太',
        account: '株式会社取引先',
        title: '社長',
      },
    ],
    outsideOthersCount: 3,
  },
  tepRecordItemList: [
    {
      amount: 100,
    },
  ],
  amount: 1000,
};

export default tepApprovalRecordEntertainmentTemplate;
