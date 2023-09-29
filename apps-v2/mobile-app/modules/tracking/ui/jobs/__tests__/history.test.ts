import snapshotDiff from 'snapshot-diff';

import { Job } from '../../../../../../domain/models/time-tracking/Job';

import reducer, {
  actions,
  CLEAR,
  GO,
  GO_BACK,
  initialState,
  PUSH,
} from '../history';

const job = {
  parentId: null,
  name: 'This is so long name. This is so long name. This is so long name.',
  id: 'a0h2v00000bvdPfAAI',
  hasJobType: true,
  code: '012345678901234567890123456789',
} as Job;

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(PUSH, () => {
    // Arrange
    const prev = initialState;

    // Act
    const next = [actions.push(job)].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(GO_BACK, () => {
    // Arrange
    const prev = [
      actions.push({ name: '1', id: '1' } as Job),
      actions.push({ name: '2', id: '2' } as Job),
      actions.push({ name: '3', id: '3' } as Job),
      actions.push({ name: '4', id: '4' } as Job),
    ].reduce(reducer, initialState);

    // Act
    const next = [actions.goBack()].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(CLEAR, () => {
    // Arrange
    const prev = [
      { type: '@@INIT' },
      actions.push({ name: '3', id: '3' } as Job),
      actions.push({ name: '4', id: '4' } as Job),
      actions.push({ name: '2', id: '2' } as Job),
      actions.goBack(),
    ].reduce(reducer, undefined);

    // Act
    const next = [actions.clear()].reduce(reducer, prev);

    // Assert
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(GO, () => {
    // Arrange
    const prev = [
      actions.push({ name: '1', id: '1' } as Job),
      actions.push({ name: '2', id: '2' } as Job),
      actions.push({ name: '3', id: '3' } as Job),
      actions.push({ name: '4', id: '4' } as Job),
      actions.push({ name: '5', id: '5' } as Job),
    ].reduce(reducer, initialState);

    // Act
    const next = [actions.go({ name: '2', id: '2' } as Job)].reduce(
      reducer,
      prev
    );

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});

it('should record parent jobs that user visited', () => {
  const state = [
    actions.push({ name: '1', id: '1' } as Job),
    actions.push({ name: '2', id: '2' } as Job),
    actions.push({ name: '3', id: '3' } as Job),
    actions.push({ name: '4', id: '4' } as Job),
  ].reduce(reducer, initialState);

  expect(state).toEqual({
    prev: { name: '3', id: '3' },
    current: { name: '4', id: '4' },
    parents: [
      { name: '4', id: '4' },
      { name: '3', id: '3' },
      { name: '2', id: '2' },
      { name: '1', id: '1' },
    ],
  });
});

it('should should go back the root level of jobs', () => {
  // Assert
  const prev = [
    actions.push({ name: '1', id: '1' } as Job),
    actions.push({ name: '2', id: '2' } as Job),
    actions.push({ name: '3', id: '3' } as Job),
    actions.push({ name: '4', id: '4' } as Job),
  ].reduce(reducer, initialState);

  // Act
  const state = [
    actions.goBack(),
    actions.goBack(),
    actions.goBack(),
    actions.goBack(),
  ].reduce(reducer, prev);

  expect(state).toEqual({
    prev: null,
    current: null,
    parents: [],
  });
});

it('should go back the second level of jobs', () => {
  // Assert
  const prev = [
    actions.push({ name: '1', id: '1' } as Job),
    actions.push({ name: '2', id: '2' } as Job),
    actions.push({ name: '3', id: '3' } as Job),
    actions.push({ name: '4', id: '4' } as Job),
  ].reduce(reducer, initialState);

  // Act
  const state = [actions.goBack(), actions.goBack(), actions.goBack()].reduce(
    reducer,
    prev
  );

  expect(state).toEqual({
    prev: null,
    current: { name: '1', id: '1' },
    parents: [{ name: '1', id: '1' }],
  });
});

it('should go a given job', () => {
  // Arrange
  const prev = [
    actions.push({ name: '1', id: '1' } as Job),
    actions.push({ name: '2', id: '2' } as Job),
    actions.push({ name: '3', id: '3' } as Job),
    actions.push({ name: '4', id: '4' } as Job),
    actions.push({ name: '5', id: '5' } as Job),
  ].reduce(reducer, initialState);

  // Act
  const state = [actions.go({ name: '1', id: '1' } as Job)].reduce(
    reducer,
    prev
  );

  // Assert
  expect(state).toEqual({
    prev: null,
    current: { name: '1', id: '1' },
    parents: [{ name: '1', id: '1' }],
  });
});
