import snapshotDiff from 'snapshot-diff';

import { SELECT_TAB } from '../../../../../../commons/actions/tab';

import {
  CHANGE_COMPANY,
  SELECT_MENU_ITEM,
} from '../../../../base/menu-pane/ui';
import { CHANGE_LEAVE_TYPE } from '../../ui/leave-type';
import reducer, {
  CLEAR,
  clear,
  initialState,
  SEARCH_EMPLOYEE_SUCCESS,
  searchEmployeeSuccess,
} from '../employee-list';

const LIMIT = 5;

const records = [
  {
    workingTypeName: 'Test Fix',
    photoUrl: 'https://c.ap5.content.force.com/profilephoto/7297F000000kJst/T',
    name: 'Spring',
    id: '0000001',
    deptName: 'テスト部署',
    code: '000001',
  },
  {
    workingTypeName: 'Test Fix',
    photoUrl: 'https://c.ap5.content.force.com/profilephoto/7297F000000kJst/T',
    name: 'Rain',
    id: '0000002',
    deptName: 'テスト部署',
    code: '000002',
  },
  {
    workingTypeName: 'Test Fix',
    photoUrl: 'https://c.ap5.content.force.com/profilephoto/7297F000000kJst/T',
    name: 'Summer',
    id: '0000003',
    deptName: 'テスト部署',
    code: '000003',
  },
  {
    workingTypeName: 'Test Fix',
    photoUrl: 'https://c.ap5.content.force.com/profilephoto/7297F000000kJst/T',
    name: 'Autumn',
    id: '0000004',
    deptName: 'テスト部署',
    code: '000004',
  },
  {
    workingTypeName: 'Test Fix',
    photoUrl: 'https://c.ap5.content.force.com/profilephoto/7297F000000kJst/T',
    name: 'Winter',
    id: '0000005',
    deptName: 'テスト部署',
    code: '000005',
  },
  {
    workingTypeName: 'Test Fix',
    photoUrl: 'https://c.ap5.content.force.com/profilephoto/7297F000000kJst/T',
    name: 'Season',
    id: '0000006',
    deptName: 'テスト部署',
    code: '000006',
  },
];

describe('reducer()', () => {
  it('@@init', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(SEARCH_EMPLOYEE_SUCCESS, () => {
    const next = reducer(
      initialState,
      searchEmployeeSuccess({ records }, LIMIT)
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(CLEAR, () => {
    const state = searchEmployeeSuccess({ records }, LIMIT);
    // @ts-ignore
    const next = reducer(state, clear());
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(SELECT_TAB, () => {
    const state = searchEmployeeSuccess({ records }, LIMIT);
    // @ts-ignore
    const next = reducer(state, { type: SELECT_TAB });
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(CHANGE_COMPANY, () => {
    const state = searchEmployeeSuccess({ records }, LIMIT);
    // @ts-ignore
    const next = reducer(state, { type: CHANGE_COMPANY });
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(SELECT_MENU_ITEM, () => {
    const state = searchEmployeeSuccess({ records }, LIMIT);
    // @ts-ignore
    const next = reducer(state, { type: CHANGE_COMPANY });
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(CHANGE_LEAVE_TYPE, () => {
    const state = searchEmployeeSuccess({ records }, LIMIT);
    // @ts-ignore
    const next = reducer(state, { type: CHANGE_LEAVE_TYPE });
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
});
