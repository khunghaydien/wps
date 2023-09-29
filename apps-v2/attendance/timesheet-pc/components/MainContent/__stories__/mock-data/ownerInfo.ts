import { OwnerInfo } from '@attendance/domain/models/Timesheet';

const dummyOwnerInfo: OwnerInfo = {
  startDate: '',
  endDate: '',
  employee: {
    code: '',
    name: '社員太郎',
  },
  department: { name: 'マーケティングチーム' },
  workingType: {
    name: '管理監督者',
  },
};

export default dummyOwnerInfo;
