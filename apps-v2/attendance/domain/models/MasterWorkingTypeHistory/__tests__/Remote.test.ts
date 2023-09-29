import snapshotDiff from 'snapshot-diff';

// @ts-ignore
import RemoteDefault, * as Remote from '../Remote';
import { defaultValue, JPFix } from '../WorkSystem/JPFix';

describe('convert', () => {
  const init = {
    null: null,
    int: 0,
    float: 0.1,
    minus: -1,
    string: '',
    true: true,
    false: false,
    object: {},
  };
  it('convertNumberToString(object)', () => {
    const next = RemoteDefault.__get__('convertNumberToString')(init);
    expect(snapshotDiff(init, next)).toMatchSnapshot();
  });
  it('convertNullToString(object)', () => {
    const next = RemoteDefault.__get__('convertNullToString')(init);
    expect(snapshotDiff(init, next)).toMatchSnapshot();
  });
});

it('createByWorkSystem()', () => {
  const init: JPFix = {
    ...defaultValue,
    startTime: 8 * 60,
    endTime: 17 * 60,
    rest1StartTime: 12 * 60,
    rest1EndTime: 13 * 60,
  };
  const next = Remote.createByWorkSystem(init);
  expect(snapshotDiff(init, next)).toMatchSnapshot();
});
