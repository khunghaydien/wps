import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  INITIALIZE,
  initialState,
  SET_BASE_RECORD,
  SET_BASE_RECORD_BY_KEY_VALUE,
  SET_HISTORY_RECORD,
  SET_HISTORY_RECORD_BY_KEY_VALUE,
  SET_SELECTED_HISTORY_ID,
} from '../detail';

const base = {
  id: 'id',
  code: 'code',
  name: 'name',
  userId: 'userId',
  userName: 'userName',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  lastName_L0: 'lastName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  lastName_L1: 'lastName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  lastName_L2: 'lastName_L2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  firstName_L0: 'firstName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  firstName_L1: 'firstName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  firstName_L2: 'firstName_L2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middleName_L0: 'middleName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middleName_L1: 'middleName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  middleName_L2: 'middleName_L2',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  displayName_L0: 'displayName_L0',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  displayName_L1: 'displayName_L1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  displayName_L2: 'displayName_L2',
};

const history = {
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
  approvalAuthority01: 'approverAuthority01',
  commuterPassAvailable: 'commuterPassAvailable',
  jorudanRoute: [
    {
      fare1: 0,
      fare3: 0,
      fare6: 0,
      pashList: [
        {
          fromName: 'fromName',
          toName: 'toName',
          lineName: 'lineName',
          lineType: 'limeType',
        },
      ],
    },
  ],
};

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(INITIALIZE, () => {
    const next = reducer(
      {
        selectedHistoryId: '',
        // @ts-ignore
        historyList: [],
        // @ts-ignore
        baseRecord: base,
        // @ts-ignore
        historyRecord: history,
      },
      actions.initialize()
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SET_SELECTED_HISTORY_ID, () => {
    const next = reducer(initialState, actions.setSelectedHistoryId('1234abc'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SET_BASE_RECORD, () => {
    // @ts-ignore
    const next = reducer(initialState, actions.setBaseRecord(base));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SET_HISTORY_RECORD, () => {
    // @ts-ignore
    const next = reducer(initialState, actions.setHistoryRecord(history));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SET_BASE_RECORD_BY_KEY_VALUE, () => {
    const next = reducer(
      initialState,
      actions.setBaseRecordByKeyValue('name', 'Name')
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(SET_HISTORY_RECORD_BY_KEY_VALUE, () => {
    const next = reducer(
      initialState,
      actions.setHistoryRecordByKeyValue('comment', 'Comment')
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
