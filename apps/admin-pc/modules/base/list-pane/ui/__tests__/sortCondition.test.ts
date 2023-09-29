import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  getOrder,
  initialState,
  Order,
  SET,
} from '../sortCondition';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(`${SET}`, () => {
    const next = reducer(initialState, actions.set('name'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(`${SET} with order`, () => {
    const next = reducer(initialState, actions.set('name', 'DESC'));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(`${SET} change to ASC`, () => {
    const state = {
      field: 'name',
      order: 'DESC',
    };
    // @ts-ignore
    const next = reducer(state, actions.set('name'));
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(`${SET} change to DESC`, () => {
    const state = {
      field: 'name',
      order: 'ASC',
    };
    // @ts-ignore
    const next = reducer(state, actions.set('name'));
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(`${SET} change to other field (DESC -> ASC)`, () => {
    const state = {
      field: 'name',
      order: 'DESC',
    };
    // @ts-ignore
    const next = reducer(state, actions.set('code'));
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(`${SET} change to other field (ASC -> ASC)`, () => {
    const state = {
      field: 'name',
      order: 'ASC',
    };
    // @ts-ignore
    const next = reducer(state, actions.set('code'));
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
});

describe('getOrder()', () => {
  test.each`
    field     | order     | changed   | expected
    ${'name'} | ${'ASC'}  | ${`name`} | ${`DESC`}
    ${'name'} | ${'DESC'} | ${`name`} | ${`ASC`}
    ${'name'} | ${'ASC'}  | ${`code`} | ${`ASC`}
    ${'name'} | ${'DESC'} | ${`code`} | ${`ASC`}
  `(
    'state.field= $field, state.order=$order, change to $changed, to be $expected',
    ({
      field,
      order,
      changed,
      expected,
    }: {
      field: string;
      order: Order;
      changed: string;
      expected: Order;
    }) => {
      expect(getOrder({ field, order }, changed)).toEqual(expected);
    }
  );
});
