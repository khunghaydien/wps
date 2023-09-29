import tepApprovalFormType from './tepApprovalFormType';
import tepApprovalRecordEntertainmentTemplate from './tepApprovalRecordEntertainmentTemplate';

// TODO:各メンバは将来的に初期値を空にしておくこと。
const newPreApprReportEntertainmentTemplate = {
  title: '件名なし',
  purpose: '入力なし',
  totalAmount: '1000',
  formType: tepApprovalFormType.ENTERTAINMENT_EXPENSE,
  tepRecordList: [tepApprovalRecordEntertainmentTemplate],
};

export default newPreApprReportEntertainmentTemplate;
