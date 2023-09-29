import tepApprovalFormType from './tepApprovalFormType';

// TODO:各メンバは将来的に初期値を空にしておくこと。
const newPreApprReportGeneralExpenseTemplate = {
  title: '件名なし',
  purpose: '入力なし',
  totalAmount: '1000',
  formType: tepApprovalFormType.GENERAL_EXPENSE,
  tepRecordList: [],
};

export default newPreApprReportGeneralExpenseTemplate;
