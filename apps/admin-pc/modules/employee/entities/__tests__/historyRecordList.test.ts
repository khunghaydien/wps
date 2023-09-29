import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  FETCH,
  INITIALIZE,
  initialState,
} from '../historyRecordList';

const dummy = [
  {
    id: 'id',
    baseId: 'baseId',
    departmentId: 'departmentId',
    department: {
      name: 'departmentName',
    },
    title: 'title',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    title_L0: 'title_L0',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    title_L1: 'title_L1',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    title_L2: 'title_L2',
    managerId: 'managerId',
    manager: {
      name: 'managerName',
      code: 'managerCode',
    },
    validDateFrom: 'validDateFrom',
    validDateTo: 'validDateTo',
    comment: 'comment',
    workingTypeId: 'workingTypeId',
    workingType: {
      name: 'workingTypeName',
    },
    timeSettingId: 'timeSettingId',
    timeSetting: {
      name: 'timeSettingName',
    },
    agreementAlertSettingId: 'agreementAlertSettingId',
    agreementAlertSetting: {
      name: 'agreementAlertSettingName',
    },
    calendarId: 'calenderId',
    permissionId: 'permissionId',
    approver01Id: 'approver01Id',
    approver01: {
      name: 'approver01Name',
      code: 'approver01Code',
    },
    approvalAuthority01: 'approvalAuthority01',
    commuterPassAvailable: 'commuterPassAvailable',
    jorudanRoute: {
      fare1: 0,
      fare3: 0,
      fare6: 0,
      pashList: [
        {
          fromName: 'fromName',
          toName: 'toName',
          lineName: 'lineName',
          lineType: 'lineType',
        },
      ],
    },
  },
];

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(INITIALIZE, () => {
    // @ts-ignore
    const next = reducer(dummy, actions.initialize());
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(FETCH, () => {
    // @ts-ignore
    const next = reducer(initialState, actions.fetch(dummy));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
